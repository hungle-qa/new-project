import { useState, useEffect, useCallback } from 'react'
import { FileText, Pencil, Save, X } from 'lucide-react'

interface PreviewTabProps {
  knowledgeName: string
  content: string
  sourceFiles: string[]
  onSaved: () => void
  onDirtyChange?: (dirty: boolean) => void
  saveRef?: (saveFn: (() => Promise<void>) | null) => void
}

export function PreviewTab({ knowledgeName, content, sourceFiles, onSaved, onDirtyChange, saveRef }: PreviewTabProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(content)
  const [saving, setSaving] = useState(false)

  const hasChanges = isEditing && editContent !== content

  const handleEdit = () => {
    setEditContent(content)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditContent(content)
  }

  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/feature-knowledge/${knowledgeName}/content`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent }),
      })
      if (res.ok) {
        setIsEditing(false)
        onSaved()
      }
    } finally {
      setSaving(false)
    }
  }, [editContent, knowledgeName, onSaved])

  useEffect(() => {
    onDirtyChange?.(hasChanges)
  }, [hasChanges])

  useEffect(() => {
    saveRef?.(hasChanges ? handleSave : null)
    return () => saveRef?.(null)
  }, [hasChanges, handleSave])

  if (!content && !isEditing) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No content yet. Import a document in the Import tab.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {sourceFiles.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap text-xs text-gray-500">
            <FileText className="w-3 h-3" />
            <span>Sources:</span>
            {sourceFiles.map(file => (
              <span key={file} className="px-2 py-0.5 bg-gray-100 rounded">{file}</span>
            ))}
          </div>
        )}
        {!sourceFiles.length && <div />}
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleCancel}
                className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
              >
                <X className="w-3 h-3" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1 px-2 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? (
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                Save
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
            >
              <Pencil className="w-3 h-3" />
              Edit
            </button>
          )}
        </div>
      </div>

      {isEditing ? (
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          className="w-full h-[600px] px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
        />
      ) : (
        <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-sm max-h-[600px] whitespace-pre-wrap border border-gray-200">
          {content}
        </pre>
      )}
    </div>
  )
}
