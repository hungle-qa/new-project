import fs from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { TestcaseFeatureService } from './TestcaseFeatureService'
import { TestcaseConfigService } from './TestcaseConfigService'
import {
  SOURCE_DIR,
  FEATURE_DIR,
  BASE_SOURCE_DIR,
  CURRENT_DIGEST_VERSION,
  getKnowledgeItemName,
  getKnowledgeSections,
  filterContentBySections,
} from './TestcaseTypes'
import {
  renderTree,
  condenseSpec,
  buildTestScope,
  extractTerminology,
  condenseRules,
  buildTemplateSection,
} from './TestcaseDigestHelpers'

export class TestcaseDigestService {
  static async checkDigestFreshness(name: string): Promise<{ status: 'FRESH' | 'STALE'; reason?: string }> {
    const digestPath = path.join(FEATURE_DIR, name, 'context-digest.md')

    let digestTime: number
    try {
      digestTime = (await fs.stat(digestPath)).mtimeMs
    } catch {
      return { status: 'STALE', reason: 'no-digest' }
    }

    try {
      const parsed = matter(await fs.readFile(digestPath, 'utf-8'))
      const version = parsed.data['digest-version']
      if (!version || version < CURRENT_DIGEST_VERSION) {
        return { status: 'STALE', reason: `version-outdated (${version || 'none'} < ${CURRENT_DIGEST_VERSION})` }
      }
    } catch {
      return { status: 'STALE', reason: 'unreadable-digest' }
    }

    const config = await TestcaseFeatureService.getFeatureConfig(name)

    const filesToCheck = [
      path.join(FEATURE_DIR, name, 'config.md'),
      path.join(FEATURE_DIR, name, 'rules.md'),
      path.join(FEATURE_DIR, name, 'template.json'),
      path.join(SOURCE_DIR, 'rule', 'test-rules.md'),
      path.join(SOURCE_DIR, 'template', 'template.json'),
    ]

    try {
      const specFiles = await fs.readdir(path.join(FEATURE_DIR, name, 'spec'))
      for (const f of specFiles) {
        if (f.endsWith('.md')) filesToCheck.push(path.join(FEATURE_DIR, name, 'spec', f))
      }
    } catch { /* no spec dir */ }

    if (config?.strategy) {
      filesToCheck.push(path.join(SOURCE_DIR, 'strategy', `${config.strategy}.md`))
    }

    for (const entry of config?.linked_knowledge || []) {
      filesToCheck.push(path.join(BASE_SOURCE_DIR, 'feature-knowledge', getKnowledgeItemName(entry), 'config.md'))
    }

    for (const comp of config?.components || []) {
      filesToCheck.push(path.join(BASE_SOURCE_DIR, 'design-system', `${comp.name}.md`))
    }

    for (const f of filesToCheck) {
      try {
        if ((await fs.stat(f)).mtimeMs > digestTime) {
          return { status: 'STALE', reason: path.relative(BASE_SOURCE_DIR, f) }
        }
      } catch { /* skip */ }
    }

    return { status: 'FRESH' }
  }

