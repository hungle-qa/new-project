import { useState, useEffect } from 'react'
import { Download, FileText, Eye, Trash2, Copy, Check } from 'lucide-react'
import { parseCSV } from './csvUtils'
import { CsvPreviewModal } from './CsvPreviewModal'

interface ReviewExportTabProps {
  feature: string
}

export function ReviewExportTab({ feature }: ReviewExportTabProps) {
  const [csvFiles, setCsvFiles] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [previewFile, setPreviewFile] = useState<string | null>(null)
  const [previewContent, setPreviewContent] = useState<string[][] | null>(null)
  const [loadingPreview, setLoadingPreview] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [copiedCmd, setCopiedCmd] = useState<'write' | 'write-lite' | null>(null)

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

  if (loading) {
    return <div className="text-center py-8 text-gray-500 text-sm">Loading results...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Generated Testcase Results</h3>
        <div className="flex items-center gap-1.5">
          {(['write', 'write-lite'] as const).map(cmd => {
            const isCopied = copiedCmd === cmd
            const label = cmd === 'write' ? 'Full' : 'Lite'
            return (
              <button
                key={cmd}
                onClick={() => {
                  navigator.clipboard.writeText(`/testcase ${cmd} ${feature}`)
                  setCopiedCmd(cmd)
                  setTimeout(() => setCopiedCmd(null), 2000)
                }}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs rounded-md transition-colors ${
                  isCopied
                    ? 'text-green-600 bg-green-50 border border-green-200'
                    : 'text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200'
                }`}
              >
                {isCopied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {isCopied ? 'Copied!' : `Copy: ${cmd} (${label})`}
              </button>
            )
          })}
        </div>
      </div>

      {csvFiles.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm mb-1">No testcase results yet</p>
          <p className="text-xs text-gray-400">
            Run <code className="bg-gray-100 px-1 py-0.5 rounded">/testcase write {feature}</code> (full) or <code className="bg-gray-100 px-1 py-0.5 rounded">/testcase write-lite {feature}</code> (lite) to generate
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
                  {filename.includes('-lite-') ? (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-700 border border-amber-300">Lite</span>
                  ) : (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-700 border border-blue-300">Full</span>
                  )}
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

      {previewFile && previewContent && (
        <CsvPreviewModal
          filename={previewFile}
          content={previewContent}
          loading={loadingPreview}
          onClose={handleClosePreview}
        />
      )}
    </div>
  )
}
