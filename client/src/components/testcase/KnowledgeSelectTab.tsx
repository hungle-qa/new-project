import { useState, useEffect, useCallback } from 'react'
import { Search, X, Save } from 'lucide-react'
import { LinkedKnowledgeEntry } from './types'
import { ParsedHeading, getItemName, getItemSections, normalizeEntries } from './KnowledgeSelectHelpers'
import { KnowledgeSelectedItem } from './KnowledgeSelectedItem'

interface KnowledgeSelectTabProps {
  feature: string
  linkedKnowledge: LinkedKnowledgeEntry[]
  onSave: (linkedKnowledge: LinkedKnowledgeEntry[]) => Promise<void>
  onDirtyChange?: (dirty: boolean) => void
  saveRef?: (saveFn: (() => Promise<void>) | null) => void
}

export function KnowledgeSelectTab({ feature, linkedKnowledge, onSave, onDirtyChange, saveRef }: KnowledgeSelectTabProps) {
  const [allItems, setAllItems] = useState<string[]>([])
  const [selected, setSelected] = useState<LinkedKnowledgeEntry[]>(linkedKnowledge || [])
  const [searchQuery, setSearchQuery] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  // Expand/collapse and section cache
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [itemSections, setItemSections] = useState<Record<string, ParsedHeading[]>>({})
  const [loadingSections, setLoadingSections] = useState<string | null>(null)

  const hasChanges = normalizeEntries(selected) !== normalizeEntries(linkedKnowledge || [])

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

  const isSelected = (name: string) => selected.some(e => getItemName(e) === name)

  const handleToggle = (name: string) => {
    if (isSelected(name)) {
      setSelected(prev => prev.filter(e => getItemName(e) !== name))
      if (expandedItem === name) setExpandedItem(null)
    } else {
      setSelected(prev => [...prev, name])
    }
  }

  const handleRemove = (name: string) => {
    setSelected(prev => prev.filter(e => getItemName(e) !== name))
    if (expandedItem === name) setExpandedItem(null)
  }

  const handleExpand = async (name: string) => {
    if (expandedItem === name) {
      setExpandedItem(null)
      return
    }
    setExpandedItem(name)

    // Fetch and parse headings if not cached
    if (!itemSections[name]) {
      setLoadingSections(name)
      try {
        const res = await fetch(`/api/feature-knowledge/${name}`)
        if (res.ok) {
          const data = await res.json()
          const content: string = data.content || ''
          const headings: ParsedHeading[] = []
          for (const line of content.split('\n')) {
            const match = line.match(/^## (.+)$/)
            if (match) {
              headings.push({ heading: line, title: match[1] })
            }
          }
          setItemSections(prev => ({ ...prev, [name]: headings }))
        }
      } catch { /* ignore */ }
      setLoadingSections(null)
    }
  }

  const handleSectionToggle = (itemName: string, heading: string) => {
    setSelected(prev => {
      const idx = prev.findIndex(e => getItemName(e) === itemName)
      if (idx === -1) return prev

      const entry = prev[idx]
      const currentSections = getItemSections(entry)
      const allHeadings = (itemSections[itemName] || []).map(h => h.heading)

      let newSections: string[]

      if (currentSections.length === 0) {
        // Currently "all" → deselect one = all except this one
        newSections = allHeadings.filter(h => h !== heading)
      } else if (currentSections.includes(heading)) {
        // Remove this section
        newSections = currentSections.filter(h => h !== heading)
        if (newSections.length === 0) {
          // Last section removed → remove entire item
          return prev.filter(e => getItemName(e) !== itemName)
        }
      } else {
        // Add this section
        newSections = [...currentSections, heading]
      }

      // If all sections selected → simplify to plain string
      if (newSections.length >= allHeadings.length) {
        const next = [...prev]
        next[idx] = itemName
        return next
      }

      const next = [...prev]
      next[idx] = { item: itemName, sections: newSections }
      return next
    })
  }

  const isSectionSelected = (itemName: string, heading: string): boolean => {
    const entry = selected.find(e => getItemName(e) === itemName)
    if (!entry) return false
    const sections = getItemSections(entry)
    if (sections.length === 0) return true // plain string = all selected
    return sections.includes(heading)
  }

  const getSectionBadge = (itemName: string): string | null => {
    const entry = selected.find(e => getItemName(e) === itemName)
    if (!entry) return null
    const sections = getItemSections(entry)
    const allHeadings = itemSections[itemName]
    if (!allHeadings || allHeadings.length === 0) return null
    if (sections.length === 0) return null // all selected
    return `${sections.length}/${allHeadings.length} sections`
  }

  const filteredItems = allItems.filter(name =>
    name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedNames = selected.map(e => getItemName(e))
  const selectedItems = filteredItems.filter(name => selectedNames.includes(name))
  const availableItems = filteredItems.filter(name => !selectedNames.includes(name))

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
                  <KnowledgeSelectedItem
                    key={name}
                    name={name}
                    badge={getSectionBadge(name)}
                    isExpanded={expandedItem === name}
                    headings={itemSections[name]}
                    isLoadingThis={loadingSections === name}
                    onToggle={() => handleToggle(name)}
                    onExpand={() => handleExpand(name)}
                    onRemove={() => handleRemove(name)}
                    isSectionSelected={(heading) => isSectionSelected(name, heading)}
                    onSectionToggle={(heading) => handleSectionToggle(name, heading)}
                  />
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
