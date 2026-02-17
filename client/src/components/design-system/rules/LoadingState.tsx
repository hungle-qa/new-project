import { AlertCircle } from 'lucide-react'

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

interface ErrorStateProps {
  error: string
  onRetry: () => void
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
      <div className="flex items-center gap-3">
        <AlertCircle className="w-5 h-5 text-red-600" />
        <div>
          <h3 className="font-semibold text-red-900">Error Loading Rules</h3>
          <p className="text-sm text-red-700 mt-1">{error}</p>
        </div>
      </div>
      <button
        onClick={onRetry}
        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium"
      >
        Retry
      </button>
    </div>
  )
}
