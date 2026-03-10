import { useState, useEffect, useCallback } from 'react'
import { Save, Plus, AlertTriangle, RefreshCw, Download } from 'lucide-react'
import { ColumnRulesModal } from './template/ColumnRulesModal'
import { ColumnEditorTable } from './template/ColumnEditorTable'
import { TemplatePreview } from './template/TemplatePreview'
import {
  TemplateColumn,
  DEFAULT_COLUMNS,
} from './template/templateUtils'

interface TemplateTabProps {
  feature?: string
  /** When set, edits a specific global template file (used by GlobalTabsPanel) */
  globalTemplateName?: string
  selectedTemplate?: string
  onTemplateChange?: (templateName: string) => void
  onDirtyChange?: (dirty: boolean) => void
  saveRef?: (saveFn: (() => Promise<void>) | null) => void
}

export function TemplateTab({ feature, globalTemplateName, selectedTemplate, onTemplateChange, onDirtyChange, saveRef }: TemplateTabProps) {
  // Determine API base
  const apiBase = globalTemplateName
    ? `/api/testcase/templates/${globalTemplateName}`
    : feature
      ? `/api/testcase/${feature}/template`
      : '/api/testcase/template'

  const [columns, setColumns] = useState<TemplateColumn[]>([])
  const [original, setOriginal] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [detailsCol, setDetailsCol] = useState<string | null>(null)
  const [detailsText, setDetailsText] = useState('')
  const [columnDrift, setColumnDrift] = useState<{ missingColumns: string[]; extraColumns: string[] } | null>(null)
  const [syncing, setSyncing] = useState(false)

  // For per-feature combobox
  const [templatesList, setTemplatesList] = useState<string[]>([])
  const [templateSyncing, setTemplateSyncing] = useState(false)

  const hasChanges = JSON.stringify(columns) !== original

  // Fetch available global templates for per-feature combobox
  useEffect(() => {
    if (feature) {
      fetch('/api/testcase/templates/list')
        .then(res => res.json())
        .then(data => setTemplatesList(data))
        .catch(() => {})
    }
  }, [feature])

  useEffect(() => {
    setLoading(true)
    setColumnDrift(null)
    fetch(apiBase)
      .then(res => res.json())
      .then((data: TemplateColumn[]) => {
        const cols = data.length > 0 ? data : DEFAULT_COLUMNS
        setColumns(cols)
        setOriginal(JSON.stringify(cols))
        setLoading(false)
      })
      .catch(() => {
        setColumns(DEFAULT_COLUMNS)
        setOriginal(JSON.stringify(DEFAULT_COLUMNS))
        setLoading(false)
      })

    if (feature) {
      fetch(`/api/testcase/${feature}/template/status`)
        .then(res => res.json())
        .then(data => {
          if (data.missingColumns?.length > 0 || data.extraColumns?.length > 0) {
            setColumnDrift({ missingColumns: data.missingColumns, extraColumns: data.extraColumns })
          }
        })
        .catch(() => {})
    }
  }, [apiBase, feature])

  const handleSyncFromGlobal = async () => {
    if (!feature) return
    setSyncing(true)
    try {
      const res = await fetch('/api/testcase/template')
      if (res.ok) {
        const globalCols: TemplateColumn[] = await res.json()
        setColumns(globalCols)
        await handleSave(globalCols)
        setColumnDrift(null)
      }
    } finally {
      setSyncing(false)
    }
  }

  const handleTemplateSelection = async (templateName: string) => {
    if (!feature) return
    onTemplateChange?.(templateName)
    setTemplateSyncing(true)
    try {
      await fetch(`/api/testcase/${feature}/template/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateName }),
      })
      // Reload content
      const res = await fetch(`/api/testcase/${feature}/template`)
      if (res.ok) {
        const data: TemplateColumn[] = await res.json()
        const cols = data.length > 0 ? data : DEFAULT_COLUMNS
        setColumns(cols)
        setOriginal(JSON.stringify(cols))
        setColumnDrift(null)
      }
    } finally {
      setTemplateSyncing(false)
    }
  }

  const handleFetch = async () => {
    if (!feature) return
    const templateName = selectedTemplate || 'template'
    setTemplateSyncing(true)
    try {
      await fetch(`/api/testcase/${feature}/template/sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateName }),
      })
      // Reload content
      const res = await fetch(`/api/testcase/${feature}/template`)
      if (res.ok) {
        const data: TemplateColumn[] = await res.json()
        const cols = data.length > 0 ? data : DEFAULT_COLUMNS
        setColumns(cols)
        setOriginal(JSON.stringify(cols))
        setColumnDrift(null)
      }
    } finally {
      setTemplateSyncing(false)
    }
  }

  const handleSave = useCallback(async (cols?: TemplateColumn[]) => {
    const toSave = cols || columns
    setSaving(true)
    try {
      const res = await fetch(apiBase, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(toSave),
      })
      if (res.ok) {
        setOriginal(JSON.stringify(toSave))
      }
    } finally {
      setSaving(false)
    }
  }, [columns, apiBase])

  useEffect(() => {
    onDirtyChange?.(hasChanges)
  }, [hasChanges])

  useEffect(() => {
    saveRef?.(hasChanges ? handleSave : null)
    return () => saveRef?.(null)
  }, [hasChanges, handleSave])

  const addColumn = () => {
    const newCol: TemplateColumn = {
      id: `col_${Date.now()}`,
      name: '',
      width: '120px',
      style: 'normal',
      columnRules: '',
    }
    setColumns([...columns, newCol])
  }

  const updateColumn = (id: string, field: keyof TemplateColumn, value: string) => {
    setColumns(columns.map(c => c.id === id ? { ...c, [field]: value } : c))
  }

  const removeColumn = (id: string) => {
    setColumns(columns.filter(c => c.id !== id))
  }

  const moveColumn = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= columns.length) return
    const newCols = [...columns]
    const temp = newCols[index]
    newCols[index] = newCols[newIndex]
    newCols[newIndex] = temp
    setColumns(newCols)
  }

  const handleColumnRulesSave = (colId: string, text: string) => {
    const updatedColumns = columns.map(c => c.id === colId ? { ...c, columnRules: text } : c)
    setColumns(updatedColumns)
    setDetailsCol(null)
    handleSave(updatedColumns)
  }

  if (loading) {
    return <div className="text-center py-8 text-gray-500 text-sm">Loading template...</div>
  }

  const title = globalTemplateName
    ? globalTemplateName
    : feature ? 'Feature Template' : 'Default Template'

  const subtitle = globalTemplateName
    ? 'Edit this global template file'
    : feature ? 'Template specific to this feature (cloned from global)' : 'Default template for all new features'

  return (
    <div className="space-y-4">
      {/* Per-feature: template source selector */}
      {feature && templatesList.length > 0 && (
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <label className="text-xs font-medium text-gray-600 whitespace-nowrap">Source Template:</label>
          <select
            value={selectedTemplate || 'template'}
            onChange={e => handleTemplateSelection(e.target.value)}
            disabled={templateSyncing}
            className="flex-1 text-sm px-2 py-1.5 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {templatesList.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <button
            onClick={handleFetch}
            disabled={templateSyncing}
            className="flex items-center gap-1 px-2 py-1.5 text-xs text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 disabled:opacity-50"
            title="Fetch latest from selected global template"
          >
            <Download className="w-3 h-3" />
            Fetch
          </button>
          {templateSyncing && (
            <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
          )}
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-700">{title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={addColumn}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
          >
            <Plus className="w-3 h-3" />
            Add Column
          </button>
          <button
            onClick={() => handleSave()}
            disabled={saving || !hasChanges}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="w-3 h-3" />
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>


      {/* Column Editor Table */}
      <ColumnEditorTable
        columns={columns}
        onUpdateColumn={updateColumn}
        onRemoveColumn={removeColumn}
        onMoveColumn={moveColumn}
        onOpenColumnRules={(colId, text) => { setDetailsCol(colId); setDetailsText(text) }}
      />

      {columns.length === 0 && (
        <p className="text-center py-4 text-gray-500 text-sm">No columns defined. Click "Add Column" to start.</p>
      )}

      {!hasChanges && !saving && (
        <p className="text-xs text-gray-400">No changes to save</p>
      )}

      {/* Preview */}
      {columns.length > 0 && (
        <TemplatePreview columns={columns} />
      )}

      {/* Writing Style Details Modal */}
      {detailsCol && (
        <ColumnRulesModal
          columnName={columns.find(c => c.id === detailsCol)?.name || 'Column'}
          text={detailsText}
          onTextChange={setDetailsText}
          onSave={() => handleColumnRulesSave(detailsCol, detailsText)}
          onClose={() => setDetailsCol(null)}
        />
      )}
    </div>
  )
}
