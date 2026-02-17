import { Plus, Code, Layers, Settings } from 'lucide-react'

type ViewMode = 'components' | 'icons' | 'rules'

interface DesignSystemHeaderProps {
  viewMode: ViewMode
  componentCount: number
  onViewModeChange: (mode: ViewMode) => void
  onImportClick: () => void
}

export function DesignSystemHeader({
  viewMode,
  componentCount,
  onViewModeChange,
  onImportClick
}: DesignSystemHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Design System</h1>
        {/* View Mode Toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onViewModeChange('components')}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'components'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Code className="w-4 h-4" />
            Components
          </button>
          <button
            onClick={() => onViewModeChange('icons')}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'icons'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            Icons
          </button>
          <button
            onClick={() => onViewModeChange('rules')}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              viewMode === 'rules'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            Rules
          </button>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {viewMode === 'components' && (
          <>
            <span className="text-sm text-gray-500">{componentCount} components</span>
            <button
              onClick={onImportClick}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Plus className="w-4 h-4" />
              Import Component
            </button>
          </>
        )}
      </div>
    </div>
  )
}
