/**
 * PdfTableParser - Detects table layouts in PDFs and extracts cells separately.
 *
 * Identifies column boundaries by x-position frequency analysis, then
 * accumulates rows (AC1, AC2, ...) and outputs structured text with
 * GIVEN/WHEN/THEN labels instead of garbled merged columns.
 */

import type { LineItem, LineGroup } from './PdfBulletParser'

/** Columns to skip in output (Figma URLs, notes, noise) */
const SKIP_COLUMNS = new Set(['design', 'note'])

/** Minimum fraction of lines an x-position must appear in to be a column */
const COLUMN_FREQUENCY_THRESHOLD = 0.15

/** Minimum number of columns to qualify as a table */
const MIN_TABLE_COLUMNS = 3

/** X-position tolerance when snapping items to columns (pts) */
const COL_SNAP_TOLERANCE = 8

/** Known header fixes: PDFs sometimes split words across items */
const HEADER_FIXES: Record<string, string> = {
  'GIVE': 'GIVEN',
  'GIVE N': 'GIVEN',
  'GIVEN N': 'GIVEN',
}

export interface TableResult {
  /** Map from line index → formatted table output string */
  tableLines: Map<number, string>
  /** Detected column x-starts */
  colStarts: number[]
}

interface TableRow {
  cells: Map<number, string> // colIndex → accumulated text
}

/**
 * Detect column boundaries by frequency of item x-positions across lines.
 * Returns sorted column x-starts, or null if not enough columns detected.
 */
function detectColumnBoundaries(lines: LineGroup[]): number[] | null {
  // Bucket x-positions (rounded) and count how many lines have items there
  const xLineCounts = new Map<number, Set<number>>()

  for (let i = 0; i < lines.length; i++) {
    for (const item of lines[i].items) {
      const rx = Math.round(item.x)
      if (!xLineCounts.has(rx)) xLineCounts.set(rx, new Set())
      xLineCounts.get(rx)!.add(i)
    }
  }

  const threshold = lines.length * COLUMN_FREQUENCY_THRESHOLD
  const candidates: number[] = []
  for (const [x, lineSet] of xLineCounts) {
    if (lineSet.size >= threshold) candidates.push(x)
  }
  candidates.sort((a, b) => a - b)

  // Merge nearby x-positions (within COL_SNAP_TOLERANCE)
  const merged: number[] = []
  for (const x of candidates) {
    if (merged.length === 0 || x - merged[merged.length - 1] > COL_SNAP_TOLERANCE) {
      merged.push(x)
    }
  }

  return merged.length >= MIN_TABLE_COLUMNS ? merged : null
}

/** Assign an item's x-position to the nearest column index, or -1 */
function getItemColumn(x: number, colStarts: number[]): number {
  for (let i = colStarts.length - 1; i >= 0; i--) {
    if (x >= colStarts[i] - COL_SNAP_TOLERANCE) return i
  }
  return -1
}

/** True if line's items span ≥2 detected columns */
function isTableLine(line: LineGroup, colStarts: number[]): boolean {
  const cols = new Set<number>()
  for (const item of line.items) {
    const col = getItemColumn(item.x, colStarts)
    if (col >= 0) cols.add(col)
  }
  return cols.size >= 2
}

/** Extract header names from the first multi-column header line */
function extractHeaders(
  line: LineGroup,
  colStarts: number[],
  joinFn: (items: LineItem[]) => string,
): string[] {
  const headers: string[] = new Array(colStarts.length).fill('')
  const colItems = new Map<number, LineItem[]>()

  for (const item of line.items) {
    const col = getItemColumn(item.x, colStarts)
    if (col < 0) continue
    if (!colItems.has(col)) colItems.set(col, [])
    colItems.get(col)!.push(item)
  }

  for (const [col, items] of colItems) {
    let text = joinFn(items).trim().toUpperCase()
    if (HEADER_FIXES[text]) text = HEADER_FIXES[text]
    headers[col] = text
  }

  return headers
}

/** Format a single table row into structured text */
function formatRow(
  row: TableRow,
  headers: string[],
  acLabel: string,
): string {
  const parts: string[] = [acLabel]
  for (let col = 1; col < headers.length; col++) {
    const header = headers[col]
    if (SKIP_COLUMNS.has(header.toLowerCase())) continue
    const cellText = row.cells.get(col)?.trim()
    if (!cellText) continue
    parts.push(`  ${header}: ${cellText}`)
  }
  return parts.join('\n')
}

/**
 * Main entry point. Detects table content in grouped PDF lines.
 * Returns null if no table detected (caller falls back to existing flow).
 */
export function extractTableContent(
  lines: LineGroup[],
  joinFn: (items: LineItem[]) => string,
): TableResult | null {
  const colStarts = detectColumnBoundaries(lines)
  if (!colStarts) return null

  const tableLines = new Map<number, string>()
  let headers: string[] = []
  let headersDetected = false
  let currentRow: TableRow | null = null
  let currentAcLabel = ''
  let rowStartIdx = -1

  // Flush accumulated row into tableLines
  const flushRow = () => {
    if (!currentRow || rowStartIdx < 0) return
    const formatted = formatRow(currentRow, headers, currentAcLabel)
    tableLines.set(rowStartIdx, formatted)
    currentRow = null
    rowStartIdx = -1
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    if (!isTableLine(line, colStarts)) continue

    // Group items by column
    const colItems = new Map<number, LineItem[]>()
    for (const item of line.items) {
      const col = getItemColumn(item.x, colStarts)
      if (col < 0) continue
      if (!colItems.has(col)) colItems.set(col, [])
      colItems.get(col)!.push(item)
    }

    const col0Text = colItems.has(0) ? joinFn(colItems.get(0)!).trim() : ''

    // Header detection: first table line where col-0 is "AC" (not "AC1:", etc.)
    if (!headersDetected && /^AC$/i.test(col0Text)) {
      headers = extractHeaders(line, colStarts, joinFn)
      tableLines.set(i, '') // Mark as consumed (empty = skip in output)
      headersDetected = true
      continue
    }

    // New AC row starts when col-0 matches AC\d+ pattern
    if (/^AC\d+/i.test(col0Text)) {
      flushRow()
      currentAcLabel = col0Text.replace(/:?\s*$/, ':')
      // Append any extra text in col-0 after the AC label
      const afterLabel = col0Text.replace(/^AC\d+:?\s*/i, '').trim()
      currentRow = { cells: new Map() }
      rowStartIdx = i

      // Populate cells from this line
      for (const [col, items] of colItems) {
        if (col === 0) {
          if (afterLabel) currentRow.cells.set(col, afterLabel)
        } else {
          currentRow.cells.set(col, joinFn(items).trim())
        }
      }
      continue
    }

    // Continuation line within current row — append text to cells
    if (currentRow) {
      for (const [col, items] of colItems) {
        const text = joinFn(items).trim()
        const existing = currentRow.cells.get(col) || ''
        currentRow.cells.set(col, existing ? `${existing} ${text}` : text)
      }
      tableLines.set(i, '') // consumed by row accumulation
    }
  }

  flushRow()
  return tableLines.size > 0 ? { tableLines, colStarts } : null
}
