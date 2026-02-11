import { useState, useEffect, useCallback } from 'react'
import { Plus, Trash2, Save, X } from 'lucide-react'

interface LevelEntry {
  level: number
  type: string
  value?: string
  values?: string[]
}

interface LevelsTabProps {
  feature: string
  levels: LevelEntry[]
  onSave: (levels: LevelEntry[]) => Promise<void>
  onDirtyChange?: (dirty: boolean) => void
  saveRef?: (saveFn: (() => Promise<void>) | null) => void
}

export function LevelsTab({ feature, levels: initialLevels, onSave, onDirtyChange, saveRef }: LevelsTabProps) {
  const [levels, setLevels] = useState<LevelEntry[]>(initialLevels)
  const [saving, setSaving] = useState(false)
  const [tagInput, setTagInput] = useState<Record<number, string>>({})

  const hasChanges = JSON.stringify(levels) !== JSON.stringify(initialLevels)

  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      await onSave(levels)
    } finally {
      setSaving(false)
    }
  }, [levels, onSave])

  useEffect(() => {
    onDirtyChange?.(hasChanges)
  }, [hasChanges])

  useEffect(() => {
    saveRef?.(hasChanges ? handleSave : null)
    return () => saveRef?.(null)
  }, [hasChanges, handleSave])

  useEffect(() => {
    setLevels(initialLevels)
  }, [initialLevels, feature])

  const addLevel = () => {
    const nextLevel = levels.length + 1
    setLevels([...levels, { level: nextLevel, type: 'component', value: '' }])
  }

  const removeLevel = (index: number) => {
    const updated = levels.filter((_, i) => i !== index).map((l, i) => ({ ...l, level: i + 1 }))
    setLevels(updated)
  }

  const updateLevel = (index: number, field: string, value: string) => {
    const updated = [...levels]
    updated[index] = { ...updated[index], [field]: value }
    setLevels(updated)
  }

  const addTag = (index: number) => {
    const input = tagInput[index]?.trim()
    if (!input) return
    const updated = [...levels]
    const current = updated[index].values || []
    if (!current.includes(input)) {
      updated[index] = { ...updated[index], values: [...current, input] }
      setLevels(updated)
    }
    setTagInput({ ...tagInput, [index]: '' })
  }

  const removeTag = (levelIndex: number, tagIndex: number) => {
    const updated = [...levels]
    const current = updated[levelIndex].values || []
    updated[levelIndex] = { ...updated[levelIndex], values: current.filter((_, i) => i !== tagIndex) }
    setLevels(updated)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Hierarchy Levels</h3>
        <div className="flex gap-2">
          <button
            onClick={addLevel}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100"
          >
            <Plus className="w-4 h-4" />
            Add Level
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {levels.length === 0 ? (
        <div className="text-center py-8 text-gray-500 text-sm">
          No levels defined. Click "Add Level" to start.
        </div>
      ) : (
        <div className="space-y-3">
          {levels.map((level, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-700">Level {level.level}</span>
                <button
                  onClick={() => removeLevel(index)}
                  className="p-1 text-red-500 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Type</label>
                  <select
                    value={level.type}
                    onChange={(e) => updateLevel(index, 'type', e.target.value)}
                    className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="component">Component</option>
                    <option value="sub-component">Sub-component</option>
                    <option value="function">Function</option>
                    <option value="screen">Screen</option>
                    <option value="module">Module</option>
                  </select>
                </div>

                {level.type === 'function' ? (
                  <div className="col-span-1">
                    <label className="block text-xs text-gray-500 mb-1">Values (tags)</label>
                    <div className="flex gap-1">
                      <input
                        type="text"
                        value={tagInput[index] || ''}
                        onChange={(e) => setTagInput({ ...tagInput, [index]: e.target.value })}
                        onKeyDown={(e) => e.key === 'Enter' && addTag(index)}
                        placeholder="Add tag..."
                        className="flex-1 px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => addTag(index)}
                        className="px-2 py-1.5 text-sm bg-gray-200 rounded hover:bg-gray-300"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Value</label>
                    <input
                      type="text"
                      value={level.value || ''}
                      onChange={(e) => updateLevel(index, 'value', e.target.value)}
                      placeholder="e.g. inbox"
                      className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>

              {/* Tags display */}
              {level.values && level.values.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {level.values.map((tag, tagIdx) => (
                    <span
                      key={tagIdx}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full"
                    >
                      {tag}
                      <button onClick={() => removeTag(index, tagIdx)} className="hover:text-blue-900">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
