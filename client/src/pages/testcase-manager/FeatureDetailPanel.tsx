import { FeatureDetailHeader } from './FeatureDetailHeader'
import { FeatureTabContent } from './FeatureTabContent'
import { FeatureConfig, TabType, featureTabs } from './types'

interface FeatureDetailPanelProps {
  feature: string
  config: FeatureConfig
  activeTab: TabType
  isEditing: boolean
  editName: string
  setEditName: (name: string) => void
  setIsEditing: (editing: boolean) => void
  handleRename: () => Promise<void>
  digestUpdating: boolean
  digestDone: boolean
  digestWarnings: string[]
  showDigestWarnings: boolean
  setDigestUpdating: (updating: boolean) => void
  setDigestDone: (done: boolean) => void
  setDigestWarnings: (warnings: string[]) => void
  setShowDigestWarnings: (show: boolean) => void
  onDelete: () => void
  onTabChange: (tab: TabType) => void
  onSaveConfig: (updates: Partial<FeatureConfig>) => Promise<void>
  onDirtyChange: (dirty: boolean) => void
  onSaveRef: (fn: (() => Promise<void>) | null) => void
}

export function FeatureDetailPanel(props: FeatureDetailPanelProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <FeatureDetailHeader
        feature={props.feature}
        isEditing={props.isEditing}
        editName={props.editName}
        setEditName={props.setEditName}
        setIsEditing={props.setIsEditing}
        handleRename={props.handleRename}
        digestUpdating={props.digestUpdating}
        digestDone={props.digestDone}
        digestWarnings={props.digestWarnings}
        showDigestWarnings={props.showDigestWarnings}
        setDigestUpdating={props.setDigestUpdating}
        setDigestDone={props.setDigestDone}
        setDigestWarnings={props.setDigestWarnings}
        setShowDigestWarnings={props.setShowDigestWarnings}
        onDelete={props.onDelete}
      />

      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {featureTabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => props.onTabChange(id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              props.activeTab === id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <FeatureTabContent
        activeTab={props.activeTab}
        feature={props.feature}
        config={props.config}
        onSaveConfig={props.onSaveConfig}
        onDirtyChange={props.onDirtyChange}
        onSaveRef={props.onSaveRef}
      />
    </div>
  )
}
