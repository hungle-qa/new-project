import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface Icon {
  name: string
  svg: string
  category?: string
  tags?: string[]
  created: string
}

export function IconEditModal({ icon, onClose, onSuccess }: { icon: Icon; onClose: () => void; onSuccess: () => void }) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        document.querySelector<HTMLFormElement>('form')?.requestSubmit()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const [svg, setSvg] = useState(icon.svg)
  const [category, setCategory] = useState(icon.category || 'general')
  const [tags, setTags] = useState((icon.tags || []).join(', '))
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const isWhiteIcon = icon.name.toLowerCase().includes('white')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!svg.trim()) {
      setError('SVG content is required')
      return
    }

    if (!svg.includes('<svg') || !svg.includes('</svg>')) {
      setError('Invalid SVG content')
      return
    }

    setSubmitting(true)

    try {
      const response = await fetch(`/api/design-system/icons/${icon.name}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          svg: svg.trim(),
          category,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean)
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update icon')
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update icon')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-[#141414]">Edit Icon: {icon.name}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-[#184EFF] focus:ring-1 focus:ring-[#184EFF] focus:outline-none"
              >
                <option value="general">General</option>
                <option value="navigation">Navigation</option>
                <option value="action">Action</option>
                <option value="status">Status</option>
                <option value="social">Social</option>
                <option value="file">File</option>
                <option value="communication">Communication</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., arrow, direction, next"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-[#184EFF] focus:ring-1 focus:ring-[#184EFF] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Preview</label>
              <div className={`flex items-center justify-center p-4 border border-gray-200 rounded-md ${isWhiteIcon ? 'bg-black' : 'bg-gray-50'}`}>
                <div
                  className="w-16 h-16"
                  dangerouslySetInnerHTML={{ __html: svg }}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SVG Code</label>
              <textarea
                value={svg}
                onChange={(e) => setSvg(e.target.value)}
                placeholder="<svg>...</svg>"
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono focus:border-[#184EFF] focus:ring-1 focus:ring-[#184EFF] focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-[#141414] bg-white border border-gray-300 rounded-md hover:bg-[#F5F7F9]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-4 py-2 text-sm font-medium text-white bg-[#184EFF] rounded-md hover:bg-[#1241CC] disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
