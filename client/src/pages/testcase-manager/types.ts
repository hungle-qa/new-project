import { Compass, ScrollText, Table, BookOpen, FileUp, FileSpreadsheet } from 'lucide-react'
import { StructureNode } from '../../components/testcase/LevelsTab'
import { LinkedKnowledgeEntry } from '../../components/testcase/types'

export interface FeatureConfig {
  name: string
  created: string
  updated: string
  strategy: string
  structure: StructureNode[]
  scope: { happy_case: string; corner_case: string; negative_case: string }
  linked_knowledge: LinkedKnowledgeEntry[]
  components: Array<{ name: string; usage: string }>
  content: string
}

export interface FeatureSummary {
  name: string
  created: string
  updated: string
}

export type TestcaseMode = 'lite' | 'full'

export type TabType = 'strategy' | 'knowledge' | 'components' | 'import-spec' | 'review-export' | 'rules' | 'template' | 'default-rules' | 'default-template'

const liteTabs: TabType[] = ['import-spec', 'review-export']

export function getVisibleTabs(mode: TestcaseMode) {
  return mode === 'lite' ? featureTabs.filter(t => liteTabs.includes(t.id)) : featureTabs
}

export const featureTabs = [
  { id: 'strategy' as TabType, label: 'Strategy', icon: Compass },
  { id: 'rules' as TabType, label: 'Rules', icon: ScrollText },
  { id: 'template' as TabType, label: 'Template', icon: Table },
  { id: 'knowledge' as TabType, label: 'Knowledge', icon: BookOpen },
  { id: 'import-spec' as TabType, label: 'Import Spec', icon: FileUp },
  { id: 'review-export' as TabType, label: 'Review & Export', icon: FileSpreadsheet },
]

export const globalTabs = [
  { id: 'default-rules' as TabType, label: 'Default Rules', icon: ScrollText },
  { id: 'default-template' as TabType, label: 'Default Template', icon: Table },
]

export const PAGE_SIZE = 20
