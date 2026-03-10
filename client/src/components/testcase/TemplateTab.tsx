import { useState, useEffect, useCallback } from 'react'
import { Save, Plus } from 'lucide-react'
import { ColumnRulesModal } from './template/ColumnRulesModal'
import { ColumnEditorTable } from './template/ColumnEditorTable'
import { TemplatePreview } from './template/TemplatePreview'
import {
  TemplateColumn,
  DEFAULT_COLUMNS,
} from './template/templateUtils'

interface TemplateTabProps {
  /** When set, edits a specific global template file (used by GlobalTabsPanel) */
  globalTemplateName?: string
  onDirtyChange?: (dirty: boolean) => void
  saveRef?: (saveFn: (() => Promise<void>) | null) => void
}

export function TemplateTab({ globalTemplateName, onDirtyChange, saveRef }: TemplateTabProps) {
  const apiBase = globalTemplateName
    ? `/api/testcase/templates/${globalTemplateName}`
    : '/api/testcase/template'

  const [columns, setColumns] = useState<TemplateColumn[]>([])
  const [original, setOriginal] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [detailsCol, setDetailsCol] = useState<string | null>(null)
  const [detailsText, setDetailsText] = useState('')

  const hasChanges = JSON.stringify(columns) !== original

  useEffect(() => {
    setLoading(true)
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
  }, [apiBase])

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
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && hasChanges) {
        e.preventDefault()
        handleSave()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [hasChanges, handleSave])

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

  const title = globalTemplateName || 'Default Template'
  const subtitle = globalTemplateName
    ? 'Edit this global template file'
    : 'Default template for all new features'

  return (
    <div className="space-y-4">
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
