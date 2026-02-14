import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Save, Plus, Trash2, ArrowUp, ArrowDown, ExternalLink, X, GitBranch } from 'lucide-react'
import { StructureTab, StructureNode } from './LevelsTab'

interface TemplateColumn {
  id: string
  name: string
  width: string
  style: string
  writingStyle: string
}

interface TemplateTabProps {
  feature?: string
  structure?: StructureNode[]
  onStructureSave?: (structure: StructureNode[]) => Promise<void>
  onDirtyChange?: (dirty: boolean) => void
  saveRef?: (saveFn: (() => Promise<void>) | null) => void
}

const STYLE_OPTIONS = ['normal', 'bold', 'mono', 'center', 'bold center', 'bold mono']

const DEFAULT_COLUMNS: TemplateColumn[] = [
  { id: '1', name: 'ID', width: '80px', style: 'bold mono', writingStyle: 'Auto-increment ID, e.g. TC-001' },
  { id: '2', name: 'Module', width: '120px', style: 'normal', writingStyle: 'Feature module name' },
  { id: '3', name: 'Test Type', width: '100px', style: 'normal', writingStyle: 'Functional, UI, API, Security, or Performance' },
  { id: '4', name: 'Scope', width: '80px', style: 'normal', writingStyle: 'Unit, Integration, or E2E' },
  { id: '5', name: 'Title', width: '200px', style: 'bold', writingStyle: 'Short descriptive title' },
  { id: '6', name: 'Preconditions', width: '180px', style: 'normal', writingStyle: 'Setup required before execution' },
  { id: '7', name: 'Steps', width: '300px', style: 'mono', writingStyle: 'Numbered list, one step per line' },
  { id: '8', name: 'Expected Result', width: '200px', style: 'normal', writingStyle: 'Always start with SHOULD or SHOULD NOT.\nBreak new line if many expected results in one testcase.' },
  { id: '9', name: 'Priority', width: '80px', style: 'bold center', writingStyle: 'Critical, High, Medium, or Low' },
  { id: '10', name: 'Status', width: '80px', style: 'center', writingStyle: 'Not Executed' },
]

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

  const hasChanges = JSON.stringify(columns) !== original
  const combinedDirty = hasChanges || structureDirty

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

  const getStyleClasses = (style: string) => {
    const classes: string[] = []
    if (style.includes('bold')) classes.push('font-bold')
    if (style.includes('mono')) classes.push('font-mono')
    if (style.includes('center')) classes.push('text-center')
    return classes.join(' ')
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

      {/* Column Editor Table */}
      <div className="border border-gray-200 rounded-lg overflow-visible">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase w-12">#</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase">Column Name</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase w-28">Width</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase w-36">Style</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase min-w-[200px]">Writing Style</th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase w-24">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {columns.map((col, index) => {
              const isModule = isModuleColumn(col.name)
              return (
                <React.Fragment key={col.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-3 py-2 text-gray-500 text-xs">{index + 1}</td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <input
                          type="text"
                          value={col.name}
                          onChange={(e) => !isModule && updateColumn(col.id, 'name', e.target.value)}
                          readOnly={isModule}
                          placeholder="Column name"
                          title={isModule ? 'Module column name is locked. It maps to the structure hierarchy.' : ''}
                          className={`w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${isModule ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                        />
                        {isModule && feature && (
                          <button
                            onClick={() => setStructureExpanded(!structureExpanded)}
                            className={`flex-shrink-0 p-1 rounded transition-colors ${structureExpanded ? 'text-blue-600 bg-blue-50' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'}`}
                            title={structureExpanded ? 'Collapse module structure' : 'Expand module structure'}
                          >
                            <GitBranch className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <input
                        type="text"
                        value={col.width}
                        onChange={(e) => updateColumn(col.id, 'width', e.target.value)}
                        placeholder="120px"
                        className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-3 py-2">
                      <select
                        value={col.style}
                        onChange={(e) => updateColumn(col.id, 'style', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {STYLE_OPTIONS.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500 truncate max-w-[150px]" title={col.writingStyle || ''}>
                          {col.writingStyle || <span className="italic text-gray-400">None</span>}
                        </span>
                        <button
                          onClick={() => { setDetailsCol(col.id); setDetailsText(col.writingStyle || '') }}
                          className="flex-shrink-0 p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded"
                          title="Edit writing style"
                        >
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => moveColumn(index, 'up')}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          title="Move up"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => moveColumn(index, 'down')}
                          disabled={index === columns.length - 1}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                          title="Move down"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                        {isModule ? (
                          <div className="relative group/del">
                            <button
                              disabled
                              className="p-1 text-gray-300 cursor-not-allowed"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                            <div className="fixed z-[9999] hidden group-hover/del:block pointer-events-none" style={{ transform: 'translate(-90%, -110%)' }}>
                              <div className="bg-gray-900 text-white text-xs leading-relaxed rounded px-2.5 py-2 shadow-lg w-[260px]">
                                Module column cannot be deleted.<br />
                                It maps to the structure hierarchy<br />
                                (Level 1, Level 2...).
                              </div>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => removeColumn(col.id)}
                            className="p-1 text-red-400 hover:text-red-600"
                            title="Remove column"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                  {/* Embedded Structure editor for Module column */}
                  {isModule && feature && structureExpanded && (
                    <tr>
                      <td colSpan={6} className="p-0">
                        <div className="border-t border-b border-blue-100 bg-blue-50/30 px-4 py-3">
                          <StructureTab
                            feature={feature}
                            structure={structure || []}
                            onSave={onStructureSave || (async () => {})}
                            onDirtyChange={setStructureDirty}
                            saveRef={(fn) => { structureSaveFn.current = fn }}
                          />
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              )
            })}
          </tbody>
        </table>
      </div>

      {columns.length === 0 && (
        <p className="text-center py-4 text-gray-500 text-sm">No columns defined. Click "Add Column" to start.</p>
      )}

      {!hasChanges && !saving && (
        <p className="text-xs text-gray-400">No changes to save</p>
      )}

      {/* Preview */}
      {columns.length > 0 && (
        <div>
          <p className="text-xs font-medium text-gray-500 uppercase mb-2">Preview</p>
          <div className="border border-gray-200 rounded-lg overflow-x-auto">
            <table className="text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map(col => (
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
                  {columns.map(col => (
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
      )}
      {/* Writing Style Details Modal */}
      {detailsCol && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setDetailsCol(null)} />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-[600px] p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Writing Style: {columns.find(c => c.id === detailsCol)?.name || 'Column'}
                </h3>
                <button
                  onClick={() => setDetailsCol(null)}
                  className="p-1 text-gray-400 hover:text-gray-600 rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <textarea
                value={detailsText}
                onChange={(e) => setDetailsText(e.target.value)}
                placeholder="Describe how AI should write content for this column..."
                rows={16}
                autoFocus
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setDetailsCol(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleWritingStyleSave(detailsCol, detailsText)}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function isModuleColumn(name: string): boolean {
  return name.toLowerCase().trim() === 'module'
}

function getSampleData(columnName: string): string {
  const name = columnName.toLowerCase()
  if (name.includes('id')) return 'TC-001'
  if (name.includes('module')) return 'Login'
  if (name.includes('type')) return 'Functional'
  if (name.includes('scope')) return 'E2E'
  if (name.includes('title')) return 'Verify login with valid credentials'
  if (name.includes('precondition')) return 'User is on login page'
  if (name.includes('step')) return '1. Enter email\n2. Enter password\n3. Click login'
  if (name.includes('expected') || name.includes('result')) return 'User is redirected to dashboard'
  if (name.includes('priority')) return 'High'
  if (name.includes('status')) return 'Not Executed'
  return 'Sample'
}
