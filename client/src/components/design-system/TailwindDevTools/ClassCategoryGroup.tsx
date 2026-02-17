import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { ClassItem } from './ClassItem'
import { getCategoryLabel } from '../utils/tailwindCategories'

interface ClassCategoryGroupProps {
  category: string
  classes: string[]
  disabledClasses: Set<string>
  onToggleClass: (className: string) => void
  onRemoveClass: (className: string) => void
}

export function ClassCategoryGroup({
  category,
  classes,
  disabledClasses,
  onToggleClass,
  onRemoveClass
}: ClassCategoryGroupProps) {
  const [expanded, setExpanded] = useState(true)
  const label = getCategoryLabel(category)

  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 w-full py-2 px-1 text-left hover:bg-gray-50 transition-colors"
      >
        {expanded ? (
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        ) : (
          <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        )}
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
          {label}
        </span>
        <span className="text-xs text-gray-400 ml-1">({classes.length})</span>
      </button>

      {expanded && (
        <div className="pl-5 pb-2 space-y-0.5">
          {classes.map(cls => (
            <ClassItem
              key={cls}
              className={cls}
              enabled={!disabledClasses.has(cls)}
              onToggle={() => onToggleClass(cls)}
              onRemove={() => onRemoveClass(cls)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
