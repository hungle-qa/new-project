import { StrategyTab } from '../../components/testcase/StrategyTab'
import { KnowledgeSelectTab } from '../../components/testcase/KnowledgeSelectTab'
import { ComponentsTab } from '../../components/testcase/ComponentsTab'
import { ImportSpecTab } from '../../components/testcase/ImportSpecTab'
import { RulesTab } from '../../components/testcase/RulesTab'
import { TemplateTab } from '../../components/testcase/TemplateTab'
import { ReviewExportTab } from '../../components/testcase/ReviewExportTab'
import { CornerCasesTab } from '../../components/testcase/CornerCasesTab'
import { FeatureConfig, TabType, TestcaseMode } from './types'

interface FeatureTabContentProps {
  activeTab: TabType
  feature: string
  config: FeatureConfig
  mode: TestcaseMode
  onSaveConfig: (updates: Partial<FeatureConfig>) => Promise<void>
  onDirtyChange: (dirty: boolean) => void
  onSaveRef: (fn: (() => Promise<void>) | null) => void
}

export function FeatureTabContent({
  activeTab,
  feature,
  config,
  mode,
  onSaveConfig,
  onDirtyChange,
  onSaveRef
}: FeatureTabContentProps) {
  return (
    <div className="p-4">
      {activeTab === 'strategy' && (
        <StrategyTab
          feature={feature}
          strategy={config.strategy || ''}
          onSave={async (strategy) => onSaveConfig({ strategy })}
          onDirtyChange={onDirtyChange}
          saveRef={onSaveRef}
        />
      )}
      {activeTab === 'knowledge' && (
        <KnowledgeSelectTab
          feature={feature}
          linkedKnowledge={config.linked_knowledge || []}
          onSave={async (linked_knowledge) => onSaveConfig({ linked_knowledge } as Partial<FeatureConfig>)}
          onDirtyChange={onDirtyChange}
          saveRef={onSaveRef}
        />
      )}
      {activeTab === 'components' && (
        <ComponentsTab
          feature={feature}
          components={config.components}
          onSave={async (components) => onSaveConfig({ components })}
          onDirtyChange={onDirtyChange}
          saveRef={onSaveRef}
        />
      )}
      {activeTab === 'import-spec' && (
        <ImportSpecTab feature={feature} onDirtyChange={onDirtyChange} saveRef={onSaveRef} />
      )}
      {activeTab === 'rules' && (
        <RulesTab
          feature={feature}
          selectedRule={config.rule || 'test-rules'}
          onRuleChange={async (rule) => onSaveConfig({ rule })}
          onDirtyChange={onDirtyChange}
          saveRef={onSaveRef}
        />
      )}
      {activeTab === 'template' && (
        <TemplateTab
          feature={feature}
          selectedTemplate={config.template || 'template'}
          onTemplateChange={async (template) => onSaveConfig({ template })}
          onDirtyChange={onDirtyChange}
          saveRef={onSaveRef}
        />
      )}
      {activeTab === 'corner-cases' && (
        <CornerCasesTab feature={feature} />
      )}
      {activeTab === 'review-export' && (
        <ReviewExportTab feature={feature} mode={mode} />
      )}
    </div>
  )
}
