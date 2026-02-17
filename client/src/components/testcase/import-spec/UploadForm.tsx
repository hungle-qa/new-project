import { DragEvent, RefObject } from 'react'
import { Upload, FileText, AlertCircle, Settings } from 'lucide-react'

interface UploadFormProps {
  selectedFile: File | null
  skipAi: boolean
  isConfigured: boolean
  aiModel: string
  isDragging: boolean
  fileInputRef: RefObject<HTMLInputElement>
  onFileSelect: (file: File) => void
  onDragEnter: (e: DragEvent<HTMLDivElement>) => void
  onDragOver: (e: DragEvent<HTMLDivElement>) => void
  onDragLeave: (e: DragEvent<HTMLDivElement>) => void
  onDrop: (e: DragEvent<HTMLDivElement>) => void
  onSkipAiChange: (skipAi: boolean) => void
  onSettingsClick: () => void
  onUploadClick: () => void
}

export function UploadForm({
  selectedFile,
  skipAi,
  isConfigured,
  aiModel,
  isDragging,
  fileInputRef,
  onFileSelect,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDrop,
  onSkipAiChange,
  onSettingsClick,
  onUploadClick
}: UploadFormProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Import Specification</h3>
        <button
          onClick={onSettingsClick}
          className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded hover:bg-gray-200"
        >
          <Settings className="w-3 h-3" />
          AI Settings
        </button>
      </div>

      {/* Upload Zone */}
      <div
        onDragEnter={onDragEnter}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.md,.txt"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) onFileSelect(f) }}
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

      {/* Import Mode Toggle */}
      <div className="flex items-center gap-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="importMode"
            checked={skipAi}
            onChange={() => onSkipAiChange(true)}
            className="text-blue-600"
          />
          <span className="text-sm text-gray-700">Save original (no AI)</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="radio"
            name="importMode"
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
              <span className="text-sm">Google Gemini connected</span>
            </div>
            <span className="text-xs text-green-600">{aiModel}</span>
          </div>
        )
      )}

      {selectedFile && (
        <button
          onClick={onUploadClick}
          disabled={!skipAi && !isConfigured}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload className="w-4 h-4" />
          {skipAi ? 'Save Original' : 'Import Spec'}
        </button>
      )}
    </div>
  )
}
