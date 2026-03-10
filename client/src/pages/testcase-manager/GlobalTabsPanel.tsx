import { useState, useEffect } from 'react'
import { Plus, Trash2, Pencil, Check, X } from 'lucide-react'
import { RulesTab } from '../../components/testcase/RulesTab'
import { TemplateTab } from '../../components/testcase/TemplateTab'
import { LearnTab } from '../../components/testcase/LearnTab'
import { TabType, globalTabs } from './types'

interface GlobalTabsPanelProps {
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  onDirtyChange: (dirty: boolean) => void
  onSaveRef: (fn: (() => Promise<void>) | null) => void
}

export function GlobalTabsPanel({
  activeTab,
  onTabChange,
  onDirtyChange,
  onSaveRef
}: GlobalTabsPanelProps) {
  const isLearn = activeTab === 'learn'
  const isRules = activeTab === 'default-rules'
  const [items, setItems] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [renamingItem, setRenamingItem] = useState<string | null>(null)
  const [renameValue, setRenameValue] = useState('')

  const fetchItems = async (autoSelect = false) => {
    const endpoint = isRules ? '/api/testcase/rules/list' : '/api/testcase/templates/list'
    try {
      const res = await fetch(endpoint)
      const data = await res.json()
      setItems(data)
      if (autoSelect && data.length > 0) {
        setSelected(data[0])
      }
    } catch { /* ignore */ }
  }

  useEffect(() => {
    setSelected(null)
    setCreating(false)
    setRenamingItem(null)
    fetchItems(true)
  }, [activeTab])

  const handleCreate = async () => {
    if (!newName.trim()) return
    const endpoint = isRules ? '/api/testcase/rules' : '/api/testcase/templates'
    const body = isRules
      ? { name: newName, content: '' }
      : { name: newName, columns: [] }
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        const data = await res.json()
        setCreating(false)
        setNewName('')
        setSelected(null)
        await fetchItems()
        setSelected(data.name)
      }
    } catch { /* ignore */ }
  }

  const handleRename = async (oldName: string) => {
    if (!renameValue.trim() || renameValue === oldName) {
      setRenamingItem(null)
      return
    }
    const endpoint = isRules
      ? `/api/testcase/rules/${oldName}/rename`
      : `/api/testcase/templates/${oldName}/rename`
    try {
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newName: renameValue }),
      })
      if (res.ok) {
        const data = await res.json()
        setRenamingItem(null)
        if (selected === oldName) setSelected(data.name)
        await fetchItems()
      }
    } catch { /* ignore */ }
  }

  const handleDelete = async (name: string) => {
    if (!confirm(`Delete "${name}"?`)) return
    const endpoint = isRules
      ? `/api/testcase/rules/${name}`
      : `/api/testcase/templates/${name}`
    try {
      const res = await fetch(endpoint, { method: 'DELETE' })
      if (res.ok) {
        if (selected === name) setSelected(null)
        await fetchItems()
      }
    } catch { /* ignore */ }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-200 overflow-x-auto">
        {globalTabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTabChange(id)}
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

      {isLearn ? (
        <div className="p-4">
          <LearnTab />
        </div>
      ) : (
      <div className="flex min-h-[500px]">
        {/* Left sidebar: list of items */}
        <div className="w-56 border-r border-gray-200 flex flex-col">
          <div className="p-2 border-b border-gray-100 flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              {isRules ? 'Rules' : 'Templates'}
            </span>
            <button
              onClick={() => { setCreating(true); setNewName('') }}
              className="p-1 text-gray-400 hover:text-blue-600 rounded"
              title="Create new"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {creating && (
            <div className="p-2 border-b border-gray-100 flex items-center gap-1">
              <input
                autoFocus
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') handleCreate()
                  if (e.key === 'Escape') setCreating(false)
                }}
                placeholder="name..."
                className="flex-1 text-sm px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
              <button onClick={handleCreate} className="p-1 text-green-600 hover:text-green-700">
                <Check className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => setCreating(false)} className="p-1 text-gray-400 hover:text-gray-600">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            {items.map(name => (
              <div
                key={name}
                className={`group flex items-center gap-1 px-3 py-2 text-sm cursor-pointer border-l-2 ${
                  selected === name
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-transparent hover:bg-gray-50 text-gray-700'
                }`}
                onClick={() => { if (renamingItem !== name) setSelected(name) }}
              >
                {renamingItem === name ? (
                  <div className="flex-1 flex items-center gap-1">
                    <input
                      autoFocus
                      value={renameValue}
                      onChange={e => setRenameValue(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') handleRename(name)
                        if (e.key === 'Escape') setRenamingItem(null)
                      }}
                      className="flex-1 text-sm px-1 py-0.5 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button onClick={() => handleRename(name)} className="p-0.5 text-green-600">
                      <Check className="w-3 h-3" />
                    </button>
                    <button onClick={() => setRenamingItem(null)} className="p-0.5 text-gray-400">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="flex-1 truncate">{name}</span>
                    <div className="hidden group-hover:flex items-center gap-0.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); setRenamingItem(name); setRenameValue(name) }}
                        className="p-0.5 text-gray-400 hover:text-blue-600"
                        title="Rename"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(name) }}
                        className="p-0.5 text-gray-400 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
            {items.length === 0 && !creating && (
              <p className="p-3 text-xs text-gray-400 text-center">No items yet</p>
            )}
          </div>
        </div>

        {/* Right area: editor */}
        <div className="flex-1 p-4 overflow-x-auto">
          {selected ? (
            isRules ? (
              <RulesTab
                key={selected}
                globalRuleName={selected}
                onDirtyChange={onDirtyChange}
                saveRef={onSaveRef}
              />
            ) : (
              <TemplateTab
                key={selected}
                globalTemplateName={selected}
                onDirtyChange={onDirtyChange}
                saveRef={onSaveRef}
              />
            )
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              Select an item from the list or create a new one
            </div>
          )}
        </div>
      </div>
      )}
    </div>
  )
}
