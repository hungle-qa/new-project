import { useState, useEffect, useCallback } from 'react'
import { Save, Eye, Edit3 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

interface RulesTabProps {
  onDirtyChange?: (dirty: boolean) => void
  saveRef?: (saveFn: (() => Promise<void>) | null) => void
}

export function RulesTab({ onDirtyChange, saveRef }: RulesTabProps) {
  const [content, setContent] = useState('')
  const [original, setOriginal] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const hasChanges = content !== original

  useEffect(() => {
    fetch('/api/testcase/rules')
      .then(res => res.json())
      .then(data => {
        setContent(data.content || '')
        setOriginal(data.content || '')
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/testcase/rules', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      if (res.ok) {
        setOriginal(content)
      }
    } finally {
      setSaving(false)
    }
  }, [content])

  useEffect(() => {
    onDirtyChange?.(hasChanges)
  }, [hasChanges])

  useEffect(() => {
    saveRef?.(hasChanges ? handleSave : null)
    return () => saveRef?.(null)
  }, [hasChanges, handleSave])

  if (loading) {
    return <div className="text-center py-8 text-gray-500 text-sm">Loading rules...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-700">Testcase Rules</h3>
          <p className="text-xs text-gray-500 mt-0.5">Edit rules that guide AI testcase generation</p>
        </div>
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
        <div className="prose prose-sm max-w-none border border-gray-200 rounded-lg p-4 max-h-[600px] overflow-auto bg-white">
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
            {content}
          </ReactMarkdown>
        </div>
      ) : (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-[500px] px-4 py-3 text-sm font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
          placeholder="# Testcase Rules&#10;&#10;Write your testcase generation rules in markdown..."
        />
      )}

      {!hasChanges && !saving && (
        <p className="text-xs text-gray-400">No changes to save</p>
      )}
    </div>
  )
}
