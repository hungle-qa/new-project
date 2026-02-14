import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { AIService, AIConfig } from './AIService'

const SOURCE_DIR = path.join(__dirname, '../../../source/testcase')
const EXCLUDED_DIRS = ['rule', 'template', 'strategy']

function getMaxDepth(nodes: StructureNode[], depth = 1): number {
  let max = nodes.length > 0 ? depth : 0
  for (const node of nodes) {
    if (node.children.length > 0) {
      max = Math.max(max, getMaxDepth(node.children, depth + 1))
    }
  }
  return max
}

export interface StructureNode {
  id: string
  name: string
  children: StructureNode[]
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

export type LinkedKnowledgeEntry = string | { item: string; sections: string[] }

export interface FeatureConfig {
  name: string
  created: string
  updated: string
  strategy: string
  structure: StructureNode[]
  scope: {
    happy_case: string
    corner_case: string
  }
  linked_knowledge: LinkedKnowledgeEntry[]
  components: ComponentMapping[]
  content: string
}

export class TestcaseService {
  static getKnowledgeItemName(entry: LinkedKnowledgeEntry): string {
    return typeof entry === 'string' ? entry : entry.item
  }

  static getKnowledgeSections(entry: LinkedKnowledgeEntry): string[] {
    return typeof entry === 'string' ? [] : entry.sections
  }

  static filterContentBySections(content: string, sections: string[]): string {
    if (sections.length === 0) return content

    const lines = content.split('\n')
    const result: string[] = []
    let currentHeading = ''
    let include = false

    for (const line of lines) {
      const headingMatch = line.match(/^## (.+)$/)
      if (headingMatch) {
        currentHeading = headingMatch[0]
        include = sections.includes(currentHeading)
        if (include) result.push(line)
      } else if (include) {
        result.push(line)
      } else if (!currentHeading) {
        // Content before any ## heading — always include
        result.push(line)
      }
    }

    return result.join('\n')
  }

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
      structure: [],
      scope: {
        happy_case: '',
        corner_case: '',
      },
      linked_knowledge: [],
      components: [],
    }

    const configContent = matter.stringify('\n## Mapped Components\n', config)
    await fs.writeFile(path.join(featureDir, 'config.md'), configContent)

    // Scaffold empty context-digest.md so user can click "Update Context" to populate
    const digestContent = `---
digest-version: 2
generated: ${new Date().toISOString()}
feature: ${name}
sources: []
---

## Config
strategy: (none)
structure: empty
components: (none)
linked_knowledge: (none)

<!-- [REQUIREMENTS — Generate testcases from this] -->

## Spec Summary
(no spec imported)

## Test Scope

### TESTABLE (generate testcases for these)
(no spec imported — import spec first)

### OUT OF SCOPE (in knowledge but NOT in spec — do NOT test)
(none)

### Scope Hints
**Happy Case:** Standard happy paths
**Corner Case:** Standard edge cases

## Structure
No structure defined — AI freestyles module assignment.

## Strategy Guide
No strategy selected — use default balanced approach.

<!-- [FORMAT — How to write testcases] -->

## Template Columns
(no writing styles defined)
Full column order: (not yet configured)

## Merged Column Order
(not yet configured)

## Rules Summary
(no rules)

<!-- [REFERENCE — Terminology only, do NOT generate testcases from this] -->

## Terminology & Context
(no linked knowledge)

## Component Knowledge
(no components linked)
`
    await fs.writeFile(path.join(featureDir, 'context-digest.md'), digestContent)

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
      structure: merged.structure,
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

