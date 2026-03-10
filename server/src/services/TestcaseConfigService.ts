import fs from 'fs/promises'
import path from 'path'
import { TestcaseFeatureService } from './TestcaseFeatureService'
import {
  SOURCE_DIR,
  FEATURE_DIR,
  TemplateColumn,
  FeatureConfig,
} from './TestcaseTypes'

export class TestcaseConfigService {
  // --- Global Rules ---

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

  // --- Multi-Rule CRUD ---

  static async listRules(): Promise<string[]> {
    try {
      const rulesDir = path.join(SOURCE_DIR, 'rule')
      const files = await fs.readdir(rulesDir)
      return files.filter(f => f.endsWith('.md')).map(f => f.replace('.md', ''))
    } catch {
      return []
    }
  }

  static async getRule(name: string): Promise<string> {
    try {
      return await fs.readFile(path.join(SOURCE_DIR, 'rule', `${name}.md`), 'utf-8')
    } catch {
      return ''
    }
  }

  static async saveRule(name: string, content: string): Promise<void> {
    const rulesDir = path.join(SOURCE_DIR, 'rule')
    await fs.mkdir(rulesDir, { recursive: true })
    await fs.writeFile(path.join(rulesDir, `${name}.md`), content)
  }

  static async renameRule(oldName: string, newName: string): Promise<boolean> {
    try {
      const rulesDir = path.join(SOURCE_DIR, 'rule')
      await fs.rename(path.join(rulesDir, `${oldName}.md`), path.join(rulesDir, `${newName}.md`))
      return true
    } catch {
      return false
    }
  }

  static async deleteRule(name: string): Promise<boolean> {
    try {
      await fs.unlink(path.join(SOURCE_DIR, 'rule', `${name}.md`))
      return true
    } catch {
      return false
    }
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
      const promptPath = path.join(FEATURE_DIR, name, 'spec', 'prompt.txt')
      return (await fs.readFile(promptPath, 'utf-8')).trim()
    } catch {
      return ''
    }
  }

  static async saveSpecPrompt(name: string, prompt: string): Promise<void> {
    const specDir = path.join(FEATURE_DIR, name, 'spec')
    await fs.mkdir(specDir, { recursive: true })
    await fs.writeFile(path.join(specDir, 'prompt.txt'), prompt.trim())
  }

  // --- Global Template ---

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

  // --- Multi-Template CRUD ---

  static async listTemplates(): Promise<string[]> {
    try {
      const templateDir = path.join(SOURCE_DIR, 'template')
      const files = await fs.readdir(templateDir)
      return files.filter(f => f.endsWith('.json')).map(f => f.replace('.json', ''))
    } catch {
      return []
    }
  }

  static async getTemplateByName(name: string): Promise<TemplateColumn[]> {
    try {
      const raw = await fs.readFile(path.join(SOURCE_DIR, 'template', `${name}.json`), 'utf-8')
      return JSON.parse(raw)
    } catch {
      return []
    }
  }

  static async saveTemplateByName(name: string, columns: TemplateColumn[]): Promise<void> {
    const templateDir = path.join(SOURCE_DIR, 'template')
    await fs.mkdir(templateDir, { recursive: true })
    await fs.writeFile(
      path.join(templateDir, `${name}.json`),
      JSON.stringify(columns, null, 2)
    )
  }

  static async renameTemplate(oldName: string, newName: string): Promise<boolean> {
    try {
      const templateDir = path.join(SOURCE_DIR, 'template')
      await fs.rename(path.join(templateDir, `${oldName}.json`), path.join(templateDir, `${newName}.json`))
      return true
    } catch {
      return false
    }
  }

  static async deleteTemplate(name: string): Promise<boolean> {
    try {
      await fs.unlink(path.join(SOURCE_DIR, 'template', `${name}.json`))
      return true
    } catch {
      return false
    }
  }

  // --- Resolved Rule/Template (reads config.md → fetches from global) ---

  static async getResolvedRule(featureName: string): Promise<string> {
    const config = await TestcaseFeatureService.getFeatureConfig(featureName)
    const ruleName = config?.rule || 'test-rules'
    return this.getRule(ruleName)
  }

  static async getResolvedTemplate(featureName: string): Promise<TemplateColumn[]> {
    const config = await TestcaseFeatureService.getFeatureConfig(featureName)
    const templateName = config?.template || 'template'
    return this.getTemplateByName(templateName)
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
