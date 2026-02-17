import { RuleValueInput } from './RuleValueInput'

export interface DesignRule {
  id: string
  token: string
  value: string
  usage: string
  type: 'color' | 'text' | 'opacity' | 'gradient' | 'css'
  isCore?: boolean
}

interface AddRuleFormProps {
  newRule: Omit<DesignRule, 'id' | 'isCore'>
  onChange: (rule: Omit<DesignRule, 'id' | 'isCore'>) => void
  onAdd: () => void
  onCancel: () => void
}

export function AddRuleForm({ newRule, onChange, onAdd, onCancel }: AddRuleFormProps) {
  return (
    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h4 className="text-sm font-medium text-gray-900 mb-3">Add New Rule</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs text-gray-600 mb-1">Token Name *</label>
          <input
            type="text"
            value={newRule.token}
            onChange={(e) => onChange({ ...newRule, token: e.target.value })}
            placeholder="--color-custom"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-xs text-gray-600 mb-1">Type</label>
          <select
            value={newRule.type}
            onChange={(e) => onChange({ ...newRule, type: e.target.value as DesignRule['type'] })}
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
                onChange={(e) => onChange({ ...newRule, value: e.target.value })}
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
                onChange={(e) => onChange({ ...newRule, value: e.target.value })}
                className="w-full"
              />
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={newRule.value}
                onChange={(e) => onChange({ ...newRule, value: e.target.value })}
                placeholder="0.5"
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
          {(newRule.type === 'gradient' || newRule.type === 'css') && (
            <textarea
              value={newRule.value}
              onChange={(e) => onChange({ ...newRule, value: e.target.value })}
              placeholder={newRule.type === 'gradient' ? 'linear-gradient(0deg, #184EFF, #184EFF), linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1))' : 'CSS value from Figma'}
              rows={3}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          )}
          {newRule.type === 'text' && (
            <input
              type="text"
              value={newRule.value}
              onChange={(e) => onChange({ ...newRule, value: e.target.value })}
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
            onChange={(e) => onChange({ ...newRule, usage: e.target.value })}
            placeholder="Description of usage"
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <button
          type="button"
          onClick={onAdd}
          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
