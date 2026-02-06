import { GoogleGenerativeAI } from '@google/generative-ai'
import fs from 'fs/promises'
import path from 'path'

const TEMPLATE_PATH = path.join(__dirname, '../../../source/product-idea/template/product-idea-format.md')

export interface StructuredProductIdea {
  name: string
  content: string
}

export interface AIConfig {
  provider: 'gemini'
  apiKey: string
  model?: string
}

export class AIService {
  /**
   * Uses Google Gemini AI to structure raw, unstructured content into a product idea format
   */
  static async structureProductIdea(
    rawContent: string,
    config: AIConfig
  ): Promise<StructuredProductIdea> {
    if (!config.apiKey) {
      throw new Error('API key is required. Please configure AI settings.')
    }

    // Read format template from file (allows real-time updates)
    const formatTemplate = await fs.readFile(TEMPLATE_PATH, 'utf-8')

    const prompt = `You are a senior business analyst. Convert the following raw content into a structured product idea document.

**YOU MUST FOLLOW THIS EXACT FORMAT TEMPLATE:**

${formatTemplate}

---

**RAW CONTENT TO CONVERT:**

${rawContent}

---

**CRITICAL INSTRUCTIONS:**

1. **Follow the format template EXACTLY** - use the same section headers and structure
2. **Extract information from the raw content** and place it in the appropriate sections
3. **For the product name**, create a short, descriptive kebab-case name (e.g., "canvas-table-builder")
4. **Fill in all sections** based on the content - if information is not available, write "To be defined" or make reasonable inferences
5. **Keep tables and formatting** as shown in the template
6. **Be thorough** - this is a professional product specification document

**OUTPUT FORMAT:**
- First line MUST be: "NAME: [kebab-case-product-name]"
- Remaining content: The full markdown document following the template structure

**EXAMPLE OUTPUT:**
NAME: interactive-table-builder
# Interactive Table Builder

---

## 1. Executive Summary
...`

    try {
      const genAI = new GoogleGenerativeAI(config.apiKey)
      const model = genAI.getGenerativeModel({
        model: config.model || 'gemini-2.0-flash'
      })

      const result = await model.generateContent(prompt)
      const responseText = result.response.text()

      // Parse response
      const lines = responseText.split('\n')
      const nameLine = lines.find(line => line.startsWith('NAME:'))

      if (!nameLine) {
        throw new Error('AI response did not include product name')
      }

      const name = nameLine.replace('NAME:', '').trim()
      const content = lines
        .slice(lines.indexOf(nameLine) + 1)
        .join('\n')
        .trim()

      return { name, content }
    } catch (error) {
      console.error('AI Service Error:', error)
      throw new Error(
        error instanceof Error
          ? `Failed to structure content: ${error.message}`
          : 'Failed to structure content with AI'
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
