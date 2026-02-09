import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { AIService, AIConfig } from './AIService'

const SOURCE_DIR = path.join(__dirname, '../../../source/feature-knowledge')

export interface KnowledgeItem {
  name: string
  created: string
  updated: string
  source_files: string[]
  prompt: string
  content: string
}

export class FeatureKnowledgeService {
  static async getAll(): Promise<string[]> {
    try {
      await fs.mkdir(SOURCE_DIR, { recursive: true })
      const entries = await fs.readdir(SOURCE_DIR, { withFileTypes: true })
      return entries.filter(e => e.isDirectory()).map(e => e.name)
    } catch {
      return []
    }
  }

  static async create(name: string): Promise<{ name: string; path: string }> {
    const itemDir = path.join(SOURCE_DIR, name)
    await fs.mkdir(itemDir, { recursive: true })
    await fs.mkdir(path.join(itemDir, 'source'), { recursive: true })

    const today = new Date().toISOString().split('T')[0]
    const frontmatter: Record<string, unknown> = {
      name,
      created: today,
      updated: today,
      source_files: [],
      prompt: '',
    }

    const configContent = matter.stringify('', frontmatter)
    await fs.writeFile(path.join(itemDir, 'config.md'), configContent)

    return { name, path: itemDir }
  }

  static async getByName(name: string): Promise<KnowledgeItem | null> {
    try {
      const configPath = path.join(SOURCE_DIR, name, 'config.md')
      const fileContent = await fs.readFile(configPath, 'utf-8')
      const { data, content } = matter(fileContent)

      // Backward compat: convert old source_file string to array
      let sourceFiles: string[] = []
      if (Array.isArray(data.source_files)) {
        sourceFiles = data.source_files
      } else if (data.source_file) {
        sourceFiles = [data.source_file]
      }

      return {
        name: data.name || name,
        created: data.created || '',
        updated: data.updated || '',
        source_files: sourceFiles,
        prompt: data.prompt || '',
        content: content.trim(),
      }
    } catch {
      return null
    }
  }

  static async delete(name: string): Promise<boolean> {
    try {
      const itemDir = path.join(SOURCE_DIR, name)
      await fs.rm(itemDir, { recursive: true, force: true })
      return true
    } catch {
      return false
    }
  }

  static async importKnowledge(
    name: string,
    fileBuffer: Buffer,
    filename: string,
    mimeType: string,
    customPrompt: string,
    aiConfig: AIConfig
  ): Promise<{ content: string }> {
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

    const structured = await AIService.structureKnowledge(rawContent, customPrompt, aiConfig)

    // Save source file (append, don't clear)
    const sourceDir = path.join(SOURCE_DIR, name, 'source')
    await fs.mkdir(sourceDir, { recursive: true })
    await fs.writeFile(path.join(sourceDir, filename), fileBuffer)

    // Read existing config to append content
    const today = new Date().toISOString().split('T')[0]
    const existing = await this.getByName(name)
    const existingContent = existing?.content || ''
    const existingFiles = existing?.source_files || []

    // Add filename to source_files if not already present
    const updatedFiles = existingFiles.includes(filename)
      ? existingFiles
      : [...existingFiles, filename]

    // Build new section for this file
    const newSection = `\n<!-- source: ${filename} -->\n\n${structured.content}`

    // If re-importing same file, replace its section; otherwise append
    let finalContent: string
    if (existingFiles.includes(filename) && existingContent) {
      // Replace existing section for this file
      const regex = new RegExp(
        `(^|\\n---\\n)\\n<!-- source: ${filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')} -->\\n[\\s\\S]*?(?=\\n---\\n\\n<!-- source:|$)`,
      )
      if (regex.test(existingContent)) {
        finalContent = existingContent.replace(regex, `$1${newSection}`)
      } else {
        finalContent = existingContent + '\n\n---\n' + newSection
      }
    } else if (existingContent) {
      finalContent = existingContent + '\n\n---\n' + newSection
    } else {
      finalContent = newSection
    }

    const frontmatter: Record<string, unknown> = {
      name,
      created: existing?.created || today,
      updated: today,
      source_files: updatedFiles,
      prompt: customPrompt,
    }

    const configContent = matter.stringify('\n' + finalContent.trim() + '\n', frontmatter)
    await fs.writeFile(path.join(SOURCE_DIR, name, 'config.md'), configContent)

    return { content: finalContent.trim() }
  }

  static async updatePrompt(name: string, prompt: string): Promise<boolean> {
    const existing = await this.getByName(name)
    if (!existing) return false

    const today = new Date().toISOString().split('T')[0]
    const frontmatter: Record<string, unknown> = {
      name,
      created: existing.created || today,
      updated: today,
      source_files: existing.source_files,
      prompt,
    }

    const body = existing.content.trim() ? '\n' + existing.content.trim() + '\n' : ''
    const configContent = matter.stringify(body, frontmatter)
    await fs.writeFile(path.join(SOURCE_DIR, name, 'config.md'), configContent)

    return true
  }

  static async updateContent(name: string, content: string): Promise<boolean> {
    const existing = await this.getByName(name)
    if (!existing) return false

    const today = new Date().toISOString().split('T')[0]
    const frontmatter: Record<string, unknown> = {
      name,
      created: existing.created || today,
      updated: today,
      source_files: existing.source_files,
      prompt: existing.prompt,
    }

    const body = content.trim() ? '\n' + content.trim() + '\n' : ''
    const configContent = matter.stringify(body, frontmatter)
    await fs.writeFile(path.join(SOURCE_DIR, name, 'config.md'), configContent)

    return true
  }

  static async deleteFile(name: string, filename: string): Promise<boolean> {
    const existing = await this.getByName(name)
    if (!existing || !existing.source_files.includes(filename)) return false

    // Remove physical file
    const filePath = path.join(SOURCE_DIR, name, 'source', filename)
    try {
      await fs.unlink(filePath)
    } catch {
      // File may not exist on disk, continue cleanup
    }

    // Remove from source_files array
    const updatedFiles = existing.source_files.filter(f => f !== filename)

    // Remove file's content section from body
    const escapedName = filename.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const sectionRegex = new RegExp(
      `(\\n---\\n)?\\n<!-- source: ${escapedName} -->\\n[\\s\\S]*?(?=\\n---\\n\\n<!-- source:|$)`,
    )
    let updatedContent = existing.content.replace(sectionRegex, '')
    // Clean leading separator if first section was removed
    updatedContent = updatedContent.replace(/^\n---\n/, '')
    updatedContent = updatedContent.trim()

    const today = new Date().toISOString().split('T')[0]
    const frontmatter: Record<string, unknown> = {
      name,
      created: existing.created || today,
      updated: today,
      source_files: updatedFiles,
      prompt: existing.prompt,
    }

    const body = updatedContent ? '\n' + updatedContent + '\n' : ''
    const configContent = matter.stringify(body, frontmatter)
    await fs.writeFile(path.join(SOURCE_DIR, name, 'config.md'), configContent)

    return true
  }
}
