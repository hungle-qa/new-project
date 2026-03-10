import { useState, useRef, useEffect, useCallback } from 'react'
import { useToast } from '../../hooks/useToast'
import { useAISettings } from '../../hooks/useAISettings'
import { AISettingsModal } from '../AISettingsModal'
import { PromptEditor } from './import/PromptEditor'
import { UploadSection } from './import/UploadSection'
import { ImportedFilesList } from './import/ImportedFilesList'
import { FALLBACK_PROMPT } from './import/importUtils'

interface ImportTabProps {
  knowledgeName: string
  sourceFiles: string[]
  savedPrompt: string
  onImported: () => void
  onDirtyChange?: (dirty: boolean) => void
  saveRef?: (saveFn: (() => Promise<void>) | null) => void
}

type UploadState = 'idle' | 'uploading' | 'success' | 'error'

export function ImportTab({ knowledgeName, sourceFiles, savedPrompt, onImported, onDirtyChange, saveRef }: ImportTabProps) {
  const { showToast } = useToast()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [skipAi, setSkipAi] = useState(true)
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
        showToast('Prompt saved')
        setTimeout(() => setPromptSaved(false), 2000)
      } else {
        showToast('Save failed', 'error')
      }
    } catch {
      showToast('Save failed', 'error')
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
        showToast('Saved as default')
        setTimeout(() => setDefaultSaved(false), 2000)
      }
      if (!itemRes.ok || !defaultRes.ok) {
        showToast('Save failed', 'error')
      }
    } catch {
      showToast('Save failed', 'error')
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

  const handleImport = async () => {
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
      } else {
        formData.append('prompt', customPrompt.trim())
      }

      const headers: Record<string, string> = {}
      if (!skipAi) {
        headers['X-AI-API-Key'] = settings.apiKey
        headers['X-AI-Model'] = settings.model
      }

      const res = await fetch(`/api/feature-knowledge/${knowledgeName}/import`, {
        method: 'POST',
        headers,
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
        {/* Imported Files */}
        {sourceFiles.length > 0 && (
          <ImportedFilesList
            files={sourceFiles}
            deletingFile={deletingFile}
            onDeleteFile={handleDeleteFile}
          />
        )}

        {/* Upload Section */}
        <UploadSection
          selectedFile={selectedFile}
          skipAi={skipAi}
          isConfigured={isConfigured}
          aiModel={settings.model}
          uploadState={uploadState}
          errorMessage={errorMessage}
          isDragging={isDragging}
          totalFiles={sourceFiles.length}
          onFileSelect={handleFileSelect}
          onDragStateChange={setIsDragging}
          onSkipAiChange={setSkipAi}
          onSettingsClick={() => setIsSettingsOpen(true)}
          onUpload={handleImport}
          onStop={handleStop}
        />

        {/* Custom Prompt — only when using AI */}
        {!skipAi && (
          <PromptEditor
            customPrompt={customPrompt}
            onPromptChange={(value) => {
              setCustomPrompt(value)
              setPromptSaved(false)
              setDefaultSaved(false)
            }}
            promptChanged={promptChanged}
            effectiveDefault={effectiveDefault}
            onSavePrompt={handleSavePrompt}
            onSaveAndSetDefault={handleSaveAndSetDefault}
            savingPrompt={savingPrompt}
            savingDefault={savingDefault}
            promptSaved={promptSaved}
            defaultSaved={defaultSaved}
          />
        )}
      </div>

      <AISettingsModal
        isOpen={isSettingsOpen}
        onClose={() => { setIsSettingsOpen(false); refreshSettings() }}
      />
    </>
  )
}
