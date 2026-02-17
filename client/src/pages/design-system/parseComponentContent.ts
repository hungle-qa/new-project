/**
 * Parse component content from markdown to extract HTML, CSS, Tailwind HTML, JavaScript, and description
 */
export interface ParsedComponentContent {
  html: string
  css: string
  tailwindHtml: string
  javascript: string
  description: string
}

/**
 * Extracts HTML, CSS, Tailwind HTML, JavaScript, and description from markdown content
 *
 * @param content - Markdown content with sections for Preview, HTML, CSS, Tailwind CSS, and JavaScript
 * @returns Parsed component content with all extracted code blocks
 */
export function parseComponentContent(content: string | undefined): ParsedComponentContent {
  if (!content) {
    return { html: '', css: '', tailwindHtml: '', javascript: '', description: '' }
  }

  // Extract description from Preview section
  const descMatch = content.match(/## Preview\s*\n([\s\S]*?)(?=\n## |$)/)
  const description = descMatch ? descMatch[1].trim() : ''

  // Extract HTML block (allow content between header and code block)
  const htmlMatch = content.match(/## HTML[\s\S]*?```html\s*([\s\S]*?)```/)
  const html = htmlMatch ? htmlMatch[1].trim() : ''

  // Extract CSS block (allow content between header and code block)
  const cssMatch = content.match(/## CSS[\s\S]*?```css\s*([\s\S]*?)```/)
  const css = cssMatch ? cssMatch[1].trim() : ''

  // Extract Tailwind HTML block (allow content between header and code block)
  const tailwindMatch = content.match(/## Tailwind CSS[\s\S]*?```html\s*([\s\S]*?)```/)
  const tailwindHtml = tailwindMatch ? tailwindMatch[1].trim() : ''

  // Extract JavaScript block (allow content between header and code block)
  const jsMatch = content.match(/## JavaScript[\s\S]*?```javascript\s*([\s\S]*?)```/)
  const javascript = jsMatch ? jsMatch[1].trim() : ''

  return { html, css, tailwindHtml, javascript, description }
}
