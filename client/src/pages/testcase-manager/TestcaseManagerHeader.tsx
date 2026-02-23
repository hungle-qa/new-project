import { Plus, ScrollText, Table } from 'lucide-react'
import { TabType, TestcaseMode } from './types'

interface TestcaseManagerHeaderProps {
  featureCount: number
  activeTab: TabType
  isGlobalTabActive: boolean
  mode: TestcaseMode
  onModeChange: (mode: TestcaseMode) => void
  onGlobalTab: (tab: TabType) => void
  onCreateClick: () => void
}

export function TestcaseManagerHeader({
  featureCount,
  activeTab,
  isGlobalTabActive,
  mode,
  onModeChange,
  onGlobalTab,
  onCreateClick
}: TestcaseManagerHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Testcase Manager</h1>
        <button
          onClick={() => onGlobalTab('default-rules')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors ${
            activeTab === 'default-rules' && isGlobalTabActive
              ? 'text-blue-600 bg-blue-50 border border-blue-200'
              : 'text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <ScrollText className="w-4 h-4" />
          Default Rules
        </button>
        <button
          onClick={() => onGlobalTab('default-template')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors ${
            activeTab === 'default-template' && isGlobalTabActive
              ? 'text-blue-600 bg-blue-50 border border-blue-200'
              : 'text-gray-600 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Table className="w-4 h-4" />
          Default Template
        </button>
        <select
          value={mode}
          onChange={(e) => onModeChange(e.target.value as TestcaseMode)}
          className="px-3 py-1.5 text-sm text-gray-600 border border-gray-200 rounded-md bg-white hover:bg-gray-50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="full">Full</option>
          <option value="lite">Lite</option>
        </select>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">{featureCount} features</span>
        <button
          onClick={onCreateClick}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Create Feature
        </button>
      </div>
    </div>
  )
}
