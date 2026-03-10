import { Trash2, ArrowUp, ArrowDown, ExternalLink } from 'lucide-react'
import { TemplateColumn, STYLE_OPTIONS } from './templateUtils'

interface ColumnEditorTableProps {
  columns: TemplateColumn[]
  onUpdateColumn: (id: string, field: keyof TemplateColumn, value: string) => void
  onRemoveColumn: (id: string) => void
  onMoveColumn: (index: number, direction: 'up' | 'down') => void
  onOpenColumnRules: (colId: string, text: string) => void
}

export function ColumnEditorTable({
  columns,
  onUpdateColumn,
  onRemoveColumn,
  onMoveColumn,
  onOpenColumnRules,
}: ColumnEditorTableProps) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-visible">
      <table className="w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase w-12">#</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase w-[200px]">Column Name</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase w-28">Width</th>
            <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase w-36">Style</th>
            <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase w-16">Rules</th>
            <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase w-24">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {columns.map((col, index) => (
            <tr key={col.id} className="hover:bg-gray-50">
              <td className="px-3 py-2 text-gray-500 text-xs">{index + 1}</td>
              <td className="px-3 py-2">
                <input
                  type="text"
                  value={col.name}
                  onChange={(e) => onUpdateColumn(col.id, 'name', e.target.value)}
                  placeholder="Column name"
                  className="w-full px-2 py-1 text-sm border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
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
              <td className="px-3 py-2 text-center">
                <button
                  onClick={() => onOpenColumnRules(col.id, col.columnRules || '')}
                  className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded"
                  title="Edit rules"
                >
                  <ExternalLink className="w-3 h-3" />
                </button>
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
                  <button
                    onClick={() => onRemoveColumn(col.id)}
                    className="p-1 text-red-400 hover:text-red-600"
                    title="Remove column"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
