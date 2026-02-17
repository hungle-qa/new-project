import { useState, useEffect, useCallback, useRef } from 'react'
import { Save, Plus, AlertTriangle } from 'lucide-react'
import { StructureNode } from './LevelsTab'
import { WritingStyleModal } from './template/WritingStyleModal'
import { ColumnEditorTable } from './template/ColumnEditorTable'
import { TemplatePreview } from './template/TemplatePreview'
import {
  TemplateColumn,
  DEFAULT_COLUMNS,
} from './template/templateUtils'

interface TemplateTabProps {
  feature?: string
  structure?: StructureNode[]
  onStructureSave?: (structure: StructureNode[]) => Promise<void>
  onDirtyChange?: (dirty: boolean) => void
  saveRef?: (saveFn: (() => Promise<void>) | null) => void
}

export function TemplateTab({ feature, structure, onStructureSave, onDirtyChange, saveRef }: TemplateTabProps) {
  const apiBase = feature ? `/api/testcase/${feature}/template` : '/api/testcase/template'
  const [columns, setColumns] = useState<TemplateColumn[]>([])
  const [original, setOriginal] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [detailsCol, setDetailsCol] = useState<string | null>(null)
  const [detailsText, setDetailsText] = useState('')
  const [structureExpanded, setStructureExpanded] = useState(false)
  const [structureDirty, setStructureDirty] = useState(false)
  const structureSaveFn = useRef<(() => Promise<void>) | null>(null)
  const [columnDrift, setColumnDrift] = useState<{ missingColumns: string[]; extraColumns: string[] } | null>(null)
  const [syncing, setSyncing] = useState(false)

  const hasChanges = JSON.stringify(columns) !== original
  const combinedDirty = hasChanges || structureDirty

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

    // Check column drift for per-feature templates
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
  }, [columns])

  useEffect(() => {
    onDirtyChange?.(combinedDirty)
  }, [combinedDirty])

  useEffect(() => {
    saveRef?.(combinedDirty ? async () => {
      if (hasChanges) await handleSave()
      if (structureDirty && structureSaveFn.current) await structureSaveFn.current()
    } : null)
    return () => saveRef?.(null)
  }, [combinedDirty, hasChanges, structureDirty, handleSave])

  const addColumn = () => {
    const newCol: TemplateColumn = {
      id: `col_${Date.now()}`,
      name: '',
      width: '120px',
      style: 'normal',
      writingStyle: '',
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

  const handleWritingStyleSave = (colId: string, text: string) => {
    const updatedColumns = columns.map(c => c.id === colId ? { ...c, writingStyle: text } : c)
    setColumns(updatedColumns)
    setDetailsCol(null)
    // Auto-save template when writing style is saved
    handleSave(updatedColumns)
  }

  if (loading) {
    return <div className="text-center py-8 text-gray-500 text-sm">Loading template...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-700">{feature ? 'Feature Template' : 'Default Template'}</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {feature ? 'Template specific to this feature (cloned from default)' : 'Default template for all new features'}
          </p>
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

      {/* Column Drift Warning */}
      {feature && columnDrift && (
        <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-2 text-sm text-amber-800">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <div>
              <span className="font-medium">Column drift detected.</span>
              {columnDrift.missingColumns.length > 0 && (
                <span> Global has columns not in this feature: <strong>{columnDrift.missingColumns.join(', ')}</strong>.</span>
              )}
              {columnDrift.extraColumns.length > 0 && (
                <span> This feature has extra columns: <strong>{columnDrift.extraColumns.join(', ')}</strong>.</span>
              )}
            </div>
          </div>
          <button
            onClick={handleSyncFromGlobal}
            disabled={syncing}
            className="shrink-0 px-3 py-1 text-xs font-medium text-amber-700 bg-amber-100 border border-amber-300 rounded-md hover:bg-amber-200 disabled:opacity-50"
          >
            {syncing ? 'Syncing...' : 'Sync from Global'}
          </button>
        </div>
      )}

      {/* Column Editor Table */}
      <ColumnEditorTable
        columns={columns}
        feature={feature}
        structure={structure || []}
        structureExpanded={structureExpanded}
        onStructureExpandToggle={() => setStructureExpanded(!structureExpanded)}
        onStructureSave={onStructureSave || (async () => {})}
        onStructureDirtyChange={setStructureDirty}
        onStructureSaveRef={(fn) => { structureSaveFn.current = fn }}
        onUpdateColumn={updateColumn}
        onRemoveColumn={removeColumn}
        onMoveColumn={moveColumn}
        onOpenWritingStyle={(colId, text) => { setDetailsCol(colId); setDetailsText(text) }}
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
        <WritingStyleModal
          columnName={columns.find(c => c.id === detailsCol)?.name || 'Column'}
          text={detailsText}
          onTextChange={setDetailsText}
          onSave={() => handleWritingStyleSave(detailsCol, detailsText)}
          onClose={() => setDetailsCol(null)}
        />
      )}
    </div>
  )
}
