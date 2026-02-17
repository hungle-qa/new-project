/**
 * PdfBulletParser - Preserves bullet hierarchy when importing PDFs (no-AI path).
 *
 * Uses pdf-parse with a custom pagerender that reads x-positions from
 * getTextContent() to reconstruct indentation and convert bullet chars
 * to markdown syntax.
 */

import { extractTableContent } from './PdfTableParser'

const Y_THRESHOLD = 2
const INDENT_STEP = 18
const BULLET_PATTERN = /^[\u2022\u25CF\u25CB\u25AA\u25AB\u25A0\u25A1\u2023\u2043\u27A2\u2013\u2014\u2015]+\s*/
const NUMBERED_PATTERN = /^(\d+)[.)]\s*/
const DASH_ASTERISK_PATTERN = /^[-*]\s+/

interface TextItem {
  str: string
  width: number
  transform: number[] // [scaleX, skewX, skewY, scaleY, x, y]
}

interface TextContent {
  items: TextItem[]
}

interface PageData {
  getTextContent: () => Promise<TextContent>
}

export interface LineItem {
  x: number
  str: string
  fontSize: number
  width: number
}

export interface LineGroup {
  y: number
  items: LineItem[]
}

function groupIntoLines(items: TextItem[]): LineGroup[] {
  const lines: LineGroup[] = []

  for (const item of items) {
    if (!item.str.trim()) continue
    const x = item.transform[4]
    const y = item.transform[5]
    const fontSize = Math.abs(item.transform[0])
    const width = item.width || (item.str.length * fontSize * 0.5)

    const existing = lines.find(l => Math.abs(l.y - y) <= Y_THRESHOLD)
    if (existing) {
      existing.items.push({ x, str: item.str, fontSize, width })
    } else {
      lines.push({ y, items: [{ x, str: item.str, fontSize, width }] })
    }
  }

  // Sort lines top-to-bottom (higher y = earlier in PDF)
  lines.sort((a, b) => b.y - a.y)
  // Sort items within each line left-to-right
  for (const line of lines) {
    line.items.sort((a, b) => a.x - b.x)
  }

  return lines
}

function detectBaseMargin(lines: LineGroup[]): number {
  const xCounts = new Map<number, number>()
  for (const line of lines) {
    if (line.items.length === 0) continue
    const minX = Math.round(line.items[0].x)
    xCounts.set(minX, (xCounts.get(minX) || 0) + 1)
  }

  let bestX = 0
  let bestCount = 0
  for (const [x, count] of xCounts) {
    if (count > bestCount) {
      bestX = x
      bestCount = count
    }
  }
  return bestX
}

function calcIndentLevel(lineX: number, baseMargin: number): number {
  const offset = lineX - baseMargin
  if (offset <= INDENT_STEP / 2) return 0
  return Math.round(offset / INDENT_STEP)
}

function formatLine(rawText: string, indentLevel: number): string {
  const indent = '  '.repeat(indentLevel)
  let text = rawText

  // Detect and convert bullet characters
  if (BULLET_PATTERN.test(text)) {
    text = text.replace(BULLET_PATTERN, '')
    return `${indent}- ${text.trim()}`
  }

  // Detect numbered patterns
  const numMatch = text.match(NUMBERED_PATTERN)
  if (numMatch) {
    text = text.replace(NUMBERED_PATTERN, '')
    return `${indent}${numMatch[1]}. ${text.trim()}`
  }

  // Detect dash/asterisk bullets
  if (DASH_ASTERISK_PATTERN.test(text)) {
    text = text.replace(DASH_ASTERISK_PATTERN, '')
    return `${indent}- ${text.trim()}`
  }

  // Plain text line
  return `${indent}${text.trim()}`
}

function isBulletLine(line: string): boolean {
  return /^\s*[-*]\s|^\s*\d+\.\s/.test(line)
}

function rejoinBrokenWords(lines: string[]): string[] {
  const result: string[] = []
  for (let i = 0; i < lines.length; i++) {
    const current = lines[i]
    if (
      i > 0 &&
      result.length > 0 &&
      !isBulletLine(current) &&
      current.trim().length > 0
    ) {
      const prev = result[result.length - 1]
      const prevTrimmed = prev.trimEnd()
      const currTrimmed = current.trim()
      // Rejoin if previous line ends lowercase and current starts lowercase
      if (
        prevTrimmed.length > 0 &&
        /[a-z,]$/.test(prevTrimmed) &&
        /^[a-z]/.test(currTrimmed) &&
        !isBulletLine(prev)
      ) {
        result[result.length - 1] = `${prevTrimmed} ${currTrimmed}`
        continue
      }
    }
    result.push(current)
  }
  return result
}

/**
 * Join text items with spaces when there's a significant x-gap between them.
 * PDFs represent word spacing as positional gaps, not space characters.
 * Uses item width (from pdf-parse) or fontSize-based estimate to detect gaps.
 */
function joinItemsWithSpaces(items: LineItem[]): string {
  if (items.length === 0) return ''
  let result = items[0].str
  for (let i = 1; i < items.length; i++) {
    const prev = items[i - 1]
    const curr = items[i]
    // Estimated end-x of previous item
    const prevEndX = prev.x + prev.width
    // Gap between end of previous item and start of current
    const gap = curr.x - prevEndX
    // Space threshold: ~30% of a character width at current font size
    const spaceThreshold = curr.fontSize * 0.15
    if (gap > spaceThreshold) {
      result += ' '
    }
    result += curr.str
  }
  return result
}

async function customPageRender(pageData: PageData): Promise<string> {
  const textContent = await pageData.getTextContent()
  const lines = groupIntoLines(textContent.items)

  if (lines.length === 0) return ''

  const baseMargin = detectBaseMargin(lines)
  const tableResult = extractTableContent(lines, joinItemsWithSpaces)

  const formatted = lines.map((line, i) => {
    // If table parser handled this line, use its output
    if (tableResult?.tableLines.has(i)) {
      return tableResult.tableLines.get(i)!
    }
    // Otherwise use existing bullet/indent flow
    const lineX = line.items[0].x
    const rawText = joinItemsWithSpaces(line.items)
    const indentLevel = calcIndentLevel(lineX, baseMargin)
    return formatLine(rawText, indentLevel)
  })

  // Filter out empty strings from consumed table continuation lines
  const filtered = formatted.filter(l => l !== '')
  return rejoinBrokenWords(filtered).join('\n')
}

export async function parsePdfWithBullets(fileBuffer: Buffer): Promise<string> {
  const pdfParse = await import('pdf-parse')
  const result = await pdfParse.default(fileBuffer, {
    pagerender: customPageRender,
  })
  return result.text
}
