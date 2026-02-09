import { useState, useEffect } from 'react'
import { Save } from 'lucide-react'

interface ComponentMapping {
  name: string
  usage: string
}

interface ComponentsTabProps {
  feature: string
  components: ComponentMapping[]
  onSave: (components: ComponentMapping[]) => Promise<void>
}

export function ComponentsTab({ feature, components: initialComponents, onSave }: ComponentsTabProps) {
  const [dsComponents, setDsComponents] = useState<string[]>([])
  const [selected, setSelected] = useState<ComponentMapping[]>(initialComponents)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setSelected(initialComponents)
  }, [initialComponents, feature])

  useEffect(() => {
    fetch('/api/design-system')
      .then(res => res.json())
      .then(data => {
        const filtered = (data as string[]).filter(n => n !== 'RULE')
        setDsComponents(filtered)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const toggleComponent = (name: string) => {
    const exists = selected.find(c => c.name === name)
    if (exists) {
      setSelected(selected.filter(c => c.name !== name))
    } else {
      setSelected([...selected, { name, usage: '' }])
    }
  }

  const updateUsage = (name: string, usage: string) => {
    setSelected(selected.map(c => c.name === name ? { ...c, usage } : c))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await onSave(selected)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8 text-gray-500 text-sm">Loading design system components...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">
          Map Design System Components ({selected.length} selected)
        </h3>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {dsComponents.length === 0 ? (
        <div className="text-center py-8 text-gray-500 text-sm">
          No design system components found. Import components first.
        </div>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {dsComponents.map(name => {
            const isSelected = selected.some(c => c.name === name)
            const mapping = selected.find(c => c.name === name)

            return (
              <div
                key={name}
                className={`rounded-lg border p-3 transition-colors ${
                  isSelected ? 'border-blue-300 bg-blue-50' : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleComponent(name)}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-900 flex-shrink-0">{name}</span>
                  {isSelected && (
                    <input
                      type="text"
                      value={mapping?.usage || ''}
                      onChange={(e) => updateUsage(name, e.target.value)}
                      placeholder="Usage description..."
                      className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
