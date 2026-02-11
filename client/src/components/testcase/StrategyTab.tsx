import { useState, useEffect, useCallback } from 'react'
import { Save, ChevronDown, ChevronUp } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface StrategyTabProps {
  feature: string
  strategy: string
  onSave: (strategy: string) => Promise<void>
  onDirtyChange?: (dirty: boolean) => void
  saveRef?: (saveFn: (() => Promise<void>) | null) => void
}

interface StrategyOption {
  id: string
  name: string
  description: string
}

const STRATEGIES: StrategyOption[] = [
  {
    id: 'scenario-based',
    name: 'Scenario-Based Testing',
    description: 'Test smarter, not harder. Maximum coverage with minimum cases using EP, BVA, E2E Pathing.',
  },
  {
    id: 'component-testing',
    name: 'Component Testing',
    description: '100% Happy Path coverage from components to E2E workflows using Atomic-to-Flow framework.',
  },
]

export function StrategyTab({ feature, strategy: initialStrategy, onSave, onDirtyChange, saveRef }: StrategyTabProps) {
  const [selected, setSelected] = useState(initialStrategy)
  const [saving, setSaving] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [detailsContent, setDetailsContent] = useState<Record<string, string>>({})
  const [loadingDetails, setLoadingDetails] = useState<string | null>(null)

  const hasChanges = selected !== initialStrategy

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
    setSelected(initialStrategy)
  }, [initialStrategy, feature])

  const toggleDetails = async (id: string) => {
    if (expandedId === id) {
      setExpandedId(null)
      return
    }

    setExpandedId(id)

    if (!detailsContent[id]) {
      setLoadingDetails(id)
      try {
        const res = await fetch(`/api/testcase/strategies/${id}`)
        if (res.ok) {
          const data = await res.json()
          setDetailsContent(prev => ({ ...prev, [id]: data.content }))
        }
      } catch {
        // ignore
      } finally {
        setLoadingDetails(null)
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-700">Testing Strategy</h3>
          <p className="text-xs text-gray-500 mt-0.5">Select a testing approach for this feature</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-3 h-3" />
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div className="space-y-3">
        {STRATEGIES.map(({ id, name, description }) => {
          const isSelected = selected === id
          const isExpanded = expandedId === id

          return (
            <div key={id} className="rounded-lg border overflow-hidden transition-colors">
              {/* Card Header */}
              <button
                onClick={() => setSelected(id)}
                className={`w-full text-left p-4 transition-colors ${
                  isSelected
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-200 bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'border-blue-600' : 'border-gray-300'
                  }`}>
                    {isSelected && (
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${isSelected ? 'text-blue-900' : 'text-gray-900'}`}>
                      {name}
                    </p>
                    <p className={`text-xs mt-1 ${isSelected ? 'text-blue-700' : 'text-gray-500'}`}>
                      {description}
                    </p>
                  </div>
                </div>
              </button>

              {/* View Details Toggle */}
              <div className={`border-t ${isSelected ? 'border-blue-200' : 'border-gray-100'}`}>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleDetails(id) }}
                  className={`w-full flex items-center justify-center gap-1 px-4 py-2 text-xs font-medium transition-colors ${
                    isSelected
                      ? 'text-blue-600 hover:bg-blue-100'
                      : 'text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {isExpanded ? (
                    <>
                      Hide Details
                      <ChevronUp className="w-3 h-3" />
                    </>
                  ) : (
                    <>
                      View Details
                      <ChevronDown className="w-3 h-3" />
                    </>
                  )}
                </button>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className={`border-t px-4 py-3 ${isSelected ? 'border-blue-200 bg-blue-50/50' : 'border-gray-100 bg-gray-50'}`}>
                  {loadingDetails === id ? (
                    <div className="flex items-center gap-2 text-sm text-gray-500 py-4 justify-center">
                      <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                      Loading details...
                    </div>
                  ) : detailsContent[id] ? (
                    <div className="prose prose-sm max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {detailsContent[id]}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No details available</p>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {!selected && (
        <p className="text-xs text-gray-400">No strategy selected. Choose one above and save.</p>
      )}
    </div>
  )
}
