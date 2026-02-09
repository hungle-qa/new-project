import { useState, useEffect } from 'react'
import { Download, FileText, Eye } from 'lucide-react'

interface ReviewExportTabProps {
  feature: string
}

export function ReviewExportTab({ feature }: ReviewExportTabProps) {
  const [csvFiles, setCsvFiles] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [previewFile, setPreviewFile] = useState<string | null>(null)
  const [previewContent, setPreviewContent] = useState<string[][] | null>(null)
  const [loadingPreview, setLoadingPreview] = useState(false)

  useEffect(() => {
    setLoading(true)
    setPreviewFile(null)
    setPreviewContent(null)
    fetch(`/api/review-testcase/${feature}/results`)
      .then(res => res.json())
      .then(data => {
        setCsvFiles(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [feature])

  const handlePreview = async (filename: string) => {
    if (previewFile === filename) {
      setPreviewFile(null)
      setPreviewContent(null)
      return
    }

    setLoadingPreview(true)
    setPreviewFile(filename)

    try {
      const res = await fetch(`/api/review-testcase/${feature}/results/${filename}`)
      const data = await res.json()

      if (data.content) {
        const lines = data.content.split('\n').filter((l: string) => l.trim())
        const rows = lines.slice(0, 100).map((line: string) => {
          // Simple CSV parsing (handles basic cases)
          const result: string[] = []
          let current = ''
          let inQuotes = false
          for (const char of line) {
            if (char === '"') {
              inQuotes = !inQuotes
            } else if (char === ',' && !inQuotes) {
              result.push(current.trim())
              current = ''
            } else {
              current += char
            }
          }
          result.push(current.trim())
          return result
        })
        setPreviewContent(rows)
      }
    } catch {
      setPreviewContent(null)
    } finally {
      setLoadingPreview(false)
    }
  }

  const handleDownload = (filename: string) => {
    window.open(`/api/review-testcase/${feature}/results/${filename}?download=true`, '_blank')
  }

  if (loading) {
    return <div className="text-center py-8 text-gray-500 text-sm">Loading results...</div>
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">Generated Testcase Results</h3>

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
                    className={`flex items-center gap-1 px-2 py-1 text-xs rounded ${
                      previewFile === filename
                        ? 'text-blue-700 bg-blue-100'
                        : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
                    }`}
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
                </div>
              </div>

              {/* CSV Preview Table */}
              {previewFile === filename && (
                <div className="mt-2 border border-gray-200 rounded-lg overflow-auto max-h-96">
                  {loadingPreview ? (
                    <div className="text-center py-4 text-gray-500 text-sm">Loading preview...</div>
                  ) : previewContent && previewContent.length > 0 ? (
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-gray-50">
                          {previewContent[0].map((header, i) => (
                            <th key={i} className="px-3 py-2 text-left font-medium text-gray-700 border-b border-gray-200 whitespace-nowrap">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewContent.slice(1).map((row, ri) => (
                          <tr key={ri} className="hover:bg-gray-50">
                            {row.map((cell, ci) => (
                              <td key={ci} className="px-3 py-1.5 border-b border-gray-100 text-gray-600 max-w-xs truncate">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center py-4 text-gray-500 text-sm">No data in file</div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
