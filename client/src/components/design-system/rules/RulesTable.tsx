import { Trash2 } from 'lucide-react'
import { RuleValueInput } from './RuleValueInput'
import { type DesignRule } from './AddRuleForm'

interface RulesTableProps {
  rules: DesignRule[]
  validationErrors: Record<string, string>
  onRuleChange: (id: string, field: keyof DesignRule, value: string) => void
  onDeleteRule: (id: string) => void
}

export function RulesTable({ rules, validationErrors, onRuleChange, onDeleteRule }: RulesTableProps) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase w-48">Token</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase w-48">Value</th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase min-w-[300px]">Usage</th>
            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase w-20">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {rules.map(rule => (
            <tr key={rule.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <input
                  type="text"
                  value={rule.token}
                  onChange={(e) => onRuleChange(rule.id, 'token', e.target.value)}
                  className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${
                    validationErrors[`${rule.id}_token`] ? 'border-red-300' : 'border-gray-200'
                  }`}
                  disabled={rule.isCore}
                />
              </td>
              <td className="px-4 py-3">
                <RuleValueInput
                  type={rule.type}
                  value={rule.value}
                  onChange={(value) => onRuleChange(rule.id, 'value', value)}
                  hasError={!!validationErrors[rule.id]}
                  disabled={false}
                />
              </td>
              <td className="px-4 py-3">
                <input
                  type="text"
                  value={rule.usage}
                  onChange={(e) => onRuleChange(rule.id, 'usage', e.target.value)}
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
                    onClick={() => onDeleteRule(rule.id)}
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
  )
}
