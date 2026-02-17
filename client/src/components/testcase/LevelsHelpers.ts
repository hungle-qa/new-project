import { StructureNode } from './LevelsTab'

let nodeCounter = 0
export function genId() {
  return `n_${Date.now()}_${++nodeCounter}`
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

export interface FlatRow {
  levels: string[]
}

export function flattenTree(nodes: StructureNode[], maxDepth: number): FlatRow[] {
  const rows: FlatRow[] = []

  function walk(children: StructureNode[], depth: number, parentLevels: string[]) {
    for (let i = 0; i < children.length; i++) {
      const node = children[i]
      const levels = [...parentLevels]
      levels[depth] = node.name
      while (levels.length < maxDepth) levels.push('')

      if (node.children.length === 0) {
        rows.push({ levels })
      } else {
        walk(node.children, depth + 1, levels)
      }

      if (i < children.length - 1) {
        parentLevels = parentLevels.map(() => '')
      }
    }
  }

  walk(nodes, 0, [])
  return rows
}
