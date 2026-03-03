import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { AIService, AIConfig } from './AIService'
import { getDigestScaffold } from './TestcaseDigestScaffold'
import {
  SOURCE_DIR,
  EXCLUDED_DIRS,
  FeatureSummary,
  FeatureConfig,
  ComponentMapping,
} from './TestcaseTypes'

export class TestcaseFeatureService {
  static async getAllFeatures(): Promise<FeatureSummary[]> {
    try {
      const entries = await fs.readdir(SOURCE_DIR, { withFileTypes: true })
      const dirs = entries.filter(e => e.isDirectory() && !EXCLUDED_DIRS.includes(e.name))

      const summaries: FeatureSummary[] = []
      for (const dir of dirs) {
        const config = await this.getFeatureConfig(dir.name)
        summaries.push({
          name: dir.name,
          created: config?.created || '',
          updated: config?.updated || '',
        })
      }

      summaries.sort((a, b) => (b.updated || '').localeCompare(a.updated || ''))
      return summaries
    } catch {
      return []
    }
  }

  static async createFeature(name: string): Promise<{ name: string; path: string }> {
    const featureDir = path.join(SOURCE_DIR, name)

    await fs.mkdir(featureDir, { recursive: true })
    await fs.mkdir(path.join(featureDir, 'spec'), { recursive: true })
    await fs.mkdir(path.join(featureDir, 'result'), { recursive: true })

    const today = new Date().toISOString().split('T')[0]
    const config: Record<string, unknown> = {
      name,
      created: today,
      updated: today,
      strategy: '',
      structure: [],
      scope: { happy_case: '', corner_case: '', negative_case: '' },
      linked_knowledge: [],
      components: [],
    }

    const configContent = matter.stringify('\n## Mapped Components\n', config)
    await fs.writeFile(path.join(featureDir, 'config.md'), configContent)
    await fs.writeFile(path.join(featureDir, 'context-digest.md'), getDigestScaffold(name))

    return { name, path: featureDir }
  }

  static async getFeatureConfig(name: string): Promise<FeatureConfig | null> {
    try {
      const configPath = path.join(SOURCE_DIR, name, 'config.md')
      const fileContent = await fs.readFile(configPath, 'utf-8')
      const { data, content } = matter(fileContent)

      return {
        name: data.name || name,
        created: data.created || '',
        updated: data.updated || '',
        strategy: data.strategy || '',
        structure: data.structure || [],
        scope: { happy_case: '', corner_case: '', negative_case: '', ...(data.scope || {}) },
        linked_knowledge: data.linked_knowledge || [],
        components: data.components || [],
        content,
      }
    } catch {
      return null
    }
  }

  static async updateFeatureConfig(
    name: string,
    updates: Partial<FeatureConfig>
  ): Promise<FeatureConfig | null> {
    const existing = await this.getFeatureConfig(name)
    if (!existing) return null

    const today = new Date().toISOString().split('T')[0]
    const merged = { ...existing, ...updates, updated: today, name: existing.name }

    const componentLines = (merged.components || [])
      .map((c: ComponentMapping) => `- ${c.name}: ${c.usage}`)
      .join('\n')
    const body = `\n## Mapped Components\n${componentLines}\n`

    const frontmatter: Record<string, unknown> = {
      name: merged.name, created: merged.created, updated: merged.updated,
      strategy: merged.strategy, structure: merged.structure, scope: merged.scope,
      linked_knowledge: merged.linked_knowledge, components: merged.components,
    }

    const configPath = path.join(SOURCE_DIR, name, 'config.md')
    await fs.writeFile(configPath, matter.stringify(body, frontmatter))

    return this.getFeatureConfig(name)
  }

  static async renameFeature(oldName: string, newName: string): Promise<string | null> {
    try {
      const oldDir = path.join(SOURCE_DIR, oldName)
      const newDir = path.join(SOURCE_DIR, newName)

      try { await fs.access(newDir); return null } catch { /* Good */ }

      await fs.rename(oldDir, newDir)
      const config = await this.getFeatureConfig(newName)
      if (config) {
        await this.updateFeatureConfig(newName, { name: newName } as Partial<FeatureConfig>)
      }
      return newName
    } catch {
      return null
    }
  }

  static async deleteFeature(name: string): Promise<boolean> {
    try {
      await fs.rm(path.join(SOURCE_DIR, name), { recursive: true, force: true })
      return true
    } catch {
      return false
    }
  }

