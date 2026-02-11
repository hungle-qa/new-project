import { useState, useEffect, useCallback } from 'react'
import { Search, X, Save } from 'lucide-react'

interface KnowledgeSelectTabProps {
  feature: string
  linkedKnowledge: string[]
  onSave: (linkedKnowledge: string[]) => Promise<void>
  onDirtyChange?: (dirty: boolean) => void
  saveRef?: (saveFn: (() => Promise<void>) | null) => void
}

export function KnowledgeSelectTab({ feature, linkedKnowledge, onSave, onDirtyChange, saveRef }: KnowledgeSelectTabProps) {
  const [allItems, setAllItems] = useState<string[]>([])
  const [selected, setSelected] = useState<string[]>(linkedKnowledge || [])
  const [searchQuery, setSearchQuery] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  const hasChanges = JSON.stringify([...selected].sort()) !== JSON.stringify([...(linkedKnowledge || [])].sort())

  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      await onSave(selected)
    } finally {
      setSaving(false)
    }
  }, [selected, onSave])

  useEffect(() => {
    onDirtyChange?.(hasChanges)
  }, [hasChanges])

  useEffect(() => {
    saveRef?.(hasChanges ? handleSave : null)
    return () => saveRef?.(null)
  }, [hasChanges, handleSave])

  useEffect(() => {
    fetch('/api/feature-knowledge')
      .then(res => res.json())
      .then(data => { setAllItems(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    setSelected(linkedKnowledge || [])
  }, [feature, linkedKnowledge])

  const handleToggle = (name: string) => {
    setSelected(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    )
  }

  const handleRemove = (name: string) => {
    setSelected(prev => prev.filter(n => n !== name))
  }

  const filteredItems = allItems.filter(name =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedItems = filteredItems.filter(name => selected.includes(name))
  const availableItems = filteredItems.filter(name => !selected.includes(name))

  if (loading) {
    return <div className="text-center py-4 text-gray-500 text-sm">Loading knowledge items...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Knowledge</h3>
        <button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-3 h-3" />
              Save
            </>
          )}
        </button>
      </div>

      {/* Search */}
      <div className="relative">
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

      {allItems.length === 0 ? (
        <p className="text-sm text-gray-500 text-center py-4">
          No knowledge items available. Create some in the Feature Knowledge page first.
        </p>
      ) : (
        <div className="space-y-3">
          {/* Selected items */}
          {selectedItems.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-2">Selected</p>
              <div className="space-y-1">
                {selectedItems.map(name => (
                  <div key={name} className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded-lg">
                    <label className="flex items-center gap-2 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked
                        onChange={() => handleToggle(name)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-blue-900">{name.replace(/-/g, ' ')}</span>
                    </label>
                    <button
                      onClick={() => handleRemove(name)}
                      className="p-1 text-blue-400 hover:text-blue-600 rounded"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available items */}
          {availableItems.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase mb-2">Available</p>
              <div className="space-y-1">
                {availableItems.map(name => (
                  <label key={name} className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={false}
                      onChange={() => handleToggle(name)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">{name.replace(/-/g, ' ')}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
