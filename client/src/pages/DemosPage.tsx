import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Trash2 } from 'lucide-react'
import { Card } from '../components/Card'

interface Demo {
  name: string
  created: string
  status: string
  productIdea: string
  pages: string[]
  components: string[]
}

export function DemosPage() {
  const [demos, setDemos] = useState<string[]>([])
  const [selected, setSelected] = useState<Demo | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const navigate = useNavigate()

  const loadDemos = () => {
    fetch('/api/demo')
      .then(res => res.json())
      .then(data => {
        setDemos(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    loadDemos()
  }, [])

  const handleSelect = async (name: string) => {
    const res = await fetch(`/api/demo/${name}`)
    const data = await res.json()
    setSelected(data)
  }

  const handleDelete = async () => {
    if (!selected) return
    setDeleting(true)
    try {
      const res = await fetch(`/api/demo/${selected.name}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      loadDemos()
      setSelected(null)
      setIsDeleteConfirmOpen(false)
    } catch (err) {
      console.error('Delete failed:', err)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div>
      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setIsDeleteConfirmOpen(false)}
          />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-red-100 rounded-full">
                  <Trash2 className="w-5 h-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Demo?</h3>
              </div>
              <p className="text-gray-600 mb-6">
                This will permanently delete <strong>{selected?.name}</strong> and all its pages.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {deleting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Demo Projects</h1>
        <span className="text-sm text-gray-500">{demos.length} demos</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Demos List */}
        <div className="lg:col-span-1 space-y-4">
          {demos.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No demos yet. Use /create-demo to create a demo.
            </p>
          ) : (
            demos.map(name => (
              <Card
                key={name}
                title={name.replace(/-/g, ' ')}
                onClick={() => handleSelect(name)}
              />
            ))
          )}
        </div>

        {/* Demo Detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selected.name.replace(/-/g, ' ')}
                  </h2>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">
                      {selected.status}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {selected.pages.length} pages
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsDeleteConfirmOpen(true)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>

              {/* Pages */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Pages</h3>
                <div className="space-y-2">
                  {selected.pages.length === 0 ? (
                    <p className="text-sm text-gray-500">No pages yet</p>
                  ) : (
                    selected.pages.map(page => (
                      <div
                        key={page}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="text-sm text-gray-700">{page}</span>
                        <button
                          onClick={() => navigate(`/demos/${selected.name}/preview?page=${page}`)}
                          className="flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Eye className="w-4 h-4" />
                          Preview
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Product Idea Reference */}
              {selected.productIdea && (
                <div className="mt-6 p-3 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Product Idea:</strong> {selected.productIdea}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
              <p className="text-gray-500">Select a demo to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
