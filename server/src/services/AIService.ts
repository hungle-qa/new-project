import { GoogleGenerativeAI } from '@google/generative-ai'

export const DEFAULT_SPEC_PROMPT = `You are a senior QA analyst. Convert the following raw content into a structured feature specification document.

**CRITICAL INSTRUCTIONS:**

1. Extract all feature requirements, user flows, and acceptance criteria
2. Organize into clear sections with markdown headers
3. Preserve all technical details, field names, error messages, and business rules
4. Use tables for structured data (fields, validations, etc.)
5. Include edge cases and boundary conditions if mentioned
6. Output ONLY the structured markdown content (no preamble)

**OUTPUT FORMAT:**
# Feature Specification

## Overview
...

## User Flows
...

## Requirements
...

## Acceptance Criteria
...`

export const DEFAULT_KNOWLEDGE_PROMPT = `Keep the original content exactly as-is. Only convert to clean, well-formatted markdown that is easy to read. Do not summarize, rewrite, or omit any content.`

export interface StructuredSpec {
  content: string
}

export interface AIConfig {
  provider: 'gemini'
  apiKey: string
  model?: string
}

export class AIService {
  private static async callWithRetry(
    model: ReturnType<GoogleGenerativeAI['getGenerativeModel']>,
    prompt: string,
    maxRetries = 3
  ) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await model.generateContent(prompt)
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        const is429 = message.includes('429') || message.includes('Resource has been exhausted')

        if (!is429 || attempt === maxRetries) {
          throw error
        }

        const delay = Math.pow(2, attempt + 1) * 1000 // 2s, 4s, 8s
        console.warn(`Rate limited (429). Retrying in ${delay / 1000}s... (attempt ${attempt + 1}/${maxRetries})`)
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

      return { content }
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
