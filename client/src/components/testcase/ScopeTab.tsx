import { useState, useEffect, useCallback } from 'react'
import { Save } from 'lucide-react'

interface ScopeTabProps {
  feature: string
  scope: { happy_case: string; corner_case: string }
  onSave: (scope: { happy_case: string; corner_case: string }) => Promise<void>
  onDirtyChange?: (dirty: boolean) => void
  saveRef?: (saveFn: (() => Promise<void>) | null) => void
}

const DEFAULT_HAPPY_CASE = 'Normal user flows, valid inputs, expected outcomes. Make sure all expectations in the spec are covered.'
const DEFAULT_CORNER_CASE = 'Boundary values, invalid inputs, many data, make action quickly'

export function ScopeTab({ feature, scope: initialScope, onSave, onDirtyChange, saveRef }: ScopeTabProps) {
  const [happyCase, setHappyCase] = useState(initialScope.happy_case || DEFAULT_HAPPY_CASE)
  const [cornerCase, setCornerCase] = useState(initialScope.corner_case || DEFAULT_CORNER_CASE)
  const [saving, setSaving] = useState(false)

  const initialHappy = initialScope.happy_case || DEFAULT_HAPPY_CASE
  const initialCorner = initialScope.corner_case || DEFAULT_CORNER_CASE
  const hasChanges = happyCase !== initialHappy || cornerCase !== initialCorner

  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      await onSave({ happy_case: happyCase, corner_case: cornerCase })
    } finally {
      setSaving(false)
    }
  }, [happyCase, cornerCase, onSave])

  useEffect(() => {
    onDirtyChange?.(hasChanges)
  }, [hasChanges])

  useEffect(() => {
    saveRef?.(hasChanges ? handleSave : null)
    return () => saveRef?.(null)
  }, [hasChanges, handleSave])

  useEffect(() => {
    setHappyCase(initialScope.happy_case || DEFAULT_HAPPY_CASE)
    setCornerCase(initialScope.corner_case || DEFAULT_CORNER_CASE)
  }, [initialScope, feature])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Test Scope Definitions</h3>
        <button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Happy Case Definition
        </label>
        <textarea
          value={happyCase}
          onChange={(e) => setHappyCase(e.target.value)}
          placeholder="Normal user flow, valid inputs, expected outcomes..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Corner Case Definition
        </label>
        <textarea
          value={cornerCase}
          onChange={(e) => setCornerCase(e.target.value)}
          placeholder="Empty states, boundary values, invalid inputs..."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
      </div>
    </div>
  )
}
