import { useState, useEffect } from 'react'
import { Plus, Trash2, Brain, FileUp, Eye, Search, BookOpen, X } from 'lucide-react'
import { CreateKnowledgeModal } from '../components/feature-knowledge/CreateKnowledgeModal'
import { ImportTab } from '../components/feature-knowledge/ImportTab'
import { PreviewTab } from '../components/feature-knowledge/PreviewTab'
import { ContentTab } from '../components/feature-knowledge/ContentTab'

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
  const [items, setItems] = useState<string[]>([])
  const [selectedItem, setSelectedItem] = useState<string | null>(null)
  const [itemData, setItemData] = useState<KnowledgeItem | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('import')
  const [loading, setLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

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
    setSelectedItem(name)
    setActiveTab('import')
    loadItemData(name)
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
        setSelectedItem(null)
        setItemData(null)
        setIsDeleteConfirmOpen(false)
        fetchItems()
      }
    } finally {
      setDeleting(false)
    }
  }

  const filteredItems = items.filter(name =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  )

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
        <div className="lg:col-span-1 space-y-2">
          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search knowledge..."
              className="w-full pl-9 pr-8 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {filteredItems.length === 0 ? (
            <p className="text-gray-500 text-center py-8 text-sm">
              {items.length === 0 ? 'No knowledge items yet. Click "Create" to start.' : 'No matches found.'}
            </p>
          ) : (
            filteredItems.map(name => (
              <button
                key={name}
                onClick={() => handleSelectItem(name)}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                  selectedItem === name
                    ? 'border-blue-300 bg-blue-50 text-blue-900'
                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <span className="text-sm font-medium">{name.replace(/-/g, ' ')}</span>
              </button>
            ))
          )}
        </div>

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
                    onClick={() => setActiveTab(id)}
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
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsDeleteConfirmOpen(false)} />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Knowledge Item</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>{selectedItem}</strong>? This will remove the config and source files. This cannot be undone.
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
    </div>
  )
}
