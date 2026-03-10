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

    const ruleName = config?.rule || 'test-rules'
    const templateName = config?.template || 'template'

    const filesToCheck = [
      path.join(FEATURE_DIR, name, 'config.md'),
      path.join(SOURCE_DIR, 'rule', `${ruleName}.md`),
      path.join(SOURCE_DIR, 'template', `${templateName}.json`),
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
    const rules = await TestcaseConfigService.getResolvedRule(name)
    const template = await TestcaseConfigService.getResolvedTemplate(name)
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
    for (const entry of config.linked_knowledge || []) {
      const kName = getKnowledgeItemName(entry)
      const selectedSections = getKnowledgeSections(entry)

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

    const specSummary = spec ? condenseSpec(spec) : '(no spec imported)'
    const { testable: testScopeTestable } = buildTestScope(spec, knowledgeSections, config)

    const terminologySection = extractTerminology(knowledgeSections)
    const rulesCondensed = condenseRules(rules)
    const { templateSection, fullColumnOrder, mergedOrder } = buildTemplateSection(template, config.structure)

    const componentSection = config.components?.length
      ? config.components.map(c => `- **${c.name}**: ${c.usage}`).join('\n')
      : '(no components linked)'

    const now = new Date().toISOString()
    const resolvedRuleName = config.rule || 'test-rules'
    const resolvedTemplateName = config.template || 'template'
    const sources = [
      `source/testcase/feature/${name}/config.md`,
      `source/testcase/feature/${name}/spec/*.md`,
      `source/testcase/rule/${resolvedRuleName}.md`,
      `source/testcase/template/${resolvedTemplateName}.json`,
      ...(config.strategy ? [`source/testcase/strategy/${config.strategy}.md`] : []),
      ...(config.linked_knowledge || []).map(k => `source/feature-knowledge/${getKnowledgeItemName(k)}/config.md`),
    ]

    const digest = `---
digest-version: 3
generated: ${now}
feature: ${name}
sources:
${sources.map(s => `  - ${s}`).join('\n')}
---

## Config
strategy: ${config.strategy || '(none)'}
components: ${(config.components || []).map(c => c.name).join(', ') || '(none)'}
linked_knowledge: ${(config.linked_knowledge || []).map(k => {
  const kn = getKnowledgeItemName(k)
  const sections = getKnowledgeSections(k)
  return sections.length > 0 ? `${kn} (${sections.length} sections)` : kn
}).join(', ') || '(none)'}

<!-- [FORMAT — Read these rules FIRST before reading the spec] -->

## Template Columns
${templateSection || '(no column rules defined)'}
Full column order: ${fullColumnOrder}

## Merged Column Order
${mergedOrder}

## Rules Summary
${rulesCondensed}

## Strategy Guide
${strategyName ? `strategy: ${strategyName}\n${strategySummary}\n(Full strategy: source/testcase/strategy/${strategyName}.md)` : 'No strategy selected — use default balanced approach.'}

<!-- [REQUIREMENTS — Generate testcases from this, following the rules above] -->

## Spec Summary
${specSummary}

## Test Scope

### TESTABLE (generate testcases for these)
${testScopeTestable}

${terminologySection !== '(no linked knowledge)' ? `<!-- [REFERENCE — Terminology only, do NOT generate testcases from this] -->\n\n## Terminology & Context\n${terminologySection}\n\n` : ''}## Component Knowledge
${componentSection}
${warnings.length > 0 ? `\n## Warnings\n${warnings.map(w => `- ${w}`).join('\n')}\n` : ''}`

    await fs.writeFile(path.join(FEATURE_DIR, name, 'context-digest.md'), digest)
    return { digest, warnings }
  }
}
