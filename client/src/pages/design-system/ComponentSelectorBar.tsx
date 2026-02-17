import { Search, X } from 'lucide-react'

interface ComponentSelectorBarProps {
  components: string[]
  filteredComponents: string[]
  selectedName: string | null
  searchQuery: string
  statusFilter: string
  onSearchChange: (query: string) => void
  onStatusFilterChange: (filter: string) => void
  onSelect: (name: string) => void
}

export function ComponentSelectorBar({
  components,
  filteredComponents,
  selectedName,
  searchQuery,
  statusFilter,
  onSearchChange,
  onStatusFilterChange,
  onSelect,
}: ComponentSelectorBarProps) {
  return (
    <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
      {/* Search Input */}
      <div className="relative flex-shrink-0 w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search components..."
          className="w-full pl-10 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Status Filter */}
      <select
        value={statusFilter}
        onChange={(e) => onStatusFilterChange(e.target.value)}
        className="flex-shrink-0 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
      >
        <option value="all">All Status</option>
        <option value="draft">Draft</option>
        <option value="reviewed">Reviewed</option>
        <option value="approved">Approved</option>
      </select>

      {/* Horizontal Component List */}
      <div className="flex gap-2 overflow-x-auto flex-1 pb-1">
        {filteredComponents.length === 0 ? (
          <span className="text-gray-500 text-sm py-2">
            {components.length === 0 ? 'No components yet' : 'No matching components'}
          </span>
        ) : (
          filteredComponents.map(name => (
            <button
              key={name}
              onClick={() => onSelect(name)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
                selectedName === name
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {name}
            </button>
          ))
        )}
      </div>
    </div>
  )
}
