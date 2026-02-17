import { CheckCircle, AlertCircle, Square } from 'lucide-react'
import { UploadState } from './importSpecUtils'

interface UploadStatusProps {
  uploadState: UploadState
  skipAi: boolean
  errorMessage: string
  onStop: () => void
}

export function UploadStatus({ uploadState, skipAi, errorMessage, onStop }: UploadStatusProps) {
  if (uploadState === 'uploading') {
    return (
      <div className="flex items-center justify-between px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-2 text-sm text-blue-700">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          {skipAi ? 'Saving...' : 'Processing with AI...'}
        </div>
        {!skipAi && (
          <button
            onClick={onStop}
            className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
          >
            <Square className="w-3 h-3" />
            Stop
          </button>
        )}
      </div>
    )
  }

  if (uploadState === 'success') {
    return (
      <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
        <CheckCircle className="w-4 h-4" />
        <span className="text-sm">Spec imported successfully!</span>
      </div>
    )
  }

  if (uploadState === 'error' && errorMessage) {
    return (
      <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
        <AlertCircle className="w-4 h-4" />
        <span className="text-sm">{errorMessage}</span>
      </div>
    )
  }

  return null
}
