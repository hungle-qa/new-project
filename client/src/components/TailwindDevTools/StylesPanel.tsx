import { useMemo } from 'react'
import { HtmlNode } from '../../utils/parseHtmlTree'
import { groupClassesByCategory, CATEGORIES } from '../../utils/tailwindCategories'
import { ClassCategoryGroup } from './ClassCategoryGroup'
import { ClassAutocomplete } from './ClassAutocomplete'

interface StylesPanelProps {
  selectedNode: HtmlNode | null
  allClasses: string[]  // Combined original + added classes
  disabledClasses: Set<string>
  onToggleClass: (className: string) => void
  onRemoveClass: (className: string) => void
  onAddClass: (className: string) => void
}

export function StylesPanel({
  selectedNode,
  allClasses,
  disabledClasses,
  onToggleClass,
  onRemoveClass,
  onAddClass
}: StylesPanelProps) {
  const groupedClasses = useMemo(() => {
    if (!selectedNode || allClasses.length === 0) return {}
    return groupClassesByCategory(allClasses)
  }, [selectedNode, allClasses])

  // Sort categories by predefined order
  const sortedCategories = useMemo(() => {
    const categoryOrder = CATEGORIES.map(c => c.name)
    const categories = Object.keys(groupedClasses)

    return categories.sort((a, b) => {
      const aIndex = categoryOrder.indexOf(a)
      const bIndex = categoryOrder.indexOf(b)
      const aOrder = aIndex === -1 ? 999 : aIndex
      const bOrder = bIndex === -1 ? 999 : bIndex
      return aOrder - bOrder
    })
  }, [groupedClasses])

  if (!selectedNode) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-sm">
        Select an element to edit styles
      </div>
    )
  }

  const attributes = Object.entries(selectedNode.attributes)
    .filter(([key]) => key !== 'class')
    .map(([key, value]) => `${key}="${value}"`)
    .join(' ')

  return (
    <div className="h-full overflow-y-auto">
      {/* Element info header */}
      <div className="p-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">Selected:</span>
          <code className="text-sm font-mono text-purple-600">
            &lt;{selectedNode.tagName}{attributes ? ` ${attributes}` : ''}&gt;
          </code>
        </div>
        {selectedNode.textContent && (
          <p className="mt-1 text-xs text-gray-500 truncate">
            "{selectedNode.textContent}"
          </p>
        )}
      </div>

      {/* Classes section */}
      <div className="p-3">
        {allClasses.length === 0 ? (
          <p className="text-sm text-gray-500 mb-2">No classes on this element</p>
        ) : (
          <div className="space-y-1">
            {sortedCategories.map(category => (
              <ClassCategoryGroup
                key={category}
                category={category}
                classes={groupedClasses[category]}
                disabledClasses={disabledClasses}
                onToggleClass={onToggleClass}
                onRemoveClass={onRemoveClass}
              />
            ))}
          </div>
        )}

        {/* Add class input */}
        <ClassAutocomplete
          existingClasses={allClasses}
          onAddClass={onAddClass}
        />
      </div>
    </div>
  )
}
