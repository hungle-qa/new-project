import { useState, useEffect, useCallback } from 'react'
import { Upload, Trash2, Pencil, Search, X, Plus } from 'lucide-react'

interface Icon {
  name: string
  svg: string
  category?: string
  tags?: string[]
  created: string
}

interface IconManagerProps {
  onSelectIcon?: (icon: Icon) => void
}

export function IconManager({ onSelectIcon }: IconManagerProps) {
  const [icons, setIcons] = useState<Icon[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [editingIcon, setEditingIcon] = useState<Icon | null>(null)

  const fetchIcons = useCallback(async () => {
    try {
      const response = await fetch('/api/design-system/icons/list')
      if (response.ok) {
        const data = await response.json()
        setIcons(data)
      }
    } catch (error) {
      console.error('Failed to fetch icons:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchIcons()
  }, [fetchIcons])

  const handleDelete = async (name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return

    try {
      const response = await fetch(`/api/design-system/icons/${name}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        fetchIcons()
      }
    } catch (error) {
      console.error('Failed to delete icon:', error)
    }
  }

  const categories = ['all', ...new Set(icons.map(i => i.category || 'general'))]

  const filteredIcons = icons.filter(icon => {
    const matchesSearch = icon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (icon.tags || []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || icon.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return <div className="text-center py-12 text-gray-500">Loading icons...</div>
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-[#141414]">Icons Library</h3>
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#184EFF] text-white text-sm font-medium rounded-md hover:bg-[#1241CC]"
        >
          <Plus className="w-4 h-4" />
          Upload Icon
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4 p-4 border-b border-gray-200">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search icons..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-8 py-2 text-sm border border-gray-300 rounded-md focus:border-[#184EFF] focus:ring-1 focus:ring-[#184EFF] focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:border-[#184EFF] focus:ring-1 focus:ring-[#184EFF] focus:outline-none"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Icons Grid */}
      <div className="flex-1 overflow-auto p-4">
        {filteredIcons.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {icons.length === 0 ? (
              <>
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No icons yet. Upload your first icon!</p>
              </>
            ) : (
              <p>No icons match your search.</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-4">
            {filteredIcons.map(icon => {
              const isWhiteIcon = icon.name.toLowerCase().includes('white')
              return (
                <div
                  key={icon.name}
                  className="group relative flex flex-col items-center p-3 border border-gray-200 rounded-lg hover:border-[#184EFF] hover:shadow-sm transition-all cursor-pointer"
                  onClick={() => onSelectIcon?.(icon)}
                >
                  {/* SVG Preview */}
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded ${isWhiteIcon ? 'bg-black' : ''}`}
                    dangerouslySetInnerHTML={{ __html: icon.svg }}
                  />
                  {/* Name */}
                  <span className="mt-2 text-xs text-gray-600 truncate w-full text-center">
                    {icon.name}
                  </span>
                  {/* Actions */}
                  <div className="absolute top-1 right-1 hidden group-hover:flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingIcon(icon)
                      }}
                      className="p-1 bg-white rounded shadow-sm hover:bg-gray-100"
                      title="Edit"
                    >
                      <Pencil className="w-3 h-3 text-gray-500" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(icon.name)
                      }}
                      className="p-1 bg-white rounded shadow-sm hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3 text-red-500" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <IconUploadModal
          onClose={() => setIsUploadModalOpen(false)}
          onSuccess={() => {
            setIsUploadModalOpen(false)
            fetchIcons()
          }}
        />
      )}

      {/* Edit Modal */}
      {editingIcon && (
        <IconEditModal
          icon={editingIcon}
          onClose={() => setEditingIcon(null)}
          onSuccess={() => {
            setEditingIcon(null)
            fetchIcons()
          }}
        />
      )}
    </div>
  )
}

// Upload Modal Component
function IconUploadModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const [name, setName] = useState('')
  const [svg, setSvg] = useState('')
  const [category, setCategory] = useState('general')
  const [tags, setTags] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith('.svg')) {
      setError('Please upload an SVG file')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      setSvg(content)
      // Auto-fill name from filename
      if (!name) {
        setName(file.name.replace('.svg', '').replace(/[^a-zA-Z0-9-_]/g, '-'))
      }
      setError('')
    }
    reader.readAsText(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!name.trim()) {
      setError('Icon name is required')
      return
    }

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
      const response = await fetch('/api/design-system/icons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          svg: svg.trim(),
          category,
          tags: tags.split(',').map(t => t.trim()).filter(Boolean)
        })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to upload icon')
      }

      onSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload icon')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-[#141414]">Upload Icon</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
                {error}
              </div>
            )}

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SVG File
              </label>
              <input
                type="file"
                accept=".svg"
                onChange={handleFileUpload}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-[#184EFF] focus:ring-1 focus:ring-[#184EFF] focus:outline-none"
              />
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icon Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., arrow-right"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-[#184EFF] focus:ring-1 focus:ring-[#184EFF] focus:outline-none"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
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

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., arrow, direction, next"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-[#184EFF] focus:ring-1 focus:ring-[#184EFF] focus:outline-none"
              />
            </div>

            {/* SVG Preview */}
            {svg && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Preview
                </label>
                <div className="flex items-center justify-center p-4 border border-gray-200 rounded-md bg-gray-50">
                  <div
                    className="w-16 h-16 text-[#141414]"
                    dangerouslySetInnerHTML={{ __html: svg }}
                  />
                </div>
              </div>
            )}

            {/* SVG Code (optional) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SVG Code (paste directly)
              </label>
              <textarea
                value={svg}
                onChange={(e) => setSvg(e.target.value)}
                placeholder="<svg>...</svg>"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono focus:border-[#184EFF] focus:ring-1 focus:ring-[#184EFF] focus:outline-none"
              />
            </div>

            {/* Actions */}
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
                {submitting ? 'Uploading...' : 'Upload Icon'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

// Edit Modal Component
function IconEditModal({ icon, onClose, onSuccess }: { icon: Icon; onClose: () => void; onSuccess: () => void }) {
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
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-[#141414]">Edit Icon: {icon.name}</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
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

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., arrow, direction, next"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-[#184EFF] focus:ring-1 focus:ring-[#184EFF] focus:outline-none"
              />
            </div>

            {/* SVG Preview */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preview
              </label>
              <div className={`flex items-center justify-center p-4 border border-gray-200 rounded-md ${isWhiteIcon ? 'bg-black' : 'bg-gray-50'}`}>
                <div
                  className="w-16 h-16"
                  dangerouslySetInnerHTML={{ __html: svg }}
                />
              </div>
            </div>

            {/* SVG Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                SVG Code
              </label>
              <textarea
                value={svg}
                onChange={(e) => setSvg(e.target.value)}
                placeholder="<svg>...</svg>"
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm font-mono focus:border-[#184EFF] focus:ring-1 focus:ring-[#184EFF] focus:outline-none"
              />
            </div>

            {/* Actions */}
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
