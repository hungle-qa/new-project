import { useState, useRef, useEffect, DragEvent } from 'react'
import { Upload, FileText, CheckCircle, AlertCircle, Settings } from 'lucide-react'
import { useAISettings } from '../../hooks/useAISettings'
import { AISettingsModal } from '../AISettingsModal'

interface ImportSpecTabProps {
  feature: string
}

type UploadState = 'idle' | 'uploading' | 'success' | 'error'

export function ImportSpecTab({ feature }: ImportSpecTabProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadState, setUploadState] = useState<UploadState>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [specContent, setSpecContent] = useState<string | null>(null)
  const [loadingSpec, setLoadingSpec] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { settings, isConfigured, refreshSettings } = useAISettings()

  // Load existing spec on mount
  useEffect(() => {
    setLoadingSpec(true)
    fetch(`/api/review-testcase/${feature}/spec`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setSpecContent(data?.content || null)
        setLoadingSpec(false)
      })
      .catch(() => setLoadingSpec(false))
  }, [feature])

  const handleFileSelect = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File must be less than 10MB')
      setUploadState('error')
      return
    }
    setSelectedFile(file)
    setErrorMessage('')
    setUploadState('idle')
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleUpload = async () => {
    if (!selectedFile || !isConfigured) return

    setUploadState('uploading')
    setErrorMessage('')

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const res = await fetch(`/api/review-testcase/${feature}/import-spec`, {
        method: 'POST',
        headers: {
          'X-AI-API-Key': settings.apiKey,
          'X-AI-Model': settings.model,
        },
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to import spec')

      setUploadState('success')
      setSelectedFile(null)

      // Reload spec content
      const specRes = await fetch(`/api/review-testcase/${feature}/spec`)
      if (specRes.ok) {
        const specData = await specRes.json()
        setSpecContent(specData.content)
      }
    } catch (err) {
      setUploadState('error')
      setErrorMessage(err instanceof Error ? err.message : 'Failed to import spec')
    }
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">Import Specification</h3>
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
          >
            <Settings className="w-3 h-3" />
            AI Settings
          </button>
        </div>

        {/* AI Status */}
        {!isConfigured ? (
          <div
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 cursor-pointer hover:bg-yellow-100"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm font-medium">AI not configured</span>
            </div>
            <span className="text-xs underline">Configure now</span>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              <span className="text-sm">Google Gemini connected</span>
            </div>
            <span className="text-xs text-green-600">{settings.model}</span>
          </div>
        )}

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
            onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileSelect(f) }}
            className="hidden"
          />
          {selectedFile ? (
            <div className="flex items-center justify-center gap-3">
              <FileText className="w-8 h-8 text-blue-600" />
              <div className="text-left">
                <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
          ) : (
            <div>
              <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-600">Drag and drop a spec file, or click to browse</p>
              <p className="text-xs text-gray-500">PDF, Markdown, or TXT (max 10MB)</p>
            </div>
          )}
        </div>

        {selectedFile && (
          <button
            onClick={handleUpload}
            disabled={!isConfigured || uploadState === 'uploading'}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploadState === 'uploading' ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Processing with AI...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Import Spec
              </>
            )}
          </button>
        )}

        {uploadState === 'success' && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">Spec imported successfully!</span>
          </div>
        )}

        {uploadState === 'error' && errorMessage && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{errorMessage}</span>
          </div>
        )}

        {/* Spec Preview */}
        {loadingSpec ? (
          <div className="text-center py-4 text-gray-500 text-sm">Loading spec...</div>
        ) : specContent ? (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Imported Spec Preview</h4>
            <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-sm max-h-96 whitespace-pre-wrap border border-gray-200">
              {specContent}
            </pre>
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            No spec imported yet. Upload a PDF/MD/TXT file above.
          </p>
        )}
      </div>

      <AISettingsModal
        isOpen={isSettingsOpen}
        onClose={() => { setIsSettingsOpen(false); refreshSettings() }}
      />
    </>
  )
}
