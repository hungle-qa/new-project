import { useState, useEffect, useCallback } from 'react'
import { Save, Eye, Edit3, RefreshCw, Download } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

interface RulesTabProps {
  feature?: string
  /** When set, edits a specific global rule file (used by GlobalTabsPanel) */
  globalRuleName?: string
  selectedRule?: string
  onRuleChange?: (ruleName: string) => void
  onDirtyChange?: (dirty: boolean) => void
  saveRef?: (saveFn: (() => Promise<void>) | null) => void
}

export function RulesTab({ feature, globalRuleName, selectedRule, onRuleChange, onDirtyChange, saveRef }: RulesTabProps) {
  const [content, setContent] = useState('')
  const [original, setOriginal] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [customized, setCustomized] = useState<boolean | null>(null)

  // For per-feature combobox
  const [rulesList, setRulesList] = useState<string[]>([])
  const [syncing, setSyncing] = useState(false)

  const hasChanges = content !== original

  // Determine API base
  const apiBase = globalRuleName
    ? `/api/testcase/rules/${globalRuleName}`
    : feature
      ? `/api/testcase/${feature}/rules`
      : '/api/testcase/rules'

  // Fetch available global rules for per-feature combobox
  useEffect(() => {
    if (feature) {
      fetch('/api/testcase/rules/list')
        .then(res => res.json())
        .then(data => setRulesList(data))
        .catch(() => {})
    }
  }, [feature])

  useEffect(() => {
    setLoading(true)
    setShowPreview(false)
    setCustomized(null)
    fetch(apiBase)
      .then(res => res.json())
      .then(data => {
        setContent(data.content || '')
        setOriginal(data.content || '')
        setLoading(false)
      })
      .catch(() => setLoading(false))

    if (feature) {
      fetch(`/api/testcase/${feature}/rules/status`)
        .then(res => res.json())
        .then(data => setCustomized(data.customized ?? null))
        .catch(() => {})
    }
  }, [apiBase, feature])

  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      const res = await fetch(apiBase, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(globalRuleName ? { content } : { content }),
      })
      if (res.ok) {
        setOriginal(content)
      }
    } finally {
      setSaving(false)
    }
  }, [content, apiBase, globalRuleName])

  const handleRuleSelection = async (ruleName: string) => {
    if (!feature) return
    onRuleChange?.(ruleName)
    // Sync: re-clone from selected global rule
    setSyncing(true)
    try {
      await fetch(`/api/testcase/${feature}/rules/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ruleName }),
      })
      // Reload content
      const res = await fetch(`/api/testcase/${feature}/rules`)
      if (res.ok) {
        const data = await res.json()
        setContent(data.content || '')
        setOriginal(data.content || '')
      }
    } finally {
      setSyncing(false)
    }
  }

  const handleFetch = async () => {
    if (!feature) return
    const ruleName = selectedRule || 'test-rules'
    setSyncing(true)
    try {
      await fetch(`/api/testcase/${feature}/rules/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ruleName }),
      })
      // Reload content
      const res = await fetch(`/api/testcase/${feature}/rules`)
      if (res.ok) {
        const data = await res.json()
        setContent(data.content || '')
        setOriginal(data.content || '')
      }
    } finally {
      setSyncing(false)
    }
  }

  useEffect(() => {
    onDirtyChange?.(hasChanges)
  }, [hasChanges])

  useEffect(() => {
    saveRef?.(hasChanges ? handleSave : null)
    return () => saveRef?.(null)
  }, [hasChanges, handleSave])

  if (loading) {
    return <div className="text-center py-8 text-gray-500 text-sm">Loading rules...</div>
  }

  const title = globalRuleName
    ? globalRuleName
    : feature ? 'Feature Rules' : 'Default Rules'

  const subtitle = globalRuleName
    ? 'Edit this global rule file'
    : feature ? 'Rules specific to this feature (cloned from global)' : 'Default rules for all new features'

  return (
    <div className="space-y-4">
      {/* Per-feature: rule source selector */}
      {feature && rulesList.length > 0 && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <label className="text-xs font-medium text-gray-600 whitespace-nowrap">Source Rule:</label>
          <select
            value={selectedRule || 'test-rules'}
            onChange={e => handleRuleSelection(e.target.value)}
            disabled={syncing}
            className="flex-1 text-sm px-2 py-1.5 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {rulesList.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <button
            onClick={handleFetch}
            disabled={syncing}
            className="flex items-center gap-1 px-2 py-1.5 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 disabled:opacity-50"
            title="Fetch latest from selected global rule"
          >
            <Download className="w-3 h-3" />
            Fetch
          </button>
          {syncing && (
            <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div>
            <h3 className="text-sm font-medium text-gray-700">{title}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
          </div>
          {feature && customized !== null && (
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
              customized
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {customized ? 'Customized' : 'Matches Default'}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-md ${
              showPreview
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            {showPreview ? <Edit3 className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
            {showPreview ? 'Edit' : 'Preview'}
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-3 h-3" />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {showPreview ? (
        <div className="prose prose-sm max-w-none border border-gray-200 rounded-lg p-4 max-h-[600px] overflow-auto bg-white">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{
              table: ({ children, ...props }) => (
                <table {...props} style={{ tableLayout: 'fixed', width: '100%' }}>{children}</table>
              ),
              td: ({ children, ...props }) => (
                <td {...props} style={{ whiteSpace: 'pre-line', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{children}</td>
              ),
              th: ({ children, ...props }) => (
                <th {...props} style={{ whiteSpace: 'pre-line', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{children}</th>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      ) : (
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-[500px] px-4 py-3 text-sm font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
          placeholder="# Testcase Rules&#10;&#10;Write your testcase generation rules in markdown..."
        />
      )}

      {!hasChanges && !saving && (
        <p className="text-xs text-gray-400">No changes to save</p>
      )}
    </div>
  )
}
