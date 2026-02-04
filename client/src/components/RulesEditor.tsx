import { useState, useEffect } from 'react'
import { Save, AlertCircle, Plus, Trash2 } from 'lucide-react'

interface DesignRule {
  id: string
  token: string
  value: string
  usage: string
  type: 'color' | 'text' | 'opacity' | 'gradient' | 'css'
  isCore?: boolean // Core rules cannot be deleted
}

interface DesignRulesData {
  fontFamily: string
  rules: DesignRule[]
}

export function RulesEditor() {
  const [rulesData, setRulesData] = useState<DesignRulesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [showAddForm, setShowAddForm] = useState(false)
  const [newRule, setNewRule] = useState<Omit<DesignRule, 'id' | 'isCore'>>({
    token: '',
    value: '#000000',
    usage: '',
    type: 'color'
  })

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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load rules')
    } finally {
      setLoading(false)
    }
  }

  const validateHexColor = (value: string): boolean => {
    // Validate #XXX, #XXXXXX, or #XXXXXXXX (with alpha) format
    return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(value)
  }

  const validateForm = (): boolean => {
    if (!rulesData) return false

    const errors: Record<string, string> = {}

    if (!rulesData.fontFamily.trim()) {
      errors.fontFamily = 'Font family is required'
    }

    rulesData.rules.forEach(rule => {
      // Only validate hex color for color type
      if (rule.type === 'color' && !validateHexColor(rule.value)) {
        errors[rule.id] = 'Invalid hex color format'
      }
      // Validate opacity range
      if (rule.type === 'opacity') {
        const num = parseFloat(rule.value)
        if (isNaN(num) || num < 0 || num > 1) {
          errors[rule.id] = 'Opacity must be between 0 and 1'
        }
      }
      if (!rule.token.trim()) {
        errors[`${rule.id}_token`] = 'Token name is required'
      }
    })

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSave = async () => {
    if (!rulesData) return

    if (!validateForm()) {
      setError('Please fix validation errors before saving')
      return
    }

    try {
      setSaving(true)
      setError(null)
      setSuccessMessage(null)

      const res = await fetch('/api/design-system/rules', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rulesData)
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.error || 'Failed to save rules')
      }

      setSuccessMessage('Design rules updated successfully!')
      setTimeout(() => setSuccessMessage(null), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save rules')
    } finally {
      setSaving(false)
    }
  }

  const handleFontFamilyChange = (value: string) => {
    if (!rulesData) return
    setRulesData({ ...rulesData, fontFamily: value })
    if (validationErrors.fontFamily) {
      const newErrors = { ...validationErrors }
      delete newErrors.fontFamily
      setValidationErrors(newErrors)
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
    // Clear validation error
    if (validationErrors[id] || validationErrors[`${id}_token`]) {
      const newErrors = { ...validationErrors }
      delete newErrors[id]
      delete newErrors[`${id}_token`]
      setValidationErrors(newErrors)
    }
  }

  const handleAddRule = () => {
    if (!rulesData) return
    if (!newRule.token.trim()) {
      setError('Token name is required')
      return
    }

    const id = `custom_${Date.now()}`
    setRulesData({
      ...rulesData,
      rules: [...rulesData.rules, { ...newRule, id, isCore: false }]
    })
    setNewRule({ token: '', value: '#000000', usage: '', type: 'color' })
    setShowAddForm(false)
    setError(null)
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (error && !rulesData) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <div>
            <h3 className="font-semibold text-red-900">Error Loading Rules</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
        </div>
        <button
          onClick={loadRules}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!rulesData) return null

  // Helper to get rule value by token for preview
  const getRuleValue = (token: string) => {
    const rule = rulesData.rules.find(r => r.token === token)
    return rule?.value || ''
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Design System Rules</h2>
        <p className="text-sm text-gray-500 mt-1">
          Edit baseline styling rules for all components in the design system
        </p>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-700">{successMessage}</p>
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
            <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Add New Rule</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Token Name *</label>
                  <input
                    type="text"
                    value={newRule.token}
                    onChange={(e) => setNewRule({ ...newRule, token: e.target.value })}
                    placeholder="--color-custom"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">Type</label>
                  <select
                    value={newRule.type}
                    onChange={(e) => setNewRule({ ...newRule, type: e.target.value as DesignRule['type'] })}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="color">Color</option>
                    <option value="text">Text</option>
                    <option value="opacity">Opacity</option>
                    <option value="gradient">Gradient</option>
                    <option value="css">CSS</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-600 mb-1">Value *</label>
                  {newRule.type === 'color' && (
                    <div className="flex gap-2 items-center">
                      <div
                        className="w-12 h-9 rounded border border-gray-300 shrink-0"
                        style={{ backgroundColor: newRule.value }}
                        title={newRule.value}
                      />
                      <input
                        type="text"
                        value={newRule.value}
                        onChange={(e) => setNewRule({ ...newRule, value: e.target.value })}
                        placeholder="#000000 or #000000FF"
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                  {newRule.type === 'opacity' && (
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={newRule.value}
                        onChange={(e) => setNewRule({ ...newRule, value: e.target.value })}
                        className="w-full"
                      />
                      <input
                        type="number"
                        min="0"
                        max="1"
                        step="0.1"
                        value={newRule.value}
                        onChange={(e) => setNewRule({ ...newRule, value: e.target.value })}
                        placeholder="0.5"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                  {(newRule.type === 'gradient' || newRule.type === 'css') && (
                    <textarea
                      value={newRule.value}
                      onChange={(e) => setNewRule({ ...newRule, value: e.target.value })}
                      placeholder={newRule.type === 'gradient' ? 'linear-gradient(0deg, #184EFF, #184EFF), linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1))' : 'CSS value from Figma'}
                      rows={3}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                    />
                  )}
                  {newRule.type === 'text' && (
                    <input
                      type="text"
                      value={newRule.value}
                      onChange={(e) => setNewRule({ ...newRule, value: e.target.value })}
                      placeholder="value"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs text-gray-600 mb-1">Usage Description</label>
                  <input
                    type="text"
                    value={newRule.usage}
                    onChange={(e) => setNewRule({ ...newRule, usage: e.target.value })}
                    placeholder="Description of usage"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  type="button"
                  onClick={handleAddRule}
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Add
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Rules Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Token</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Value</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Usage</th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase w-20">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rulesData.rules.map(rule => (
                  <tr key={rule.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={rule.token}
                        onChange={(e) => handleRuleChange(rule.id, 'token', e.target.value)}
                        className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                          validationErrors[`${rule.id}_token`] ? 'border-red-300' : 'border-gray-200'
                        }`}
                        disabled={rule.isCore}
                      />
                    </td>
                    <td className="px-4 py-3">
                      {rule.type === 'color' && (
                        <div className="flex gap-2 items-center">
                          <div
                            className="w-8 h-8 rounded border border-gray-300 shrink-0"
                            style={{ backgroundColor: rule.value }}
                            title={rule.value}
                          />
                          <input
                            type="text"
                            value={rule.value}
                            onChange={(e) => handleRuleChange(rule.id, 'value', e.target.value)}
                            className={`flex-1 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                              validationErrors[rule.id] ? 'border-red-300' : 'border-gray-200'
                            }`}
                          />
                        </div>
                      )}
                      {rule.type === 'opacity' && (
                        <div className="space-y-1">
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={rule.value}
                            onChange={(e) => handleRuleChange(rule.id, 'value', e.target.value)}
                            className="w-full"
                          />
                          <input
                            type="number"
                            min="0"
                            max="1"
                            step="0.1"
                            value={rule.value}
                            onChange={(e) => handleRuleChange(rule.id, 'value', e.target.value)}
                            className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                              validationErrors[rule.id] ? 'border-red-300' : 'border-gray-200'
                            }`}
                          />
                        </div>
                      )}
                      {(rule.type === 'gradient' || rule.type === 'css') && (
                        <textarea
                          value={rule.value}
                          onChange={(e) => handleRuleChange(rule.id, 'value', e.target.value)}
                          rows={3}
                          className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono ${
                            validationErrors[rule.id] ? 'border-red-300' : 'border-gray-200'
                          }`}
                        />
                      )}
                      {rule.type === 'text' && (
                        <input
                          type="text"
                          value={rule.value}
                          onChange={(e) => handleRuleChange(rule.id, 'value', e.target.value)}
                          className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                            validationErrors[rule.id] ? 'border-red-300' : 'border-gray-200'
                          }`}
                        />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={rule.usage}
                        onChange={(e) => handleRuleChange(rule.id, 'usage', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                        placeholder="Description"
                      />
                    </td>
                    <td className="px-4 py-3 text-center">
                      {rule.isCore ? (
                        <span className="text-xs text-gray-400">Core</span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleDeleteRule(rule.id)}
                          className="p-1 text-red-500 hover:bg-red-50 rounded"
                          title="Delete rule"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
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
        </div>
      </div>

      {/* Preview Section */}
      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Preview</h3>
        <div
          className="p-6 rounded-lg"
          style={{
            backgroundColor: getRuleValue('--color-bg-white') || '#FFFFFF',
            fontFamily: rulesData.fontFamily
          }}
        >
          <p
            className="text-lg mb-4"
            style={{ color: getRuleValue('--color-text-primary') || '#141414' }}
          >
            Sample Text (Primary Color)
          </p>
          <p
            className="text-sm mb-6"
            style={{ color: getRuleValue('--color-text-primary') || '#141414' }}
          >
            This is how your primary text will appear with the current font family and color settings.
          </p>
          <div className="flex gap-3">
            <button
              className="px-4 py-2 rounded-md font-medium transition-colors"
              style={{
                backgroundColor: getRuleValue('--color-btn-action') || '#184EFF',
                color: getRuleValue('--color-text-white') || '#FFFFFF'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = getRuleValue('--color-btn-action-hover') || '#1241CC'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = getRuleValue('--color-btn-action') || '#184EFF'}
            >
              Action Button
            </button>
            <button
              className="px-4 py-2 rounded-md font-medium border border-gray-200 transition-colors"
              style={{
                backgroundColor: '#FFFFFF',
                color: getRuleValue('--color-text-primary') || '#141414'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = getRuleValue('--color-btn-cancel-hover') || '#F5F7F9'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
            >
              Cancel Button
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
