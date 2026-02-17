export function renderMarkdownBoldParts(text: string): { text: string; bold: boolean }[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map(part => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return { text: part.slice(2, -2), bold: true }
    }
    return { text: part, bold: false }
  })
}

export function parseCSV(text: string): string[][] {
  const rows: string[][] = []
  let current = ''
  let inQuotes = false
  let row: string[] = []

  for (let i = 0; i < text.length; i++) {
    const char = text[i]
    const next = text[i + 1]

    if (inQuotes) {
      if (char === '"' && next === '"') {
        current += '"'
        i++
      } else if (char === '"') {
        inQuotes = false
      } else {
        current += char
      }
    } else {
      if (char === '"') {
        inQuotes = true
      } else if (char === ',') {
        row.push(current.trim())
        current = ''
      } else if (char === '\n' || (char === '\r' && next === '\n')) {
        row.push(current.trim())
        if (row.some(cell => cell !== '')) rows.push(row)
        row = []
        current = ''
        if (char === '\r') i++
      } else {
        current += char
      }
    }
  }
  row.push(current.trim())
  if (row.some(cell => cell !== '')) rows.push(row)

  return rows
}

export function findColumnIndex(headers: string[], name: string): number {
  return headers.findIndex(h => h.toLowerCase().trim() === name.toLowerCase())
}

export function extractUniqueTags(rows: string[][], tagColIdx: number): string[] {
  const tagSet = new Set<string>()
  for (let i = 1; i < rows.length; i++) {
    const cell = rows[i][tagColIdx]
    if (cell) {
      cell.split(',').forEach(t => {
        const trimmed = t.trim().toLowerCase()
        if (trimmed) tagSet.add(trimmed)
      })
    }
  }
  return Array.from(tagSet).sort()
}

export function expandVariantRows(rows: string[][], variantColIdx: number, stepsColIdx: number): string[][] {
  const expanded: string[][] = []
  for (const row of rows) {
    const variantCell = row[variantColIdx]
    if (!variantCell || !variantCell.trim()) {
      expanded.push(row)
      continue
    }
    const pairs = variantCell.split('|').map(p => p.trim()).filter(Boolean)
    for (const pair of pairs) {
      const newRow = [...row]
      const kvMap: Record<string, string> = {}
      pair.split(',').forEach(kv => {
        const [k, v] = kv.split('=').map(s => s.trim())
        if (k && v !== undefined) kvMap[k] = v
      })
      if (stepsColIdx >= 0 && newRow[stepsColIdx]) {
        let steps = newRow[stepsColIdx]
        for (const [k, v] of Object.entries(kvMap)) {
          steps = steps.replace(new RegExp(`\\{${k}\\}`, 'g'), v)
        }
        newRow[stepsColIdx] = steps
      }
      newRow[variantColIdx] = pair
      expanded.push(newRow)
    }
  }
  return expanded
}

export function getTagDistribution(rows: string[][], tagColIdx: number): Record<string, number> {
  const counts: Record<string, number> = {}
  for (let i = 1; i < rows.length; i++) {
    const cell = rows[i][tagColIdx]
    if (cell) {
      cell.split(',').forEach(t => {
        const trimmed = t.trim().toLowerCase()
        if (trimmed) counts[trimmed] = (counts[trimmed] || 0) + 1
      })
    }
  }
  return counts
}

export const HIDDEN_COLUMNS = ['priority']

export const TAG_COLORS: Record<string, string> = {
  happy: 'bg-green-100 text-green-700 border-green-300',
  corner: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  negative: 'bg-red-100 text-red-700 border-red-300',
  state: 'bg-purple-100 text-purple-700 border-purple-300',
  ui: 'bg-blue-100 text-blue-700 border-blue-300',
  a11y: 'bg-orange-100 text-orange-700 border-orange-300',
  perf: 'bg-cyan-100 text-cyan-700 border-cyan-300',
}
