interface SpecPreviewProps {
  loading: boolean
  content: string | null
}

export function SpecPreview({ loading, content }: SpecPreviewProps) {
  if (loading) {
    return <div className="text-center py-4 text-gray-500 text-sm">Loading spec...</div>
  }

  if (content) {
    return (
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Imported Spec Preview</h4>
        <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-sm max-h-96 whitespace-pre-wrap border border-gray-200">
          {content}
        </pre>
      </div>
    )
  }

  return (
    <p className="text-sm text-gray-500 text-center py-4">
      No spec imported yet. Upload a PDF/MD/TXT/DOC/DOCX file above.
    </p>
  )
}
