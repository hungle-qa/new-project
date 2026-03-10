import { StructureNode, getMaxDepth, getKnowledgeItemName } from './TestcaseTypes'

export function renderTree(nodes: StructureNode[], indent = ''): string {
  return nodes.map(n => {
    const line = `${indent}- ${n.name}`
    const children = n.children.length > 0 ? '\n' + renderTree(n.children, indent + '  ') : ''
    return line + children
  }).join('\n')
}

/**
 * Strip lossless decorative elements from spec/rules to reduce token count
 * while preserving all testable behaviors and constraints
 */
export function stripDecorativeElements(content: string): string {
  let result = content

  // Strip HTML tags (e.g. <br> from spec imports)
  // IMPORTANT: Only match tags starting with a letter or slash — NOT comparison operators like <=, >=
  result = result.replace(/<br\s*\/?>/gi, ' / ')
  result = result.replace(/<\/?[a-zA-Z][a-zA-Z0-9]*(?:\s[^>]*)?>/g, '')

  // Strip changelog date annotations — not needed for generation logic
  result = result.replace(/\s*\(Updated on \w+ \d+,?\s*\d{4}\)/g, '')

  // Strip purely decorative state descriptions
  result = result.replace(/\s*\(Have hover state\)/g, '')
  result = result.replace(/\s*\(have hover state\)/g, '')
  result = result.replace(/\s*\(have past date and current date state\)/g, '')
  result = result.replace(/\s*\(have hover, selected state\)/g, '')

  // Add a global rule to Constraints so inline decorations can be removed
  // This is handled in condenseRules() which adds it once, so AI doesn't need 15+ repetitions

  // Collapse excessive blank lines
  result = result.replace(/\n{3,}/g, '\n\n')

  return result
}

export function condenseSpec(spec: string): string {
  return stripDecorativeElements(spec)
}

export function buildTestScope(
  spec: string | null,
  knowledgeSections: string[],
  config: { linked_knowledge: Array<string | { item: string; sections: string[] }> }
): { testable: string; outOfScope: string } {
  let testable = '(no spec imported — import spec first)'
  let outOfScope = '(none)'

  const knowledgeTopicNames: string[] = []
  for (const section of knowledgeSections) {
    const headingMatches = section.match(/^###?\s+(.+)$/gm)
    if (headingMatches) {
      for (const h of headingMatches) {
        const topicName = h.replace(/^###?\s+/, '').trim()
        if (!topicName || topicName.length < 3) continue
        if (topicName.startsWith('|') || topicName.includes('http')) continue
        if ((config.linked_knowledge || []).some(k => topicName.toLowerCase() === getKnowledgeItemName(k).toLowerCase())) continue
        knowledgeTopicNames.push(topicName)
      }
    }
    const boldTopics = section.match(/^\*\*([^*]{3,50})\*\*(?::|[\s])/gm)
    if (boldTopics) {
      for (const bt of boldTopics) {
        const term = bt.replace(/^\*\*/, '').replace(/\*\*[:\s].*$/, '').trim()
        if (term && term.length >= 3 && !knowledgeTopicNames.includes(term)) {
          knowledgeTopicNames.push(term)
        }
      }
    }
  }

  if (spec) {
    const usPattern = /(?:^##\s+(US\d+.*)$)|(?:^\*\*(US\d+\s*-\s*.*?)\*\*)/gm
    const testableLines: string[] = []
    const specText = spec.toLowerCase()

    let usExec: RegExpExecArray | null
    const usBlocks: { title: string; pos: number }[] = []
    while ((usExec = usPattern.exec(spec)) !== null) {
      const title = (usExec[1] || usExec[2]).trim()
      usBlocks.push({ title, pos: usExec.index })
    }

    for (let i = 0; i < usBlocks.length; i++) {
      const us = usBlocks[i]
      const nextPos = i + 1 < usBlocks.length ? usBlocks[i + 1].pos : spec.length
      const usBlock = spec.slice(us.pos, nextPos)
      testableLines.push(`- ${us.title}`)

      const acRows = usBlock.match(/^\|\s*(AC\d+)\s*\|\s*([^|]+)/gm)
      if (acRows) {
        for (const row of acRows) {
          const acMatch = row.match(/^\|\s*(AC\d+)\s*\|\s*(.+?)(?:\s*\||$)/)
          if (acMatch) {
            testableLines.push(`  - ${acMatch[1]}: ${acMatch[2].trim()}`)
          }
        }
      }

      const acHeadings = usBlock.match(/^###\s+(AC\d+.*)$/gm)
      if (acHeadings && !acRows) {
        for (const ac of acHeadings) {
          testableLines.push(`  - ${ac.replace(/^###\s+/, '').trim()}`)
        }
      }
    }

    testable = testableLines.length > 0
      ? testableLines.join('\n')
      : '(spec found but no user stories detected)'

    const outOfScopeItems = knowledgeTopicNames.filter(topic => {
      return !specText.includes(topic.toLowerCase())
    })
    const uniqueOutOfScope = [...new Set(outOfScopeItems)]
    outOfScope = uniqueOutOfScope.length > 0
      ? uniqueOutOfScope.map(t => `- ${t}`).join('\n')
      : '(all knowledge topics are in scope)'
  }

  return { testable, outOfScope }
}

export function extractTerminology(knowledgeSections: string[]): string {
  if (knowledgeSections.length === 0) return '(no linked knowledge)'

  // Return full knowledge content, only dedup identical sections
  const seen = new Set<string>()
  const unique: string[] = []
  for (const section of knowledgeSections) {
    const key = section.trim()
    if (!seen.has(key)) {
      seen.add(key)
      unique.push(key)
    }
  }

  return unique.join('\n\n')
}

export function condenseRules(rules: string): string {
  if (!rules) return '(no rules)'

  let result = stripDecorativeElements(rules)

  // Remove ## Column Format section from Rules Summary if present
  // (Template Columns section already in digest provides this exact content)
  const cfStart = result.indexOf('\n## Column Format\n')
  if (cfStart !== -1) {
    const nextSection = result.indexOf('\n## ', cfStart + 1)
    if (nextSection !== -1) {
      result = result.slice(0, cfStart) + result.slice(nextSection)
    } else {
      result = result.slice(0, cfStart)
    }
  }

  return result
}

export function buildTemplateSection(
  template: Array<{ name: string; columnRules: string }>,
  structure: StructureNode[] | undefined
): { templateSection: string; fullColumnOrder: string; mergedOrder: string } {
  const colsWithRules = template.filter(c => c.columnRules)
  const templateSection = colsWithRules.map(c => {
    return `### ${c.name}\n${c.columnRules}`
  }).join('\n\n')
  const fullColumnOrder = template.map(c => c.name).join(', ')

  const maxDepth = getMaxDepth(structure || [])
  let mergedOrder = fullColumnOrder
  if (structure && structure.length > 0 && maxDepth > 0) {
    const levelCols = Array.from({ length: maxDepth }, (_, i) => `Level ${i + 1}`)
    mergedOrder = template.map(c => {
      if (c.name.toLowerCase().includes('module')) return levelCols.join(', ')
      return c.name
    }).join(', ')
  }

  return { templateSection, fullColumnOrder, mergedOrder }
}
