import { useState, useEffect, useCallback } from 'react'
import { Upload, Trash2, Pencil, Search, X, Plus } from 'lucide-react'
import { IconUploadModal } from './IconUploadModal'
import { IconEditModal } from './IconEditModal'

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
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded ${isWhiteIcon ? 'bg-black' : ''}`}
                    dangerouslySetInnerHTML={{ __html: icon.svg }}
                  />
                  <span className="mt-2 text-xs text-gray-600 truncate w-full text-center">
                    {icon.name}
                  </span>
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

      {isUploadModalOpen && (
        <IconUploadModal
          onClose={() => setIsUploadModalOpen(false)}
          onSuccess={() => {
            setIsUploadModalOpen(false)
            fetchIcons()
          }}
        />
      )}

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
