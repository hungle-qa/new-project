import { useRef, DragEvent } from 'react'
import { Upload, FileText } from 'lucide-react'

interface UploadZoneProps {
  selectedFile: File | null
  isDragging: boolean
  onFileSelect: (file: File) => void
  onDragStateChange: (dragging: boolean) => void
}

export function UploadZone({ selectedFile, isDragging, onFileSelect, onDragStateChange }: UploadZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    onDragStateChange(false)
    const file = e.dataTransfer.files[0]
    if (file) onFileSelect(file)
  }

  return (
    <div
      onDragEnter={(e) => { e.preventDefault(); onDragStateChange(true) }}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={(e) => { e.preventDefault(); onDragStateChange(false) }}
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
          <p className="text-sm text-gray-600">Drag and drop a file, or click to browse</p>
          <p className="text-xs text-gray-500">PDF, Markdown, or TXT (max 10MB)</p>
        </div>
      )}
    </div>
  )
}
