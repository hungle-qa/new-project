import { GoogleGenerativeAI } from '@google/generative-ai'

export const DEFAULT_SPEC_PROMPT = `You are a senior QA analyst. Convert the raw content into a testcase-ready spec. Focus on Acceptance Criteria — this is what QA uses to generate testcases.

**CRITICAL INSTRUCTIONS:**
1. Extract ALL user stories (US) and acceptance criteria (AC) with Given/When/Then
2. Preserve exact field names, error messages, and business rules
3. Keep a brief Requirements table for traceability
4. SKIP lengthy overview prose and user flow narratives — the ACs already capture these
5. Output ONLY the structured markdown (no preamble)

**OUTPUT FORMAT:**

### Acceptance Criteria

**US1 - {user story title with "As a... I want... so that..."}**

| AC ID | Description | Given | When | Then |
|-------|-------------|-------|------|------|
| AC1 | ... | ... | ... | ... |

**US2 - {title}**
(repeat table for each US)

### Requirements

| REQ-ID | Description | User Story |
|--------|-------------|------------|
| REQ-1 | ... | US1 |

### Edge Cases
(only if explicitly mentioned in the source document)`

export const DEFAULT_KNOWLEDGE_PROMPT = `Extract ONLY these sections from the document into clean markdown. Omit everything else.

1. **Glossary** — Feature name, module/page, purpose (1-2 sentences max per term)
2. **User Roles** — Who can use the feature, access levels (bullet list)
3. **Preconditions** — Plans, settings, or conditions required (bullet list)
4. **UI Map** — Screen areas, button names, panel names referenced in the document (brief list, no full descriptions)
5. **Key Logic** — Confusing logic, known issues, edge cases worth noting for testing (bullet list, skip if none)
6. **Test Accounts** — Email, role, scenario (table, skip if none mentioned)

SKIP entirely: full function detail prose, help center URLs, notification tables, document status tables, cURL commands, related documents table, changelog entries.
Keep terminology exact — do not rename buttons, screens, or features.`

export interface TokenStats {
  input_tokens: number
  output_tokens: number
  total_tokens: number
}

export interface StructuredSpec {
  content: string
  tokens?: TokenStats
}

export interface AIConfig {
  provider: 'gemini'
  apiKey: string
  model?: string
}

export interface AIModel {
  id: string
  displayName: string
}

export class AIService {
  private static async callWithRetry(
    model: ReturnType<GoogleGenerativeAI['getGenerativeModel']>,
    prompt: string | Array<{ inlineData: { data: string; mimeType: string } } | string>,
    maxRetries = 5
  ) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await model.generateContent(prompt)
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        const isRateLimit = message.includes('429') ||
          message.toLowerCase().includes('resource exhausted') ||
          message.toLowerCase().includes('too many requests')

        if (!isRateLimit || attempt === maxRetries) {
          throw error
        }

