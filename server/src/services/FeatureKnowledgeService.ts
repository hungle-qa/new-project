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

    // If re-importing same file, delete old section first
    const existing = await this.getByName(name)
    if (existing && existing.source_files.includes(filename)) {
      await this.deleteFile(name, filename)
    }

    // Save source file (after deleteFile to avoid it being removed)
    const sourceDir = path.join(SOURCE_DIR, name, 'source')
    await fs.mkdir(sourceDir, { recursive: true })
    await fs.writeFile(path.join(sourceDir, filename), fileBuffer)

    // Re-read after potential deletion
    const today = new Date().toISOString().split('T')[0]
    const current = await this.getByName(name)
    const currentContent = current?.content || ''
    const currentFiles = current?.source_files || []

    const updatedFiles = [...currentFiles, filename]
    const newSection = `\n<!-- source: ${filename} -->\n\n${structured.content}`

    let finalContent: string
    if (currentContent) {
      finalContent = currentContent + '\n\n---\n' + newSection
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

    // Remove file's content section from body by splitting on source markers
    const sections = this.splitContentBySections(existing.content)
    const filteredSections = sections.filter(s => s.sourceFile !== filename)
    const updatedContent = filteredSections
      .map(s => s.sourceFile ? `<!-- source: ${s.sourceFile} -->\n\n${s.body}` : s.body)
      .join('\n\n---\n\n')
      .trim()

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

  private static splitContentBySections(content: string): { sourceFile: string; body: string }[] {
    if (!content.trim()) return []

    const parts = content.split(/\n---\n/)
    const sections: { sourceFile: string; body: string }[] = []

    for (const part of parts) {
      const trimmed = part.trim()
      if (!trimmed) continue

      const sourceMatch = trimmed.match(/^<!-- source: (.+?) -->\s*\n([\s\S]*)$/)
      if (sourceMatch) {
        sections.push({ sourceFile: sourceMatch[1], body: sourceMatch[2].trim() })
      } else {
        sections.push({ sourceFile: '', body: trimmed })
      }
    }

    return sections
  }
}
