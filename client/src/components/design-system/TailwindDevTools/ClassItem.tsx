import { X } from 'lucide-react'
import { ColorSwatch } from './ColorSwatch'

interface ClassItemProps {
  className: string
  enabled: boolean
  onToggle: () => void
  onRemove: () => void
}

export function ClassItem({ className, enabled, onToggle, onRemove }: ClassItemProps) {
  return (
    <div className="flex items-center gap-2 py-0.5 group">
      <input
        type="checkbox"
        checked={enabled}
        onChange={onToggle}
        className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
      />
      <ColorSwatch className={className} />
      <span
        className={`text-sm font-mono ${enabled ? 'text-gray-800' : 'text-gray-400 line-through'}`}
      >
        {className}
      </span>
      <button
        onClick={onRemove}
        className="opacity-0 group-hover:opacity-100 p-0.5 text-gray-400 hover:text-red-500 transition-opacity"
        title="Remove class"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  )
}
