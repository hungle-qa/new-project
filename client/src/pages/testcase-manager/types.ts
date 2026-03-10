import { ScrollText, Table, FileUp, FileSpreadsheet, GraduationCap, Settings } from 'lucide-react'
import { StructureNode } from '../../components/testcase/LevelsTab'
import { LinkedKnowledgeEntry } from '../../components/testcase/types'

export interface FeatureConfig {
  name: string
  created: string
  updated: string
  strategy: string
  rule: string
  template: string
  structure: StructureNode[]
  linked_knowledge: LinkedKnowledgeEntry[]
  components: Array<{ name: string; usage: string }>
  content: string
}

export interface FeatureSummary {
  name: string
  created: string
  updated: string
}

export type TestcaseMode = 'lite' | 'lite-v2' | 'full'

export type TabType = 'strategy' | 'knowledge' | 'components' | 'import-spec' | 'review-export' | 'config' | 'default-rules' | 'default-template' | 'corner-cases' | 'learn'

const liteTabs: TabType[] = ['import-spec', 'review-export']
const liteV2Tabs: TabType[] = ['import-spec', 'config', 'review-export']

export function getVisibleTabs(mode: TestcaseMode) {
  if (mode === 'lite') return featureTabs.filter(t => liteTabs.includes(t.id))
  if (mode === 'lite-v2') return featureTabs.filter(t => liteV2Tabs.includes(t.id))
  return featureTabs
}

export const featureTabs = [
  { id: 'config' as TabType, label: 'Config', icon: Settings },
  { id: 'import-spec' as TabType, label: 'Import Spec', icon: FileUp },
  { id: 'review-export' as TabType, label: 'Review & Export', icon: FileSpreadsheet },
]

export const globalTabs = [
  { id: 'default-rules' as TabType, label: 'Default Rules', icon: ScrollText },
  { id: 'default-template' as TabType, label: 'Default Template', icon: Table },
  { id: 'learn' as TabType, label: 'Learn', icon: GraduationCap },
]

export const PAGE_SIZE = 20
