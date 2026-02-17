import { Search, X, ChevronDown } from 'lucide-react'
import { PAGE_SIZE } from './types'

interface FeatureSidebarProps {
  features: Array<{ name: string }>
  selectedFeature: string | null
  searchQuery: string
  showAll: boolean
  onSearchChange: (query: string) => void
  onShowAll: () => void
  onSelectFeature: (name: string) => void
}

export function FeatureSidebar({
  features,
  selectedFeature,
  searchQuery,
  showAll,
  onSearchChange,
  onShowAll,
  onSelectFeature,
}: FeatureSidebarProps) {
  const filteredFeatures = features.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const displayedFeatures = showAll ? filteredFeatures : filteredFeatures.slice(0, PAGE_SIZE)
  const hasMore = filteredFeatures.length > PAGE_SIZE && !showAll

  return (
    <div className="lg:col-span-1 space-y-2">
      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search features..."
          className="w-full pl-9 pr-8 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {filteredFeatures.length === 0 ? (
        <p className="text-gray-500 text-center py-8 text-sm">
          {features.length === 0 ? 'No features yet. Click "Create Feature" to start.' : 'No matches found.'}
        </p>
      ) : (
        <>
          {displayedFeatures.map(({ name }) => (
            <button
              key={name}
              onClick={() => onSelectFeature(name)}
              className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                selectedFeature === name
                  ? 'border-blue-300 bg-blue-50 text-blue-900'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <span className="text-sm font-medium">{name.replace(/-/g, ' ')}</span>
            </button>
          ))}
          {hasMore && (
            <button
              onClick={onShowAll}
              className="w-full flex items-center justify-center gap-1 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
            >
              <ChevronDown className="w-4 h-4" />
              Show all ({filteredFeatures.length - PAGE_SIZE} more)
            </button>
          )}
        </>
      )}
    </div>
  )
}
