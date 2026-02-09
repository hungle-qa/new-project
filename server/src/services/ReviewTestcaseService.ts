import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { AIService, AIConfig } from './AIService'

const SOURCE_DIR = path.join(__dirname, '../../../source/testcase')
const EXCLUDED_DIRS = ['rule', 'template']

export interface LevelEntry {
  level: number
  type: string
  value?: string
  values?: string[]
}

export interface KnowledgeFile {
  name: string
  path: string
  imported: string
}

export interface ComponentMapping {
  name: string
  usage: string
}

export interface FeatureConfig {
  name: string
  created: string
  updated: string
  status: string
  levels: LevelEntry[]
  scope: {
    happy_case: string
    corner_case: string
  }
  knowledge_files: KnowledgeFile[]
  components: ComponentMapping[]
  content: string
}

export class ReviewTestcaseService {
  static async getAllFeatures(): Promise<string[]> {
    try {
      const entries = await fs.readdir(SOURCE_DIR, { withFileTypes: true })
      return entries
        .filter(e => e.isDirectory() && !EXCLUDED_DIRS.includes(e.name))
        .map(e => e.name)
    } catch {
      return []
    }
  }

  static async createFeature(name: string): Promise<{ name: string; path: string }> {
    const featureDir = path.join(SOURCE_DIR, name)

    await fs.mkdir(featureDir, { recursive: true })
    await fs.mkdir(path.join(featureDir, 'spec'), { recursive: true })
    await fs.mkdir(path.join(featureDir, 'result'), { recursive: true })
    await fs.mkdir(path.join(featureDir, 'knowledge'), { recursive: true })

    const today = new Date().toISOString().split('T')[0]
    const config: Record<string, unknown> = {
      name,
      created: today,
      updated: today,
      status: 'draft',
      levels: [],
      scope: {
        happy_case: '',
        corner_case: '',
      },
      knowledge_files: [],
      components: [],
    }

    const configContent = matter.stringify('\n## Mapped Components\n', config)
    await fs.writeFile(path.join(featureDir, 'config.md'), configContent)

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
        status: data.status || 'draft',
        levels: data.levels || [],
        scope: data.scope || { happy_case: '', corner_case: '' },
        knowledge_files: data.knowledge_files || [],
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
    const merged = {
      ...existing,
      ...updates,
      updated: today,
      name: existing.name, // name cannot be changed
    }

    // Rebuild body section from components
    const componentLines = (merged.components || [])
      .map((c: ComponentMapping) => `- ${c.name}: ${c.usage}`)
      .join('\n')
    const body = `\n## Mapped Components\n${componentLines}\n`

    const frontmatter: Record<string, unknown> = {
      name: merged.name,
      created: merged.created,
      updated: merged.updated,
      status: merged.status,
      levels: merged.levels,
      scope: merged.scope,
      knowledge_files: merged.knowledge_files,
      components: merged.components,
    }

    const configPath = path.join(SOURCE_DIR, name, 'config.md')
    const configContent = matter.stringify(body, frontmatter)
    await fs.writeFile(configPath, configContent)

    return this.getFeatureConfig(name)
  }

  static async deleteFeature(name: string): Promise<boolean> {
    try {
      const featureDir = path.join(SOURCE_DIR, name)
      await fs.rm(featureDir, { recursive: true, force: true })
      return true
    } catch {
      return false
    }
  }

  static async importSpec(
    name: string,
    fileBuffer: Buffer,
    filename: string,
    mimeType: string,
    aiConfig: AIConfig
  ): Promise<{ specPath: string }> {
    let rawContent: string

    if (mimeType === 'application/pdf') {
      const pdfParse = await import('pdf-parse')
      const pdfData = await pdfParse.default(fileBuffer)
      rawContent = pdfData.text
    } else if (mimeType === 'text/markdown' || filename.endsWith('.md')) {
      rawContent = fileBuffer.toString('utf-8')
    } else if (mimeType === 'text/plain' || filename.endsWith('.txt')) {
      rawContent = fileBuffer.toString('utf-8')
    } else {
      throw new Error('Unsupported file type. Only PDF, Markdown, and TXT files are supported.')
    }

    const structured = await AIService.structureSpec(rawContent, aiConfig)

    const specDir = path.join(SOURCE_DIR, name, 'spec')
    await fs.mkdir(specDir, { recursive: true })
    const specPath = path.join(specDir, 'imported-spec.md')
    await fs.writeFile(specPath, structured.content)

    return { specPath }
  }

  static async getSpec(name: string): Promise<string | null> {
    try {
      const specPath = path.join(SOURCE_DIR, name, 'spec', 'imported-spec.md')
      return await fs.readFile(specPath, 'utf-8')
    } catch {
      return null
    }
  }

  static async uploadKnowledge(
    name: string,
    fileBuffer: Buffer,
    filename: string
  ): Promise<KnowledgeFile> {
    const knowledgeDir = path.join(SOURCE_DIR, name, 'knowledge')
    await fs.mkdir(knowledgeDir, { recursive: true })

    const filePath = path.join(knowledgeDir, filename)
    await fs.writeFile(filePath, fileBuffer)

    const today = new Date().toISOString().split('T')[0]
    const knowledgeFile: KnowledgeFile = {
      name: filename,
      path: `knowledge/${filename}`,
      imported: today,
    }

    // Update config with new knowledge file
    const config = await this.getFeatureConfig(name)
    if (config) {
      const existing = config.knowledge_files || []
      const filtered = existing.filter(f => f.name !== filename)
      filtered.push(knowledgeFile)
      await this.updateFeatureConfig(name, { knowledge_files: filtered })
    }

    return knowledgeFile
  }

  static async deleteKnowledge(name: string, filename: string): Promise<boolean> {
    try {
      const filePath = path.join(SOURCE_DIR, name, 'knowledge', filename)
      await fs.unlink(filePath)

      // Update config to remove knowledge file
      const config = await this.getFeatureConfig(name)
      if (config) {
        const filtered = (config.knowledge_files || []).filter(f => f.name !== filename)
        await this.updateFeatureConfig(name, { knowledge_files: filtered })
      }

      return true
    } catch {
      return false
    }
  }

  static async getResults(name: string): Promise<string[]> {
    try {
      const resultDir = path.join(SOURCE_DIR, name, 'result')
      const files = await fs.readdir(resultDir)
      return files.filter(f => f.endsWith('.csv'))
    } catch {
      return []
    }
  }

  static async getResultFile(name: string, filename: string): Promise<string | null> {
    try {
      const filePath = path.join(SOURCE_DIR, name, 'result', filename)
      return await fs.readFile(filePath, 'utf-8')
    } catch {
      return null
    }
  }

  static getResultFilePath(name: string, filename: string): string {
    return path.join(SOURCE_DIR, name, 'result', filename)
  }
}
