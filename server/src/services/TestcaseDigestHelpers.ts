import { StructureNode, getMaxDepth, getKnowledgeItemName } from './TestcaseTypes'

export function renderTree(nodes: StructureNode[], indent = ''): string {
  return nodes.map(n => {
    const line = `${indent}- ${n.name}`
    const children = n.children.length > 0 ? '\n' + renderTree(n.children, indent + '  ') : ''
    return line + children
  }).join('\n')
}

export function condenseSpec(spec: string): string {
  const condensedLines: string[] = []
  const usPattern = /(?:^##\s+(US\d+.*)$)|(?:^\*\*(US\d+\s*-\s*.*?)\*\*)/gm
  let usMatch: RegExpExecArray | null
  const usPositions: { title: string; pos: number }[] = []
  while ((usMatch = usPattern.exec(spec)) !== null) {
    const title = (usMatch[1] || usMatch[2]).trim()
    usPositions.push({ title, pos: usMatch.index })
  }

  for (let i = 0; i < usPositions.length; i++) {
    const us = usPositions[i]
    const nextPos = i + 1 < usPositions.length ? usPositions[i + 1].pos : spec.length
    const usBlock = spec.slice(us.pos, nextPos)
    condensedLines.push(`### ${us.title}`)

    const acTableRows = usBlock.match(/^\|\s*AC\d+\s*\|.*$/gm)
    if (acTableRows) {
      for (const row of acTableRows) {
        const cells = row.split('|').map(c => c.trim()).filter(Boolean)
        if (cells.length >= 5) {
          const [acId, desc, given, when, then] = cells
          condensedLines.push(`- **${acId}: ${desc}**`)
          condensedLines.push(`  - Given: ${given}`)
          condensedLines.push(`  - When: ${when}`)
          condensedLines.push(`  - Then: ${then}`)
        }
      }
    }

    const acHeadings = usBlock.match(/^###\s+(AC\d+.*)$/gm)
    if (acHeadings && !acTableRows) {
      for (const ac of acHeadings) {
        condensedLines.push(`- ${ac.replace(/^###\s+/, '').trim()}`)
      }
    }
  }

  return condensedLines.length > 0 ? condensedLines.join('\n') : spec
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

  const fullKnowledge = knowledgeSections.join('\n\n')

  function isCleanLine(line: string): boolean {
    const trimmed = line.trim()
    if (trimmed.length < 5) return false
    if (trimmed.startsWith('|')) return false
    if (/https?:\/\//.test(trimmed)) return false
    if (trimmed.startsWith('---')) return false
    return true
  }

  const glossaryTerms: string[] = []
  const glossaryMatches = fullKnowledge.match(/^\*\*([^*]{2,50})\*\*[:\s]+([^\n|]{5,})/gm)
  if (glossaryMatches) {
    const seen = new Set<string>()
    for (const g of glossaryMatches) {
      if (!isCleanLine(g)) continue
      const termMatch = g.match(/^\*\*(.+?)\*\*/)
      const key = termMatch ? termMatch[1].toLowerCase() : g.toLowerCase()
      if (!seen.has(key)) {
        seen.add(key)
        glossaryTerms.push(g.trim())
      }
    }
  }

  const roles: string[] = []
  const rolePatterns = fullKnowledge.match(/(?:^|\n)\*\*(?:User Roles?|Roles?)\*\*[:\s]+([^\n]+)/gi)
  if (rolePatterns) {
    for (const r of rolePatterns) {
      const clean = r.trim()
      if (isCleanLine(clean)) roles.push(`- ${clean}`)
    }
  }

  const preconditions: string[] = []
  const prePatterns = fullKnowledge.match(/(?:^|\n)\*\*(?:Preconditions?|Plans?)\*\*[:\s]+([^\n]+)/gi)
  if (prePatterns) {
    for (const p of prePatterns) {
      const clean = p.trim()
      if (isCleanLine(clean)) preconditions.push(`- ${clean}`)
    }
  }

  const parts: string[] = []
  if (glossaryTerms.length > 0) parts.push(`**Glossary:**\n${glossaryTerms.slice(0, 15).join('\n')}`)
  if (roles.length > 0) parts.push(`**User Roles:**\n${roles.slice(0, 5).join('\n')}`)
  if (preconditions.length > 0) parts.push(`**Preconditions:**\n${preconditions.slice(0, 5).join('\n')}`)

  return parts.length > 0
    ? parts.join('\n\n')
    : '(knowledge linked but no extractable terminology found)'
}

export function condenseRules(rules: string): string {
  if (!rules) return '(no rules)'

  const rulesParts: string[] = []

  const priorityMatch = rules.match(/##\s*Priority Mapping\s*\n([\s\S]*?)(?=\n##|$)/)
  if (priorityMatch) rulesParts.push(`### Priority Mapping\n${priorityMatch[1].trim()}`)

  const constraintsMatch = rules.match(/##\s*CONSTRAINTS\s*\n([\s\S]*?)(?=\n##|$)/i)
  if (constraintsMatch) rulesParts.push(`### Constraints\n${constraintsMatch[1].trim()}`)

  const orderMatch = rules.match(/##\s*Order of case\s*\n([\s\S]*?)(?=\n##|$)/i)
  if (orderMatch) rulesParts.push(`### Order\n${orderMatch[1].trim()}`)

  const platformMatch = rules.match(/###\s*Platform[:\s]+(.+)/i)
  if (platformMatch) rulesParts.push(`**Platform:** ${platformMatch[1].trim()}`)

  return rulesParts.length > 0 ? rulesParts.join('\n\n') : rules
}

export function buildTemplateSection(
  template: Array<{ name: string; writingStyle: string }>,
  structure: StructureNode[] | undefined
): { templateSection: string; fullColumnOrder: string; mergedOrder: string } {
  const colsWithStyle = template.filter(c => c.writingStyle)
  const templateSection = colsWithStyle.map(c => {
    const firstLine = c.writingStyle
      .split('\n')
      .map(l => l.replace(/^#+\s*/, '').trim())
      .find(l => l.length > 0)
    return `- **${c.name}**: ${firstLine || c.writingStyle.slice(0, 80)}`
  }).join('\n')
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
