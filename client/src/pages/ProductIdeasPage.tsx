import { useState, useEffect } from 'react'
import { Card } from '../components/Card'

interface ProductIdea {
  name: string
  category: string
  created: string
  status: string
  priority: string
  content: string
}

export function ProductIdeasPage() {
  const [ideas, setIdeas] = useState<string[]>([])
  const [selected, setSelected] = useState<ProductIdea | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/product-idea')
      .then(res => res.json())
      .then(data => {
        setIdeas(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSelect = async (name: string) => {
    const res = await fetch(`/api/product-idea/${name}`)
    const data = await res.json()
    setSelected(data)
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Product Ideas</h1>
        <span className="text-sm text-gray-500">{ideas.length} ideas</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ideas List */}
        <div className="lg:col-span-1 space-y-4">
          {ideas.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No product ideas yet. Use @import-idea to add ideas.
            </p>
          ) : (
            ideas.map(name => (
              <Card
                key={name}
                title={name.replace(/-/g, ' ')}
                onClick={() => handleSelect(name)}
              />
            ))
          )}
        </div>

        {/* Idea Detail */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {selected.name.replace(/-/g, ' ')}
                  </h2>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      {selected.category}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">
                      {selected.status}
                    </span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-600 text-xs rounded">
                      {selected.priority}
                    </span>
                  </div>
                </div>
              </div>
              <div className="prose prose-sm max-w-none">
                <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-sm whitespace-pre-wrap">
                  {selected.content}
                </pre>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
              <p className="text-gray-500">Select an idea to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
