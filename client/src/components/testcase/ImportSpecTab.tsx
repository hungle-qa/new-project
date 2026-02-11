import { useState, useRef, useEffect, DragEvent } from 'react'
import { Upload, FileText, CheckCircle, AlertCircle, Settings, Square, Save, Globe, RotateCcw } from 'lucide-react'
import { useAISettings } from '../../hooks/useAISettings'
import { AISettingsModal } from '../AISettingsModal'

interface ImportSpecTabProps {
  feature: string
}

type UploadState = 'idle' | 'uploading' | 'success' | 'error'

const FALLBACK_SPEC_PROMPT = `You are a senior QA analyst. Convert the following raw content into a structured feature specification document.

**CRITICAL INSTRUCTIONS:**

1. Extract all feature requirements, user flows, and acceptance criteria
2. Organize into clear sections with markdown headers
3. Preserve all technical details, field names, error messages, and business rules
4. Use tables for structured data (fields, validations, etc.)
5. Include edge cases and boundary conditions if mentioned
6. Output ONLY the structured markdown content (no preamble)

**OUTPUT FORMAT:**
# Feature Specification

## Overview
...

## User Flows
...

## Requirements
...

## Acceptance Criteria
...`

export function ImportSpecTab({ feature }: ImportSpecTabProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [defaultPrompt, setDefaultPrompt] = useState('')
  const [savedPrompt, setSavedPrompt] = useState('')
  const [customPrompt, setCustomPrompt] = useState('')
  const [promptInitialized, setPromptInitialized] = useState(false)
  const [uploadState, setUploadState] = useState<UploadState>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [specContent, setSpecContent] = useState<string | null>(null)
  const [loadingSpec, setLoadingSpec] = useState(true)
  const [savingPrompt, setSavingPrompt] = useState(false)
  const [savingDefault, setSavingDefault] = useState(false)
  const [promptSaved, setPromptSaved] = useState(false)
  const [defaultSaved, setDefaultSaved] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  const { settings, isConfigured, refreshSettings } = useAISettings()

  // Load default prompt + per-feature saved prompt on mount
  useEffect(() => {
    Promise.all([
      fetch('/api/testcase/default-prompt').then(r => r.json()).catch(() => ({ prompt: '' })),
      fetch(`/api/testcase/${feature}/spec-prompt`).then(r => r.json()).catch(() => ({ prompt: '' })),
    ]).then(([defaultData, savedData]) => {
      const dp = defaultData.prompt || ''
      const sp = savedData.prompt || ''
      setDefaultPrompt(dp)
      setSavedPrompt(sp)
      // Priority: savedPrompt > defaultPrompt > fallback
      setCustomPrompt(sp || dp || FALLBACK_SPEC_PROMPT)
      setPromptInitialized(true)
    })
  }, [])

  // Update prompt when switching features
  useEffect(() => {
    if (promptInitialized) {
      fetch(`/api/testcase/${feature}/spec-prompt`)
        .then(r => r.json())
        .then(data => {
          const sp = data.prompt || ''
          setSavedPrompt(sp)
          setCustomPrompt(sp || defaultPrompt || FALLBACK_SPEC_PROMPT)
        })
        .catch(() => {
          setSavedPrompt('')
          setCustomPrompt(defaultPrompt || FALLBACK_SPEC_PROMPT)
        })
    }
  }, [feature])

  // Load existing spec on mount / feature change
  useEffect(() => {
    setLoadingSpec(true)
    fetch(`/api/testcase/${feature}/spec`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setSpecContent(data?.content || null)
        setLoadingSpec(false)
      })
      .catch(() => setLoadingSpec(false))
  }, [feature])

  const effectiveDefault = defaultPrompt || FALLBACK_SPEC_PROMPT
  const promptChanged = customPrompt.trim() !== (savedPrompt || effectiveDefault).trim()

  const handleSavePrompt = async () => {
    setSavingPrompt(true)
    setPromptSaved(false)
    try {
      const res = await fetch(`/api/testcase/${feature}/spec-prompt`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: customPrompt.trim() }),
      })
      if (res.ok) {
        setSavedPrompt(customPrompt.trim())
        setPromptSaved(true)
        setTimeout(() => setPromptSaved(false), 2000)
      }
    } finally {
      setSavingPrompt(false)
    }
  }

  const handleSaveAndSetDefault = async () => {
    setSavingDefault(true)
    setDefaultSaved(false)
    try {
      // Save to current feature + save as global default in parallel
      const [itemRes, defaultRes] = await Promise.all([
        fetch(`/api/testcase/${feature}/spec-prompt`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: customPrompt.trim() }),
        }),
        fetch('/api/testcase/default-prompt', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: customPrompt.trim() }),
        }),
      ])
      if (itemRes.ok) {
        setSavedPrompt(customPrompt.trim())
      }
      if (defaultRes.ok) {
        setDefaultSaved(true)
        setTimeout(() => setDefaultSaved(false), 2000)
      }
    } finally {
      setSavingDefault(false)
    }
  }

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

    const controller = new AbortController()
    abortRef.current = controller

    setUploadState('uploading')
    setErrorMessage('')

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      if (customPrompt.trim()) {
        formData.append('prompt', customPrompt.trim())
      }

      const res = await fetch(`/api/testcase/${feature}/import-spec`, {
        method: 'POST',
        headers: {
          'X-AI-API-Key': settings.apiKey,
          'X-AI-Model': settings.model,
        },
        body: formData,
        signal: controller.signal,
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to import spec')

      setUploadState('success')
      setSelectedFile(null)

      // Reload spec content
      const specRes = await fetch(`/api/testcase/${feature}/spec`)
      if (specRes.ok) {
        const specData = await specRes.json()
        setSpecContent(specData.content)
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setUploadState('idle')
        return
      }
      setUploadState('error')
      setErrorMessage(err instanceof Error ? err.message : 'Failed to import spec')
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

        {/* Custom Prompt */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="specPrompt" className="text-sm font-medium text-gray-700">
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
                onClick={() => { setCustomPrompt(savedPrompt || effectiveDefault); setPromptSaved(false); setDefaultSaved(false) }}
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
            id="specPrompt"
            value={customPrompt}
            onChange={(e) => { setCustomPrompt(e.target.value); setPromptSaved(false); setDefaultSaved(false) }}
            rows={6}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            Tells AI how to process the spec document. Edit above to customize.
          </p>
        </div>

        {selectedFile && uploadState !== 'uploading' && (
          <button
            onClick={handleUpload}
            disabled={!isConfigured}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload className="w-4 h-4" />
            Import Spec
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
