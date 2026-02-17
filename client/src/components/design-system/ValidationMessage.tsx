import { AlertCircle, AlertTriangle } from 'lucide-react'
import { ValidationError } from './utils/validateComponent'

export function ValidationMessage({ error }: { error: ValidationError }) {
  const isError = error.type === 'error'
  return (
    <div
      className={`flex items-start gap-2 p-3 rounded-md text-sm ${
        isError
          ? 'bg-red-50 border border-red-200 text-red-700'
          : 'bg-yellow-50 border border-yellow-200 text-yellow-700'
      }`}
    >
      {isError ? (
        <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
      ) : (
        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
      )}
      <div>
        <span className="font-medium capitalize">{error.field}:</span> {error.message}
      </div>
    </div>
  )
}
