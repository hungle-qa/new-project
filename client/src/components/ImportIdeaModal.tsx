import { useState, useRef, DragEvent } from 'react'
import { X, Upload, FileText, CheckCircle, AlertCircle, Settings } from 'lucide-react'
import { useAISettings } from '../hooks/useAISettings'
import { AISettingsModal } from './AISettingsModal'

interface ImportIdeaModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

type UploadState = 'idle' | 'uploading' | 'success' | 'error'

export function ImportIdeaModal({ isOpen, onClose, onSuccess }: ImportIdeaModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileName, setFileName] = useState('')
  const [uploadState, setUploadState] = useState<UploadState>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { settings, isConfigured, refreshSettings } = useAISettings()

  const resetForm = () => {
    setSelectedFile(null)
    setFileName('')
    setUploadState('idle')
    setErrorMessage('')
    setIsDragging(false)
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  const validateFile = (file: File): string | null => {
    // Check file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      return 'File size must be less than 10MB'
    }

    // Check file type
    const validTypes = ['application/pdf', 'text/markdown']
    const validExtensions = ['.pdf', '.md']
    const hasValidType = validTypes.includes(file.type)
    const hasValidExtension = validExtensions.some(ext => file.name.toLowerCase().endsWith(ext))

    if (!hasValidType && !hasValidExtension) {
      return 'Only PDF and Markdown (.md) files are supported'
    }

    return null
  }

  const handleFileSelect = (file: File) => {
    const error = validateFile(file)
    if (error) {
      setErrorMessage(error)
      setUploadState('error')
      return
    }

    setSelectedFile(file)
    setFileName(file.name.replace(/\.(pdf|md)$/i, ''))
    setErrorMessage('')
    setUploadState('idle')
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    if (!isConfigured) {
      setErrorMessage('Please configure AI settings first')
      setUploadState('error')
      return
    }

    setUploadState('uploading')
    setErrorMessage('')

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const response = await fetch('/api/product-idea/import', {
        method: 'POST',
        headers: {
          'X-AI-API-Key': settings.apiKey,
          'X-AI-Model': settings.model,
          ...(fileName && { 'X-Product-Name': fileName }),
        },
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to import product idea')
      }

      setUploadState('success')
      setTimeout(() => {
        handleClose()
        onSuccess()
      }, 1500)
    } catch (error) {
      setUploadState('error')
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to import product idea'
      )
    }
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
          onClick={uploadState === 'uploading' ? undefined : handleClose}
        />

        {/* Modal */}
        <div className="relative min-h-screen flex items-center justify-center p-4">
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Import Product Idea
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                  title="AI Settings"
                >
                  <Settings className="w-5 h-5" />
                </button>
                <button
                  onClick={handleClose}
                  disabled={uploadState === 'uploading'}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* AI Status Banner */}
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

              {/* File Upload Zone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload File
                </label>
                <div
                  onDragEnter={handleDragEnter}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                    isDragging
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.md"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />

                  {selectedFile ? (
                    <div className="flex items-center justify-center gap-3">
                      <FileText className="w-8 h-8 text-blue-600" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-gray-900">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(selectedFile.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-12 h-12 mx-auto text-gray-400 mb-3" />
                      <p className="text-sm text-gray-600 mb-1">
                        Drag and drop a file here, or click to browse
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF or Markdown files only (max 10MB)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* File Name Input (Optional) */}
              {selectedFile && (
                <div>
                  <label htmlFor="fileName" className="block text-sm font-medium text-gray-700 mb-1">
                    File Name (Optional)
                  </label>
                  <input
                    type="text"
                    id="fileName"
                    value={fileName}
                    onChange={(e) => setFileName(e.target.value)}
                    placeholder="Auto-detected from content"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty to auto-detect from file content
                  </p>
                </div>
              )}

              {/* Upload State Messages */}
              {uploadState === 'uploading' && (
                <div className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700">
                  <div className="w-5 h-5 border-2 border-blue-700 border-t-transparent rounded-full animate-spin" />
                  <div>
                    <p className="text-sm font-medium">Processing file...</p>
                    <p className="text-xs">Using Gemini AI to structure content</p>
                  </div>
                </div>
              )}

              {uploadState === 'success' && (
                <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Import successful!</p>
                    <p className="text-xs">Product idea has been created</p>
                  </div>
                </div>
              )}

              {uploadState === 'error' && errorMessage && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Import failed</p>
                    <p className="text-xs">{errorMessage}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
              <button
                type="button"
                onClick={handleClose}
                disabled={uploadState === 'uploading'}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleUpload}
                disabled={!selectedFile || !isConfigured || uploadState === 'uploading' || uploadState === 'success'}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploadState === 'uploading' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    Import
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Settings Modal */}
      <AISettingsModal
        isOpen={isSettingsOpen}
        onClose={() => {
          setIsSettingsOpen(false)
          refreshSettings()
        }}
      />
    </>
  )
}
