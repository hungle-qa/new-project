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
    let rawContent: string

    if (mimeType === 'application/pdf') {
      if (skipAi) {
        const { parsePdfWithBullets } = await import('./PdfBulletParser')
        rawContent = await parsePdfWithBullets(fileBuffer)
      } else {
        const pdfParse = await import('pdf-parse')
        rawContent = (await pdfParse.default(fileBuffer)).text
      }
    } else if (mimeType === 'text/markdown' || filename.endsWith('.md')) {
      rawContent = fileBuffer.toString('utf-8')
    } else if (mimeType === 'text/plain' || filename.endsWith('.txt')) {
      rawContent = fileBuffer.toString('utf-8')
    } else {
      throw new Error('Unsupported file type. Only PDF, Markdown, and TXT files are supported.')
    }

    const finalContent = skipAi
      ? rawContent
      : (await AIService.structureSpec(rawContent, customPrompt, aiConfig)).content

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

  static async getResults(name: string): Promise<string[]> {
    try {
      return (await fs.readdir(path.join(SOURCE_DIR, name, 'result'))).filter(f => f.endsWith('.csv'))
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
      return true
    } catch { return false }
  }
}
