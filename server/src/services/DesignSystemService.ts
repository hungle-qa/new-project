import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'

const SOURCE_DIR = path.join(__dirname, '../../../source/design-system')
const ICONS_DIR = path.join(SOURCE_DIR, 'icons')

// ============== IN-MEMORY CACHE ==============
// Simple cache with TTL to prevent repeated disk I/O

interface CacheEntry<T> {
  data: T | null
  timestamp: number
}

const cache: {
  rules: CacheEntry<IDesignRulesData>
  icons: CacheEntry<IIcon[]>
  components: CacheEntry<string[]>
} = {
  rules: { data: null, timestamp: 0 },
  icons: { data: null, timestamp: 0 },
  components: { data: null, timestamp: 0 }
}

const CACHE_TTL = 30000 // 30 seconds - longer TTL for better performance

function getCached<T>(key: keyof typeof cache): T | null {
  const entry = cache[key] as CacheEntry<T>
  if (entry.data && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data
  }
  return null
}

function setCache<T>(key: keyof typeof cache, data: T): void {
  (cache[key] as CacheEntry<T>) = { data, timestamp: Date.now() }
}

function invalidateCache(key?: keyof typeof cache): void {
  if (key) {
    cache[key] = { data: null, timestamp: 0 }
  } else {
    cache.rules = { data: null, timestamp: 0 }
    cache.icons = { data: null, timestamp: 0 }
    cache.components = { data: null, timestamp: 0 }
  }
}

// ============== COMPONENT-LEVEL CACHE ==============
// Dedicated cache for individual component reads (getByName)

const componentCache: Map<string, { data: IDesignComponent; timestamp: number }> = new Map()

function getCachedComponent(name: string): IDesignComponent | null {
  const entry = componentCache.get(name)
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data
  }
  return null
}

function setCachedComponent(name: string, data: IDesignComponent): void {
  componentCache.set(name, { data, timestamp: Date.now() })
}

function invalidateComponentCache(name?: string): void {
  if (name) {
    componentCache.delete(name)
  } else {
    componentCache.clear()
  }
}

export interface IDesignComponent {
  name: string
  category: string
  created: string
  updated: string
  status: string
  content: string
}

export interface CreateComponentData {
  name: string
  category: string
  description: string
  html: string
  css: string
  tailwindHtml?: string
}

export interface IIcon {
  name: string
  svg: string
  category?: string
  tags?: string[]
  created: string
}

export interface IDesignRule {
  id: string
  token: string
  value: string
  usage: string
  type: 'color' | 'text' | 'opacity' | 'gradient' | 'css'
  isCore?: boolean
}

export interface IDesignRulesData {
  fontFamily: string
  rules: IDesignRule[]
}

export class DesignSystemService {
  static async getAll(): Promise<string[]> {
    // Check cache first
    const cached = getCached<string[]>('components')
    if (cached) return cached

    try {
      const files = await fs.readdir(SOURCE_DIR)
      const mdFiles = files.filter(f => f.endsWith('.md'))

      // Read frontmatter from each file to get updated date (or created as fallback)
      const componentsWithDates = await Promise.all(
        mdFiles.map(async (file) => {
          const name = file.replace('.md', '')
          try {
            const filePath = path.join(SOURCE_DIR, file)
            const content = await fs.readFile(filePath, 'utf-8')
            const { data } = matter(content)
            // Use updated date for sorting, fall back to created if updated doesn't exist
            const sortDate = data.updated || data.created
            return {
              name,
              updated: sortDate ? new Date(sortDate).getTime() : 0
            }
          } catch {
            return { name, updated: 0 }
          }
        })
      )

      // Sort by updated date descending (newest updates first)
      componentsWithDates.sort((a, b) => b.updated - a.updated)

      // Extract just the names
      const result = componentsWithDates.map(c => c.name)

      // Cache the result
      setCache('components', result)

      return result
    } catch {
      return []
    }
  }

  static async getByName(name: string): Promise<IDesignComponent | null> {
    // Check component cache first
    const cached = getCachedComponent(name)
    if (cached) return cached

    try {
      const filePath = path.join(SOURCE_DIR, `${name}.md`)
      const fileContent = await fs.readFile(filePath, 'utf-8')
      const { data, content } = matter(fileContent)
      const result = {
        name,
        category: data.category || 'uncategorized',
        created: data.created || '',
        updated: data.updated || data.created || '',
        status: data.status || 'draft',
        content
      }

      // Cache the result
      setCachedComponent(name, result)

      return result
    } catch {
      return null
    }
  }

