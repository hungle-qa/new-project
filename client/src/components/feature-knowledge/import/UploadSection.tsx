import { Upload, CheckCircle, AlertCircle, Settings, Square } from 'lucide-react'
import { UploadZone } from './UploadZone'

interface UploadSectionProps {
  selectedFile: File | null
  skipAi: boolean
  isConfigured: boolean
  aiModel: string
  uploadState: 'idle' | 'uploading' | 'success' | 'error'
  errorMessage: string
  isDragging: boolean
  totalFiles: number
  onFileSelect: (file: File) => void
  onDragStateChange: (dragging: boolean) => void
  onSkipAiChange: (skipAi: boolean) => void
  onSettingsClick: () => void
  onUpload: () => void
  onStop: () => void
}

export function UploadSection({
  selectedFile,
  skipAi,
  isConfigured,
  aiModel,
  uploadState,
  errorMessage,
  isDragging,
  totalFiles,
  onFileSelect,
  onDragStateChange,
  onSkipAiChange,
  onSettingsClick,
  onUpload,
  onStop
}: UploadSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Import Knowledge</h3>
        <button
          onClick={onSettingsClick}
          className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
        >
          <Settings className="w-3 h-3" />
          AI Settings
        </button>
      </div>

      {/* Import Mode Toggle */}
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="knowledgeImportMode"
            checked={skipAi}
            onChange={() => onSkipAiChange(true)}
            className="text-blue-600"
          />
          <span className="text-sm text-gray-700">Save original (no AI)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="knowledgeImportMode"
            checked={!skipAi}
            onChange={() => onSkipAiChange(false)}
            className="text-blue-600"
          />
          <span className="text-sm text-gray-700">Process with AI</span>
        </label>
      </div>

      {/* AI Status — only when using AI */}
      {!skipAi && (
        !isConfigured ? (
          <div
            onClick={onSettingsClick}
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
            <span className="text-xs text-green-600">{aiModel}</span>
          </div>
        )
      )}

      {/* Upload Zone */}
      <UploadZone
        selectedFile={selectedFile}
        isDragging={isDragging}
        onFileSelect={onFileSelect}
        onDragStateChange={onDragStateChange}
      />

      {/* Import Button */}
      {selectedFile && uploadState !== 'uploading' && (
        <button
          onClick={onUpload}
          disabled={!skipAi && !isConfigured}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload className="w-4 h-4" />
          {skipAi ? 'Save Original' : 'Import'}
        </button>
      )}

      {uploadState === 'uploading' && (
        <div className="flex items-center justify-between px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            {skipAi ? 'Saving...' : 'Processing with AI...'}
          </div>
          {!skipAi && <button
            onClick={onStop}
            className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
          >
            <Square className="w-3 h-3" />
            Stop
          </button>}
        </div>
      )}

      {uploadState === 'success' && (
        <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
          <CheckCircle className="w-4 h-4" />
          <span className="text-sm">File imported successfully! ({totalFiles} file{totalFiles !== 1 ? 's' : ''} total)</span>
        </div>
      )}

      {uploadState === 'error' && errorMessage && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{errorMessage}</span>
        </div>
      )}
    </div>
  )
}
