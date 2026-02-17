import { TemplateColumn, getStyleClasses, getSampleData } from './templateUtils'

interface TemplatePreviewProps {
  columns: TemplateColumn[]
}

export function TemplatePreview({ columns }: TemplatePreviewProps) {
  if (columns.length === 0) return null

  return (
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
  )
}
