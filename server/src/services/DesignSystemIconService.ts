import fs from 'fs/promises'
import path from 'path'
import {
  DS_ICONS_DIR,
  IIcon,
  getCached,
  setCache,
  invalidateCache,
} from './DesignSystemTypes'

export class DesignSystemIconService {
  static async getAllIcons(): Promise<IIcon[]> {
    const cached = getCached<IIcon[]>('icons')
    if (cached) return cached

    try {
      await fs.mkdir(DS_ICONS_DIR, { recursive: true })

      const files = await fs.readdir(DS_ICONS_DIR)
      const svgFiles = files.filter(f => f.endsWith('.svg'))

      const iconPromises = svgFiles.map(file => {
        const name = file.replace('.svg', '')
        return this.getIconByName(name)
      })
      const results = await Promise.all(iconPromises)
      const icons = results.filter((icon): icon is IIcon => icon !== null)

      setCache('icons', icons)
      return icons
    } catch {
      return []
    }
  }

  static async getIconByName(name: string): Promise<IIcon | null> {
    try {
      const svgPath = path.join(DS_ICONS_DIR, `${name}.svg`)
      const metaPath = path.join(DS_ICONS_DIR, `${name}.json`)

      const svg = await fs.readFile(svgPath, 'utf-8')

      let metadata: { category?: string; tags?: string[]; created?: string } = {}
      try {
        const metaContent = await fs.readFile(metaPath, 'utf-8')
        metadata = JSON.parse(metaContent)
      } catch {
        // No metadata file, use defaults
      }

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
    await fs.mkdir(DS_ICONS_DIR, { recursive: true })

    const name = data.name.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase()
    const svgPath = path.join(DS_ICONS_DIR, `${name}.svg`)
    const metaPath = path.join(DS_ICONS_DIR, `${name}.json`)

    try {
      await fs.access(svgPath)
      throw new Error('Icon with this name already exists')
    } catch (e) {
      if ((e as Error).message === 'Icon with this name already exists') throw e
    }

    if (!data.svg.includes('<svg') || !data.svg.includes('</svg>')) {
      throw new Error('Invalid SVG content')
    }

    await fs.writeFile(svgPath, data.svg)

    const metadata = {
      category: data.category || 'general',
      tags: data.tags || [],
      created: new Date().toISOString()
    }
    await fs.writeFile(metaPath, JSON.stringify(metadata, null, 2))

    invalidateCache('icons')

    return { name, path: svgPath }
  }

  static async updateIcon(name: string, data: { svg?: string; category?: string; tags?: string[] }): Promise<{ name: string; path: string }> {
    const svgPath = path.join(DS_ICONS_DIR, `${name}.svg`)
    const metaPath = path.join(DS_ICONS_DIR, `${name}.json`)

    try {
      await fs.access(svgPath)
    } catch {
      throw new Error('Icon not found')
    }

    if (data.svg) {
      if (!data.svg.includes('<svg') || !data.svg.includes('</svg>')) {
        throw new Error('Invalid SVG content')
      }
      await fs.writeFile(svgPath, data.svg)
    }

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

    invalidateCache('icons')

    return { name, path: svgPath }
  }

  static async deleteIcon(name: string): Promise<boolean> {
    try {
      const svgPath = path.join(DS_ICONS_DIR, `${name}.svg`)
      const metaPath = path.join(DS_ICONS_DIR, `${name}.json`)

      await fs.unlink(svgPath)

      try {
        await fs.unlink(metaPath)
      } catch {
        // Metadata file doesn't exist, ignore
      }

      invalidateCache('icons')

      return true
    } catch {
      return false
    }
  }
}
