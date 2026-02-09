import { useState, useRef, useEffect, useCallback, DragEvent } from 'react'
import { Upload, FileText, CheckCircle, AlertCircle, Settings, X, Save } from 'lucide-react'
import { useAISettings } from '../../hooks/useAISettings'
import { AISettingsModal } from '../AISettingsModal'

interface ImportTabProps {
  knowledgeName: string
  sourceFiles: string[]
  savedPrompt: string
  onImported: () => void
  onDirtyChange?: (dirty: boolean) => void
  saveRef?: (saveFn: (() => Promise<void>) | null) => void
}

type UploadState = 'idle' | 'uploading' | 'success' | 'error'

const DEFAULT_KNOWLEDGE_PROMPT = 'Keep the original content exactly as-is. Only convert to clean, well-formatted markdown that is easy to read. Do not summarize, rewrite, or omit any content.'

export function ImportTab({ knowledgeName, sourceFiles, savedPrompt, onImported, onDirtyChange, saveRef }: ImportTabProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [customPrompt, setCustomPrompt] = useState(savedPrompt || DEFAULT_KNOWLEDGE_PROMPT)
  const [uploadState, setUploadState] = useState<UploadState>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [deletingFile, setDeletingFile] = useState<string | null>(null)
  const [savingPrompt, setSavingPrompt] = useState(false)
  const [promptSaved, setPromptSaved] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { settings, isConfigured, refreshSettings } = useAISettings()

  const handleDeleteFile = async (filename: string) => {
    setDeletingFile(filename)
    try {
      const res = await fetch(`/api/feature-knowledge/${knowledgeName}/files/${encodeURIComponent(filename)}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        onImported()
      }
    } finally {
      setDeletingFile(null)
    }
  }

  const promptChanged = customPrompt.trim() !== (savedPrompt || DEFAULT_KNOWLEDGE_PROMPT).trim()

  const handleSavePrompt = useCallback(async () => {
    setSavingPrompt(true)
    setPromptSaved(false)
    try {
      const res = await fetch(`/api/feature-knowledge/${knowledgeName}/prompt`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: customPrompt.trim() }),
      })
      if (res.ok) {
        setPromptSaved(true)
        onImported()
        setTimeout(() => setPromptSaved(false), 2000)
      }
    } finally {
      setSavingPrompt(false)
    }
  }, [customPrompt, knowledgeName, onImported])

  useEffect(() => {
    onDirtyChange?.(promptChanged)
  }, [promptChanged])

  useEffect(() => {
    saveRef?.(promptChanged ? handleSavePrompt : null)
    return () => saveRef?.(null)
  }, [promptChanged, handleSavePrompt])

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

  const handleImport = async () => {
    if (!selectedFile || !isConfigured) return

    setUploadState('uploading')
    setErrorMessage('')

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('prompt', customPrompt.trim())

      const res = await fetch(`/api/feature-knowledge/${knowledgeName}/import`, {
        method: 'POST',
        headers: {
          'X-AI-API-Key': settings.apiKey,
          'X-AI-Model': settings.model,
        },
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to import knowledge')

      setUploadState('success')
      setSelectedFile(null)
      onImported()
    } catch (err) {
      setUploadState('error')
      setErrorMessage(err instanceof Error ? err.message : 'Failed to import knowledge')
    }
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-700">Import Knowledge</h3>
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

        {/* Imported Files */}
        {sourceFiles.length > 0 && (
          <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
            <div className="px-3 py-2 bg-gray-50 rounded-t-lg">
              <span className="text-xs font-medium text-gray-600">{sourceFiles.length} imported file{sourceFiles.length !== 1 ? 's' : ''}</span>
            </div>
            {sourceFiles.map(file => (
              <div key={file} className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-sm text-gray-700">{file}</span>
                </div>
                <button
                  onClick={() => handleDeleteFile(file)}
                  disabled={deletingFile === file}
                  className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded disabled:opacity-50"
                  title="Remove file"
                >
                  {deletingFile === file ? (
                    <div className="w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <X className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            ))}
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
              <p className="text-sm text-gray-600">Drag and drop a file, or click to browse</p>
              <p className="text-xs text-gray-500">PDF, Markdown, or TXT (max 10MB)</p>
            </div>
          )}
        </div>

        {/* Custom Prompt */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="customPrompt" className="text-sm font-medium text-gray-700">
              Custom Prompt (optional)
            </label>
            <div className="flex items-center gap-2">
              {promptSaved && (
                <span className="text-xs text-green-600">Saved</span>
              )}
              {promptChanged && (
                <button
                  onClick={handleSavePrompt}
                  disabled={savingPrompt}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {savingPrompt ? (
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-3 h-3" />
                  )}
                  Save
                </button>
              )}
            </div>
          </div>
          <textarea
            id="customPrompt"
            value={customPrompt}
            onChange={(e) => { setCustomPrompt(e.target.value); setPromptSaved(false) }}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            Tells AI how to process the document. Edit above to customize.
          </p>
        </div>

        {/* Import Button */}
        {selectedFile && (
          <button
            onClick={handleImport}
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
                Import
              </>
            )}
          </button>
        )}

        {uploadState === 'success' && (
          <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">File imported successfully! ({sourceFiles.length} file{sourceFiles.length !== 1 ? 's' : ''} total)</span>
          </div>
        )}

        {uploadState === 'error' && errorMessage && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{errorMessage}</span>
          </div>
        )}
      </div>

      <AISettingsModal
        isOpen={isSettingsOpen}
        onClose={() => { setIsSettingsOpen(false); refreshSettings() }}
      />
    </>
  )
}
