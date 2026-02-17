import { FileText, X } from 'lucide-react'

interface ImportedFilesListProps {
  files: string[]
  deletingFile: string | null
  onDeleteFile: (filename: string) => void
}

export function ImportedFilesList({ files, deletingFile, onDeleteFile }: ImportedFilesListProps) {
  if (files.length === 0) return null

  return (
    <div className="border border-gray-200 rounded-lg divide-y divide-gray-100">
      <div className="px-3 py-2 bg-gray-50 rounded-t-lg">
        <span className="text-xs font-medium text-gray-600">{files.length} imported file{files.length !== 1 ? 's' : ''}</span>
      </div>
      {files.map(file => (
        <div key={file} className="flex items-center justify-between px-3 py-2">
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-sm text-gray-700">{file}</span>
          </div>
          <button
            onClick={() => onDeleteFile(file)}
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
  )
}