  // Helper to get current timestamp in GMT+7 format
  private static getGMT7Timestamp(): string {
    const now = new Date()
    // Adjust to GMT+7
    const gmt7Offset = 7 * 60 * 60 * 1000
    const gmt7Time = new Date(now.getTime() + gmt7Offset)
    const isoString = gmt7Time.toISOString().replace('Z', '')
    return `${isoString.split('.')[0]}+07:00`
  }

  static async create(data: CreateComponentData | Partial<IDesignComponent>): Promise<{ name: string; path: string }> {
    const name = data.name || 'untitled'
    const filePath = path.join(SOURCE_DIR, `${name}.md`)
    const timestamp = this.getGMT7Timestamp()

    // Check if this is structured data (from import modal) or legacy format
    if ('html' in data && data.html) {
      // Structured import - generate full markdown
      const output = this.generateMarkdown({
        name,
        category: data.category || 'uncategorized',
        description: data.description || '',
        html: data.html,
        css: data.css || '',
        tailwindHtml: data.tailwindHtml || '',
        created: timestamp,
        updated: timestamp
      })
      await fs.writeFile(filePath, output)
    } else {
      // Legacy format - simple frontmatter + content
      const frontmatter = [
        '---',
        `name: ${name}`,
        `category: ${(data as Partial<IDesignComponent>).category || 'uncategorized'}`,
        `created: ${timestamp}`,
        `updated: ${timestamp}`,
        `status: draft`,
        '---'
      ].join('\n')

      const output = `${frontmatter}\n\n${(data as Partial<IDesignComponent>).content || ''}`
      await fs.writeFile(filePath, output)
    }

    // Invalidate caches
    invalidateCache('components')
    invalidateComponentCache()

    return { name, path: filePath }
  }

