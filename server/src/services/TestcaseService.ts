import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { AIService, AIConfig } from './AIService'

const SOURCE_DIR = path.join(__dirname, '../../../source/testcase')
const EXCLUDED_DIRS = ['rule', 'template', 'strategy']

export interface LevelEntry {
  level: number
  type: string
  value?: string
  values?: string[]
}

export interface ComponentMapping {
  name: string
  usage: string
}

export interface TemplateColumn {
  id: string
  name: string
  width: string
  style: string
  writingStyle: string
}

export interface FeatureSummary {
  name: string
  created: string
  updated: string
}

export interface FeatureConfig {
  name: string
  created: string
  updated: string
  strategy: string
  levels: LevelEntry[]
  scope: {
    happy_case: string
    corner_case: string
  }
  linked_knowledge: string[]
  components: ComponentMapping[]
  content: string
}

export class TestcaseService {
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

      // Sort by updated date, newest first
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
      levels: [],
      scope: {
        happy_case: '',
        corner_case: '',
      },
      linked_knowledge: [],
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
        strategy: data.strategy || '',
        levels: data.levels || [],
        scope: data.scope || { happy_case: '', corner_case: '' },
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
      strategy: merged.strategy,
      levels: merged.levels,
      scope: merged.scope,
      linked_knowledge: merged.linked_knowledge,
      components: merged.components,
    }

    const configPath = path.join(SOURCE_DIR, name, 'config.md')
    const configContent = matter.stringify(body, frontmatter)
    await fs.writeFile(configPath, configContent)

    return this.getFeatureConfig(name)
  }

  static async renameFeature(oldName: string, newName: string): Promise<string | null> {
    try {
      const oldDir = path.join(SOURCE_DIR, oldName)
      const newDir = path.join(SOURCE_DIR, newName)

      // Check target doesn't already exist
      try {
        await fs.access(newDir)
        return null // target already exists
      } catch {
        // Good - doesn't exist
      }

      await fs.rename(oldDir, newDir)

      // Update name in config.md
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
    customPrompt: string,
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

    const structured = await AIService.structureSpec(rawContent, customPrompt, aiConfig)

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

  // --- Rules ---

  static async getRules(): Promise<string> {
    try {
      const rulesPath = path.join(SOURCE_DIR, 'rule', 'test-rules.md')
      return await fs.readFile(rulesPath, 'utf-8')
    } catch {
      return ''
    }
  }

  static async saveRules(content: string): Promise<void> {
    const rulesDir = path.join(SOURCE_DIR, 'rule')
    await fs.mkdir(rulesDir, { recursive: true })
    await fs.writeFile(path.join(rulesDir, 'test-rules.md'), content)
  }

  // --- Default Spec Prompt ---

  static async getDefaultPrompt(): Promise<string> {
    try {
      const promptPath = path.join(SOURCE_DIR, 'default-prompt.txt')
      return (await fs.readFile(promptPath, 'utf-8')).trim()
    } catch {
      return ''
    }
  }

  static async saveDefaultPrompt(prompt: string): Promise<void> {
    await fs.mkdir(SOURCE_DIR, { recursive: true })
    await fs.writeFile(path.join(SOURCE_DIR, 'default-prompt.txt'), prompt.trim())
  }

  // --- Per-feature Spec Prompt ---

  static async getSpecPrompt(name: string): Promise<string> {
    try {
      const promptPath = path.join(SOURCE_DIR, name, 'spec', 'prompt.txt')
      return (await fs.readFile(promptPath, 'utf-8')).trim()
    } catch {
      return ''
    }
  }

  static async saveSpecPrompt(name: string, prompt: string): Promise<void> {
    const specDir = path.join(SOURCE_DIR, name, 'spec')
    await fs.mkdir(specDir, { recursive: true })
    await fs.writeFile(path.join(specDir, 'prompt.txt'), prompt.trim())
  }

  // --- Template ---

  static async getTemplate(): Promise<TemplateColumn[]> {
    try {
      const templatePath = path.join(SOURCE_DIR, 'template', 'template.json')
      const raw = await fs.readFile(templatePath, 'utf-8')
      return JSON.parse(raw)
    } catch {
      return []
    }
  }

  static async saveTemplate(columns: TemplateColumn[]): Promise<void> {
    const templateDir = path.join(SOURCE_DIR, 'template')
    await fs.mkdir(templateDir, { recursive: true })
    await fs.writeFile(
      path.join(templateDir, 'template.json'),
      JSON.stringify(columns, null, 2)
    )
  }

  // --- Strategies ---

  static async getStrategies(): Promise<string[]> {
    try {
      const strategyDir = path.join(SOURCE_DIR, 'strategy')
      const files = await fs.readdir(strategyDir)
      return files.filter(f => f.endsWith('.md')).map(f => f.replace('.md', ''))
    } catch {
      return []
    }
  }

  static async getStrategyContent(name: string): Promise<string | null> {
    try {
      const filePath = path.join(SOURCE_DIR, 'strategy', `${name}.md`)
      return await fs.readFile(filePath, 'utf-8')
    } catch {
      return null
    }
  }
}
