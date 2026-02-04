import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, ExternalLink } from 'lucide-react'

export function DemoPreviewPage() {
  const { name } = useParams<{ name: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const page = searchParams.get('page') || 'index.html'
  const [content, setContent] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/demo/${name}/pages/${page}`)
      .then(res => res.text())
      .then(data => {
        setContent(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [name, page])

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/demos')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="text-xl font-bold text-gray-900">
            {name?.replace(/-/g, ' ')} / {page}
          </h1>
        </div>
        <a
          href={`/api/demo/${name}/pages/${page}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <ExternalLink className="w-4 h-4" />
          Open in New Tab
        </a>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <iframe
          srcDoc={content}
          className="w-full h-[600px] border-0"
          title="Demo Preview"
        />
      </div>
    </div>
  )
}
