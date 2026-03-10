import path from 'path'

export const BASE_SOURCE_DIR = path.join(__dirname, '../../../source')
export const SOURCE_DIR = path.join(BASE_SOURCE_DIR, 'testcase')
export const FEATURE_DIR = path.join(SOURCE_DIR, 'feature')
export const EXCLUDED_DIRS = ['rule', 'template', 'strategy']
export const CURRENT_DIGEST_VERSION = 3

export interface StructureNode {
  id: string
  name: string
  children: StructureNode[]
}

export interface ComponentMapping {
  name: string
  usage: string
}

export interface TemplateColumn {
  id: string
  name: string
  width: string
  style: string
  columnRules: string
}

export interface FeatureSummary {
  name: string
  created: string
  updated: string
}

export type LinkedKnowledgeEntry = string | { item: string; sections: string[] }

export interface FeatureConfig {
  name: string
  created: string
  updated: string
  strategy: string
  rule: string
  template: string
  structure: StructureNode[]
  linked_knowledge: LinkedKnowledgeEntry[]
  components: ComponentMapping[]
  content: string
}

export function getMaxDepth(nodes: StructureNode[], depth = 1): number {
  let max = nodes.length > 0 ? depth : 0
  for (const node of nodes) {
    if (node.children.length > 0) {
      max = Math.max(max, getMaxDepth(node.children, depth + 1))
    }
  }
  return max
}

export function getKnowledgeItemName(entry: LinkedKnowledgeEntry): string {
  return typeof entry === 'string' ? entry : entry.item
}

export function getKnowledgeSections(entry: LinkedKnowledgeEntry): string[] {
  return typeof entry === 'string' ? [] : entry.sections
}

export interface CornerCaseQuestion {
  id: number
  question: string
  approved: boolean
  note: string
}

export function filterContentBySections(content: string, sections: string[]): string {
  if (sections.length === 0) return content

  const lines = content.split('\n')
  const result: string[] = []
  let currentHeading = ''
  let include = false

  for (const line of lines) {
    const headingMatch = line.match(/^## (.+)$/)
    if (headingMatch) {
      currentHeading = headingMatch[0]
      include = sections.includes(currentHeading)
      if (include) result.push(line)
    } else if (include) {
      result.push(line)
    } else if (!currentHeading) {
      // Content before any ## heading — always include
      result.push(line)
    }
  }

  return result.join('\n')
}
