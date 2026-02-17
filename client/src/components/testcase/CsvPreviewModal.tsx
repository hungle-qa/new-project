import { useMemo } from 'react'
import { X, Tag, Expand } from 'lucide-react'
import {
  extractUniqueTags,
  expandVariantRows,
  getTagDistribution,
  findColumnIndex,
  renderMarkdownBoldParts,
  HIDDEN_COLUMNS,
  TAG_COLORS,
} from './csvUtils'

interface CsvPreviewModalProps {
  filename: string
  content: string[][]
  loading: boolean
  onClose: () => void
}

export function CsvPreviewModal({ filename, content, loading, onClose }: CsvPreviewModalProps) {
  const headers = content.length > 0 ? content[0] : []

  const visibleIndices = useMemo(() => {
    return headers
      .map((h, i) => ({ header: h, index: i }))
      .filter(({ header }) => !HIDDEN_COLUMNS.includes(header.toLowerCase().trim()))
      .map(({ index }) => index)
  }, [headers])

  const tagColIdx = findColumnIndex(headers, 'Tags')
  const variantColIdx = findColumnIndex(headers, 'Data Variants')
  const stepsColIdx = findColumnIndex(headers, 'Steps')

  const allTags = useMemo(() => {
    if (tagColIdx < 0) return []
    return extractUniqueTags(content, tagColIdx)
  }, [content, tagColIdx])

  const tagDistribution = useMemo(() => {
    if (tagColIdx < 0) return {}
    return getTagDistribution(content, tagColIdx)
  }, [content, tagColIdx])

  const parameterizedCount = useMemo(() => {
    if (variantColIdx < 0) return 0
    return content.slice(1).filter(row => row[variantColIdx]?.trim()).length
  }, [content, variantColIdx])

  // Local filter state
  const { filteredRows, selectedTags, toggleTag, clearTags, expandVariantsOn, toggleExpand } = useTagFilter(content, tagColIdx, variantColIdx, stepsColIdx)

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[85vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Preview: {filename}</h3>
              {content.length > 0 && (
                <p className="text-xs text-gray-500 mt-0.5">
                  {filteredRows.length} of {content.length - 1} rows &middot; {visibleIndices.length} of {headers.length} columns shown
                </p>
              )}
            </div>
            <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Bar */}
          {!loading && content.length > 0 && (allTags.length > 0 || variantColIdx >= 0) && (
            <div className="px-6 py-3 border-b border-gray-200 bg-gray-50 space-y-2">
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span>{filteredRows.length} rows shown</span>
                {parameterizedCount > 0 && <span>{parameterizedCount} parameterized</span>}
                {allTags.length > 0 && (
                  <span className="flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    {Object.entries(tagDistribution).map(([tag, count]) => (
                      <span key={tag} className="text-gray-400">{tag}:{count}</span>
                    ))}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-2 py-0.5 text-xs rounded-full border transition-colors ${
                      selectedTags.has(tag)
                        ? TAG_COLORS[tag] || 'bg-gray-200 text-gray-700 border-gray-400'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
                {selectedTags.size > 0 && (
                  <button onClick={clearTags} className="px-2 py-0.5 text-xs text-gray-400 hover:text-gray-600">
                    Clear
                  </button>
                )}
                {variantColIdx >= 0 && parameterizedCount > 0 && (
                  <button
                    onClick={toggleExpand}
                    className={`ml-auto flex items-center gap-1 px-2 py-0.5 text-xs rounded border transition-colors ${
                      expandVariantsOn
                        ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Expand className="w-3 h-3" />
                    Expand Variants
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Body */}
          <div className="flex-1 overflow-auto">
            {loading ? (
              <div className="text-center py-8 text-gray-500 text-sm">Loading preview...</div>
            ) : content.length > 0 ? (
              <table className="w-full text-xs">
                <thead className="sticky top-0 z-10">
                  <tr className="bg-gray-50">
                    {visibleIndices.map(ci => (
                      <th key={ci} className="px-3 py-2 text-left font-medium text-gray-700 border-b border-gray-200 whitespace-normal">
                        {headers[ci]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.map((row, ri) => (
                    <tr key={ri} className="hover:bg-gray-50 border-b border-gray-100">
                      {visibleIndices.map(ci => (
                        <td key={ci} className="px-3 py-1.5 text-gray-600 whitespace-pre-line max-w-xs" title={row[ci] || ''}>
                          {row[ci] ? renderMarkdownBold(row[ci]) : ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-gray-500 text-sm">No data in file</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function renderMarkdownBold(text: string) {
  const parts = renderMarkdownBoldParts(text)
  return parts.map((part, i) =>
    part.bold ? <strong key={i}>{part.text}</strong> : part.text
  )
}

// Hook for tag filtering and variant expansion
import { useState } from 'react'

function useTagFilter(content: string[][], tagColIdx: number, variantColIdx: number, stepsColIdx: number) {
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set())
  const [expandVariantsOn, setExpandVariantsOn] = useState(false)

  const filteredRows = useMemo(() => {
    if (content.length <= 1) return []
    let dataRows = content.slice(1)

    if (selectedTags.size > 0 && tagColIdx >= 0) {
      dataRows = dataRows.filter(row => {
        const cell = row[tagColIdx]
        if (!cell) return false
        const rowTags = cell.split(',').map(t => t.trim().toLowerCase())
        return Array.from(selectedTags).some(st => rowTags.includes(st))
      })
    }

    if (expandVariantsOn && variantColIdx >= 0) {
      dataRows = expandVariantRows(dataRows, variantColIdx, stepsColIdx)
    }

    return dataRows
  }, [content, selectedTags, expandVariantsOn, tagColIdx, variantColIdx, stepsColIdx])

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      const next = new Set(prev)
      if (next.has(tag)) next.delete(tag)
      else next.add(tag)
      return next
    })
  }

  const clearTags = () => setSelectedTags(new Set())
  const toggleExpand = () => setExpandVariantsOn(v => !v)

  return { filteredRows, selectedTags, toggleTag, clearTags, expandVariantsOn, toggleExpand }
}
