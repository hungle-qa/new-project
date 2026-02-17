import React from 'react'
import { Trash2, ArrowUp, ArrowDown, ExternalLink, GitBranch } from 'lucide-react'
import { StructureTab, StructureNode } from '../LevelsTab'
import { TemplateColumn, STYLE_OPTIONS, isModuleColumn } from './templateUtils'

interface ColumnEditorTableProps {
  columns: TemplateColumn[]
  feature?: string
  structure?: StructureNode[]
  structureExpanded: boolean
  onStructureExpandToggle: () => void
  onStructureSave?: (structure: StructureNode[]) => Promise<void>
  onStructureDirtyChange: (dirty: boolean) => void
  onStructureSaveRef: (fn: (() => Promise<void>) | null) => void
  onUpdateColumn: (id: string, field: keyof TemplateColumn, value: string) => void
  onRemoveColumn: (id: string) => void
  onMoveColumn: (index: number, direction: 'up' | 'down') => void
  onOpenWritingStyle: (colId: string, text: string) => void
}

export function ColumnEditorTable({
  columns,
  feature,
  structure,
  structureExpanded,
  onStructureExpandToggle,
  onStructureSave,
  onStructureDirtyChange,
  onStructureSaveRef,
  onUpdateColumn,
  onRemoveColumn,
  onMoveColumn,
  onOpenWritingStyle,
}: ColumnEditorTableProps) {
  return (
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
                        onChange={(e) => !isModule && onUpdateColumn(col.id, 'name', e.target.value)}
                        readOnly={isModule}
                        placeholder="Column name"
                        title={isModule ? 'Module column name is locked. It maps to the structure hierarchy.' : ''}
                        className={`w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${isModule ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                      />
                      {isModule && feature && (
                        <button
                          onClick={onStructureExpandToggle}
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
                      onChange={(e) => onUpdateColumn(col.id, 'width', e.target.value)}
                      placeholder="120px"
                      className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={col.style}
                      onChange={(e) => onUpdateColumn(col.id, 'style', e.target.value)}
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
                        onClick={() => onOpenWritingStyle(col.id, col.writingStyle || '')}
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
                        onClick={() => onMoveColumn(index, 'up')}
                        disabled={index === 0}
                        className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                        title="Move up"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => onMoveColumn(index, 'down')}
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
                          onClick={() => onRemoveColumn(col.id)}
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
                          onDirtyChange={onStructureDirtyChange}
                          saveRef={onStructureSaveRef}
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
  )
}
