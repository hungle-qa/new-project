import { Search, X } from 'lucide-react'

interface KnowledgeSidebarProps {
  items: string[]
  selectedItem: string | null
  searchQuery: string
  onSearchChange: (query: string) => void
  onSelectItem: (name: string) => void
}

export function KnowledgeSidebar({
  items,
  selectedItem,
  searchQuery,
  onSearchChange,
  onSelectItem,
}: KnowledgeSidebarProps) {
  const filteredItems = items.filter(name =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="lg:col-span-1 space-y-2">
      {/* Search */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search knowledge..."
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

      {filteredItems.length === 0 ? (
        <p className="text-gray-500 text-center py-8 text-sm">
          {items.length === 0 ? 'No knowledge items yet. Click "Create" to start.' : 'No matches found.'}
        </p>
      ) : (
        filteredItems.map(name => (
          <button
            key={name}
            onClick={() => onSelectItem(name)}
            className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
              selectedItem === name
                ? 'border-blue-300 bg-blue-50 text-blue-900'
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-sm'
            }`}
          >
            <span className="text-sm font-medium">{name.replace(/-/g, ' ')}</span>
          </button>
        ))
      )}
    </div>
  )
}
