import { useState, useEffect, useCallback } from 'react'
import { Search, X, Save, ChevronDown, ChevronUp } from 'lucide-react'
import { LinkedKnowledgeEntry } from '../../pages/TestcaseManagerPage'

interface ParsedHeading {
  heading: string  // full "## Title" string
  title: string    // just "Title"
}

interface KnowledgeSelectTabProps {
  feature: string
  linkedKnowledge: LinkedKnowledgeEntry[]
  onSave: (linkedKnowledge: LinkedKnowledgeEntry[]) => Promise<void>
  onDirtyChange?: (dirty: boolean) => void
  saveRef?: (saveFn: (() => Promise<void>) | null) => void
}

function getItemName(entry: LinkedKnowledgeEntry): string {
  return typeof entry === 'string' ? entry : entry.item
}

function getItemSections(entry: LinkedKnowledgeEntry): string[] {
  return typeof entry === 'string' ? [] : entry.sections
}

function normalizeEntries(entries: LinkedKnowledgeEntry[]): string {
  const normalized = entries.map(e => {
    const name = getItemName(e)
    const sections = getItemSections(e)
    return sections.length > 0 ? JSON.stringify({ item: name, sections: [...sections].sort() }) : name
  }).sort()
  return JSON.stringify(normalized)
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
                {selectedItems.map(name => {
                  const badge = getSectionBadge(name)
                  const isExpanded = expandedItem === name
                  const headings = itemSections[name]
                  const isLoadingThis = loadingSections === name

                  return (
                    <div key={name} className="bg-blue-50 border border-blue-200 rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between p-2">
                        <label className="flex items-center gap-2 cursor-pointer flex-1">
                          <input
                            type="checkbox"
                            checked
                            onChange={() => handleToggle(name)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-blue-900">{name.replace(/-/g, ' ')}</span>
                          {badge && (
                            <span className="text-xs text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                              {badge}
                            </span>
                          )}
                        </label>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleExpand(name)}
                            className="p-1 text-blue-400 hover:text-blue-600 rounded"
                            title="Select sections"
                          >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleRemove(name)}
                            className="p-1 text-blue-400 hover:text-blue-600 rounded"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Expandable section checkboxes */}
                      {isExpanded && (
                        <div className="border-t border-blue-200 px-3 py-2 bg-white">
                          {isLoadingThis ? (
                            <div className="text-xs text-gray-400 py-1">Loading sections...</div>
                          ) : headings && headings.length > 0 ? (
                            <div className="space-y-1">
                              {headings.map(h => (
                                <label key={h.heading} className="flex items-center gap-2 cursor-pointer py-0.5">
                                  <input
                                    type="checkbox"
                                    checked={isSectionSelected(name, h.heading)}
                                    onChange={() => handleSectionToggle(name, h.heading)}
                                    className="w-3.5 h-3.5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                  />
                                  <span className="text-xs text-gray-700">{h.title}</span>
                                </label>
                              ))}
                            </div>
                          ) : (
                            <div className="text-xs text-gray-400 py-1">No sections found</div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
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
