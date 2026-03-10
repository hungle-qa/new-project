import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { AIService, AIConfig } from './AIService'
import { getDigestScaffold } from './TestcaseDigestScaffold'
import {
  FEATURE_DIR,
  EXCLUDED_DIRS,
  FeatureSummary,
  FeatureConfig,
  ComponentMapping,
  CornerCaseQuestion,
} from './TestcaseTypes'

export interface ResultMetadata {
  test_count: number
  est_input_tokens: number | null
  est_output_tokens: number | null
  est_total_tokens: number | null
  rows_per_token: number | null
}

export interface ResultWithMetadata {
  filename: string
  metadata: ResultMetadata | null
}

export class TestcaseFeatureService {
  static async getAllFeatures(): Promise<FeatureSummary[]> {
    try {
      const entries = await fs.readdir(FEATURE_DIR, { withFileTypes: true })
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
    const featureDir = path.join(FEATURE_DIR, name)

    await fs.mkdir(featureDir, { recursive: true })
    await fs.mkdir(path.join(featureDir, 'spec'), { recursive: true })
    await fs.mkdir(path.join(featureDir, 'result'), { recursive: true })

    const today = new Date().toISOString().split('T')[0]
    const config: Record<string, unknown> = {
      name,
      created: today,
      updated: today,
      strategy: '',
      rule: '',
      template: '',
      structure: [],
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
      const configPath = path.join(FEATURE_DIR, name, 'config.md')
      const fileContent = await fs.readFile(configPath, 'utf-8')
      const { data, content } = matter(fileContent)

      return {
        name: data.name || name,
        created: data.created || '',
        updated: data.updated || '',
        strategy: data.strategy || '',
        rule: data.rule || '',
        template: data.template || '',
        structure: data.structure || [],
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
      strategy: merged.strategy, rule: merged.rule, template: merged.template,
      structure: merged.structure,
      linked_knowledge: merged.linked_knowledge, components: merged.components,
    }

    const configPath = path.join(FEATURE_DIR, name, 'config.md')
    await fs.writeFile(configPath, matter.stringify(body, frontmatter))

    return this.getFeatureConfig(name)
  }

  static async renameFeature(oldName: string, newName: string): Promise<string | null> {
    try {
      const oldDir = path.join(FEATURE_DIR, oldName)
      const newDir = path.join(FEATURE_DIR, newName)

      try { await fs.access(newDir); return null } catch { /* Good */ }

      await fs.rename(oldDir, newDir)
      const config = await this.getFeatureConfig(newName)
      if (config) {
        await this.updateFeatureConfig(newName, { name: newName } as Partial<FeatureConfig>)
      }

      // Update context-digest.md references
      try {
        const digestPath = path.join(newDir, 'context-digest.md')
        const digestContent = await fs.readFile(digestPath, 'utf-8')
        const updated = digestContent
          .replace(new RegExp(`feature: ${oldName}`, 'g'), `feature: ${newName}`)
          .replace(new RegExp(`source/testcase/feature/${oldName}/`, 'g'), `source/testcase/feature/${newName}/`)
        await fs.writeFile(digestPath, updated)
      } catch { /* digest may not exist */ }

      // Rename result files (csv, metadata.json, note.md) that start with oldName
      try {
        const resultDir = path.join(newDir, 'result')
        const files = await fs.readdir(resultDir)
        for (const file of files) {
          if (file.startsWith(`${oldName}-`)) {
            const newFile = file.replace(`${oldName}-`, `${newName}-`)
            await fs.rename(path.join(resultDir, file), path.join(resultDir, newFile))
          }
        }
      } catch { /* result dir may not exist */ }

      return newName
    } catch {
      return null
    }
  }

  static async deleteFeature(name: string): Promise<boolean> {
    try {
      await fs.rm(path.join(FEATURE_DIR, name), { recursive: true, force: true })
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

    const specDir = path.join(FEATURE_DIR, name, 'spec')
    await fs.mkdir(specDir, { recursive: true })
    const specPath = path.join(specDir, 'imported-spec.md')
    await fs.writeFile(specPath, finalContent)

    return { specPath }
  }

  static async getSpec(name: string): Promise<string | null> {
    try {
      return await fs.readFile(path.join(FEATURE_DIR, name, 'spec', 'imported-spec.md'), 'utf-8')
    } catch { return null }
  }

  static async updateSpec(name: string, content: string): Promise<void> {
    const specPath = path.join(FEATURE_DIR, name, 'spec', 'imported-spec.md')
    await fs.writeFile(specPath, content)
  }

  static async getResults(name: string): Promise<string[]> {
    try {
      const resultDir = path.join(FEATURE_DIR, name, 'result')
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

  static async saveResultMetadata(
    name: string,
    csvFilename: string,
    metadata: ResultMetadata
  ): Promise<void> {
    const metaPath = path.join(FEATURE_DIR, name, 'result', `${csvFilename}.metadata.json`)
    await fs.writeFile(metaPath, JSON.stringify(metadata, null, 2))
  }

  static async getResultMetadata(
    name: string,
    csvFilename: string
  ): Promise<ResultMetadata | null> {
    try {
      const metaPath = path.join(FEATURE_DIR, name, 'result', `${csvFilename}.metadata.json`)
      const raw = await fs.readFile(metaPath, 'utf-8')
      return JSON.parse(raw) as ResultMetadata
    } catch { return null }
  }

  static async listResultsWithMetadata(name: string): Promise<ResultWithMetadata[]> {
    const filenames = await this.getResults(name)
    return Promise.all(
      filenames.map(async (filename) => {
        const metadata = await this.getResultMetadata(name, filename)
        return { filename, metadata }
      })
    )
  }

  static async getResultFile(name: string, filename: string): Promise<string | null> {
    try {
      return await fs.readFile(path.join(FEATURE_DIR, name, 'result', filename), 'utf-8')
    } catch { return null }
  }

  static getResultFilePath(name: string, filename: string): string {
    return path.join(FEATURE_DIR, name, 'result', filename)
  }

  static async deleteResultFile(name: string, filename: string): Promise<boolean> {
    try {
      await fs.unlink(path.join(FEATURE_DIR, name, 'result', filename))
      // Also delete associated note and metadata sidecar if they exist
      const notePath = path.join(FEATURE_DIR, name, 'result', `${filename}.note.md`)
      await fs.unlink(notePath).catch(() => {})
      const metaPath = path.join(FEATURE_DIR, name, 'result', `${filename}.metadata.json`)
      await fs.unlink(metaPath).catch(() => {})
      return true
    } catch { return false }
  }

  static async getResultNote(name: string, filename: string): Promise<string | null> {
    try {
      return await fs.readFile(path.join(FEATURE_DIR, name, 'result', `${filename}.note.md`), 'utf-8')
    } catch { return null }
  }

  static async saveResultNote(name: string, filename: string, note: string): Promise<void> {
    const notePath = path.join(FEATURE_DIR, name, 'result', `${filename}.note.md`)
    if (!note.trim()) {
      await fs.unlink(notePath).catch(() => {})
    } else {
      await fs.writeFile(notePath, note)
    }
  }

  static async getResultNotes(name: string): Promise<Record<string, string>> {
    try {
      const resultDir = path.join(FEATURE_DIR, name, 'result')
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

  static async getCornerCaseQuestions(name: string): Promise<CornerCaseQuestion[]> {
    try {
      const filePath = path.join(FEATURE_DIR, name, 'corner-case-questions.json')
      return JSON.parse(await fs.readFile(filePath, 'utf-8'))
    } catch { return [] }
  }

  static async saveCornerCaseQuestions(name: string, questions: CornerCaseQuestion[]): Promise<void> {
    const filePath = path.join(FEATURE_DIR, name, 'corner-case-questions.json')
    await fs.writeFile(filePath, JSON.stringify(questions, null, 2))
  }
}
