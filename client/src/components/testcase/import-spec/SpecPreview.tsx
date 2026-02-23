import { useState, useEffect, useCallback } from 'react'
import { Save, Eye, Edit3 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

interface SpecPreviewProps {
  feature: string
  loading: boolean
  content: string | null
  onContentChange?: (content: string) => void
  onDirtyChange?: (dirty: boolean) => void
  saveRef?: (saveFn: (() => Promise<void>) | null) => void
}

export function SpecPreview({ feature, loading, content, onContentChange, onDirtyChange, saveRef }: SpecPreviewProps) {
  const [editContent, setEditContent] = useState('')
  const [original, setOriginal] = useState('')
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const hasChanges = editContent !== original

  // Sync when content loads or changes externally
  useEffect(() => {
    const val = content || ''
    setEditContent(val)
    setOriginal(val)
    setShowPreview(false)
  }, [content])

  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/testcase/${feature}/spec`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent }),
      })
      if (res.ok) {
        setOriginal(editContent)
        onContentChange?.(editContent)
      }
    } finally {
      setSaving(false)
    }
  }, [editContent, feature, onContentChange])

  useEffect(() => {
    onDirtyChange?.(hasChanges)
  }, [hasChanges])

  useEffect(() => {
    saveRef?.(hasChanges ? handleSave : null)
    return () => saveRef?.(null)
  }, [hasChanges, handleSave])

  if (loading) {
    return <div className="text-center py-4 text-gray-500 text-sm">Loading spec...</div>
  }

  if (!content) {
    return (
      <p className="text-sm text-gray-500 text-center py-4">
        No spec imported yet. Upload a PDF/MD/TXT file above.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">Imported Spec</h4>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-md ${
              showPreview
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {showPreview ? <Edit3 className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {showPreview ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-3 h-3" />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {showPreview ? (
        <div className="prose prose-sm max-w-none border border-gray-200 rounded-lg p-4 max-h-96 overflow-auto bg-white">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              table: ({ children, ...props }) => (
                <table {...props} style={{ tableLayout: 'fixed', width: '100%' }}>{children}</table>
              ),
              td: ({ children, ...props }) => (
                <td {...props} style={{ whiteSpace: 'pre-line', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{children}</td>
              ),
              th: ({ children, ...props }) => (
                <th {...props} style={{ whiteSpace: 'pre-line', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{children}</th>
              ),
            }}
          >
            {editContent}
          </ReactMarkdown>
        </div>
      ) : (
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full h-96 px-4 py-3 text-sm font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y bg-gray-50"
          placeholder="# Feature Spec..."
        />
      )}

      {!hasChanges && !saving && content && (
        <p className="text-xs text-gray-400">No changes to save</p>
      )}
    </div>
  )
}
