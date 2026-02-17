import { useState, useEffect } from 'react'
import { Save, AlertCircle, Plus } from 'lucide-react'
import { AddRuleForm, type DesignRule } from './rules/AddRuleForm'
import { RulesPreview } from './rules/RulesPreview'
import { Toast } from './rules/Toast'
import { RulesTable } from './rules/RulesTable'
import { useRulesValidation } from './rules/useRulesValidation'
import { LoadingSpinner, ErrorState } from './rules/LoadingState'

interface DesignRulesData {
  fontFamily: string
  rules: DesignRule[]
}

export function RulesEditor() {
  const [rulesData, setRulesData] = useState<DesignRulesData | null>(null)
  const [originalData, setOriginalData] = useState<DesignRulesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newRule, setNewRule] = useState<Omit<DesignRule, 'id' | 'isCore'>>({
    token: '',
    value: '#000000',
    usage: '',
    type: 'color'
  })

  const { validationErrors, validateForm, clearValidationError } = useRulesValidation()

  // Check if there are unsaved changes
  const hasChanges = (): boolean => {
    if (!rulesData || !originalData) return false
    return JSON.stringify(rulesData) !== JSON.stringify(originalData)
  }

  useEffect(() => {
    loadRules()
  }, [])

  const loadRules = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await fetch('/api/design-system/rules')
      if (!res.ok) {
        throw new Error('Failed to load rules')
      }
      const data = await res.json()
      setRulesData(data)
      setOriginalData(JSON.parse(JSON.stringify(data)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load rules')
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!rulesData) return

    if (!validateForm(rulesData)) {
      setError('Please fix validation errors before saving')
      return
    }

    try {
      setSaving(true)
      setError(null)

      const res = await fetch('/api/design-system/rules', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rulesData)
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to save rules')
      }

      setOriginalData(JSON.parse(JSON.stringify(rulesData))) // Update original after successful save
      setToast({ message: 'Design rules updated successfully!', type: 'success' })
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : 'Failed to save rules', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleFontFamilyChange = (value: string) => {
    if (!rulesData) return
    setRulesData({ ...rulesData, fontFamily: value })
    if (validationErrors.fontFamily) {
      clearValidationError(['fontFamily'])
    }
  }

  const handleRuleChange = (id: string, field: keyof DesignRule, value: string) => {
    if (!rulesData) return
    setRulesData({
      ...rulesData,
      rules: rulesData.rules.map(rule =>
        rule.id === id ? { ...rule, [field]: value } : rule
      )
    })
    if (validationErrors[id] || validationErrors[`${id}_token`]) {
      clearValidationError([id, `${id}_token`])
    }
  }

  const handleAddRule = async () => {
    if (!rulesData) return
    if (!newRule.token.trim()) {
      setError('Token name is required')
      return
    }

    const id = `custom_${Date.now()}`
    const updatedData = {
      ...rulesData,
      rules: [...rulesData.rules, { ...newRule, id, isCore: false }]
    }
    setRulesData(updatedData)
    setNewRule({ token: '', value: '#000000', usage: '', type: 'color' })
    setShowAddForm(false)
    setError(null)

    // Auto-save after adding new rule
    try {
      setSaving(true)
      const res = await fetch('/api/design-system/rules', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to save rules')
      }

      setOriginalData(JSON.parse(JSON.stringify(updatedData)))
      setToast({ message: 'New rule added and saved!', type: 'success' })
    } catch (err) {
      setToast({ message: err instanceof Error ? err.message : 'Failed to save new rule', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteRule = (id: string) => {
    if (!rulesData) return
    const rule = rulesData.rules.find(r => r.id === id)
    if (rule?.isCore) {
      setError('Core rules cannot be deleted')
      return
    }
    if (!confirm(`Delete rule "${rule?.token}"?`)) return

    setRulesData({
      ...rulesData,
      rules: rulesData.rules.filter(r => r.id !== id)
    })
  }

  if (loading) return <LoadingSpinner />
  if (error && !rulesData) return <ErrorState error={error} onRetry={loadRules} />
  if (!rulesData) return null

  // Helper to get rule value by token for preview
  const getRuleValue = (token: string) => {
    const rule = rulesData.rules.find(r => r.token === token)
    return rule?.value || ''
  }

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Design System Rules</h2>
        <p className="text-sm text-gray-500 mt-1">
          Edit baseline styling rules for all components in the design system
        </p>
      </div>

      {/* Toast notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {/* Error Messages */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
        {/* Font Family */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Font Family
          </label>
          <input
            type="text"
            value={rulesData.fontFamily}
            onChange={(e) => handleFontFamilyChange(e.target.value)}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              validationErrors.fontFamily ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Open Sans"
          />
          {validationErrors.fontFamily && (
            <p className="text-xs text-red-600 mt-1">{validationErrors.fontFamily}</p>
          )}
        </div>

        {/* Rules List */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Design Tokens ({rulesData.rules.length})
            </label>
            <button
              type="button"
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
            >
              <Plus className="w-4 h-4" />
              Add Rule
            </button>
          </div>

          {/* Add New Rule Form */}
          {showAddForm && (
            <AddRuleForm
              newRule={newRule}
              onChange={setNewRule}
              onAdd={handleAddRule}
              onCancel={() => setShowAddForm(false)}
            />
          )}

          {/* Rules Table */}
          <RulesTable
            rules={rulesData.rules}
            validationErrors={validationErrors}
            onRuleChange={handleRuleChange}
            onDeleteRule={handleDeleteRule}
          />
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges()}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#184EFF] text-white rounded-md hover:bg-[#184EFFE6] disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Rules
              </>
            )}
          </button>
          {!hasChanges() && !saving && (
            <p className="text-xs text-gray-400 mt-2">No changes to save</p>
          )}
        </div>
      </div>

      {/* Preview Section */}
      <RulesPreview fontFamily={rulesData.fontFamily} getRuleValue={getRuleValue} />
    </div>
  )
}
