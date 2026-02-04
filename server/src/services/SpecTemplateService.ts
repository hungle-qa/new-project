import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'

const SOURCE_DIR = path.join(__dirname, '../../../source/spec-template')

export interface ISpecTemplate {
  name: string
  category: string
  created: string
  status: string
  content: string
}

export class SpecTemplateService {
  static async getAll(): Promise<string[]> {
    try {
      const files = await fs.readdir(SOURCE_DIR)
      return files.filter(f => f.endsWith('.md')).map(f => f.replace('.md', ''))
    } catch {
      return []
    }
  }

  static async getByName(name: string): Promise<ISpecTemplate | null> {
    try {
      const filePath = path.join(SOURCE_DIR, `${name}.md`)
      const fileContent = await fs.readFile(filePath, 'utf-8')
      const { data, content } = matter(fileContent)
      return {
        name,
        category: data.category || 'uncategorized',
        created: data.created || '',
        status: data.status || 'draft',
        content
      }
    } catch {
      return null
    }
  }

  static async create(data: Partial<ISpecTemplate>): Promise<{ name: string; path: string }> {
    const name = data.name || 'untitled'
    const filePath = path.join(SOURCE_DIR, `${name}.md`)

    const frontmatter = [
      '---',
      `name: ${name}`,
      `category: ${data.category || 'uncategorized'}`,
      `created: ${new Date().toISOString().split('T')[0]}`,
      `status: draft`,
      '---'
    ].join('\n')

    const output = `${frontmatter}\n\n${data.content || ''}`
    await fs.writeFile(filePath, output)

    return { name, path: filePath }
  }

  static async delete(name: string): Promise<boolean> {
    try {
      const filePath = path.join(SOURCE_DIR, `${name}.md`)
      await fs.unlink(filePath)
      return true
    } catch {
      return false
    }
  }
}
