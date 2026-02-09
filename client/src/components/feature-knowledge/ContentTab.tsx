import { FileText } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface ContentTabProps {
  content: string
  sourceFiles: string[]
}

function parseContent(raw: string): { filename: string; text: string }[] {
  if (!raw.trim()) return []

  const sections: { filename: string; text: string }[] = []
  const parts = raw.split(/\n---\n/)

  for (const part of parts) {
    const trimmed = part.trim()
    if (!trimmed) continue

    const sourceMatch = trimmed.match(/^<!--\s*source:\s*(.+?)\s*-->/)
    const filename = sourceMatch ? sourceMatch[1] : ''
    const text = sourceMatch
      ? trimmed.replace(/^<!--\s*source:\s*.+?\s*-->\s*/, '').trim()
      : trimmed

    if (text) {
      sections.push({ filename, text })
    }
  }

  return sections
}

export function ContentTab({ content, sourceFiles }: ContentTabProps) {
  if (!content) {
    return (
      <div className="text-center py-12">
        <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">No content yet. Import a document in the Import tab.</p>
      </div>
    )
  }

  const sections = parseContent(content)

  return (
    <div className="space-y-6">
      {sourceFiles.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap text-xs text-gray-500">
          <FileText className="w-3 h-3" />
          <span>Sources:</span>
          {sourceFiles.map(file => (
            <span key={file} className="px-2 py-0.5 bg-gray-100 rounded">{file}</span>
          ))}
        </div>
      )}

      <div className="prose prose-sm max-w-none max-h-[600px] overflow-auto">
        {sections.map((section, i) => (
          <div key={i} className={i > 0 ? 'border-t border-gray-200 pt-4 mt-4' : ''}>
            {section.filename && (
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                {section.filename}
              </h4>
            )}
            <ReactMarkdown>{section.text}</ReactMarkdown>
          </div>
        ))}
      </div>
    </div>
  )
}
