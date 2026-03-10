import { useState, useEffect, useRef, useCallback } from 'react'
import { Plus, Brain, FileUp, BookOpen, Eye, Trash2 } from 'lucide-react'
import { useToast } from '../hooks/useToast'
import { CreateKnowledgeModal } from '../components/feature-knowledge/CreateKnowledgeModal'
import { ImportTab } from '../components/feature-knowledge/ImportTab'
import { PreviewTab } from '../components/feature-knowledge/PreviewTab'
import { ContentTab } from '../components/feature-knowledge/ContentTab'
import { DeleteKnowledgeModal } from '../components/feature-knowledge/DeleteKnowledgeModal'
import { UnsavedChangesModal } from '../components/UnsavedChangesModal'
import { KnowledgeSidebar } from '../components/feature-knowledge/KnowledgeSidebar'

interface KnowledgeItem {
  name: string
  created: string
  updated: string
  source_files: string[]
  prompt: string
  content: string
}

type TabType = 'import' | 'content' | 'preview'

const tabs = [
  { id: 'import' as TabType, label: 'Import', icon: FileUp },
  { id: 'content' as TabType, label: 'Content', icon: BookOpen },
  { id: 'preview' as TabType, label: 'Preview', icon: Eye },
]

export function FeatureKnowledgePage() {
  const { showToast } = useToast()
  const [items, setItems] = useState<string[]>([])
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [itemData, setItemData] = useState<KnowledgeItem | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('import')
  const [loading, setLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

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

  const fetchItems = () => {
    setLoading(true)
    fetch('/api/feature-knowledge')
      .then(res => res.json())
      .then(data => { setItems(data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchItems() }, [])

  const loadItemData = async (name: string) => {
    const res = await fetch(`/api/feature-knowledge/${name}`)
    if (res.ok) {
      const data = await res.json()
      setItemData(data)
    }
  }

  const handleSelectItem = (name: string) => {
    guardedNavigate(() => {
      setSelectedItem(name)
      setActiveTab('import')
      loadItemData(name)
    })
  }

  const handleCreated = (name: string) => {
    fetchItems()
    handleSelectItem(name)
  }

  const handleDelete = async () => {
    if (!selectedItem) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/feature-knowledge/${selectedItem}`, { method: 'DELETE' })
      if (res.ok) {
        showToast('Knowledge deleted')
        setSelectedItem(null)
        setItemData(null)
        setIsDeleteConfirmOpen(false)
        setIsDirty(false)
        fetchItems()
      } else {
        showToast('Delete failed', 'error')
      }
    } catch {
      showToast('Delete failed', 'error')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Feature Knowledge</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{items.length} items</span>
          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            Create
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <KnowledgeSidebar
          items={items}
          selectedItem={selectedItem}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onSelectItem={handleSelectItem}
        />

        {/* Detail Panel */}
        <div className="lg:col-span-3">
          {selectedItem && itemData ? (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {selectedItem.replace(/-/g, ' ')}
                    </h2>
                    {itemData.source_files.length > 0 && (
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                        {itemData.source_files.length} file{itemData.source_files.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => setIsDeleteConfirmOpen(true)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 bg-red-50 rounded-md hover:bg-red-100"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-gray-200">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => guardedNavigate(() => setActiveTab(id))}
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
                {activeTab === 'import' && (
                  <ImportTab
                    knowledgeName={selectedItem}
                    sourceFiles={itemData.source_files}
                    savedPrompt={itemData.prompt}
                    onImported={() => loadItemData(selectedItem)}
                    onDirtyChange={handleDirtyChange}
                    saveRef={handleSaveRef}
                  />
                )}
                {activeTab === 'content' && (
                  <ContentTab
                    content={itemData.content}
                    sourceFiles={itemData.source_files}
                  />
                )}
                {activeTab === 'preview' && (
                  <PreviewTab
                    knowledgeName={selectedItem}
                    content={itemData.content}
                    sourceFiles={itemData.source_files}
                    onSaved={() => loadItemData(selectedItem)}
                    onDirtyChange={handleDirtyChange}
                    saveRef={handleSaveRef}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
              <Brain className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Select a knowledge item to view or import</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      <CreateKnowledgeModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={handleCreated}
      />

      {/* Delete Confirmation */}
      {isDeleteConfirmOpen && (
        <DeleteKnowledgeModal
          itemName={selectedItem!}
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