  static async importSpec(
    name: string, fileBuffer: Buffer, filename: string,
    mimeType: string, customPrompt: string, aiConfig: AIConfig, skipAi?: boolean
  ): Promise<{ specPath: string }> {
    let finalContent: string

    if (mimeType === 'application/pdf' && !skipAi) {
      // Send raw PDF bytes to Gemini multimodal — skip text extraction
      finalContent = (await AIService.structureSpecFromPdf(fileBuffer, customPrompt, aiConfig)).content
    } else {
      let rawContent: string

      if (mimeType === 'application/pdf') {
        const { parsePdfWithBullets } = await import('./PdfBulletParser')
        rawContent = await parsePdfWithBullets(fileBuffer)
      } else if (mimeType === 'text/markdown' || filename.endsWith('.md')) {
        rawContent = fileBuffer.toString('utf-8')
      } else if (mimeType === 'text/plain' || filename.endsWith('.txt')) {
        rawContent = fileBuffer.toString('utf-8')
      } else {
        throw new Error('Unsupported file type. Only PDF, Markdown, and TXT files are supported.')
      }

      finalContent = skipAi
        ? rawContent
        : (await AIService.structureSpec(rawContent, customPrompt, aiConfig)).content
    }

    const specDir = path.join(SOURCE_DIR, name, 'spec')
    await fs.mkdir(specDir, { recursive: true })
    const specPath = path.join(specDir, 'imported-spec.md')
    await fs.writeFile(specPath, finalContent)

    return { specPath }
  }

  static async getSpec(name: string): Promise<string | null> {
    try {
      return await fs.readFile(path.join(SOURCE_DIR, name, 'spec', 'imported-spec.md'), 'utf-8')
    } catch { return null }
  }

  static async updateSpec(name: string, content: string): Promise<void> {
    const specPath = path.join(SOURCE_DIR, name, 'spec', 'imported-spec.md')
    await fs.writeFile(specPath, content)
  }

  static async getResults(name: string): Promise<string[]> {
    try {
      const resultDir = path.join(SOURCE_DIR, name, 'result')
      const files = await fs.readdir(resultDir)
      const csvFiles = files.filter(f => f.endsWith('.csv'))

      // Get file stats for sorting by modification time
      const filesWithStats = await Promise.all(
        csvFiles.map(async (file) => {
          const stats = await fs.stat(path.join(resultDir, file))
          return { file, mtime: stats.mtime }
        })
      )

      // Sort by modification time descending (newest first)
      filesWithStats.sort((a, b) => b.mtime.getTime() - a.mtime.getTime())

      return filesWithStats.map(f => f.file)
    } catch { return [] }
  }

  static async getResultFile(name: string, filename: string): Promise<string | null> {
    try {
      return await fs.readFile(path.join(SOURCE_DIR, name, 'result', filename), 'utf-8')
    } catch { return null }
  }

  static getResultFilePath(name: string, filename: string): string {
    return path.join(SOURCE_DIR, name, 'result', filename)
  }

  static async deleteResultFile(name: string, filename: string): Promise<boolean> {
    try {
      await fs.unlink(path.join(SOURCE_DIR, name, 'result', filename))
      // Also delete associated note if exists
      const notePath = path.join(SOURCE_DIR, name, 'result', `${filename}.note.md`)
      await fs.unlink(notePath).catch(() => {})
      return true
    } catch { return false }
  }

  static async getResultNote(name: string, filename: string): Promise<string | null> {
    try {
      return await fs.readFile(path.join(SOURCE_DIR, name, 'result', `${filename}.note.md`), 'utf-8')
    } catch { return null }
  }

  static async saveResultNote(name: string, filename: string, note: string): Promise<void> {
    const notePath = path.join(SOURCE_DIR, name, 'result', `${filename}.note.md`)
    if (!note.trim()) {
      await fs.unlink(notePath).catch(() => {})
    } else {
      await fs.writeFile(notePath, note)
    }
  }

  static async getResultNotes(name: string): Promise<Record<string, string>> {
    try {
      const resultDir = path.join(SOURCE_DIR, name, 'result')
      const files = await fs.readdir(resultDir)
      const noteFiles = files.filter(f => f.endsWith('.note.md'))
      const notes: Record<string, string> = {}
      for (const nf of noteFiles) {
        const csvName = nf.replace('.note.md', '')
        notes[csvName] = await fs.readFile(path.join(resultDir, nf), 'utf-8')
      }
      return notes
    } catch { return {} }
  }
}
