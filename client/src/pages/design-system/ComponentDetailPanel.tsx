import { useState, useCallback } from 'react'
import { Eye, Code, FileCode, Copy, Check, Pencil, Trash2, Palette, RefreshCw } from 'lucide-react'
import { TailwindDevTools } from '../../components/design-system/TailwindDevTools'

interface DesignComponent {
  name: string
  category: string
  created: string
  status: string
  content: string
}

type TabType = 'preview' | 'visual-editor' | 'html' | 'css' | 'code'
type Status = 'draft' | 'reviewed' | 'approved'

const statusColors: Record<Status, string> = {
  draft: 'bg-gray-100 text-gray-600 border-gray-200',
  reviewed: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  approved: 'bg-green-100 text-green-700 border-green-200'
}

interface ComponentDetailPanelProps {
  selected: DesignComponent
  html: string
  css: string
  tailwindHtml: string
  description: string
  previewHtml: string
  onEdit: () => void
  onDelete: () => void
  onStatusChange: (status: string) => void
  onRefresh: () => Promise<void>
  onVisualEditorChange: (newHtml: string) => Promise<void>
}

export function ComponentDetailPanel({
  selected,
  html,
  css,
  tailwindHtml,
  description,
  previewHtml,
  onEdit,
  onDelete,
  onStatusChange,
  onRefresh,
  onVisualEditorChange
}: ComponentDetailPanelProps) {
  const [activeTab, setActiveTab] = useState<TabType>('preview')
  const [copied, setCopied] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleRefreshClick = useCallback(async () => {
    try {
      await onRefresh()
      setToast({ message: 'Component refreshed', type: 'success' })
    } catch {
      setToast({ message: 'Failed to refresh', type: 'error' })
    }
  }, [onRefresh])

  const tabs = [
    { id: 'preview' as TabType, label: 'Preview', icon: Eye },
    { id: 'visual-editor' as TabType, label: 'Visual Editor', icon: Palette },
    { id: 'html' as TabType, label: 'HTML', icon: Code },
    { id: 'css' as TabType, label: 'CSS', icon: FileCode },
    { id: 'code' as TabType, label: 'Full Code', icon: Code },
  ]

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* Header - Component name with category and status inline */}
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-900">{selected.name}</h2>
            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
              {selected.category}
            </span>
            <select
              value={selected.status}
              onChange={(e) => onStatusChange(e.target.value)}
              className={`px-2 py-0.5 text-xs rounded border cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                statusColors[selected.status as Status] || 'bg-gray-100 text-gray-600 border-gray-200'
              }`}
            >
              <option value="draft">Draft</option>
              <option value="reviewed">Reviewed</option>
              <option value="approved">Approved</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={onDelete}
              className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Tabs with Live render/Refresh on Preview tab */}
      <div className="flex border-b border-gray-200">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
            {id === 'preview' && activeTab === 'preview' && (
              <span className="ml-1 text-xs text-gray-400">• Live</span>
            )}
          </button>
        ))}
        {/* Refresh button in tab bar when Preview is active */}
        {activeTab === 'preview' && (
          <div className="ml-auto flex items-center pr-4">
            <button
              onClick={handleRefreshClick}
              className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
              title="Refresh component"
            >
              <RefreshCw className="w-3 h-3" />
              Refresh
            </button>
          </div>
        )}
      </div>

      {/* Tab Content */}
      <div className="p-4">
        {/* Preview Tab - No header, direct preview for more space */}
        {activeTab === 'preview' && (
          <div>
            {previewHtml ? (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <iframe
                  srcDoc={previewHtml}
                  className="w-full h-[650px] bg-gray-50"
                  title="Component Preview"
                />
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                No HTML/CSS found in component documentation.
                Make sure the markdown has ## HTML and ## CSS sections.
              </div>
            )}
          </div>
        )}

        {/* Visual Editor Tab */}
        {activeTab === 'visual-editor' && (
          <div>
            {(tailwindHtml || html) ? (
              <TailwindDevTools
                html={tailwindHtml || html}
                onChange={onVisualEditorChange}
              />
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
                No HTML found in component documentation.
                Make sure the markdown has ## Tailwind CSS or ## HTML sections.
              </div>
            )}
          </div>
        )}

        {/* HTML Tab */}
        {activeTab === 'html' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">HTML Code</h3>
              <button
                onClick={() => handleCopy(tailwindHtml || html)}
                className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            {html || tailwindHtml ? (
              <>
                {tailwindHtml && (
                  <div className="mb-4">
                    <span className="text-xs text-gray-500 mb-2 block">Tailwind CSS version:</span>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto text-sm">
                      <code>{tailwindHtml}</code>
                    </pre>
                  </div>
                )}
                {html && (
                  <div>
                    <span className="text-xs text-gray-500 mb-2 block">Standard HTML:</span>
                    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto text-sm">
                      <code>{html}</code>
                    </pre>
                  </div>
                )}
              </>
            ) : (
              <p className="text-gray-500 text-sm">No HTML code found</p>
            )}
          </div>
        )}

        {/* CSS Tab */}
        {activeTab === 'css' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">CSS Styles</h3>
              <button
                onClick={() => handleCopy(css)}
                className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            {css ? (
              <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-auto text-sm">
                <code>{css}</code>
              </pre>
            ) : (
              <p className="text-gray-500 text-sm">No CSS code found (component may use Tailwind only)</p>
            )}
          </div>
        )}

        {/* Full Code Tab */}
        {activeTab === 'code' && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-gray-700">Full Documentation</h3>
              <button
                onClick={() => handleCopy(selected.content)}
                className="flex items-center gap-1 px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
              >
                {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
            <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-sm max-h-96">
              {selected.content}
            </pre>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg transition-all ${
          toast.type === 'success'
            ? 'bg-green-600 text-white'
            : 'bg-red-600 text-white'
        }`}>
          {toast.type === 'success' ? (
            <Check className="w-4 h-4" />
          ) : (
            <span className="w-4 h-4 flex items-center justify-center">✕</span>
          )}
          <span className="text-sm font-medium">{toast.message}</span>
          <button
            onClick={() => setToast(null)}
            className="ml-2 hover:opacity-80"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}
