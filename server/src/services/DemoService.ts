import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'

const SOURCE_DIR = path.join(__dirname, '../../../source/demo')

export interface IDemo {
  name: string
  created: string
  status: string
  productIdea: string
  content: string
  pages: string[]
  components: string[]
}

export class DemoService {
  static async getAll(): Promise<string[]> {
    try {
      const entries = await fs.readdir(SOURCE_DIR, { withFileTypes: true })
      return entries.filter(e => e.isDirectory()).map(e => e.name)
    } catch {
      return []
    }
  }

  static async getByName(name: string): Promise<IDemo | null> {
    try {
      const demoDir = path.join(SOURCE_DIR, name)
      const readmePath = path.join(demoDir, 'README.md')
      const fileContent = await fs.readFile(readmePath, 'utf-8')
      const { data, content } = matter(fileContent)

      // Get pages
      const pagesDir = path.join(demoDir, 'pages')
      let pages: string[] = []
      try {
        const pageFiles = await fs.readdir(pagesDir)
        pages = pageFiles.filter(f => f.endsWith('.html'))
      } catch {
        // pages folder might not exist
      }

      // Get components
      const componentsDir = path.join(demoDir, 'components')
      let components: string[] = []
      try {
        const componentFiles = await fs.readdir(componentsDir)
        components = componentFiles.filter(f => f.endsWith('.html'))
      } catch {
        // components folder might not exist
      }

      return {
        name,
        created: data.created || '',
        status: data.status || 'draft',
        productIdea: data['product-idea'] || '',
        content,
        pages,
        components
      }
    } catch {
      return null
    }
  }

  static async getPage(demoName: string, pageName: string): Promise<string | null> {
    try {
      const pagePath = path.join(SOURCE_DIR, demoName, 'pages', pageName)
      return await fs.readFile(pagePath, 'utf-8')
    } catch {
      return null
    }
  }

  static async delete(name: string): Promise<boolean> {
    try {
      const demoDir = path.join(SOURCE_DIR, name)
      await fs.rm(demoDir, { recursive: true })
      return true
    } catch {
      return false
    }
  }
}
