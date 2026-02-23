import { useState, useEffect, useRef, useCallback } from 'react'
import { Layers } from 'lucide-react'
import { CreateFeatureModal } from '../components/testcase/CreateFeatureModal'
import { UnsavedChangesModal } from '../components/UnsavedChangesModal'
import { FeatureSidebar } from './testcase-manager/FeatureSidebar'
import { DeleteFeatureModal } from './testcase-manager/DeleteFeatureModal'
import { TestcaseManagerHeader } from './testcase-manager/TestcaseManagerHeader'
import { FeatureDetailPanel } from './testcase-manager/FeatureDetailPanel'
import { GlobalTabsPanel } from './testcase-manager/GlobalTabsPanel'
import { FeatureConfig, FeatureSummary, TabType, TestcaseMode, getVisibleTabs } from './testcase-manager/types'

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
  const [digestWarnings, setDigestWarnings] = useState<string[]>([])
  const [showDigestWarnings, setShowDigestWarnings] = useState(false)
  const [mode, setMode] = useState<TestcaseMode>('full')

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

  const firstVisibleTab = () => getVisibleTabs(mode)[0].id

  const handleSelectFeature = (name: string) => {
    guardedNavigate(() => {
      setSelectedFeature(name)
      setActiveTab(firstVisibleTab())
      loadConfig(name)
    })
  }

  const handleCreated = (name: string) => {
    fetchFeatures()
    setSelectedFeature(name)
    setActiveTab(firstVisibleTab())
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

  const handleModeChange = (newMode: TestcaseMode) => {
    setMode(newMode)
    const visible = getVisibleTabs(newMode)
    if (selectedFeature && !visible.some(t => t.id === activeTab)) {
      setActiveTab(visible[0].id)
    }
  }

  const handleGlobalTab = (tab: TabType) => {
    guardedNavigate(() => {
      setSelectedFeature(null)
      setConfig(null)
      setActiveTab(tab)
    })
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div>
      {/* Header */}
      <TestcaseManagerHeader
        featureCount={features.length}
        activeTab={activeTab}
        isGlobalTabActive={!selectedFeature}
        mode={mode}
        onModeChange={handleModeChange}
        onGlobalTab={handleGlobalTab}
        onCreateClick={() => setIsCreateOpen(true)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <FeatureSidebar
          features={features}
          selectedFeature={selectedFeature}
          searchQuery={searchQuery}
          showAll={showAll}
          onSearchChange={(q) => { setSearchQuery(q); setShowAll(false) }}
          onShowAll={() => setShowAll(true)}
          onSelectFeature={handleSelectFeature}
        />

        {/* Detail Panel */}
        <div className="lg:col-span-3">
          {selectedFeature && config ? (
            <FeatureDetailPanel
              feature={selectedFeature}
              config={config}
              activeTab={activeTab}
              mode={mode}
              isEditing={isEditing}
              editName={editName}
              setEditName={setEditName}
              setIsEditing={setIsEditing}
              handleRename={handleRename}
              digestUpdating={digestUpdating}
              digestDone={digestDone}
              digestWarnings={digestWarnings}
              showDigestWarnings={showDigestWarnings}
              setDigestUpdating={setDigestUpdating}
              setDigestDone={setDigestDone}
              setDigestWarnings={setDigestWarnings}
              setShowDigestWarnings={setShowDigestWarnings}
              onDelete={() => setIsDeleteConfirmOpen(true)}
              onTabChange={handleTabChange}
              onSaveConfig={saveConfig}
              onDirtyChange={handleDirtyChange}
              onSaveRef={handleSaveRef}
            />
          ) : activeTab === 'default-rules' || activeTab === 'default-template' ? (
            <GlobalTabsPanel
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onDirtyChange={handleDirtyChange}
              onSaveRef={handleSaveRef}
            />
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
        <DeleteFeatureModal
          feature={selectedFeature!}
          deleting={deleting}
          onDelete={handleDelete}
          onClose={() => setIsDeleteConfirmOpen(false)}
        />
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
