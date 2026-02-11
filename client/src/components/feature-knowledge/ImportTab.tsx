import { useState, useRef, useEffect, useCallback, DragEvent } from 'react'
import { Upload, FileText, CheckCircle, AlertCircle, Settings, X, Save, Square, Globe, RotateCcw } from 'lucide-react'
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

const FALLBACK_PROMPT = 'Keep the original content exactly as-is. Only convert to clean, well-formatted markdown that is easy to read. Do not summarize, rewrite, or omit any content.'

export function ImportTab({ knowledgeName, sourceFiles, savedPrompt, onImported, onDirtyChange, saveRef }: ImportTabProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [defaultPrompt, setDefaultPrompt] = useState('')
  const [customPrompt, setCustomPrompt] = useState('')
  const [promptInitialized, setPromptInitialized] = useState(false)
  const [uploadState, setUploadState] = useState<UploadState>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [deletingFile, setDeletingFile] = useState<string | null>(null)
  const [savingPrompt, setSavingPrompt] = useState(false)
  const [savingDefault, setSavingDefault] = useState(false)
  const [promptSaved, setPromptSaved] = useState(false)
  const [defaultSaved, setDefaultSaved] = useState(false)
  const [lastSavedPrompt, setLastSavedPrompt] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  const { settings, isConfigured, refreshSettings } = useAISettings()

  // Load default prompt on mount, then initialize customPrompt
  useEffect(() => {
    fetch('/api/feature-knowledge/default-prompt')
      .then(res => res.json())
      .then(data => {
        const dp = data.prompt || ''
        setDefaultPrompt(dp)
        // Priority: savedPrompt > defaultPrompt > fallback
        setCustomPrompt(savedPrompt || dp || FALLBACK_PROMPT)
        setPromptInitialized(true)
      })
      .catch(() => {
        setCustomPrompt(savedPrompt || FALLBACK_PROMPT)
        setPromptInitialized(true)
      })
  }, [])

  // Reset prompt when switching knowledge items or when parent provides updated savedPrompt
  const prevNameRef = useRef(knowledgeName)
  const prevSavedPromptRef = useRef(savedPrompt)
  useEffect(() => {
    if (!promptInitialized) return
    const nameChanged = prevNameRef.current !== knowledgeName
    const savedPromptChanged = prevSavedPromptRef.current !== savedPrompt
    prevNameRef.current = knowledgeName
    prevSavedPromptRef.current = savedPrompt

    if (nameChanged) {
      // Switching items: full reset
      setCustomPrompt(savedPrompt || defaultPrompt || FALLBACK_PROMPT)
      setLastSavedPrompt('')
    } else if (savedPromptChanged && !lastSavedPrompt) {
      // Same item but parent re-fetched with new data (async load completed)
      // Only update if user hasn't locally saved
      setCustomPrompt(savedPrompt || defaultPrompt || FALLBACK_PROMPT)
    }
  }, [knowledgeName, savedPrompt])

  const effectiveDefault = defaultPrompt || FALLBACK_PROMPT
  // The actual saved value: lastSavedPrompt (local after save) > savedPrompt (from parent) > effectiveDefault
  const currentSaved = lastSavedPrompt || savedPrompt || effectiveDefault
  // For Save/Save as Default buttons visibility
  const promptChanged = customPrompt.trim() !== currentSaved.trim()
  // For unsaved changes guard: same as promptChanged (tracks per-item save)
  const needsItemSave = promptChanged

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
        setLastSavedPrompt(customPrompt.trim())
        setPromptSaved(true)
        onImported()
        setTimeout(() => setPromptSaved(false), 2000)
      }
    } finally {
      setSavingPrompt(false)
    }
  }, [customPrompt, knowledgeName, onImported])

  const handleSaveAndSetDefault = async () => {
    setSavingDefault(true)
    setDefaultSaved(false)
    try {
      // Save to current item + save as global default in parallel
      const [itemRes, defaultRes] = await Promise.all([
        fetch(`/api/feature-knowledge/${knowledgeName}/prompt`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: customPrompt.trim() }),
        }),
        fetch('/api/feature-knowledge/default-prompt', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: customPrompt.trim() }),
        }),
      ])
      if (itemRes.ok) {
        setLastSavedPrompt(customPrompt.trim())
        onImported()
      }
      if (defaultRes.ok) {
        setDefaultSaved(true)
        setTimeout(() => setDefaultSaved(false), 2000)
      }
    } finally {
      setSavingDefault(false)
    }
  }

  useEffect(() => {
    onDirtyChange?.(needsItemSave)
  }, [needsItemSave])

  useEffect(() => {
    saveRef?.(needsItemSave ? handleSavePrompt : null)
    return () => saveRef?.(null)
  }, [needsItemSave, handleSavePrompt])

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

    const controller = new AbortController()
    abortRef.current = controller

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
        signal: controller.signal,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to import knowledge')

      setUploadState('success')
      setSelectedFile(null)
      onImported()
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setUploadState('idle')
        return
      }
      setUploadState('error')
      setErrorMessage(err instanceof Error ? err.message : 'Failed to import knowledge')
    } finally {
      abortRef.current = null
    }
  }

  const handleStop = () => {
    abortRef.current?.abort()
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
              {defaultSaved && (
                <span className="text-xs text-green-600">Default saved</span>
              )}
              <button
                onClick={() => { setCustomPrompt(effectiveDefault); setPromptSaved(false); setDefaultSaved(false) }}
                disabled={!promptChanged}
                className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-default disabled:hover:bg-transparent"
              >
                <RotateCcw className="w-3 h-3" />
                Use Default
              </button>
              <button
                onClick={handleSavePrompt}
                disabled={!promptChanged || savingPrompt}
                className="flex items-center gap-1 px-2 py-1 text-xs text-white bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-40 disabled:cursor-default"
              >
                {savingPrompt ? (
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save className="w-3 h-3" />
                )}
                Save
              </button>
              <button
                onClick={handleSaveAndSetDefault}
                disabled={!promptChanged || savingDefault}
                className="flex items-center gap-1 px-2 py-1 text-xs text-white bg-green-600 rounded hover:bg-green-700 disabled:opacity-40 disabled:cursor-default"
              >
                {savingDefault ? (
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Globe className="w-3 h-3" />
                )}
                Save & Set Default
              </button>
            </div>
          </div>
          <textarea
            id="customPrompt"
            value={customPrompt}
            onChange={(e) => { setCustomPrompt(e.target.value); setPromptSaved(false); setDefaultSaved(false) }}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            Tells AI how to process the document. Edit above to customize.
          </p>
        </div>

        {/* Import Button */}
        {selectedFile && uploadState !== 'uploading' && (
          <button
            onClick={handleImport}
            disabled={!isConfigured}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="w-4 h-4" />
            Import
          </button>
        )}

        {uploadState === 'uploading' && (
          <div className="flex items-center justify-between px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm text-blue-700">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              Processing with AI...
            </div>
            <button
              onClick={handleStop}
              className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
            >
              <Square className="w-3 h-3" />
              Stop
            </button>
          </div>
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
