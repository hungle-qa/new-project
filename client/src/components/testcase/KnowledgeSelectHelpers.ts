import { LinkedKnowledgeEntry } from './types'

export interface ParsedHeading {
  heading: string
  title: string
}

export function getItemName(entry: LinkedKnowledgeEntry): string {
  return typeof entry === 'string' ? entry : entry.item
}

export function getItemSections(entry: LinkedKnowledgeEntry): string[] {
  return typeof entry === 'string' ? [] : entry.sections
}

export function normalizeEntries(entries: LinkedKnowledgeEntry[]): string {
  const normalized = entries.map(e => {
    const name = getItemName(e)
    const sections = getItemSections(e)
    return sections.length > 0 ? JSON.stringify({ item: name, sections: [...sections].sort() }) : name
  }).sort()
  return JSON.stringify(normalized)
}
