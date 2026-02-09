import { useState, useEffect } from 'react'
import { Plus, Trash2, Layers, Target, BookOpen, Puzzle, FileUp, FileSpreadsheet } from 'lucide-react'
import { CreateFeatureModal } from '../components/review-testcase/CreateFeatureModal'
import { LevelsTab } from '../components/review-testcase/LevelsTab'
import { ScopeTab } from '../components/review-testcase/ScopeTab'
import { ComponentsTab } from '../components/review-testcase/ComponentsTab'
import { KnowledgeFilesTab } from '../components/review-testcase/KnowledgeFilesTab'
import { ImportSpecTab } from '../components/review-testcase/ImportSpecTab'
import { ReviewExportTab } from '../components/review-testcase/ReviewExportTab'

interface FeatureConfig {
  name: string
  created: string
  updated: string
  status: string
  levels: Array<{ level: number; type: string; value?: string; values?: string[] }>
  scope: { happy_case: string; corner_case: string }
  knowledge_files: Array<{ name: string; path: string; imported: string }>
  components: Array<{ name: string; usage: string }>
  content: string
}

type TabType = 'levels' | 'scope' | 'knowledge' | 'components' | 'import-spec' | 'review-export'

const tabs = [
  { id: 'levels' as TabType, label: 'Levels', icon: Layers },
  { id: 'scope' as TabType, label: 'Scope', icon: Target },
  { id: 'knowledge' as TabType, label: 'Knowledge', icon: BookOpen },
  { id: 'components' as TabType, label: 'Components', icon: Puzzle },
  { id: 'import-spec' as TabType, label: 'Import Spec', icon: FileUp },
  { id: 'review-export' as TabType, label: 'Review & Export', icon: FileSpreadsheet },
]

export function ReviewTestcasePage() {
  const [features, setFeatures] = useState<string[]>([])
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null)
  const [config, setConfig] = useState<FeatureConfig | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('levels')
  const [loading, setLoading] = useState(true)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const fetchFeatures = () => {
    setLoading(true)
    fetch('/api/review-testcase')
      .then(res => res.json())
      .then(data => { setFeatures(data); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchFeatures() }, [])

  const loadConfig = async (name: string) => {
    const res = await fetch(`/api/review-testcase/${name}`)
    if (res.ok) {
      const data = await res.json()
      setConfig(data)
    }
  }

  const handleSelectFeature = (name: string) => {
    setSelectedFeature(name)
    setActiveTab('levels')
    loadConfig(name)
  }

  const handleCreated = (name: string) => {
    fetchFeatures()
    handleSelectFeature(name)
  }

  const handleDelete = async () => {
    if (!selectedFeature) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/review-testcase/${selectedFeature}`, { method: 'DELETE' })
      if (res.ok) {
        setSelectedFeature(null)
        setConfig(null)
        setIsDeleteConfirmOpen(false)
        fetchFeatures()
      }
    } finally {
      setDeleting(false)
    }
  }

  const saveConfig = async (updates: Partial<FeatureConfig>) => {
    if (!selectedFeature) return
    const res = await fetch(`/api/review-testcase/${selectedFeature}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    })
    if (res.ok) {
      const data = await res.json()
      setConfig(data)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Review Testcase</h1>
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
          {features.length === 0 ? (
            <p className="text-gray-500 text-center py-8 text-sm">
              No features yet. Click "Create Feature" to start.
            </p>
          ) : (
            features.map(name => (
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
            ))
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
                    <h2 className="text-lg font-semibold text-gray-900">
                      {selectedFeature.replace(/-/g, ' ')}
                    </h2>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                      {config.status}
                    </span>
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
              <div className="flex border-b border-gray-200 overflow-x-auto">
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
                {activeTab === 'levels' && (
                  <LevelsTab
                    feature={selectedFeature}
                    levels={config.levels}
                    onSave={async (levels) => saveConfig({ levels })}
                  />
                )}
                {activeTab === 'scope' && (
                  <ScopeTab
                    feature={selectedFeature}
                    scope={config.scope}
                    onSave={async (scope) => saveConfig({ scope })}
                  />
                )}
                {activeTab === 'knowledge' && (
                  <KnowledgeFilesTab
                    feature={selectedFeature}
                    files={config.knowledge_files}
                    onUploaded={() => loadConfig(selectedFeature)}
                  />
                )}
                {activeTab === 'components' && (
                  <ComponentsTab
                    feature={selectedFeature}
                    components={config.components}
                    onSave={async (components) => saveConfig({ components })}
                  />
                )}
                {activeTab === 'import-spec' && (
                  <ImportSpecTab feature={selectedFeature} />
                )}
                {activeTab === 'review-export' && (
                  <ReviewExportTab feature={selectedFeature} />
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
    </div>
  )
}
