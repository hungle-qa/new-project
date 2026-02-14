import { useState, useEffect } from 'react'
import { Download, FileText, Eye, Trash2, X, Copy, Check } from 'lucide-react'

interface ReviewExportTabProps {
  feature: string
}

const HIDDEN_COLUMNS = ['priority']

function renderMarkdownBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}

function parseCSV(text: string): string[][] {
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

export function ReviewExportTab({ feature }: ReviewExportTabProps) {
  const [csvFiles, setCsvFiles] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [previewFile, setPreviewFile] = useState<string | null>(null)
  const [previewContent, setPreviewContent] = useState<string[][] | null>(null)
  const [loadingPreview, setLoadingPreview] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setLoading(true)
    setPreviewFile(null)
    setPreviewContent(null)
    fetch(`/api/testcase/${feature}/results`)
      .then(res => res.json())
      .then(data => {
        setCsvFiles(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [feature])

  const handlePreview = async (filename: string) => {
    setLoadingPreview(true)
    setPreviewFile(filename)

    try {
      const res = await fetch(`/api/testcase/${feature}/results/${filename}`)
      const data = await res.json()

      if (data.content) {
        const rows = parseCSV(data.content).slice(0, 100)
        setPreviewContent(rows)
      }
    } catch {
      setPreviewContent(null)
    } finally {
      setLoadingPreview(false)
    }
  }

  const handleClosePreview = () => {
    setPreviewFile(null)
    setPreviewContent(null)
  }

  const handleDownload = (filename: string) => {
    window.open(`/api/testcase/${feature}/results/${filename}?download=true`, '_blank')
  }

  const handleDelete = async (filename: string) => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/testcase/${feature}/results/${filename}`, { method: 'DELETE' })
      if (res.ok) {
        setCsvFiles(prev => prev.filter(f => f !== filename))
        if (previewFile === filename) {
          handleClosePreview()
        }
      }
    } catch {
      // ignore
    } finally {
      setDeleting(false)
      setConfirmDelete(null)
    }
  }

  const getVisibleColumns = (headers: string[]): number[] => {
    return headers
      .map((h, i) => ({ header: h, index: i }))
      .filter(({ header }) => !HIDDEN_COLUMNS.includes(header.toLowerCase().trim()))
      .map(({ index }) => index)
  }

  if (loading) {
    return <div className="text-center py-8 text-gray-500 text-sm">Loading results...</div>
  }

  const visibleIndices = previewContent && previewContent.length > 0
    ? getVisibleColumns(previewContent[0])
    : []

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Generated Testcase Results</h3>
        <button
          onClick={() => {
            navigator.clipboard.writeText(`/testcase write ${feature}`)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
          }}
          className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md transition-colors ${
            copied
              ? 'text-green-600 bg-green-50 border border-green-200'
              : 'text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200'
          }`}
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied!' : 'Copy Command'}
        </button>
      </div>

      {csvFiles.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm mb-1">No testcase results yet</p>
          <p className="text-xs text-gray-400">
            Run <code className="bg-gray-100 px-1 py-0.5 rounded">/testcase write {feature}</code> to generate testcases
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {csvFiles.map(filename => (
            <div key={filename}>
              <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <FileText className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-900">{filename}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePreview(filename)}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    <Eye className="w-3 h-3" />
                    Preview
                  </button>
                  <button
                    onClick={() => handleDownload(filename)}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </button>
                  <button
                    onClick={() => setConfirmDelete(filename)}
                    className="flex items-center gap-1 px-2 py-1 text-xs text-red-600 bg-red-50 rounded hover:bg-red-100"
                  >
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </button>
                </div>
              </div>

              {/* Delete Confirmation */}
              {confirmDelete === filename && (
                <div className="flex items-center justify-between px-3 py-2 mt-1 bg-red-50 border border-red-200 rounded-lg">
                  <span className="text-xs text-red-700">Delete this file permanently?</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setConfirmDelete(null)}
                      className="px-2 py-1 text-xs text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDelete(filename)}
                      disabled={deleting}
                      className="px-2 py-1 text-xs text-white bg-red-600 rounded hover:bg-red-700 disabled:opacity-50"
                    >
                      {deleting ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleClosePreview} />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[85vh] flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900">Preview: {previewFile}</h3>
                  {previewContent && previewContent.length > 0 && (
                    <p className="text-xs text-gray-500 mt-0.5">
                      {previewContent.length - 1} rows &middot; {visibleIndices.length} of {previewContent[0].length} columns shown
                    </p>
                  )}
                </div>
                <button
                  onClick={handleClosePreview}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 overflow-auto">
                {loadingPreview ? (
                  <div className="text-center py-8 text-gray-500 text-sm">Loading preview...</div>
                ) : previewContent && previewContent.length > 0 ? (
                  <table className="w-full text-xs">
                    <thead className="sticky top-0 z-10">
                      <tr className="bg-gray-50">
                        {visibleIndices.map(ci => (
                          <th key={ci} className="px-3 py-2 text-left font-medium text-gray-700 border-b border-gray-200 whitespace-normal">
                            {previewContent[0][ci]}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewContent.slice(1).map((row, ri) => (
                        <tr key={ri} className="hover:bg-gray-50 border-b border-gray-100">
                          {visibleIndices.map(ci => (
                            <td
                              key={ci}
                              className="px-3 py-1.5 text-gray-600 whitespace-pre-line max-w-xs"
                              title={row[ci] || ''}
                            >
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
      )}
    </div>
  )
}
