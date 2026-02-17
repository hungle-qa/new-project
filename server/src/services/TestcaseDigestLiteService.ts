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
      const parseQuality = parsed.data['parse-quality']
      if (parseQuality === 'raw-fallback') {
        return { status: 'STALE', reason: 'low-quality-digest' }
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

      // Noise filter for PDF-extracted lines
      const isNoiseLine = (line: string): boolean => {
        const trimmed = line.trim()
        if (trimmed.length < 4) return true
        if (/^https?:\/\//.test(trimmed)) return true
        if (/^=?\w{5,20}$/.test(trimmed)) return true
        if (/^(Design|Note)$/i.test(trimmed)) return true
        if (/node-id=|figma\.com|Connect your Figma/i.test(trimmed)) return true
        if (/^AC\s+GIVE|^WHEN\s+THEN/i.test(trimmed)) return true
        return false
      }

      // --- Phase 1: Find all US blocks ---
      const usPattern = /(?:^##\s+(US\d+.*)$)|(?:^\*\*(US\d+\s*-\s*.*?)\*\*)|(?:^(User Story \d+\s*:.*)$)/gm
      let usMatch: RegExpExecArray | null
      const allUsBlocks: { title: string; pos: number; endPos: number }[] = []
      const usMatches: RegExpExecArray[] = []
      while ((usMatch = usPattern.exec(spec)) !== null) {
        usMatches.push({ ...usMatch } as RegExpExecArray)
      }
      for (let i = 0; i < usMatches.length; i++) {
        const m = usMatches[i]
        const title = (m[1] || m[2] || m[3]).trim()
        const endPos = i + 1 < usMatches.length ? usMatches[i + 1].index : spec.length
        allUsBlocks.push({ title, pos: m.index, endPos })
      }

      // --- Phase 2: For duplicate US titles, collect clean AC titles from TOC block, content from body block ---
      const titleGroups = new Map<string, typeof allUsBlocks>()
      for (const block of allUsBlocks) {
        const group = titleGroups.get(block.title) || []
        group.push(block)
        titleGroups.set(block.title, group)
      }

      for (const [usTitle, blocks] of titleGroups) {
        // Sort by block size: smallest first (TOC), largest last (body)
        blocks.sort((a, b) => (a.endPos - a.pos) - (b.endPos - b.pos))

        // Extract clean AC titles from TOC block (shortest block, has "AC\d+:" lines with clean names)
        const cleanAcTitles = new Map<string, string>()
        if (blocks.length > 1) {
          const tocBlock = spec.slice(blocks[0].pos, blocks[0].endPos)
          const tocAcLines = tocBlock.match(/^AC(\d+)\s*:\s*(.+)$/gm)
          if (tocAcLines) {
            for (const line of tocAcLines) {
              const acMatch = line.match(/^(AC\d+)\s*:\s*(.+)$/)
              if (acMatch) cleanAcTitles.set(acMatch[1], `${acMatch[1]}: ${acMatch[2].trim()}`)
            }
          }
        }

        // Use the body block (longest) for content
        const bodyBlock = spec.slice(blocks[blocks.length - 1].pos, blocks[blocks.length - 1].endPos)
        parsedLines.push(`### ${usTitle}`)

        // --- Try table-row ACs first ---
        const acTableRows = bodyBlock.match(/^\|\s*AC\d+\s*\|.*$/gm)
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
          continue
        }

        // --- Try ### AC headings ---
        const acHeadings = bodyBlock.match(/^###\s+(AC\d+.*)$/gm)
        if (acHeadings) {
          for (const ac of acHeadings) {
            const acTitle = ac.replace(/^###\s+/, '').trim()
            parsedLines.push(`\n#### ${acTitle}`)
            const acPos = bodyBlock.indexOf(ac)
            const nextAcPattern = /^###\s+AC\d+/gm
            nextAcPattern.lastIndex = acPos + ac.length
            const nextAc = nextAcPattern.exec(bodyBlock)
            const acBlock = bodyBlock.slice(acPos, nextAc ? nextAc.index : bodyBlock.length)
            const givenMatch = acBlock.match(/[Gg]iven[:\s]+(.+)/m)
            const whenMatch = acBlock.match(/[Ww]hen[:\s]+(.+)/m)
            const thenMatch = acBlock.match(/[Tt]hen[:\s]+(.+)/m)
            if (givenMatch) parsedLines.push(`- Given: ${givenMatch[1].trim()}`)
            if (whenMatch) parsedLines.push(`- When: ${whenMatch[1].trim()}`)
            if (thenMatch) parsedLines.push(`- Then: ${thenMatch[1].trim()}`)
          }
          continue
        }

        // --- Fallback: bare "AC1:" lines (PDF-extracted) ---
        const acBareLines = bodyBlock.match(/^AC\d+\s*:\s*.*$/gm)
        if (acBareLines) {
          for (const ac of acBareLines) {
            const acIdMatch = ac.match(/^(AC\d+)/)
            const acId = acIdMatch ? acIdMatch[1] : ''

            // Use clean title from TOC if available, else use raw
            const title = cleanAcTitles.get(acId) || ac.replace(/\s*:\s*/, ': ').trim()
            parsedLines.push(`\n#### ${title}`)

            const acPos = bodyBlock.indexOf(ac)
            const nextAcBare = /^AC\d+\s*:/gm
            nextAcBare.lastIndex = acPos + ac.length
            const nextAc = nextAcBare.exec(bodyBlock)
            const acBlock = bodyBlock.slice(acPos + ac.length, nextAc ? nextAc.index : bodyBlock.length)

            // Preserve indent levels and filter noise
            const rawLines = acBlock.split('\n').filter(l => l.trim().length > 0)
            for (const line of rawLines) {
              if (isNoiseLine(line)) continue
              const leadingSpaces = line.match(/^(\s*)/)?.[1].length || 0
              const indentLevel = Math.min(Math.floor(leadingSpaces / 2), 3)
              const indent = '  '.repeat(indentLevel)
              parsedLines.push(`${indent}- ${line.trim()}`)
            }
          }
        }
      }

      if (parsedLines.length === 0) {
        warnings.push('Spec structure not detected — raw dump used. Re-import PDF for better results.')
      }
      parsedSpec = parsedLines.length > 0 ? parsedLines.join('\n') : spec
    }

    const parseQuality = spec && parsedSpec === spec ? 'raw-fallback' : 'structured'

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
parse-quality: ${parseQuality}
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
