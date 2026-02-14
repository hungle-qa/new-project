import { useState, useEffect, useRef, useCallback } from 'react'
import { Plus, Trash2, BookOpen, FileUp, FileSpreadsheet, ScrollText, Table, Search, X, ChevronDown, Pencil, Compass, Layers, RefreshCw, Check } from 'lucide-react'
import { CreateFeatureModal } from '../components/testcase/CreateFeatureModal'
import { StrategyTab } from '../components/testcase/StrategyTab'
import { StructureNode } from '../components/testcase/LevelsTab'
import { ComponentsTab } from '../components/testcase/ComponentsTab'
import { KnowledgeSelectTab } from '../components/testcase/KnowledgeSelectTab'
import { ImportSpecTab } from '../components/testcase/ImportSpecTab'
import { ReviewExportTab } from '../components/testcase/ReviewExportTab'
import { RulesTab } from '../components/testcase/RulesTab'
import { TemplateTab } from '../components/testcase/TemplateTab'
import { UnsavedChangesModal } from '../components/UnsavedChangesModal'

export type LinkedKnowledgeEntry = string | { item: string; sections: string[] }

interface FeatureConfig {
  name: string
  created: string
  updated: string
  strategy: string
  structure: StructureNode[]
  scope: { happy_case: string; corner_case: string }
  linked_knowledge: LinkedKnowledgeEntry[]
  components: Array<{ name: string; usage: string }>
  content: string
}

interface FeatureSummary {
  name: string
  created: string
  updated: string
}

type TabType = 'strategy' | 'knowledge' | 'components' | 'import-spec' | 'review-export' | 'rules' | 'template' | 'default-rules' | 'default-template'

const featureTabs = [
  { id: 'strategy' as TabType, label: 'Strategy', icon: Compass },
  { id: 'rules' as TabType, label: 'Rules', icon: ScrollText },
  { id: 'template' as TabType, label: 'Template', icon: Table },
  { id: 'knowledge' as TabType, label: 'Knowledge', icon: BookOpen },
  { id: 'import-spec' as TabType, label: 'Import Spec', icon: FileUp },
  { id: 'review-export' as TabType, label: 'Review & Export', icon: FileSpreadsheet },
]

const globalTabs = [
  { id: 'default-rules' as TabType, label: 'Default Rules', icon: ScrollText },
  { id: 'default-template' as TabType, label: 'Default Template', icon: Table },
]

const PAGE_SIZE = 20

