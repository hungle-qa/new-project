import { FlatRow } from './LevelsHelpers'

interface StructureTemplatePreviewProps {
  maxDepth: number
  flatRows: FlatRow[]
}

export function StructureTemplatePreview({ maxDepth, flatRows }: StructureTemplatePreviewProps) {
  if (maxDepth === 0 || flatRows.length === 0) return null

  return (
    <div>
      <p className="text-xs font-medium text-gray-500 uppercase mb-2">Template Preview</p>
      <div className="border border-gray-200 rounded-lg overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">ID</th>
              {Array.from({ length: maxDepth }, (_, i) => (
                <th key={i} className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">
                  Level {i + 1}
                </th>
              ))}
              <th className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">Title</th>
              <th className="px-3 py-2 text-left font-medium text-gray-600 whitespace-nowrap">Step</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {flatRows.map((row, ri) => (
              <tr key={ri} className="hover:bg-gray-50">
                <td className="px-3 py-1.5 text-gray-500 font-mono">{ri + 1}</td>
                {row.levels.map((val, ci) => (
                  <td key={ci} className="px-3 py-1.5 text-gray-700 whitespace-nowrap">
                    {val}
                  </td>
                ))}
                <td className="px-3 py-1.5 text-gray-400 italic">...</td>
                <td className="px-3 py-1.5 text-gray-400 italic">...</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
