import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { AIService, AIConfig } from './AIService'

const SOURCE_DIR = path.join(__dirname, '../../../source/product-idea')

export interface IProductIdea {
  name: string
  category: string
  created: string
  status: string
  priority: string
  content: string
}

export class ProductIdeaService {
  static async getAll(): Promise<string[]> {
    try {
      const files = await fs.readdir(SOURCE_DIR)
      return files.filter(f => f.endsWith('.md')).map(f => f.replace('.md', ''))
    } catch {
      return []
    }
  }

  static async getByName(name: string): Promise<IProductIdea | null> {
    try {
      const filePath = path.join(SOURCE_DIR, `${name}.md`)
      const fileContent = await fs.readFile(filePath, 'utf-8')
      const { data, content } = matter(fileContent)
      return {
        name,
        category: data.category || 'uncategorized',
        created: data.created || '',
        status: data.status || 'draft',
        priority: data.priority || 'medium',
        content
      }
    } catch {
      return null
    }
  }

  static async create(data: Partial<IProductIdea>): Promise<{ name: string; path: string }> {
    const name = data.name || 'untitled'
    const filePath = path.join(SOURCE_DIR, `${name}.md`)

    const frontmatter = [
      '---',
      `name: ${name}`,
      `category: ${data.category || 'uncategorized'}`,
      `created: ${new Date().toISOString().split('T')[0]}`,
      `status: draft`,
      `priority: ${data.priority || 'medium'}`,
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

  static async importFromFile(
    fileBuffer: Buffer,
    filename: string,
    mimeType: string,
    aiConfig: AIConfig,
    productName?: string
  ): Promise<{ name: string; path: string }> {
    try {
      let rawContent: string

      // Extract text based on file type
      if (mimeType === 'application/pdf') {
        // Dynamic import for pdf-parse (CommonJS module)
        const pdfParse = await import('pdf-parse')
        const pdfData = await pdfParse.default(fileBuffer)
        rawContent = pdfData.text
      } else if (mimeType === 'text/markdown' || filename.endsWith('.md')) {
        rawContent = fileBuffer.toString('utf-8')
      } else {
        throw new Error('Unsupported file type. Only PDF and Markdown files are supported.')
      }

      // Use AI to structure the content
      const aiResult = await AIService.structureProductIdea(rawContent, aiConfig)

      // Use provided productName if given, otherwise use AI-generated name
      const name = productName?.trim() || aiResult.name
      const content = aiResult.content

      // Create frontmatter
      const frontmatter = [
        '---',
        `name: ${name}`,
        `category: product-idea`,
        `created: ${new Date().toISOString().split('T')[0]}`,
        `status: draft`,
        `priority: medium`,
        '---'
      ].join('\n')

      const output = `${frontmatter}\n\n${content}`
      const filePath = path.join(SOURCE_DIR, `${name}.md`)

      // Write file (overwrite if exists)
      await fs.writeFile(filePath, output)

      return { name, path: filePath }
    } catch (error) {
      console.error('Import error:', error)
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Failed to import product idea'
      )
    }
  }
}