export function TestcaseManagerPage() {
  const [features, setFeatures] = useState<FeatureSummary[]>([])
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null)
  const [config, setConfig] = useState<FeatureConfig | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('strategy')
  const [loading, setLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [digestUpdating, setDigestUpdating] = useState(false)
  const [digestDone, setDigestDone] = useState(false)

  // Unsaved changes guard
  const [isDirty, setIsDirty] = useState(false)
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null)
  const [modalSaving, setModalSaving] = useState(false)
  const saveFnRef = useRef<(() => Promise<void>) | null>(null)

  const handleDirtyChange = useCallback((dirty: boolean) => {
    setIsDirty(dirty)
  }, [])

  const handleSaveRef = useCallback((fn: (() => Promise<void>) | null) => {
    saveFnRef.current = fn
  }, [])

  const guardedNavigate = useCallback((action: () => void) => {
    if (isDirty) {
      setPendingAction(() => action)
    } else {
      action()
    }
  }, [isDirty])

  const handleModalSave = async () => {
    if (saveFnRef.current) {
      setModalSaving(true)
      try {
        await saveFnRef.current()
      } finally {
        setModalSaving(false)
      }
    }
    const action = pendingAction
    setPendingAction(null)
    setIsDirty(false)
    action?.()
  }

  const handleModalDiscard = () => {
    const action = pendingAction
    setPendingAction(null)
    setIsDirty(false)
    action?.()
  }

  const handleModalCancel = () => {
    setPendingAction(null)
  }

  const fetchFeatures = () => {
    setLoading(true)
    fetch('/api/testcase')
      .then(res => res.json())
      .then((data: FeatureSummary[]) => { setFeatures(data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchFeatures() }, [])

  const loadConfig = async (name: string) => {
    const res = await fetch(`/api/testcase/${name}`)
    if (res.ok) {
      const data = await res.json()
      setConfig(data)
    }
  }

  const handleSelectFeature = (name: string) => {
    guardedNavigate(() => {
      setSelectedFeature(name)
      setActiveTab('strategy')
      loadConfig(name)
    })
  }

  const handleCreated = (name: string) => {
    fetchFeatures()
    setSelectedFeature(name)
    setActiveTab('strategy')
    loadConfig(name)
  }

  const handleDelete = async () => {
    if (!selectedFeature) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/testcase/${selectedFeature}`, { method: 'DELETE' })
      if (res.ok) {
        setSelectedFeature(null)
        setConfig(null)
        setIsDeleteConfirmOpen(false)
        setIsDirty(false)
        fetchFeatures()
      }
    } finally {
      setDeleting(false)
    }
  }

  const saveConfig = async (updates: Partial<FeatureConfig>) => {
    if (!selectedFeature) return
    const res = await fetch(`/api/testcase/${selectedFeature}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    if (res.ok) {
      const data = await res.json()
      setConfig(data)
    }
  }

  const handleRename = async () => {
    if (!selectedFeature || !editName.trim()) {
      setIsEditing(false)
      return
    }
    const sanitized = editName.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')
    if (sanitized === selectedFeature) {
      setIsEditing(false)
      return
    }
    const res = await fetch(`/api/testcase/${selectedFeature}/rename`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: sanitized }),
    })
    if (res.ok) {
      const { name: newName } = await res.json()
      setSelectedFeature(newName)
      setIsEditing(false)
      fetchFeatures()
      loadConfig(newName)
    }
  }

  const handleTabChange = (tab: TabType) => {
    guardedNavigate(() => setActiveTab(tab))
  }

  const handleGlobalTab = (tab: TabType) => {
    guardedNavigate(() => {
      setSelectedFeature(null)
      setConfig(null)
      setActiveTab(tab)
    })
  }

  const filteredFeatures = features.filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  const displayedFeatures = showAll ? filteredFeatures : filteredFeatures.slice(0, PAGE_SIZE)
  const hasMore = filteredFeatures.length > PAGE_SIZE && !showAll

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Testcase Manager</h1>
          <button
            onClick={() => handleGlobalTab('default-rules')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors ${
              activeTab === 'default-rules' && !selectedFeature
                ? 'text-blue-600 bg-blue-50 border border-blue-200'
                : 'text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <ScrollText className="w-4 h-4" />
            Default Rules
          </button>
          <button
            onClick={() => handleGlobalTab('default-template')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors ${
              activeTab === 'default-template' && !selectedFeature
                ? 'text-blue-600 bg-blue-50 border border-blue-200'
                : 'text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Table className="w-4 h-4" />
            Default Template
          </button>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{features.length} features</span>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Create Feature
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setShowAll(false) }}
              placeholder="Search features..."
              className="w-full pl-9 pr-8 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setShowAll(false) }}
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
                  onClick={() => handleSelectFeature(name)}
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
                  onClick={() => setShowAll(true)}
                  className="w-full flex items-center justify-center gap-1 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
                >
                  <ChevronDown className="w-4 h-4" />
                  Show all ({filteredFeatures.length - PAGE_SIZE} more)
                </button>
              )}
            </>
          )}
        </div>

        {/* Detail Panel */}
        <div className="lg:col-span-3">
          {selectedFeature && config ? (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={handleRename}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setIsEditing(false) }}
                        autoFocus
                        className="text-lg font-semibold text-gray-900 px-2 py-0.5 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[400px]"
                      />
                    ) : (
                      <button
                        onClick={() => { setEditName(selectedFeature.replace(/-/g, ' ')); setIsEditing(true) }}
                        className="flex items-center gap-2 text-lg font-semibold text-gray-900 hover:text-blue-600 group"
                        title="Click to rename"
                      >
                        {selectedFeature.replace(/-/g, ' ')}
                        <Pencil className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500" />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={async () => {
                        if (!selectedFeature || digestUpdating) return
                        setDigestUpdating(true)
                        setDigestDone(false)
                        try {
                          const res = await fetch(`/api/testcase/${selectedFeature}/context-digest`, { method: 'POST' })
                          if (res.ok) {
                            setDigestDone(true)
                            setTimeout(() => setDigestDone(false), 2000)
                          }
                        } finally {
                          setDigestUpdating(false)
                        }
                      }}
                      disabled={digestUpdating}
                      className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-md transition-colors ${
                        digestDone
                          ? 'text-green-600 bg-green-50 border border-green-200'
                          : 'text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200'
                      } disabled:opacity-50`}
                    >
                      {digestUpdating ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                          Updating...
                        </>
                      ) : digestDone ? (
                        <>
                          <Check className="w-4 h-4" />
                          Updated!
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4" />
                          Update Context
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => setIsDeleteConfirmOpen(true)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 bg-red-50 rounded-md hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200 overflow-x-auto">
                {featureTabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => handleTabChange(id)}
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

              {/* Tab Content */}
              <div className="p-4">
                {activeTab === 'strategy' && (
                  <StrategyTab
                    feature={selectedFeature}
                    strategy={config.strategy || ''}
                    onSave={async (strategy) => saveConfig({ strategy })}
                    onDirtyChange={handleDirtyChange}
                    saveRef={handleSaveRef}
                  />
                )}
                {activeTab === 'knowledge' && (
                  <KnowledgeSelectTab
                    feature={selectedFeature}
                    linkedKnowledge={config.linked_knowledge || []}
                    onSave={async (linked_knowledge) => saveConfig({ linked_knowledge } as Partial<FeatureConfig>)}
                    onDirtyChange={handleDirtyChange}
                    saveRef={handleSaveRef}
                  />
                )}
                {activeTab === 'components' && (
                  <ComponentsTab
                    feature={selectedFeature}
                    components={config.components}
                    onSave={async (components) => saveConfig({ components })}
                    onDirtyChange={handleDirtyChange}
                    saveRef={handleSaveRef}
                  />
                )}
                {activeTab === 'import-spec' && (
                  <ImportSpecTab feature={selectedFeature} />
                )}
                {activeTab === 'rules' && (
                  <RulesTab
                    feature={selectedFeature}
                    onDirtyChange={handleDirtyChange}
                    saveRef={handleSaveRef}
                  />
                )}
                {activeTab === 'template' && (
                  <TemplateTab
                    feature={selectedFeature}
                    structure={config.structure || []}
                    onStructureSave={async (structure) => saveConfig({ structure })}
                    onDirtyChange={handleDirtyChange}
                    saveRef={handleSaveRef}
                  />
                )}
                {activeTab === 'review-export' && (
                  <ReviewExportTab feature={selectedFeature} />
                )}
              </div>
            </div>
          ) : activeTab === 'default-rules' || activeTab === 'default-template' ? (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Tabs (global only) */}
              <div className="flex border-b border-gray-200 overflow-x-auto">
                {globalTabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => handleTabChange(id)}
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
                    onDirtyChange={handleDirtyChange}
                    saveRef={handleSaveRef}
                  />
                )}
                {activeTab === 'default-template' && (
                  <TemplateTab
                    onDirtyChange={handleDirtyChange}
                    saveRef={handleSaveRef}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
              <Layers className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Select a feature to configure testcases</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      <CreateFeatureModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={handleCreated}
      />

      {/* Delete Confirmation */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsDeleteConfirmOpen(false)} />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Feature</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>{selectedFeature}</strong>? This will remove all config, specs, and results. This cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {deleting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Unsaved Changes Modal */}
      <UnsavedChangesModal
        isOpen={pendingAction !== null}
        onSave={handleModalSave}
        onDiscard={handleModalDiscard}
        onCancel={handleModalCancel}
        saving={modalSaving}
      />
    </div>
  )
}
