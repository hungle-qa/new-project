import { RulesTab } from '../../components/testcase/RulesTab'
import { TemplateTab } from '../../components/testcase/TemplateTab'
import { TabType, globalTabs } from './types'

interface GlobalTabsPanelProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  onDirtyChange: (dirty: boolean) => void
  onSaveRef: (fn: (() => Promise<void>) | null) => void
}

export function GlobalTabsPanel({
  activeTab,
  onTabChange,
  onDirtyChange,
  onSaveRef
}: GlobalTabsPanelProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Tabs (global only) */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {globalTabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>
      <div className="p-4">
        {activeTab === 'default-rules' && (
          <RulesTab
            onDirtyChange={onDirtyChange}
            saveRef={onSaveRef}
          />
        )}
        {activeTab === 'default-template' && (
          <TemplateTab
            onDirtyChange={onDirtyChange}
            saveRef={onSaveRef}
          />
        )}
      </div>
    </div>
  )
}
