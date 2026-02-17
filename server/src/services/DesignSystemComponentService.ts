import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import {
  DS_SOURCE_DIR,
  IDesignComponent,
  CreateComponentData,
  getCached,
  setCache,
  invalidateCache,
  getCachedComponent,
  setCachedComponent,
  invalidateComponentCache,
} from './DesignSystemTypes'

export class DesignSystemComponentService {
  static async getAll(): Promise<string[]> {
    const cached = getCached<string[]>('components')
    if (cached) return cached

    try {
      const files = await fs.readdir(DS_SOURCE_DIR)
      const mdFiles = files.filter(f => f.endsWith('.md'))

      const componentsWithDates = await Promise.all(
        mdFiles.map(async (file) => {
          const name = file.replace('.md', '')
          try {
            const filePath = path.join(DS_SOURCE_DIR, file)
            const content = await fs.readFile(filePath, 'utf-8')
            const { data } = matter(content)
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

      componentsWithDates.sort((a, b) => b.updated - a.updated)
      const result = componentsWithDates.map(c => c.name)
      setCache('components', result)
      return result
    } catch {
      return []
    }
  }

  static async getByName(name: string): Promise<IDesignComponent | null> {
    const cached = getCachedComponent(name)
    if (cached) return cached

    try {
      const filePath = path.join(DS_SOURCE_DIR, `${name}.md`)
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

      setCachedComponent(name, result)
      return result
    } catch {
      return null
    }
  }

  // Helper to get current timestamp in GMT+7 format
  private static getGMT7Timestamp(): string {
    const now = new Date()
    const gmt7Offset = 7 * 60 * 60 * 1000
    const gmt7Time = new Date(now.getTime() + gmt7Offset)
    const isoString = gmt7Time.toISOString().replace('Z', '')
    return `${isoString.split('.')[0]}+07:00`
  }

  static async create(data: CreateComponentData | Partial<IDesignComponent>): Promise<{ name: string; path: string }> {
    const name = data.name || 'untitled'
    const filePath = path.join(DS_SOURCE_DIR, `${name}.md`)
    const timestamp = this.getGMT7Timestamp()

    if ('html' in data && data.html) {
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

    const classMatch = html.match(/class=["']([^"'\s]+)/)
    const mainClass = classMatch ? classMatch[1] : name.toLowerCase()

    const sections: string[] = []

    sections.push(`---
name: ${name}
category: ${category}
created: ${created}
updated: ${updated}
status: draft
---`)

    sections.push(`# ${name}`)

    sections.push(`## Preview
${description || `A ${category} component.`}`)

    sections.push(`## Usage
Use this component for ${category} interactions.`)

    sections.push(`## HTML
\`\`\`html
${html}
\`\`\``)

    if (css.trim()) {
      sections.push(`## CSS
\`\`\`css
${css}
\`\`\``)
    }

    if (tailwindHtml.trim()) {
      sections.push(`## Tailwind CSS
\`\`\`html
${tailwindHtml}
\`\`\``)
    }

    sections.push(`## Props/Variants
| Variant | Class | Description |
|---------|-------|-------------|
| default | \`.${mainClass}\` | Default style |`)

    sections.push(`## Accessibility
- Ensure proper aria-labels
- Include focus states
- Test with keyboard navigation`)

    sections.push(`## Notes
- Imported via web UI on ${created}`)

    return sections.join('\n\n')
  }

  static async update(name: string, data: CreateComponentData): Promise<{ name: string; path: string }> {
    const filePath = path.join(DS_SOURCE_DIR, `${name}.md`)

    try {
      await fs.access(filePath)
    } catch {
      throw new Error('Component not found')
    }

    const existing = await this.getByName(name)
    const createdDate = existing?.created || this.getGMT7Timestamp()
    const updatedDate = this.getGMT7Timestamp()

    const newName = data.name || name
    const newFilePath = path.join(DS_SOURCE_DIR, `${newName}.md`)

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

    if (name !== newName) {
      await fs.unlink(filePath)
    }

    await fs.writeFile(newFilePath, output)

    invalidateCache('components')
    invalidateComponentCache(name)
    if (name !== newName) {
      invalidateComponentCache(newName)
    }

    return { name: newName, path: newFilePath }
  }

  static async delete(name: string): Promise<boolean> {
    try {
      const filePath = path.join(DS_SOURCE_DIR, `${name}.md`)
      await fs.unlink(filePath)

      invalidateCache('components')
      invalidateComponentCache(name)

      return true
    } catch {
      return false
    }
  }

  static async updateStatus(name: string, status: string): Promise<{ success: boolean }> {
    const filePath = path.join(DS_SOURCE_DIR, `${name}.md`)

    try {
      const content = await fs.readFile(filePath, 'utf-8')
      const { data, content: body } = matter(content)

      data.status = status

      const updated = matter.stringify(body, data)
      await fs.writeFile(filePath, updated)

      invalidateComponentCache(name)

      return { success: true }
    } catch {
      throw new Error('Component not found')
    }
  }
}
