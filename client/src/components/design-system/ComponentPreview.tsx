import { Eye } from 'lucide-react'
import { useMemo } from 'react'

interface ComponentPreviewProps {
  tailwindHtml: string
  showPreview: boolean
  onTogglePreview: () => void
}

export function ComponentPreview({ tailwindHtml, showPreview, onTogglePreview }: ComponentPreviewProps) {
  // Generate preview HTML with Tailwind
  const previewHtml = useMemo(() => {
    if (!tailwindHtml.trim()) return ''

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body {
      min-height: 100vh;
      margin: 0;
      padding: 30px;
      background: #f9fafb;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
  </style>
</head>
<body>
  ${tailwindHtml}
</body>
</html>`
  }, [tailwindHtml])

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-sm font-medium text-gray-700">
          Live Preview
        </label>
        <button
          type="button"
          onClick={onTogglePreview}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
        >
          <Eye className="w-4 h-4" />
          {showPreview ? 'Hide' : 'Show'}
        </button>
      </div>
      {showPreview && (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {previewHtml ? (
            <iframe
              srcDoc={previewHtml}
              className="w-full h-48 bg-gray-50"
              title="Component Preview"
            />
          ) : (
            <div className="h-48 flex items-center justify-center bg-gray-50 text-gray-400 text-sm">
              Enter HTML with Tailwind classes to see preview
            </div>
          )}
        </div>
      )}
    </div>
  )
}
