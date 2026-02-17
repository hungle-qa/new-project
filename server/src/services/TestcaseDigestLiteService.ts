import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { TestcaseFeatureService } from './TestcaseFeatureService'
import {
  SOURCE_DIR,
  CURRENT_DIGEST_LITE_VERSION,
} from './TestcaseTypes'

export class TestcaseDigestLiteService {
  static async checkDigestLiteFreshness(name: string): Promise<{ status: 'FRESH' | 'STALE'; reason?: string }> {
    const digestPath = path.join(SOURCE_DIR, name, 'context-digest-lite.md')

    let digestTime: number
    try {
      const stat = await fs.stat(digestPath)
      digestTime = stat.mtimeMs
    } catch {
      return { status: 'STALE', reason: 'no-digest-lite' }
    }

    // Check digest-lite version
    try {
      const digestContent = await fs.readFile(digestPath, 'utf-8')
      const parsed = matter(digestContent)
      const version = parsed.data['digest-lite-version']
      if (!version || version < CURRENT_DIGEST_LITE_VERSION) {
        return { status: 'STALE', reason: `version-outdated (${version || 'none'} < ${CURRENT_DIGEST_LITE_VERSION})` }
      }
    } catch {
      return { status: 'STALE', reason: 'unreadable-digest-lite' }
    }

    // Source files to check: spec + rules only
    const filesToCheck = [
      path.join(SOURCE_DIR, name, 'rules.md'),
      path.join(SOURCE_DIR, 'rule', 'test-rules.md'),
    ]

    // Add spec files
    try {
      const specDir = path.join(SOURCE_DIR, name, 'spec')
      const specFiles = await fs.readdir(specDir)
      for (const f of specFiles) {
        if (f.endsWith('.md')) filesToCheck.push(path.join(specDir, f))
      }
    } catch { /* no spec dir */ }

    for (const f of filesToCheck) {
      try {
        const stat = await fs.stat(f)
        if (stat.mtimeMs > digestTime) {
          const relative = path.relative(path.join(SOURCE_DIR, '../..'), f)
          return { status: 'STALE', reason: relative }
        }
      } catch { /* file doesn't exist, skip */ }
    }

    return { status: 'FRESH' }
  }

  static async generateContextDigestLite(name: string): Promise<{ success: boolean; warnings: string[] }> {
    const warnings: string[] = []

    // Read spec
    const spec = await TestcaseFeatureService.getSpec(name)
    if (!spec) {
      warnings.push('No spec found — digest-lite will be empty')
    }

    // Read rules (per-feature first, else global — same cascading logic)
    let rules = ''
    let rulesSource = ''
    try {
      const featureRulesPath = path.join(SOURCE_DIR, name, 'rules.md')
      rules = await fs.readFile(featureRulesPath, 'utf-8')
      rulesSource = `${name}/rules.md`
    } catch {
      try {
        rules = await fs.readFile(path.join(SOURCE_DIR, 'rule', 'test-rules.md'), 'utf-8')
        rulesSource = 'rule/test-rules.md'
      } catch {
        warnings.push('No rules found — using empty rules')
      }
    }

    // Parse US/AC/GWT from spec
    let parsedSpec = '(no spec imported)'
    const sources: string[] = []

    if (spec) {
      // Track spec source files
      try {
        const specDir = path.join(SOURCE_DIR, name, 'spec')
        const specFiles = await fs.readdir(specDir)
        for (const f of specFiles) {
          if (f.endsWith('.md')) sources.push(`spec/${f}`)
        }
      } catch { /* no spec dir */ }

      const parsedLines: string[] = []

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
        parsedLines.push(`### ${us.title}`)

        // Extract ACs from table rows
        const acTableRows = usBlock.match(/^\|\s*AC\d+\s*\|.*$/gm)
        if (acTableRows) {
          for (const row of acTableRows) {
            const cells = row.split('|').map(c => c.trim()).filter(Boolean)
            if (cells.length >= 5) {
              const [acId, desc, given, when, then] = cells
              parsedLines.push(`\n#### ${acId}: ${desc}`)
              parsedLines.push(`- Given: ${given}`)
              parsedLines.push(`- When: ${when}`)
              parsedLines.push(`- Then: ${then}`)
            }
          }
        }

        // Fallback: AC from ### headings with GWT extraction
        const acHeadings = usBlock.match(/^###\s+(AC\d+.*)$/gm)
        if (acHeadings && !acTableRows) {
          for (const ac of acHeadings) {
            const acTitle = ac.replace(/^###\s+/, '').trim()
            parsedLines.push(`\n#### ${acTitle}`)

            const acPos = usBlock.indexOf(ac)
            const nextAcPattern = /^###\s+AC\d+/gm
            nextAcPattern.lastIndex = acPos + ac.length
            const nextAc = nextAcPattern.exec(usBlock)
            const acBlock = usBlock.slice(acPos, nextAc ? nextAc.index : usBlock.length)

            const givenMatch = acBlock.match(/[Gg]iven[:\s]+(.+)/m)
            const whenMatch = acBlock.match(/[Ww]hen[:\s]+(.+)/m)
            const thenMatch = acBlock.match(/[Tt]hen[:\s]+(.+)/m)
            if (givenMatch) parsedLines.push(`- Given: ${givenMatch[1].trim()}`)
            if (whenMatch) parsedLines.push(`- When: ${whenMatch[1].trim()}`)
            if (thenMatch) parsedLines.push(`- Then: ${thenMatch[1].trim()}`)
          }
        }
      }

      parsedSpec = parsedLines.length > 0 ? parsedLines.join('\n') : spec
    }

    if (rulesSource) sources.push(rulesSource)

    // Extract priority mapping + constraints from rules
    let rulesSection = '(no rules)'
    if (rules) {
      const rulesParts: string[] = []

      const priorityMatch = rules.match(/##\s*Priority Mapping\s*\n([\s\S]*?)(?=\n##|$)/)
      if (priorityMatch) rulesParts.push(`### Priority Mapping\n${priorityMatch[1].trim()}`)

      const constraintsMatch = rules.match(/##\s*CONSTRAINTS\s*\n([\s\S]*?)(?=\n##|$)/i)
      if (constraintsMatch) rulesParts.push(`### Constraints\n${constraintsMatch[1].trim()}`)

      const orderMatch = rules.match(/##\s*Order of case\s*\n([\s\S]*?)(?=\n##|$)/i)
      if (orderMatch) rulesParts.push(`### Order\n${orderMatch[1].trim()}`)

      rulesSection = rulesParts.length > 0 ? rulesParts.join('\n\n') : rules
    }

    // Build digest-lite
    const now = new Date().toISOString()
    const digest = `---
digest-lite-version: ${CURRENT_DIGEST_LITE_VERSION}
generated: ${now}
feature: ${name}
sources:
${sources.map(s => `  - ${s}`).join('\n')}
---

## Parsed Spec

${parsedSpec}

## Rules

${rulesSection}
${warnings.length > 0 ? `\n## Warnings\n${warnings.map(w => `- ${w}`).join('\n')}\n` : ''}`

    const digestPath = path.join(SOURCE_DIR, name, 'context-digest-lite.md')
    await fs.writeFile(digestPath, digest)

    return { success: true, warnings }
  }
}
