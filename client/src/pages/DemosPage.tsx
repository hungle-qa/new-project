import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye } from 'lucide-react'
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
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/demo')
      .then(res => res.json())
      .then(data => {
        setDemos(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSelect = async (name: string) => {
    const res = await fetch(`/api/demo/${name}`)
    const data = await res.json()
    setSelected(data)
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div>
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