  private static generateMarkdown(data: {
    name: string
    category: string
    description: string
    html: string
    css: string
    tailwindHtml: string
    created: string
    updated: string
  }): string {
    const { name, category, description, html, css, tailwindHtml, created, updated } = data

    // Extract the main class name from HTML for the variants table
    const classMatch = html.match(/class=["']([^"'\s]+)/)
    const mainClass = classMatch ? classMatch[1] : name.toLowerCase()

    const sections: string[] = []

    // Frontmatter
    sections.push(`---
name: ${name}
category: ${category}
created: ${created}
updated: ${updated}
status: draft
---`)

    // Title
    sections.push(`# ${name}`)

    // Preview section
    sections.push(`## Preview
${description || `A ${category} component.`}`)

    // Usage section
    sections.push(`## Usage
Use this component for ${category} interactions.`)

    // HTML section
    sections.push(`## HTML
\`\`\`html
${html}
\`\`\``)

    // CSS section (if provided)
    if (css.trim()) {
      sections.push(`## CSS
\`\`\`css
${css}
\`\`\``)
    }

    // Tailwind CSS section (if provided)
    if (tailwindHtml.trim()) {
      sections.push(`## Tailwind CSS
\`\`\`html
${tailwindHtml}
\`\`\``)
    }

    // Props/Variants table
    sections.push(`## Props/Variants
| Variant | Class | Description |
|---------|-------|-------------|
| default | \`.${mainClass}\` | Default style |`)

    // Accessibility section
    sections.push(`## Accessibility
- Ensure proper aria-labels
- Include focus states
- Test with keyboard navigation`)

    // Notes section
    sections.push(`## Notes
- Imported via web UI on ${created}`)

    return sections.join('\n\n')
  }

  static async update(name: string, data: CreateComponentData): Promise<{ name: string; path: string }> {
    const filePath = path.join(SOURCE_DIR, `${name}.md`)

    // Check if file exists
    try {
      await fs.access(filePath)
    } catch {
      throw new Error('Component not found')
    }

    // Get the original created date (preserve it)
    const existing = await this.getByName(name)
    const createdDate = existing?.created || this.getGMT7Timestamp()
    // Set updated to current timestamp
    const updatedDate = this.getGMT7Timestamp()

    // If name changed, we need to rename the file
    const newName = data.name || name
    const newFilePath = path.join(SOURCE_DIR, `${newName}.md`)

    // Generate updated markdown
    const output = this.generateMarkdown({
      name: newName,
      category: data.category || 'uncategorized',
      description: data.description || '',
      html: data.html,
      css: data.css || '',
      tailwindHtml: data.tailwindHtml || '',
      created: createdDate,
      updated: updatedDate
    })

    // If name changed, delete old file
    if (name !== newName) {
      await fs.unlink(filePath)
    }

    await fs.writeFile(newFilePath, output)

    // Invalidate caches
    invalidateCache('components')
    invalidateComponentCache(name)
    if (name !== newName) {
      invalidateComponentCache(newName)
    }

    return { name: newName, path: newFilePath }
  }

  static async delete(name: string): Promise<boolean> {
    try {
      const filePath = path.join(SOURCE_DIR, `${name}.md`)
      await fs.unlink(filePath)

      // Invalidate caches
      invalidateCache('components')
      invalidateComponentCache(name)

      return true
    } catch {
      return false
    }
  }

  static async updateStatus(name: string, status: string): Promise<{ success: boolean }> {
    const filePath = path.join(SOURCE_DIR, `${name}.md`)

    try {
      const content = await fs.readFile(filePath, 'utf-8')
      const { data, content: body } = matter(content)

      data.status = status

      const updated = matter.stringify(body, data)
      await fs.writeFile(filePath, updated)

      // Invalidate component cache (status changed)
      invalidateComponentCache(name)

      return { success: true }
    } catch {
      throw new Error('Component not found')
    }
  }

  // ============== ICON MANAGEMENT ==============

  static async getAllIcons(): Promise<IIcon[]> {
    // Check cache first
    const cached = getCached<IIcon[]>('icons')
    if (cached) return cached

    try {
      // Ensure icons directory exists
      await fs.mkdir(ICONS_DIR, { recursive: true })

      const files = await fs.readdir(ICONS_DIR)
      const svgFiles = files.filter(f => f.endsWith('.svg'))

      // FIX: Parallel loading instead of sequential (N+1 problem)
      const iconPromises = svgFiles.map(file => {
        const name = file.replace('.svg', '')
        return this.getIconByName(name)
      })
      const results = await Promise.all(iconPromises)
      const icons = results.filter((icon): icon is IIcon => icon !== null)

      // Cache the result
      setCache('icons', icons)

      return icons
    } catch {
      return []
    }
  }

  static async getIconByName(name: string): Promise<IIcon | null> {
    try {
      const svgPath = path.join(ICONS_DIR, `${name}.svg`)
      const metaPath = path.join(ICONS_DIR, `${name}.json`)

      const svg = await fs.readFile(svgPath, 'utf-8')

      // Try to read metadata if exists
      let metadata: { category?: string; tags?: string[]; created?: string } = {}
      try {
        const metaContent = await fs.readFile(metaPath, 'utf-8')
        metadata = JSON.parse(metaContent)
      } catch {
        // No metadata file, use defaults
      }

      // Get file stats for created date if not in metadata
      const stats = await fs.stat(svgPath)

      return {
        name,
        svg,
        category: metadata.category || 'general',
        tags: metadata.tags || [],
        created: metadata.created || stats.birthtime.toISOString()
      }
    } catch {
      return null
    }
  }

  static async createIcon(data: { name: string; svg: string; category?: string; tags?: string[] }): Promise<{ name: string; path: string }> {
    // Ensure icons directory exists
    await fs.mkdir(ICONS_DIR, { recursive: true })

    const name = data.name.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase()
    const svgPath = path.join(ICONS_DIR, `${name}.svg`)
    const metaPath = path.join(ICONS_DIR, `${name}.json`)

    // Check if already exists
    try {
      await fs.access(svgPath)
      throw new Error('Icon with this name already exists')
    } catch (e) {
      if ((e as Error).message === 'Icon with this name already exists') throw e
      // File doesn't exist, continue
    }

    // Validate SVG content
    if (!data.svg.includes('<svg') || !data.svg.includes('</svg>')) {
      throw new Error('Invalid SVG content')
    }

    // Write SVG file
    await fs.writeFile(svgPath, data.svg)

    // Write metadata
    const metadata = {
      category: data.category || 'general',
      tags: data.tags || [],
      created: new Date().toISOString()
    }
    await fs.writeFile(metaPath, JSON.stringify(metadata, null, 2))

    // Invalidate icons cache
    invalidateCache('icons')

    return { name, path: svgPath }
  }

  static async updateIcon(name: string, data: { svg?: string; category?: string; tags?: string[] }): Promise<{ name: string; path: string }> {
    const svgPath = path.join(ICONS_DIR, `${name}.svg`)
    const metaPath = path.join(ICONS_DIR, `${name}.json`)

    // Check if exists
    try {
      await fs.access(svgPath)
    } catch {
      throw new Error('Icon not found')
    }

    // Update SVG if provided
    if (data.svg) {
      if (!data.svg.includes('<svg') || !data.svg.includes('</svg>')) {
        throw new Error('Invalid SVG content')
      }
      await fs.writeFile(svgPath, data.svg)
    }

    // Update metadata
    let metadata: { category?: string; tags?: string[]; created?: string } = {}
    try {
      const metaContent = await fs.readFile(metaPath, 'utf-8')
      metadata = JSON.parse(metaContent)
    } catch {
      metadata = { created: new Date().toISOString() }
    }

    if (data.category !== undefined) metadata.category = data.category
    if (data.tags !== undefined) metadata.tags = data.tags

    await fs.writeFile(metaPath, JSON.stringify(metadata, null, 2))

    // Invalidate icons cache
    invalidateCache('icons')

    return { name, path: svgPath }
  }

  static async deleteIcon(name: string): Promise<boolean> {
    try {
      const svgPath = path.join(ICONS_DIR, `${name}.svg`)
      const metaPath = path.join(ICONS_DIR, `${name}.json`)

      await fs.unlink(svgPath)

      // Try to delete metadata (may not exist)
      try {
        await fs.unlink(metaPath)
      } catch {
        // Metadata file doesn't exist, ignore
      }

      // Invalidate icons cache
      invalidateCache('icons')

      return true
    } catch {
      return false
    }
  }

  // ============== RULES MANAGEMENT ==============

  static async getRules(): Promise<IDesignRulesData> {
    // Check cache first
    const cached = getCached<IDesignRulesData>('rules')
    if (cached) return cached

    try {
      const rulePath = path.join(SOURCE_DIR, 'rule', 'RULE.md')
      const content = await fs.readFile(rulePath, 'utf-8')

      // Parse font family from CSS code block
      const fontFamilyMatch = content.match(/font-family:\s*'([^']+)'/)
      const fontFamily = fontFamilyMatch ? fontFamilyMatch[1] : 'Open Sans'

      // Core rules with default values
      const coreRules: IDesignRule[] = [
        { id: 'text-primary', token: '--color-text-primary', value: '#141414', usage: 'Primary text, headings, body text', type: 'color', isCore: true },
        { id: 'text-white', token: '--color-text-white', value: '#FFFFFF', usage: 'Text on dark/colored backgrounds', type: 'color', isCore: true },
        { id: 'bg-white', token: '--color-bg-white', value: '#FFFFFF', usage: 'Component backgrounds, cards, modals', type: 'color', isCore: true },
        { id: 'btn-action', token: '--color-btn-action', value: '#184EFF', usage: 'Primary/action button background', type: 'color', isCore: true },
        { id: 'btn-action-hover', token: '--color-btn-action-hover', value: '#1241CC', usage: 'Primary button hover state', type: 'color', isCore: true },
        { id: 'btn-cancel-hover', token: '--color-btn-cancel-hover', value: '#F5F7F9', usage: 'Cancel button hover state', type: 'color', isCore: true }
      ]

      // Parse core rule values from markdown
      // Regex handles both "| Token | Value | Usage |" and "| Token | Hex Code | Usage |" formats
      coreRules.forEach(rule => {
        const regex = new RegExp(`\`${rule.token.replace(/[-]/g, '[-]')}\`\\s*\\|\\s*\`([^\`]+)\`\\s*\\|\\s*([^|\\n]+)`)
        const match = content.match(regex)
        if (match) {
          rule.value = match[1].trim()
          // Keep original usage if defined, otherwise use parsed
          if (match[2]) {
            rule.usage = match[2].trim()
          }
        }
      })

      // Parse custom rules from Custom Rules section
      const customRules: IDesignRule[] = []
      const customSectionMatch = content.match(/## Custom Rules\n\n\| Token \| Value \| Usage \| Type \|\n\|[^\n]+\|\n([\s\S]*?)(?=\n---|\n##|$)/)
      if (customSectionMatch) {
        const tableRows = customSectionMatch[1].trim().split('\n')
        tableRows.forEach((row, index) => {
          const cols = row.split('|').map(c => c.trim()).filter(Boolean)
          if (cols.length >= 4) {
            const typeValue = cols[3].toLowerCase()
            let ruleType: 'color' | 'text' | 'opacity' | 'gradient' | 'css' = 'text'

            if (typeValue === 'color') ruleType = 'color'
            else if (typeValue === 'text') ruleType = 'text'
            else if (typeValue === 'opacity') ruleType = 'opacity'
            else if (typeValue === 'gradient') ruleType = 'gradient'
            else if (typeValue === 'css') ruleType = 'css'

            // FIX: Stable ID based on token instead of Date.now() to prevent re-renders
            const tokenId = cols[0].replace(/`/g, '').replace(/[^a-zA-Z0-9-]/g, '_')
            customRules.push({
              id: `custom_${tokenId}`,
              token: cols[0].replace(/`/g, ''),
              value: cols[1].replace(/`/g, ''),
              usage: cols[2],
              type: ruleType,
              isCore: false
            })
          }
        })
      }

      const result = {
        fontFamily,
        rules: [...coreRules, ...customRules]
      }

      // Cache the result
      setCache('rules', result)

      return result
    } catch (error) {
      throw new Error('Failed to parse RULE.md')
    }
  }

  static async updateRules(rulesData: IDesignRulesData): Promise<{ success: boolean }> {
    try {
      const rulePath = path.join(SOURCE_DIR, 'rule', 'RULE.md')

      // Helper to get rule value by token
      const getRule = (token: string) => rulesData.rules.find(r => r.token === token)

      const textPrimary = getRule('--color-text-primary')?.value || '#141414'
      const textWhite = getRule('--color-text-white')?.value || '#FFFFFF'
      const bgWhite = getRule('--color-bg-white')?.value || '#FFFFFF'
      const btnAction = getRule('--color-btn-action')?.value || '#184EFF'
      const btnActionHover = getRule('--color-btn-action-hover')?.value || '#1241CC'
      const btnCancelHover = getRule('--color-btn-cancel-hover')?.value || '#F5F7F9'
      const fontFamily = rulesData.fontFamily || 'Open Sans'

      // Get custom rules (non-core)
      const customRules = rulesData.rules.filter(r => !r.isCore)

      // Generate custom rules table section
      let customRulesSection = ''
      if (customRules.length > 0) {
        customRulesSection = `

---

## Custom Rules

| Token | Value | Usage | Type |
|-------|-------|-------|------|
${customRules.map(r => `| \`${r.token}\` | \`${r.value}\` | ${r.usage} | ${r.type} |`).join('\n')}
`
      }

      // Generate updated RULE.md content
      const content = `# Design System Rules

This file defines the baseline styling rules for all components in the design system. All imported components MUST follow these rules.

---

## Typography

### Font Family
\`\`\`css
font-family: '${fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
\`\`\`

**Installation (if not available):**
\`\`\`html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@400;500;600;700&display=swap" rel="stylesheet">
\`\`\`

### Font Colors
| Token | Value | Usage |
|-------|-------|-------|
| \`--color-text-primary\` | \`${textPrimary}\` | ${getRule('--color-text-primary')?.usage || 'Primary text, headings, body text'} |
| \`--color-text-white\` | \`${textWhite}\` | ${getRule('--color-text-white')?.usage || 'Text on dark/colored backgrounds'} |

---

## Colors

### Backgrounds
| Token | Value | Usage |
|-------|-------|-------|
| \`--color-bg-white\` | \`${bgWhite}\` | ${getRule('--color-bg-white')?.usage || 'Component backgrounds, cards, modals'} |

### Buttons
| Token | Value | Usage |
|-------|-------|-------|
| \`--color-btn-action\` | \`${btnAction}\` | ${getRule('--color-btn-action')?.usage || 'Primary/action button background'} |
| \`--color-btn-action-hover\` | \`${btnActionHover}\` | ${getRule('--color-btn-action-hover')?.usage || 'Primary button hover state'} |
| \`--color-btn-cancel\` | \`linear-gradient(0deg, #FFFFFF, #FFFFFF), linear-gradient(0deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05))\` | Cancel/secondary button background |
| \`--color-btn-cancel-hover\` | \`${btnCancelHover}\` | ${getRule('--color-btn-cancel-hover')?.usage || 'Cancel button hover state'} |
${customRulesSection}
---

## CSS Variables

Include these variables in your component styles:

\`\`\`css
:root {
  /* Typography */
  --font-family: '${fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --color-text-primary: ${textPrimary};
  --color-text-white: ${textWhite};

  /* Backgrounds */
  --color-bg-white: ${bgWhite};

  /* Buttons */
  --color-btn-action: ${btnAction};
  --color-btn-action-hover: ${btnActionHover};
  --color-btn-cancel-hover: ${btnCancelHover};
${customRules.map(r => `  ${r.token}: ${r.value};`).join('\n')}
}
\`\`\`

---

## Button Styles

### Action Button (Primary)
\`\`\`css
.btn-action {
  background-color: ${btnAction};
  color: ${textWhite};
  border: none;
  font-family: '${fontFamily}', sans-serif;
}

.btn-action:hover {
  background-color: ${btnActionHover};
}
\`\`\`

**Tailwind:**
\`\`\`html
<button class="bg-[${btnAction}] text-white hover:bg-[${btnActionHover}] font-['${fontFamily.replace(/\s+/g, '_')}']">
  Action
</button>
\`\`\`

### Cancel Button (Secondary)
\`\`\`css
.btn-cancel {
  background: linear-gradient(0deg, #FFFFFF, #FFFFFF), linear-gradient(0deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05));
  color: ${textPrimary};
  border: 1px solid #E5E7EB;
  font-family: '${fontFamily}', sans-serif;
}

.btn-cancel:hover {
  background: ${btnCancelHover};
}
\`\`\`

**Tailwind:**
\`\`\`html
<button class="bg-white text-[${textPrimary}] border border-gray-200 hover:bg-[${btnCancelHover}] font-['${fontFamily.replace(/\s+/g, '_')}']">
  Cancel
</button>
\`\`\`

---

## Component Template

When creating new components, use this baseline:

\`\`\`css
.component {
  background-color: ${bgWhite};
  font-family: '${fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: ${textPrimary};
}
\`\`\`

**Tailwind baseline:**
\`\`\`html
<div class="bg-white text-[${textPrimary}] font-['${fontFamily.replace(/\s+/g, '_')}']">
  <!-- Component content -->
</div>
\`\`\`

---

## Quick Reference

| Property | Value |
|----------|-------|
| Background (component) | \`${bgWhite}\` |
| Font | \`${fontFamily}\` |
| Text color (dark) | \`${textPrimary}\` |
| Text color (light) | \`${textWhite}\` |
| Action button bg | \`${btnAction}\` |
| Action button hover | \`${btnActionHover}\` |
| Cancel button bg | \`#FFFFFF\` with subtle gradient |
| Cancel button hover | \`${btnCancelHover}\` |

---

## Rules for Import

When importing components via \`import-design\` or \`import-design-by-image\`:

1. **MUST** use \`${fontFamily}\` font (include Google Fonts link if needed)
2. **MUST** use \`${bgWhite}\` for component backgrounds
3. **MUST** use \`${textPrimary}\` for primary text color
4. **MUST** use \`${btnAction}\` for action/primary buttons
5. **MUST** use the gradient background for cancel/secondary buttons
6. **MUST** use \`${btnCancelHover}\` for cancel button hover state
7. **REPLACE** any blue (#3b82f6, etc.) with \`${btnAction}\` for action buttons
8. **REPLACE** any gray button backgrounds with the cancel button gradient
`

      await fs.writeFile(rulePath, content)

      // Invalidate rules cache
      invalidateCache('rules')

      return { success: true }
    } catch (error) {
      throw new Error('Failed to update RULE.md')
    }
  }
}
