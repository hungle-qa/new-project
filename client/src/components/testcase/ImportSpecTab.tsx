import { useState, useRef, useEffect, DragEvent } from 'react'
import { useAISettings } from '../../hooks/useAISettings'
import { AISettingsModal } from '../AISettingsModal'
import { PromptEditor } from './import-spec/PromptEditor'
import { UploadStatus } from './import-spec/UploadStatus'
import { SpecPreview } from './import-spec/SpecPreview'
import { UploadForm } from './import-spec/UploadForm'
import { FALLBACK_SPEC_PROMPT, UploadState } from './import-spec/importSpecUtils'

interface ImportSpecTabProps {
  feature: string
}

export function ImportSpecTab({ feature }: ImportSpecTabProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [skipAi, setSkipAi] = useState(true)
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

  const handlePromptChange = (value: string) => {
    setCustomPrompt(value)
    setPromptSaved(false)
    setDefaultSaved(false)
  }

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
    if (!selectedFile || (!skipAi && !isConfigured)) return

    const controller = new AbortController()
    abortRef.current = controller

    setUploadState('uploading')
    setErrorMessage('')

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      if (skipAi) {
        formData.append('skipAi', 'true')
      } else if (customPrompt.trim()) {
        formData.append('prompt', customPrompt.trim())
      }

      const headers: Record<string, string> = {}
      if (!skipAi) {
        headers['X-AI-API-Key'] = settings.apiKey
        headers['X-AI-Model'] = settings.model
      }

      const res = await fetch(`/api/testcase/${feature}/import-spec`, {
        method: 'POST',
        headers,
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
        {/* Upload Form */}
        <UploadForm
          selectedFile={selectedFile}
          skipAi={skipAi}
          isConfigured={isConfigured}
          aiModel={settings.model}
          isDragging={isDragging}
          fileInputRef={fileInputRef}
          onFileSelect={handleFileSelect}
          onDragEnter={(e) => { e.preventDefault(); setIsDragging(true) }}
          onDragOver={(e) => e.preventDefault()}
          onDragLeave={(e) => { e.preventDefault(); setIsDragging(false) }}
          onDrop={handleDrop}
          onSkipAiChange={setSkipAi}
          onSettingsClick={() => setIsSettingsOpen(true)}
          onUploadClick={handleUpload}
        />

        {/* Custom Prompt — only when using AI */}
        {!skipAi && uploadState !== 'uploading' && (
          <PromptEditor
            customPrompt={customPrompt}
            onPromptChange={handlePromptChange}
            promptChanged={promptChanged}
            effectiveDefault={effectiveDefault}
            savedPrompt={savedPrompt}
            onSavePrompt={handleSavePrompt}
            onSaveAndSetDefault={handleSaveAndSetDefault}
            savingPrompt={savingPrompt}
            savingDefault={savingDefault}
            promptSaved={promptSaved}
            defaultSaved={defaultSaved}
          />
        )}

        <UploadStatus
          uploadState={uploadState}
          skipAi={skipAi}
          errorMessage={errorMessage}
          onStop={handleStop}
        />

        <SpecPreview
          loading={loadingSpec}
          content={specContent}
        />
      </div>

      <AISettingsModal
        isOpen={isSettingsOpen}
        onClose={() => { setIsSettingsOpen(false); refreshSettings() }}
      />
    </>
  )
}
