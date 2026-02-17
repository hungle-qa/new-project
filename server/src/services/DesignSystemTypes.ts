import path from 'path'

export const DS_SOURCE_DIR = path.join(__dirname, '../../../source/design-system')
export const DS_ICONS_DIR = path.join(DS_SOURCE_DIR, 'icons')

// ============== IN-MEMORY CACHE ==============

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

const CACHE_TTL = 30000

export function getCached<T>(key: keyof typeof cache): T | null {
  const entry = cache[key] as CacheEntry<T>
  if (entry.data && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data
  }
  return null
}

export function setCache<T>(key: keyof typeof cache, data: T): void {
  (cache[key] as CacheEntry<T>) = { data, timestamp: Date.now() }
}

export function invalidateCache(key?: keyof typeof cache): void {
  if (key) {
    cache[key] = { data: null, timestamp: 0 }
  } else {
    cache.rules = { data: null, timestamp: 0 }
    cache.icons = { data: null, timestamp: 0 }
    cache.components = { data: null, timestamp: 0 }
  }
}

// ============== COMPONENT-LEVEL CACHE ==============

const componentCache: Map<string, { data: IDesignComponent; timestamp: number }> = new Map()

export function getCachedComponent(name: string): IDesignComponent | null {
  const entry = componentCache.get(name)
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
    return entry.data
  }
  return null
}

export function setCachedComponent(name: string, data: IDesignComponent): void {
  componentCache.set(name, { data, timestamp: Date.now() })
}

export function invalidateComponentCache(name?: string): void {
  if (name) {
    componentCache.delete(name)
  } else {
    componentCache.clear()
  }
}

// ============== INTERFACES ==============

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
