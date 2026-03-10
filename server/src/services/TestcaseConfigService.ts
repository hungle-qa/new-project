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

  // --- Per-feature Rules ---

  static async getFeatureRules(name: string): Promise<string> {
    let rulesContent: string
    try {
      const rulesPath = path.join(FEATURE_DIR, name, 'rules.md')
      rulesContent = await fs.readFile(rulesPath, 'utf-8')
    } catch {
      // Clone from selected global rule (or default) on first access
      const config = await TestcaseFeatureService.getFeatureConfig(name)
      const ruleName = config?.rule || 'test-rules'
      const globalRules = await this.getRule(ruleName)
      if (globalRules) {
        const featureDir = path.join(FEATURE_DIR, name)
        await fs.mkdir(featureDir, { recursive: true })
        await fs.writeFile(path.join(featureDir, 'rules.md'), globalRules)
      }
      rulesContent = globalRules
    }

    return rulesContent
  }

  static async saveFeatureRules(name: string, content: string): Promise<void> {
    const featureDir = path.join(FEATURE_DIR, name)
    await fs.mkdir(featureDir, { recursive: true })
    await fs.writeFile(path.join(featureDir, 'rules.md'), content)
  }

  // --- Per-feature Template ---

  static async getFeatureTemplate(name: string): Promise<TemplateColumn[]> {
    try {
      const templatePath = path.join(FEATURE_DIR, name, 'template.json')
      const raw = await fs.readFile(templatePath, 'utf-8')
      return JSON.parse(raw)
    } catch {
      // Clone from selected global template (or default) on first access
      const config = await TestcaseFeatureService.getFeatureConfig(name)
      const templateName = config?.template || 'template'
      const globalTemplate = await this.getTemplateByName(templateName)
      if (globalTemplate.length > 0) {
        const featureDir = path.join(FEATURE_DIR, name)
        await fs.mkdir(featureDir, { recursive: true })
        await fs.writeFile(
          path.join(featureDir, 'template.json'),
          JSON.stringify(globalTemplate, null, 2)
        )
      }
      return globalTemplate
    }
  }

  static async saveFeatureTemplate(name: string, columns: TemplateColumn[]): Promise<void> {
    const featureDir = path.join(FEATURE_DIR, name)
    await fs.mkdir(featureDir, { recursive: true })
    await fs.writeFile(
      path.join(featureDir, 'template.json'),
      JSON.stringify(columns, null, 2)
    )
  }

  // --- Sync (re-clone from selected global) ---

  static async syncFeatureRules(featureName: string, ruleName: string): Promise<void> {
    const globalRules = await this.getRule(ruleName)
    const featureDir = path.join(FEATURE_DIR, featureName)
    await fs.mkdir(featureDir, { recursive: true })
    await fs.writeFile(path.join(featureDir, 'rules.md'), globalRules)
  }

  static async syncFeatureTemplate(featureName: string, templateName: string): Promise<void> {
    const globalTemplate = await this.getTemplateByName(templateName)
    const featureDir = path.join(FEATURE_DIR, featureName)
    await fs.mkdir(featureDir, { recursive: true })
    await fs.writeFile(
      path.join(featureDir, 'template.json'),
      JSON.stringify(globalTemplate, null, 2)
    )
  }

  // --- Rules/Template Divergence Detection ---

  static async checkRulesCustomized(name: string): Promise<{ customized: boolean }> {
    try {
      const featureRulesPath = path.join(FEATURE_DIR, name, 'rules.md')
      const featureRules = await fs.readFile(featureRulesPath, 'utf-8')
      const globalRules = await this.getRules()
      // Compare trimmed content — ignore trailing whitespace differences
      return { customized: featureRules.trim() !== globalRules.trim() }
    } catch {
      // Per-feature rules don't exist yet — not customized
      return { customized: false }
    }
  }

  static async checkTemplateCustomized(name: string): Promise<{
    customized: boolean
    missingColumns: string[]
    extraColumns: string[]
  }> {
    try {
      const featureTemplatePath = path.join(FEATURE_DIR, name, 'template.json')
      const featureRaw = await fs.readFile(featureTemplatePath, 'utf-8')
      const featureCols: TemplateColumn[] = JSON.parse(featureRaw)
      const globalCols = await this.getTemplate()

      const featureNames = featureCols.map(c => c.name)
      const globalNames = globalCols.map(c => c.name)

      const missingColumns = globalNames.filter(n => !featureNames.includes(n))
      const extraColumns = featureNames.filter(n => !globalNames.includes(n))
      const customized = missingColumns.length > 0 || extraColumns.length > 0 ||
        JSON.stringify(featureCols) !== JSON.stringify(globalCols)

      return { customized, missingColumns, extraColumns }
    } catch {
      return { customized: false, missingColumns: [], extraColumns: [] }
    }
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