        const baseDelay = Math.pow(2, attempt + 1) * 1000 // 2s, 4s, 8s, 16s, 32s
        const jitter = Math.random() * 1000
        const delay = baseDelay + jitter
        console.warn(`Rate limited (429). Retrying in ${(delay / 1000).toFixed(1)}s... (attempt ${attempt + 1}/${maxRetries})`)
        await new Promise(resolve => setTimeout(resolve, delay))
      }
    }
    throw new Error('Unexpected: exhausted retries without throwing')
  }

  /**
   * Structure raw spec content into a clean feature specification
   */
  static async structureSpec(
    rawContent: string,
    customPrompt: string,
    config: AIConfig
  ): Promise<StructuredSpec> {
    if (!config.apiKey) {
      throw new Error('API key is required. Please configure AI settings.')
    }

    const instructions = customPrompt || DEFAULT_SPEC_PROMPT

    const prompt = `${instructions}

**FORMATTING RULES:**
- For markdown tables: use <br> tags to break long content into readable lines within cells. Each cell should be readable without horizontal scrolling.

---

**RAW CONTENT TO CONVERT:**

${rawContent}`

    try {
      const genAI = new GoogleGenerativeAI(config.apiKey)
      const model = genAI.getGenerativeModel({
        model: config.model || 'gemini-2.0-flash'
      })

      const result = await this.callWithRetry(model, prompt)
      const content = result.response.text().trim()
      const usage = result.response.usageMetadata
      const tokens: TokenStats | undefined = usage
        ? {
            input_tokens: usage.promptTokenCount ?? 0,
            output_tokens: usage.candidatesTokenCount ?? 0,
            total_tokens: usage.totalTokenCount ?? 0,
          }
        : undefined

      return { content, tokens }
    } catch (error) {
      console.error('AI Service Error:', error)
      throw new Error(
        error instanceof Error
          ? `Failed to structure spec: ${error.message}`
          : 'Failed to structure spec with AI'
      )
    }
  }

  /**
   * Structure spec from PDF buffer via Gemini multimodal (skip text extraction)
   */
  static async structureSpecFromPdf(
    pdfBuffer: Buffer,
    customPrompt: string,
    config: AIConfig
  ): Promise<StructuredSpec> {
    if (!config.apiKey) {
      throw new Error('API key is required. Please configure AI settings.')
    }

    const instructions = customPrompt || DEFAULT_SPEC_PROMPT

    const prompt = `${instructions}

**FORMATTING RULES:**
- For markdown tables: use <br> tags to break long content into readable lines within cells. Each cell should be readable without horizontal scrolling.

---

**Convert the attached PDF into structured spec format.**`

    try {
      const genAI = new GoogleGenerativeAI(config.apiKey)
      const model = genAI.getGenerativeModel({
        model: config.model || 'gemini-2.0-flash'
      })

      const result = await this.callWithRetry(model, [
        { inlineData: { data: pdfBuffer.toString('base64'), mimeType: 'application/pdf' } },
        prompt
      ])
      const content = result.response.text().trim()
      const usage = result.response.usageMetadata
      const tokens: TokenStats | undefined = usage
        ? {
            input_tokens: usage.promptTokenCount ?? 0,
            output_tokens: usage.candidatesTokenCount ?? 0,
            total_tokens: usage.totalTokenCount ?? 0,
          }
        : undefined

      return { content, tokens }
    } catch (error) {
      console.error('AI Service Error (PDF multimodal):', error)
      throw new Error(
        error instanceof Error
          ? `Failed to structure spec from PDF: ${error.message}`
          : 'Failed to structure spec from PDF with AI'
      )
    }
  }

  /**
   * Structure raw document content into knowledge markdown
   */
  static async structureKnowledge(
    rawContent: string,
    customPrompt: string,
    config: AIConfig
  ): Promise<{ content: string }> {
    if (!config.apiKey) {
      throw new Error('API key is required. Please configure AI settings.')
    }

    const instructions = customPrompt || DEFAULT_KNOWLEDGE_PROMPT

    const prompt = `You are an AI assistant that processes documents into structured knowledge.

**USER INSTRUCTIONS:**
${instructions}

**DOCUMENT CONTENT:**
${rawContent}

**OUTPUT:**
Output clean, structured markdown. Use headers, bullets, tables as appropriate.
For markdown tables: use <br> tags to break long content into multiple lines within cells. Each cell should be readable without horizontal scrolling.
Output ONLY the structured content (no preamble).`

    try {
      const genAI = new GoogleGenerativeAI(config.apiKey)
      const model = genAI.getGenerativeModel({
        model: config.model || 'gemini-2.0-flash'
      })

      const result = await this.callWithRetry(model, prompt)
      const content = result.response.text().trim()

      return { content }
    } catch (error) {
      console.error('AI Service Error:', error)
      throw new Error(
        error instanceof Error
          ? `Failed to structure knowledge: ${error.message}`
          : 'Failed to structure knowledge with AI'
      )
    }
  }

  /**
   * List available Gemini models that support generateContent
   */
  static async listModels(apiKey: string): Promise<AIModel[]> {
    if (!apiKey) {
      throw new Error('API key is required')
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    )

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}))
      const message = (errorBody as { error?: { message?: string } }).error?.message || `HTTP ${response.status}`
      throw new Error(`Failed to fetch models: ${message}`)
    }

    const data = await response.json() as {
      models: Array<{
        name: string
        displayName: string
        supportedGenerationMethods: string[]
      }>
    }

    return data.models
      .filter((m) => m.supportedGenerationMethods.includes('generateContent'))
      .map((m) => ({
        id: m.name.replace('models/', ''),
        displayName: m.displayName,
      }))
  }

  /**
   * Test AI connection with a simple prompt
   */
  static async testConnection(config: AIConfig): Promise<boolean> {
    if (!config.apiKey) {
      throw new Error('API key is required')
    }

    try {
      const genAI = new GoogleGenerativeAI(config.apiKey)
      const model = genAI.getGenerativeModel({
        model: config.model || 'gemini-2.0-flash'
      })

      const result = await model.generateContent('Say "Hello" in one word.')
      const text = result.response.text()

      return text.toLowerCase().includes('hello')
    } catch (error) {
      console.error('AI Connection Test Error:', error)
      throw new Error(
        error instanceof Error
          ? error.message
          : 'Failed to connect to AI service'
      )
    }
  }
}
