import { ChevronDown, ChevronUp, X } from 'lucide-react'
import { ParsedHeading } from './KnowledgeSelectHelpers'

interface KnowledgeSelectedItemProps {
  name: string
  badge: string | null
  isExpanded: boolean
  headings: ParsedHeading[] | undefined
  isLoadingThis: boolean
  onToggle: () => void
  onExpand: () => void
  onRemove: () => void
  isSectionSelected: (heading: string) => boolean
  onSectionToggle: (heading: string) => void
}

export function KnowledgeSelectedItem({
  name,
  badge,
  isExpanded,
  headings,
  isLoadingThis,
  onToggle,
  onExpand,
  onRemove,
  isSectionSelected,
  onSectionToggle,
}: KnowledgeSelectedItemProps) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg overflow-hidden">
      <div className="flex items-center justify-between p-2">
        <label className="flex items-center gap-2 cursor-pointer flex-1">
          <input
            type="checkbox"
            checked
            onChange={onToggle}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-blue-900">{name.replace(/-/g, ' ')}</span>
          {badge && (
            <span className="text-xs text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
              {badge}
            </span>
          )}
        </label>
        <div className="flex items-center gap-1">
          <button
            onClick={onExpand}
            className="p-1 text-blue-400 hover:text-blue-600 rounded"
            title="Select sections"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          <button
            onClick={onRemove}
            className="p-1 text-blue-400 hover:text-blue-600 rounded"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Expandable section checkboxes */}
      {isExpanded && (
        <div className="border-t border-blue-200 px-3 py-2 bg-white">
          {isLoadingThis ? (
            <div className="text-xs text-gray-400 py-1">Loading sections...</div>
          ) : headings && headings.length > 0 ? (
            <div className="space-y-1">
              {headings.map(h => (
                <label key={h.heading} className="flex items-center gap-2 cursor-pointer py-0.5">
                  <input
                    type="checkbox"
                    checked={isSectionSelected(h.heading)}
                    onChange={() => onSectionToggle(h.heading)}
                    className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-xs text-gray-700">{h.title}</span>
                </label>
              ))}
            </div>
          ) : (
            <div className="text-xs text-gray-400 py-1">No sections found</div>
          )}
        </div>
      )}
    </div>
  )
}