  static async generateContextDigest(name: string): Promise<{ digest: string; warnings: string[] }> {
    const config = await TestcaseFeatureService.getFeatureConfig(name)
    if (!config) throw new Error('Feature not found')

    const warnings: string[] = []
    const rules = await TestcaseConfigService.getFeatureRules(name)
    const template = await TestcaseConfigService.getFeatureTemplate(name)
    const spec = await TestcaseFeatureService.getSpec(name)

    let strategyName = config.strategy || ''
    let strategySummary = ''
    if (strategyName) {
      const fullStrategy = (await TestcaseConfigService.getStrategyContent(strategyName)) || ''
      const summaryLine = fullStrategy.split('\n').find(l => l.trim() && !l.startsWith('#'))
      strategySummary = summaryLine ? summaryLine.trim() : `Use ${strategyName} approach`
    }

    // Read linked knowledge
    const knowledgeSections: string[] = []
    const specLower = (spec || '').toLowerCase()
    for (const entry of config.linked_knowledge || []) {
      const kName = getKnowledgeItemName(entry)
      const selectedSections = getKnowledgeSections(entry)

      if (spec && selectedSections.length > 0) {
        const anyRelevant = selectedSections.some(s => {
          const words = s.replace(/^#+\s*/, '').replace(/^[IVXL]+\.\s*/, '').trim().toLowerCase()
          return specLower.includes(words)
        })
        if (!anyRelevant) continue
      }

      try {
        const kContent = await fs.readFile(
          path.join(BASE_SOURCE_DIR, 'feature-knowledge', kName, 'config.md'), 'utf-8'
        )
        const parsed = matter(kContent)
        knowledgeSections.push(`### ${kName}\n${filterContentBySections(parsed.content, selectedSections)}`)
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'unknown error'
        warnings.push(`Knowledge "${kName}": ${msg.includes('ENOENT') ? 'file not found' : `read failed (${msg})`}`)
      }
    }

    const structureText = config.structure?.length
      ? renderTree(config.structure)
      : 'No structure defined — AI freestyles module assignment.'

    const specSummary = spec ? condenseSpec(spec) : '(no spec imported)'
    const { testable: testScopeTestable, outOfScope: testScopeOutOfScope } = buildTestScope(spec, knowledgeSections, config)

    const happyCaseMatch = rules.match(/###\s*Happy Case\s*\n([\s\S]*?)(?=\n###|\n##|$)/)
    const cornerCaseMatch = rules.match(/###\s*Corner Case\s*\n([\s\S]*?)(?=\n###|\n##|$)/)
    const negativeCaseMatch = rules.match(/###\s*Negative Case\s*\n([\s\S]*?)(?=\n###|\n##|$)/)
    const happyCase = happyCaseMatch ? happyCaseMatch[1].trim() : 'Standard happy paths'
    const cornerCase = cornerCaseMatch ? cornerCaseMatch[1].trim() : 'Standard edge cases'
    const negativeCase = negativeCaseMatch ? negativeCaseMatch[1].trim() : (config.scope.negative_case || '')

    const terminologySection = extractTerminology(knowledgeSections)
    const rulesCondensed = condenseRules(rules)
    const { templateSection, fullColumnOrder, mergedOrder } = buildTemplateSection(template, config.structure)

    const componentSection = config.components?.length
      ? config.components.map(c => `- **${c.name}**: ${c.usage}`).join('\n')
      : '(no components linked)'

    const now = new Date().toISOString()
    const sources = [
      `source/testcase/feature/${name}/config.md`,
      `source/testcase/feature/${name}/spec/*.md`,
      `source/testcase/feature/${name}/rules.md`,
      `source/testcase/feature/${name}/template.json`,
      ...(config.strategy ? [`source/testcase/strategy/${config.strategy}.md`] : []),
      ...(config.linked_knowledge || []).map(k => `source/feature-knowledge/${getKnowledgeItemName(k)}/config.md`),
    ]

    const digest = `---
digest-version: 2
generated: ${now}
feature: ${name}
sources:
${sources.map(s => `  - ${s}`).join('\n')}
---

## Config
strategy: ${config.strategy || '(none)'}
structure: ${config.structure?.length ? 'defined (see below)' : 'empty'}
components: ${(config.components || []).map(c => c.name).join(', ') || '(none)'}
linked_knowledge: ${(config.linked_knowledge || []).map(k => {
  const kn = getKnowledgeItemName(k)
  const sections = getKnowledgeSections(k)
  return sections.length > 0 ? `${kn} (${sections.length} sections)` : kn
}).join(', ') || '(none)'}

<!-- [REQUIREMENTS — Generate testcases from this] -->

## Spec Summary
${specSummary}

## Test Scope

### TESTABLE (generate testcases for these)
${testScopeTestable}

### OUT OF SCOPE (in knowledge but NOT in spec — do NOT test)
${testScopeOutOfScope}

### Scope Hints
**Happy Case:** ${happyCase}
**Corner Case:** ${cornerCase}${negativeCase ? `\n**Negative Case:** ${negativeCase}` : ''}

## Structure
${structureText}

**RULE:** Structure defined → MUST follow tree, replace Module with Level 1..N, test ONLY leaf nodes. Empty → freestyle.

## Strategy Guide
${strategyName ? `strategy: ${strategyName}\n${strategySummary}\n(Full strategy: source/testcase/strategy/${strategyName}.md)` : 'No strategy selected — use default balanced approach.'}

<!-- [FORMAT — How to write testcases] -->

## Template Columns
${templateSection || '(no writing styles defined)'}
Full column order: ${fullColumnOrder}

## Merged Column Order
${mergedOrder}

## Rules Summary
${rulesCondensed}

<!-- [REFERENCE — Terminology only, do NOT generate testcases from this] -->

## Terminology & Context
${terminologySection}

## Component Knowledge
${componentSection}
${warnings.length > 0 ? `\n## Warnings\n${warnings.map(w => `- ${w}`).join('\n')}\n` : ''}`

    await fs.writeFile(path.join(FEATURE_DIR, name, 'context-digest.md'), digest)
    return { digest, warnings }
  }
}
