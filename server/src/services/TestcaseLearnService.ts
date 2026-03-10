import { parse } from 'csv-parse/sync'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { TemplateColumn } from './TestcaseTypes'
import { AIConfig } from './AIService'

export interface LearnColumnAnalysis {
  name: string
  detectedWidth: string
  detectedStyle: string
  detectedRules: string
  reasoning: string
}

export interface LearnRulesAnalysis {
  columnFormat: string
  orderOfCase: string
  scope: string
  priorityMapping: string
  constraints: string
  businessRules: string
}

export interface LearnAnalysis {
  columns: LearnColumnAnalysis[]
  rules: LearnRulesAnalysis
  metadata: {
    rowCount: number
    columnCount: number
    sampleRows: string[][]
  }
}

export class TestcaseLearnService {
  static parseCsv(csvContent: string): { headers: string[]; rows: string[][] } {
    const records: string[][] = parse(csvContent, {
      relax_column_count: true,
      skip_empty_lines: true,
      trim: true,
    })

    if (records.length === 0) {
      throw new Error('CSV is empty — no headers found')
    }

    const headers = records[0]
    const rows = records.slice(1)

    if (rows.length < 2) {
      throw new Error('Need at least 2 testcase rows to detect patterns')
    }

    return { headers, rows }
  }

  static sampleRows(rows: string[][], maxRows = 30): string[][] {
    if (rows.length <= maxRows) return rows
    const first = rows.slice(0, 10)
    const midStart = Math.floor(rows.length / 2) - 5
    const middle = rows.slice(midStart, midStart + 10)
    const last = rows.slice(-10)
    return [...first, ...middle, ...last]
  }

  static buildAnalysisPrompt(headers: string[], rows: string[][], spec: string | null): string {
    const sampled = this.sampleRows(rows)
    const csvPreview = sampled.map((row, i) =>
      `Row ${i + 1}: ${row.map((cell, j) => `[${headers[j] || `Col${j}`}] ${cell.slice(0, 200)}`).join(' | ')}`
    ).join('\n')

    return `You are a QA testcase analyst. Analyze this testcase CSV${spec ? ' against the provided spec' : ''} to extract writing patterns and conventions.

## CSV Data
**Headers:** ${headers.join(', ')}
**Total rows:** ${rows.length}
**Sample rows (${sampled.length} of ${rows.length}):**

${csvPreview}

${spec ? `## Spec\n${spec}\n` : ''}
## Task

Analyze the testcase data and extract patterns. Return a JSON object with this exact structure:

{
  "columns": [
    {
      "name": "column name",
      "detectedWidth": "CSS width like 80px, 200px, 300px based on content length",
      "detectedStyle": "one of: bold mono, bold, bold center, mono, normal",
      "detectedRules": "detailed writing rules you observe for this column - formatting patterns, verb conventions, value patterns, constraints",
      "reasoning": "brief explanation of why you concluded these patterns"
    }
  ],
  "rules": {
    "columnFormat": "overall formatting conventions across columns — NOTE: this goes into template columnRules only, NOT into rules markdown",
    "orderOfCase": "how testcases are ordered (e.g., UI first then function, by module, by priority, happy path first then edge cases)",
    "scope": "what types of cases are covered (happy path, corner cases, negative cases, boundary values) and approximate distribution",
    "priorityMapping": "criteria used for Critical/High/Medium/Low priority assignment based on the data",
    "constraints": "structural constraints only (no column-format items like step numbering or bullet style — those go in columnFormat/template)",
    "businessRules": "domain-specific patterns or business logic reflected in the testcases"
  }
}

IMPORTANT:
- Analyze ALL sample rows to find consistent patterns, not just the first few
- For column rules, be specific about formatting (e.g., "Steps use numbered format: 1. ACTION **[element]**")
- For ordering, look at how cases progress (e.g., basic → advanced, UI → functional → edge)
- Output ONLY the JSON object, no markdown fencing, no preamble`
  }

  static async analyzeTestcase(
    headers: string[],
    rows: string[][],
    spec: string | null,
    config: AIConfig
  ): Promise<LearnAnalysis> {
    if (!config.apiKey) {
      throw new Error('API key is required. Please configure AI settings.')
    }

    const prompt = this.buildAnalysisPrompt(headers, rows, spec)

    const genAI = new GoogleGenerativeAI(config.apiKey)
    const model = genAI.getGenerativeModel({
      model: config.model || 'gemini-2.0-flash',
    })

    let result
    for (let attempt = 0; attempt <= 2; attempt++) {
      try {
        result = await model.generateContent(prompt)
        break
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        const isRateLimit = message.includes('429') || message.toLowerCase().includes('resource exhausted')
        if (!isRateLimit || attempt === 2) throw error
        await new Promise(r => setTimeout(r, Math.pow(2, attempt + 1) * 1000))
      }
    }

    if (!result) throw new Error('Failed to get AI response')

    let text = result.response.text().trim()
    // Strip markdown code fences if present
    text = text.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '')

    let analysis: LearnAnalysis
    try {
      const parsed = JSON.parse(text)
      analysis = {
        columns: parsed.columns || [],
        rules: {
          columnFormat: parsed.rules?.columnFormat || '',
          orderOfCase: parsed.rules?.orderOfCase || '',
          scope: parsed.rules?.scope || '',
          priorityMapping: parsed.rules?.priorityMapping || '',
          constraints: parsed.rules?.constraints || '',
          businessRules: parsed.rules?.businessRules || '',
        },
        metadata: {
          rowCount: rows.length,
          columnCount: headers.length,
          sampleRows: rows.slice(0, 3),
        },
      }
    } catch {
      throw new Error(`AI returned invalid JSON. Raw response: ${text.slice(0, 500)}`)
    }

    return analysis
  }

  static analysisToTemplate(analysis: LearnAnalysis): TemplateColumn[] {
    return analysis.columns.map((col, i) => ({
      id: `col_${Date.now()}_${i}`,
      name: col.name,
      width: col.detectedWidth || '200px',
      style: col.detectedStyle || 'normal',
      columnRules: col.detectedRules,
    }))
  }

  static analysisToRules(analysis: LearnAnalysis): string {
    const r = analysis.rules
    const sections: string[] = []

    sections.push('# Learned Rules\n')
    sections.push('_Auto-generated by analyzing existing testcases._\n')

    // columnFormat is intentionally omitted — column-specific rules go only in template columnRules
    if (r.orderOfCase) {
      sections.push(`## Order of Case\n\n${r.orderOfCase}\n`)
    }
    if (r.scope) {
      sections.push(`## Scope\n\n${r.scope}\n`)
    }
    if (r.priorityMapping) {
      sections.push(`## Priority Mapping\n\n${r.priorityMapping}\n`)
    }
    if (r.constraints) {
      sections.push(`## Constraints\n\n${r.constraints}\n`)
    }
    if (r.businessRules) {
      sections.push(`## Business Rules\n\n${r.businessRules}\n`)
    }

    return sections.join('\n')
  }
}
