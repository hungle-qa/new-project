import { useState, useRef, DragEvent } from 'react'
import { Upload, FileText, Trash2, AlertCircle } from 'lucide-react'

interface KnowledgeFile {
  name: string
  path: string
  imported: string
}

interface KnowledgeFilesTabProps {
  feature: string
  files: KnowledgeFile[]
  onUploaded: () => void
}

export function KnowledgeFilesTab({ feature, files, onUploaded }: KnowledgeFilesTabProps) {
  const [uploading, setUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setError('File must be less than 10MB')
      return
    }

    setUploading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch(`/api/review-testcase/${feature}/knowledge`, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Upload failed')
      }

      onUploaded()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = async (filename: string) => {
    try {
      const res = await fetch(`/api/review-testcase/${feature}/knowledge/${filename}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        onUploaded()
      }
    } catch {
      setError('Failed to delete file')
    }
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleUpload(file)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleUpload(file)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-gray-700">Knowledge Files</h3>

      {/* Upload Zone */}
      <div
        onDragEnter={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={(e) => { e.preventDefault(); setIsDragging(false) }}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.md,.txt"
          onChange={handleFileChange}
          className="hidden"
        />
        {uploading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-gray-600">Uploading...</span>
          </div>
        ) : (
          <div>
            <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
            <p className="text-sm text-gray-600">Drag and drop or click to upload</p>
            <p className="text-xs text-gray-500">PDF, Markdown, or TXT (max 10MB)</p>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* File List */}
      {files.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">No knowledge files uploaded yet.</p>
      ) : (
        <div className="space-y-2">
          {files.map((file) => (
            <div key={file.name} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">Imported {file.imported}</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(file.name)}
                className="p-1.5 text-red-500 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
