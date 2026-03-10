import { useState, useEffect } from 'react'
import { Settings, X, List } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { TemplateColumn } from './template/templateUtils'
import { getStyleClasses, getSampleData } from './template/templateUtils'

interface ConfigTabProps {
  selectedRule: string
  selectedTemplate: string
  onSaveConfig: (updates: { rule?: string; template?: string }) => Promise<void>
}

export function ConfigTab({ selectedRule, selectedTemplate, onSaveConfig }: ConfigTabProps) {
  const [rulesList, setRulesList] = useState<string[]>([])
  const [templatesList, setTemplatesList] = useState<string[]>([])
  const [ruleContent, setRuleContent] = useState('')
  const [templateColumns, setTemplateColumns] = useState<TemplateColumn[]>([])
  const [loadingRule, setLoadingRule] = useState(false)
  const [loadingTemplate, setLoadingTemplate] = useState(false)
  const [showAllRules, setShowAllRules] = useState(false)

  // Fetch lists
  useEffect(() => {
    fetch('/api/testcase/rules/list').then(r => r.json()).then(setRulesList).catch(() => {})
    fetch('/api/testcase/templates/list').then(r => r.json()).then(setTemplatesList).catch(() => {})
  }, [])

  // Fetch rule preview
  useEffect(() => {
    if (!selectedRule) return
    setLoadingRule(true)
    fetch(`/api/testcase/rules/${selectedRule}`)
      .then(r => r.json())
      .then(data => setRuleContent(data.content || ''))
      .catch(() => setRuleContent(''))
      .finally(() => setLoadingRule(false))
  }, [selectedRule])

  // Fetch template preview
  useEffect(() => {
    if (!selectedTemplate) return
    setLoadingTemplate(true)
    fetch(`/api/testcase/templates/${selectedTemplate}`)
      .then(r => r.json())
      .then((data: TemplateColumn[]) => setTemplateColumns(Array.isArray(data) ? data : []))
      .catch(() => setTemplateColumns([]))
      .finally(() => setLoadingTemplate(false))
  }, [selectedTemplate])

  const columnsWithRules = templateColumns.filter(c => c.columnRules)

  useEffect(() => {
    if (!showAllRules) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowAllRules(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [showAllRules])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <Settings className="w-4 h-4 text-gray-500" />
        <h3 className="text-sm font-medium text-gray-700">Feature Configuration</h3>
        <span className="text-xs text-gray-400">Read-only previews — edit via Default Rules / Default Template tabs</span>
      </div>

      {/* Rule dropdown + preview */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <label className="text-xs font-medium text-gray-600 whitespace-nowrap w-16">Rule:</label>
          <select
            value={selectedRule || 'test-rules'}
            onChange={e => onSaveConfig({ rule: e.target.value })}
            className="flex-1 text-sm px-2 py-1.5 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {rulesList.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
        {loadingRule ? (
          <div className="text-xs text-gray-400 py-2">Loading rule preview...</div>
        ) : ruleContent ? (
          <div className="prose prose-sm max-w-none border border-gray-200 rounded-lg p-4 max-h-[300px] overflow-auto bg-gray-50">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeRaw]}
              components={{
                table: ({ children, ...props }) => (
                  <table {...props} style={{ tableLayout: 'fixed', width: '100%' }}>{children}</table>
                ),
                td: ({ children, ...props }) => (
                  <td {...props} style={{ whiteSpace: 'pre-line', wordBreak: 'break-word' }}>{children}</td>
                ),
                th: ({ children, ...props }) => (
                  <th {...props} style={{ whiteSpace: 'pre-line', wordBreak: 'break-word' }}>{children}</th>
                ),
              }}
            >
              {ruleContent}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="text-xs text-gray-400 py-2">No rule content</div>
        )}
      </div>

      {/* Template dropdown + preview */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <label className="text-xs font-medium text-gray-600 whitespace-nowrap w-16">Template:</label>
          <select
            value={selectedTemplate || 'template'}
            onChange={e => onSaveConfig({ template: e.target.value })}
            className="flex-1 text-sm px-2 py-1.5 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {templatesList.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
        {loadingTemplate ? (
          <div className="text-xs text-gray-400 py-2">Loading template preview...</div>
        ) : templateColumns.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-gray-500 uppercase">Preview</p>
              {columnsWithRules.length > 0 && (
                <button
                  onClick={() => setShowAllRules(true)}
                  className="flex items-center gap-1 px-2 py-1 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
                >
                  <List className="w-3 h-3" />
                  Column Rules
                </button>
              )}
            </div>
            <div className="border border-gray-200 rounded-lg overflow-x-auto" style={{ overflow: 'visible' }}>
              <table className="text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    {templateColumns.map(col => (
                      <th
                        key={col.id}
                        className={`px-3 py-2 text-xs font-medium text-gray-600 uppercase whitespace-nowrap ${getStyleClasses(col.style)}`}
                        style={{ minWidth: col.width }}
                      >
                        {col.name || '(unnamed)'}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-200">
                    {templateColumns.map(col => (
                      <td
                        key={col.id}
                        className={`px-3 py-2 text-gray-500 whitespace-pre-line ${getStyleClasses(col.style)}`}
                        style={{ minWidth: col.width }}
                      >
                        {getSampleData(col.name)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-xs text-gray-400 py-2">No template columns</div>
        )}
      </div>

      {/* All Column Rules Modal */}
      {showAllRules && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setShowAllRules(false)} />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-[600px] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">All Column Rules</h3>
                <button
                  onClick={() => setShowAllRules(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3 max-h-[500px] overflow-auto">
                {columnsWithRules.map(col => (
                  <div key={col.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="text-sm font-medium text-gray-800 mb-1">{col.name}</div>
                    <div className="text-sm text-gray-600 whitespace-pre-line">{col.columnRules}</div>
                  </div>
                ))}
                {columnsWithRules.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">No column rules defined</p>
                )}
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowAllRules(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