  static async deleteResultFile(name: string, filename: string): Promise<boolean> {
    try {
      const filePath = path.join(SOURCE_DIR, name, 'result', filename)
      await fs.unlink(filePath)
      return true
    } catch {
      return false
    }
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

  // --- Per-feature Rules ---

  static async getFeatureRules(name: string): Promise<string> {
    let rulesContent: string
    try {
      const rulesPath = path.join(SOURCE_DIR, name, 'rules.md')
      rulesContent = await fs.readFile(rulesPath, 'utf-8')
    } catch {
      // Clone from global default on first access
      const globalRules = await this.getRules()
      if (globalRules) {
        const featureDir = path.join(SOURCE_DIR, name)
        await fs.mkdir(featureDir, { recursive: true })
        await fs.writeFile(path.join(featureDir, 'rules.md'), globalRules)
      }
      rulesContent = globalRules
    }

    // Auto-migrate scope from config into rules if not already present
    if (!rulesContent.includes('## Scope')) {
      const config = await this.getFeatureConfig(name)
      if (config?.scope && (config.scope.happy_case || config.scope.corner_case)) {
        const scopeSection = `\n\n## Scope\n\n### Happy Case\n${config.scope.happy_case || 'Normal user flows, valid inputs, expected outcomes.'}\n\n### Corner Case\n${config.scope.corner_case || 'Boundary values, invalid inputs.'}\n`
        rulesContent += scopeSection
        await this.saveFeatureRules(name, rulesContent)
      }
    }

    return rulesContent
  }

  static async saveFeatureRules(name: string, content: string): Promise<void> {
    const featureDir = path.join(SOURCE_DIR, name)
    await fs.mkdir(featureDir, { recursive: true })
    await fs.writeFile(path.join(featureDir, 'rules.md'), content)
  }

  // --- Per-feature Template ---

  static async getFeatureTemplate(name: string): Promise<TemplateColumn[]> {
    try {
      const templatePath = path.join(SOURCE_DIR, name, 'template.json')
      const raw = await fs.readFile(templatePath, 'utf-8')
      return JSON.parse(raw)
    } catch {
      // Clone from global default on first access
      const globalTemplate = await this.getTemplate()
      if (globalTemplate.length > 0) {
        const featureDir = path.join(SOURCE_DIR, name)
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
    const featureDir = path.join(SOURCE_DIR, name)
    await fs.mkdir(featureDir, { recursive: true })
    await fs.writeFile(
      path.join(featureDir, 'template.json'),
      JSON.stringify(columns, null, 2)
    )
  }

  // --- Digest Freshness ---

  static async checkDigestFreshness(name: string): Promise<{ status: 'FRESH' | 'STALE'; reason?: string }> {
    const digestPath = path.join(SOURCE_DIR, name, 'context-digest.md')

    let digestTime: number
    try {
      const stat = await fs.stat(digestPath)
      digestTime = stat.mtimeMs
    } catch {
      return { status: 'STALE', reason: 'no-digest' }
    }

    const config = await this.getFeatureConfig(name)

    // Source files to check against digest timestamp
    const filesToCheck = [
      path.join(SOURCE_DIR, name, 'config.md'),
      path.join(SOURCE_DIR, name, 'rules.md'),
      path.join(SOURCE_DIR, name, 'template.json'),
      path.join(SOURCE_DIR, 'rule', 'test-rules.md'),
      path.join(SOURCE_DIR, 'template', 'template.json'),
    ]

    // Add spec files
    try {
      const specDir = path.join(SOURCE_DIR, name, 'spec')
      const specFiles = await fs.readdir(specDir)
      for (const f of specFiles) {
        if (f.endsWith('.md')) filesToCheck.push(path.join(specDir, f))
      }
    } catch { /* no spec dir */ }

    // Add strategy file
    if (config?.strategy) {
      filesToCheck.push(path.join(SOURCE_DIR, 'strategy', `${config.strategy}.md`))
    }

    // Add linked knowledge files
    for (const entry of config?.linked_knowledge || []) {
      const kName = this.getKnowledgeItemName(entry)
      filesToCheck.push(path.join(SOURCE_DIR, '../../source/feature-knowledge', kName, 'config.md'))
    }

    // Add design-system component files
    for (const comp of config?.components || []) {
      filesToCheck.push(path.join(SOURCE_DIR, '../../source/design-system', `${comp.name}.md`))
    }

    // Check each file's mtime against digest
    for (const f of filesToCheck) {
      try {
        const stat = await fs.stat(f)
        if (stat.mtimeMs > digestTime) {
          const relative = path.relative(path.join(SOURCE_DIR, '../..'), f)
          return { status: 'STALE', reason: relative }
        }
      } catch { /* file doesn't exist, skip */ }
    }

    return { status: 'FRESH' }
  }

  // --- Context Digest ---

  static async generateContextDigest(name: string): Promise<string> {
    const config = await this.getFeatureConfig(name)
    if (!config) throw new Error('Feature not found')

    // Read all sources
    const rules = await this.getFeatureRules(name)
    const template = await this.getFeatureTemplate(name)
    const spec = await this.getSpec(name)

    let strategyName = config.strategy || ''
    let strategySummary = ''
    if (strategyName) {
      const fullStrategy = (await this.getStrategyContent(strategyName)) || ''
      // Extract 1-line summary: first non-empty, non-heading line (typically the **Philosophy:** line)
      const summaryLine = fullStrategy.split('\n').find(l => l.trim() && !l.startsWith('#'))
      strategySummary = summaryLine ? summaryLine.trim() : `Use ${strategyName} approach`
    }

    // Read linked knowledge — lazy-load: only read if spec references the knowledge topics
    const knowledgeSections: string[] = []
    const specLower = (spec || '').toLowerCase()
    for (const entry of config.linked_knowledge || []) {
      const kName = this.getKnowledgeItemName(entry)
      const selectedSections = this.getKnowledgeSections(entry)

      // B5: Skip reading knowledge if selected sections are clearly unrelated to spec
      // Check if any section heading keyword appears in spec text
      if (spec && selectedSections.length > 0) {
        const anyRelevant = selectedSections.some(s => {
          // Extract core words from section heading (strip "## ", "I.", "II.", "VII.", etc.)
          const words = s.replace(/^#+\s*/, '').replace(/^[IVXL]+\.\s*/, '').trim().toLowerCase()
          return specLower.includes(words)
        })
        if (!anyRelevant) continue // skip reading this knowledge — no section is referenced in spec
      }

      try {
        const kPath = path.join(SOURCE_DIR, '../../source/feature-knowledge', kName, 'config.md')
        const kContent = await fs.readFile(kPath, 'utf-8')
        const parsed = matter(kContent)
        const filtered = this.filterContentBySections(parsed.content, selectedSections)
        knowledgeSections.push(`### ${kName}\n${filtered}`)
      } catch { /* skip missing */ }
    }

    // Render structure tree
    function renderTree(nodes: StructureNode[], indent = ''): string {
      return nodes.map(n => {
        const line = `${indent}- ${n.name}`
        const children = n.children.length > 0 ? '\n' + renderTree(n.children, indent + '  ') : ''
        return line + children
      }).join('\n')
    }

    const structureText = config.structure && config.structure.length > 0
      ? renderTree(config.structure)
      : 'No structure defined — AI freestyles module assignment.'

    const maxDepth = getMaxDepth(config.structure || [])

    // Template columns section — condense writingStyle to 1-line hints
    const colsWithStyle = template.filter(c => c.writingStyle)
    const templateSection = colsWithStyle.map(c => {
      // Extract first meaningful line as hint, strip markdown headings
      const firstLine = c.writingStyle
        .split('\n')
        .map(l => l.replace(/^#+\s*/, '').trim())
        .find(l => l.length > 0)
      return `- **${c.name}**: ${firstLine || c.writingStyle.slice(0, 80)}`
    }).join('\n')
    const fullColumnOrder = template.map(c => c.name).join(', ')

    // Merged column order
    let mergedOrder = fullColumnOrder
    if (config.structure && config.structure.length > 0 && maxDepth > 0) {
      const levelCols = Array.from({ length: maxDepth }, (_, i) => `Level ${i + 1}`)
      mergedOrder = template.map(c => {
        if (c.name.toLowerCase().includes('module')) return levelCols.join(', ')
        return c.name
      }).join(', ')
    }

    // --- Fix 2: Condense spec to US titles + AC bullets only ---
    let specSummary = '(no spec imported)'
    if (spec) {
      const condensedLines: string[] = []

      // Find US blocks: support both "## US1" headings and "**US1 - ..." bold patterns
      const usPattern = /(?:^##\s+(US\d+.*)$)|(?:^\*\*(US\d+\s*-\s*.*?)\*\*)/gm
      let usMatch: RegExpExecArray | null
      const usPositions: { title: string; pos: number }[] = []
      while ((usMatch = usPattern.exec(spec)) !== null) {
        const title = (usMatch[1] || usMatch[2]).trim()
        usPositions.push({ title, pos: usMatch.index })
      }

      for (let i = 0; i < usPositions.length; i++) {
        const us = usPositions[i]
        const nextPos = i + 1 < usPositions.length ? usPositions[i + 1].pos : spec.length
        const usBlock = spec.slice(us.pos, nextPos)
        condensedLines.push(`### ${us.title}`)

        // Extract ACs from table rows: | AC1 | description | given | when | then |
        const acTableRows = usBlock.match(/^\|\s*AC\d+\s*\|.*$/gm)
        if (acTableRows) {
          for (const row of acTableRows) {
            const cells = row.split('|').map(c => c.trim()).filter(Boolean)
            if (cells.length >= 5) {
              const [acId, desc, given, when, then] = cells
              condensedLines.push(`- **${acId}: ${desc}**`)
              condensedLines.push(`  - Given: ${given}`)
              condensedLines.push(`  - When: ${when}`)
              condensedLines.push(`  - Then: ${then}`)
            }
          }
        }

        // Also extract AC from ### headings (fallback)
        const acHeadings = usBlock.match(/^###\s+(AC\d+.*)$/gm)
        if (acHeadings && !acTableRows) {
          for (const ac of acHeadings) {
            condensedLines.push(`- ${ac.replace(/^###\s+/, '').trim()}`)
          }
        }
      }

      specSummary = condensedLines.length > 0 ? condensedLines.join('\n') : spec
    }

    // --- Fix 4: Build Test Scope with broader US pattern matching ---
    let testScopeTestable = '(no spec imported — import spec first)'
    let testScopeOutOfScope = '(none)'

    // Extract knowledge topic names for diffing (skip table rows, URLs, short fragments)
    const knowledgeTopicNames: string[] = []
    for (const section of knowledgeSections) {
      const headingMatches = section.match(/^###?\s+(.+)$/gm)
      if (headingMatches) {
        for (const h of headingMatches) {
          const topicName = h.replace(/^###?\s+/, '').trim()
          // Skip table-like lines, URLs, short fragments (<3 chars), and knowledge section headers
          if (!topicName || topicName.length < 3) continue
          if (topicName.startsWith('|') || topicName.includes('http')) continue
          if ((config.linked_knowledge || []).some(k => topicName.toLowerCase() === this.getKnowledgeItemName(k).toLowerCase())) continue
          knowledgeTopicNames.push(topicName)
        }
      }
      // Also extract bold-defined terms as topics (e.g., **Smart Responses:** ...)
      const boldTopics = section.match(/^\*\*([^*]{3,50})\*\*(?::|[\s])/gm)
      if (boldTopics) {
        for (const bt of boldTopics) {
          const term = bt.replace(/^\*\*/, '').replace(/\*\*[:\s].*$/, '').trim()
          if (term && term.length >= 3 && !knowledgeTopicNames.includes(term)) {
            knowledgeTopicNames.push(term)
          }
        }
      }
    }

    if (spec) {
      // Support both ## heading and **bold** US patterns
      const usPattern = /(?:^##\s+(US\d+.*)$)|(?:^\*\*(US\d+\s*-\s*.*?)\*\*)/gm
      const testableLines: string[] = []
      const specText = spec.toLowerCase()

      let usExec: RegExpExecArray | null
      const usBlocks: { title: string; pos: number }[] = []
      while ((usExec = usPattern.exec(spec)) !== null) {
        const title = (usExec[1] || usExec[2]).trim()
        usBlocks.push({ title, pos: usExec.index })
      }

      for (let i = 0; i < usBlocks.length; i++) {
        const us = usBlocks[i]
        const nextPos = i + 1 < usBlocks.length ? usBlocks[i + 1].pos : spec.length
        const usBlock = spec.slice(us.pos, nextPos)
        testableLines.push(`- ${us.title}`)

        // Extract ACs from table rows
        const acRows = usBlock.match(/^\|\s*(AC\d+)\s*\|\s*([^|]+)/gm)
        if (acRows) {
          for (const row of acRows) {
            const acMatch = row.match(/^\|\s*(AC\d+)\s*\|\s*(.+?)(?:\s*\||$)/)
            if (acMatch) {
              testableLines.push(`  - ${acMatch[1]}: ${acMatch[2].trim()}`)
            }
          }
        }

        // Fallback: AC from ### headings
        const acHeadings = usBlock.match(/^###\s+(AC\d+.*)$/gm)
        if (acHeadings && !acRows) {
          for (const ac of acHeadings) {
            testableLines.push(`  - ${ac.replace(/^###\s+/, '').trim()}`)
          }
        }
      }

      testScopeTestable = testableLines.length > 0
        ? testableLines.join('\n')
        : '(spec found but no user stories detected)'

      // Build OUT OF SCOPE: knowledge topics not referenced in spec
      const outOfScope = knowledgeTopicNames.filter(topic => {
        return !specText.includes(topic.toLowerCase())
      })
      // Deduplicate
      const uniqueOutOfScope = [...new Set(outOfScope)]
      testScopeOutOfScope = uniqueOutOfScope.length > 0
        ? uniqueOutOfScope.map(t => `- ${t}`).join('\n')
        : '(all knowledge topics are in scope)'
    }

    // Extract scope hints from rules
    const happyCaseMatch = rules.match(/###\s*Happy Case\s*\n([\s\S]*?)(?=\n###|\n##|$)/)
    const cornerCaseMatch = rules.match(/###\s*Corner Case\s*\n([\s\S]*?)(?=\n###|\n##|$)/)
    const happyCase = happyCaseMatch ? happyCaseMatch[1].trim() : 'Standard happy paths'
    const cornerCase = cornerCaseMatch ? cornerCaseMatch[1].trim() : 'Standard edge cases'

    // --- Fix 3: Clean terminology extraction (skip table rows, URLs, deduplicate) ---
    let terminologySection = '(no linked knowledge)'
    if (knowledgeSections.length > 0) {
      const fullKnowledge = knowledgeSections.join('\n\n')

      // Helper: skip lines that are table fragments, URLs, or too short
      function isCleanLine(line: string): boolean {
        const trimmed = line.trim()
        if (trimmed.length < 5) return false
        if (trimmed.startsWith('|')) return false
        if (/https?:\/\//.test(trimmed)) return false
        if (trimmed.startsWith('---')) return false
        return true
      }

      // Extract glossary: bold-defined terms only (e.g., **Term:** definition)
      const glossaryTerms: string[] = []
      const glossaryMatches = fullKnowledge.match(/^\*\*([^*]{2,50})\*\*[:\s]+([^\n|]{5,})/gm)
      if (glossaryMatches) {
        const seen = new Set<string>()
        for (const g of glossaryMatches) {
          if (!isCleanLine(g)) continue
          const termMatch = g.match(/^\*\*(.+?)\*\*/)
          const key = termMatch ? termMatch[1].toLowerCase() : g.toLowerCase()
          if (!seen.has(key)) {
            seen.add(key)
            glossaryTerms.push(g.trim())
          }
        }
      }

      // Extract user roles: look for structured role definitions
      const roles: string[] = []
      const rolePatterns = fullKnowledge.match(/(?:^|\n)\*\*(?:User Roles?|Roles?)\*\*[:\s]+([^\n]+)/gi)
      if (rolePatterns) {
        for (const r of rolePatterns) {
          const clean = r.trim()
          if (isCleanLine(clean)) roles.push(`- ${clean}`)
        }
      }

      // Extract preconditions: look for plan/prerequisite mentions
      const preconditions: string[] = []
      const prePatterns = fullKnowledge.match(/(?:^|\n)\*\*(?:Preconditions?|Plans?)\*\*[:\s]+([^\n]+)/gi)
      if (prePatterns) {
        for (const p of prePatterns) {
          const clean = p.trim()
          if (isCleanLine(clean)) preconditions.push(`- ${clean}`)
        }
      }

      const parts: string[] = []
      if (glossaryTerms.length > 0) parts.push(`**Glossary:**\n${glossaryTerms.slice(0, 15).join('\n')}`)
      if (roles.length > 0) parts.push(`**User Roles:**\n${roles.slice(0, 5).join('\n')}`)
      if (preconditions.length > 0) parts.push(`**Preconditions:**\n${preconditions.slice(0, 5).join('\n')}`)

      terminologySection = parts.length > 0
        ? parts.join('\n\n')
        : '(knowledge linked but no extractable terminology found)'
    }

    // --- Fix 5: Condense rules to priority map + constraints only ---
    let rulesCondensed = '(no rules)'
    if (rules) {
      const rulesParts: string[] = []

      // Extract Priority Mapping section
      const priorityMatch = rules.match(/##\s*Priority Mapping\s*\n([\s\S]*?)(?=\n##|$)/)
      if (priorityMatch) rulesParts.push(`### Priority Mapping\n${priorityMatch[1].trim()}`)

      // Extract Constraints section
      const constraintsMatch = rules.match(/##\s*CONSTRAINTS\s*\n([\s\S]*?)(?=\n##|$)/i)
      if (constraintsMatch) rulesParts.push(`### Constraints\n${constraintsMatch[1].trim()}`)

      // Extract Order of case
      const orderMatch = rules.match(/##\s*Order of case\s*\n([\s\S]*?)(?=\n##|$)/i)
      if (orderMatch) rulesParts.push(`### Order\n${orderMatch[1].trim()}`)

      // Extract Platform from Scope
      const platformMatch = rules.match(/###\s*Platform[:\s]+(.+)/i)
      if (platformMatch) rulesParts.push(`**Platform:** ${platformMatch[1].trim()}`)

      rulesCondensed = rulesParts.length > 0 ? rulesParts.join('\n\n') : rules
    }

    // Component knowledge section
    let componentSection = '(no components linked)'
    if (config.components && config.components.length > 0) {
      componentSection = config.components.map(c => `- **${c.name}**: ${c.usage}`).join('\n')
    }

    // Build digest
    const now = new Date().toISOString()
    // B4: Per-feature rules/template already include (or are cloned from) global — no need to list global separately
    const sources = [
      `source/testcase/${name}/config.md`,
      `source/testcase/${name}/spec/*.md`,
      `source/testcase/${name}/rules.md`,
      `source/testcase/${name}/template.json`,
      ...(config.strategy ? [`source/testcase/strategy/${config.strategy}.md`] : []),
      ...(config.linked_knowledge || []).map(k => `source/feature-knowledge/${this.getKnowledgeItemName(k)}/config.md`),
    ]

    const digest = `---
digest-version: 2
generated: ${now}
feature: ${name}
sources:
${sources.map(s => `  - ${s}`).join('\n')}
---

## Config
strategy: ${config.strategy || '(none)'}
structure: ${config.structure && config.structure.length > 0 ? 'defined (see below)' : 'empty'}
components: ${(config.components || []).map(c => c.name).join(', ') || '(none)'}
linked_knowledge: ${(config.linked_knowledge || []).map(k => {
  const name = this.getKnowledgeItemName(k)
  const sections = this.getKnowledgeSections(k)
  return sections.length > 0 ? `${name} (${sections.length} sections)` : name
}).join(', ') || '(none)'}

<!-- [REQUIREMENTS — Generate testcases from this] -->

## Spec Summary
${specSummary}

## Test Scope

### TESTABLE (generate testcases for these)
${testScopeTestable}

### OUT OF SCOPE (in knowledge but NOT in spec — do NOT test)
${testScopeOutOfScope}

### Scope Hints
**Happy Case:** ${happyCase}
**Corner Case:** ${cornerCase}

## Structure
${structureText}

**RULE:** Structure defined → MUST follow tree, replace Module with Level 1..N, test ONLY leaf nodes. Empty → freestyle.

## Strategy Guide
${strategyName ? `strategy: ${strategyName}\n${strategySummary}\n(Full strategy: source/testcase/strategy/${strategyName}.md)` : 'No strategy selected — use default balanced approach.'}

<!-- [FORMAT — How to write testcases] -->

## Template Columns
${templateSection || '(no writing styles defined)'}
Full column order: ${fullColumnOrder}

## Merged Column Order
${mergedOrder}

## Rules Summary
${rulesCondensed}

<!-- [REFERENCE — Terminology only, do NOT generate testcases from this] -->

## Terminology & Context
${terminologySection}

## Component Knowledge
${componentSection}
`

    const digestPath = path.join(SOURCE_DIR, name, 'context-digest.md')
    await fs.writeFile(digestPath, digest)

    return digest
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
