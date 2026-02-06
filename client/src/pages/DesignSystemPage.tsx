import { useState, useEffect, useMemo, useCallback } from 'react'
import { Eye, Code, FileCode, Copy, Check, Plus, Pencil, Trash2, Search, Palette, Layers, Settings, RefreshCw } from 'lucide-react'
import { ImportComponentModal, ComponentData } from '../components/ImportComponentModal'
import { TailwindDevTools } from '../components/TailwindDevTools'
import { IconManager } from '../components/IconManager'
import { RulesEditor } from '../components/RulesEditor'

interface DesignComponent {
  name: string
  category: string
  created: string
  status: string
  content: string
}

type TabType = 'preview' | 'visual-editor' | 'html' | 'css' | 'code'
type ViewMode = 'components' | 'icons' | 'rules'

const statusOptions = ['draft', 'reviewed', 'approved'] as const
type Status = typeof statusOptions[number]

const statusColors: Record<Status, string> = {
  draft: 'bg-gray-100 text-gray-600 border-gray-200',
  reviewed: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  approved: 'bg-green-100 text-green-700 border-green-200'
}

export function DesignSystemPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('components')
  const [components, setComponents] = useState<string[]>([])
  const [selected, setSelected] = useState<DesignComponent | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('preview')
  const [copied, setCopied] = useState(false)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [componentStatuses, setComponentStatuses] = useState<Record<string, string>>({})
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  // Fetch component statuses for filtering
  useEffect(() => {
    const fetchStatuses = async () => {
      const statuses: Record<string, string> = {}
      for (const name of components) {
        try {
          const res = await fetch(`/api/design-system/${name}`)
          const data = await res.json()
          statuses[name] = data.status || 'draft'
        } catch {
          statuses[name] = 'draft'
        }
      }
      setComponentStatuses(statuses)
    }
    if (components.length > 0) {
      fetchStatuses()
    }
  }, [components])

  const filteredComponents = useMemo(() => {
    let filtered = components

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(name =>
        name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(name => componentStatuses[name] === statusFilter)
    }

    return filtered
  }, [components, searchQuery, statusFilter, componentStatuses])

  const loadComponents = () => {
    fetch('/api/design-system')
      .then(res => res.json())
      .then(data => {
        // Filter out RULE from components list
        const filtered = data.filter((name: string) => name !== 'RULE')
        setComponents(filtered)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    loadComponents()
  }, [])

  const handleImport = async (data: ComponentData) => {
    const res = await fetch('/api/design-system', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    const result = await res.json()

    if (!res.ok) {
      throw new Error(result.message || 'Failed to import component')
    }

    // Refresh the component list
    loadComponents()

    // Select the newly imported component
    if (result.name) {
      handleSelect(result.name)
    }
  }

  const handleSelect = async (name: string) => {
    const res = await fetch(`/api/design-system/${name}`)
    const data = await res.json()
    setSelected(data)
    setActiveTab('preview')
  }

  // Parse HTML, CSS, JavaScript, and description from markdown content
  const { html, css, tailwindHtml, javascript, description } = useMemo(() => {
    if (!selected?.content) return { html: '', css: '', tailwindHtml: '', javascript: '', description: '' }

    const content = selected.content

    // Extract description from Preview section
    const descMatch = content.match(/## Preview\s*\n([\s\S]*?)(?=\n## |$)/)
    const description = descMatch ? descMatch[1].trim() : ''

    // Extract HTML block (allow content between header and code block)
    const htmlMatch = content.match(/## HTML[\s\S]*?```html\s*([\s\S]*?)```/)
    const html = htmlMatch ? htmlMatch[1].trim() : ''

    // Extract CSS block (allow content between header and code block)
    const cssMatch = content.match(/## CSS[\s\S]*?```css\s*([\s\S]*?)```/)
    const css = cssMatch ? cssMatch[1].trim() : ''

    // Extract Tailwind HTML block (allow content between header and code block)
    const tailwindMatch = content.match(/## Tailwind CSS[\s\S]*?```html\s*([\s\S]*?)```/)
    const tailwindHtml = tailwindMatch ? tailwindMatch[1].trim() : ''

    // Extract JavaScript block (allow content between header and code block)
    const jsMatch = content.match(/## JavaScript[\s\S]*?```javascript\s*([\s\S]*?)```/)
    const javascript = jsMatch ? jsMatch[1].trim() : ''

    return { html, css, tailwindHtml, javascript, description }
  }, [selected?.content])

  // Prepare edit data from selected component
  const editData: ComponentData | undefined = useMemo(() => {
    if (!selected) return undefined
    return {
      name: selected.name,
      category: selected.category,
      description,
      html,
      css,
      tailwindHtml
    }
  }, [selected, description, html, css, tailwindHtml])

  const handleEdit = async (data: ComponentData) => {
    if (!selected) return

    const res = await fetch(`/api/design-system/${selected.name}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })

    const result = await res.json()

    if (!res.ok) {
      throw new Error(result.message || 'Failed to update component')
    }

    // Refresh the component list
    loadComponents()

    // Select the updated component (name might have changed)
    if (result.name) {
      handleSelect(result.name)
    }
  }

  const handleDelete = async () => {
    if (!selected) return

    setDeleting(true)
    try {
      const res = await fetch(`/api/design-system/${selected.name}`, {
        method: 'DELETE'
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to delete component')
      }

      // Refresh the component list and clear selection
      loadComponents()
      setSelected(null)
      setIsDeleteConfirmOpen(false)
    } catch (err) {
      console.error('Delete failed:', err)
    } finally {
      setDeleting(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    if (!selected) return

    try {
      const res = await fetch(`/api/design-system/${selected.name}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (!res.ok) {
        throw new Error('Failed to update status')
      }

      // Update local status map so filtering reflects the change
      setComponentStatuses(prev => ({ ...prev, [selected.name]: newStatus }))

      // Refresh selected component to show updated status
      handleSelect(selected.name)
    } catch (err) {
      console.error('Status update failed:', err)
    }
  }

  // Generate preview HTML with embedded styles and JavaScript
  const previewHtml = useMemo(() => {
    if (!html && !tailwindHtml) return ''

    const componentHtml = tailwindHtml || html

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
      display: flex;
      align-items: flex-start;
      justify-content: center;
    }
    .component-wrapper {
      width: 100%;
      display: flex;
      justify-content: center;
    }
    /* Dynamic positioning: small components start at 1/3, large components start at top */
    body.small-component {
      padding-top: calc(100vh / 3 - 100px);
    }
    body.large-component {
      padding-top: 30px;
    }
    ${css}
  </style>
</head>
<body>
  <div class="component-wrapper">${componentHtml}</div>
  ${javascript ? `<script>${javascript}</script>` : ''}
  <script>
    // Auto-detect component size and apply appropriate class
    (function() {
      const wrapper = document.querySelector('.component-wrapper');
      if (!wrapper) return;

      function updateBodyClass() {
        const componentHeight = wrapper.scrollHeight;
        const viewportHeight = window.innerHeight;
        const threshold = viewportHeight * 0.5; // 50% of viewport

        if (componentHeight > threshold) {
          document.body.classList.remove('small-component');
          document.body.classList.add('large-component');
        } else {
          document.body.classList.remove('large-component');
          document.body.classList.add('small-component');
        }
      }

      // Initial check
      updateBodyClass();

      // Re-check on resize and mutations
      window.addEventListener('resize', updateBodyClass);

      // Observe DOM changes (for expanding components)
      const observer = new MutationObserver(updateBodyClass);
      observer.observe(wrapper, { childList: true, subtree: true, attributes: true });
    })();
  </script>
</body>
</html>`
  }, [html, css, tailwindHtml, javascript])

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Handle visual editor changes with auto-save
  const handleVisualEditorChange = useCallback(async (newHtml: string) => {
    if (!selected) return

    try {
      const res = await fetch(`/api/design-system/${selected.name}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: selected.name,
          category: selected.category,
          description,
          html,
          css,
          tailwindHtml: newHtml
        })
      })

      if (res.ok) {
        // Update local state to avoid re-fetching and re-parsing
        setSelected(prev => prev ? { ...prev, content: prev.content.replace(/## Tailwind CSS\s*```html[\s\S]*?```/, `## Tailwind CSS\n\`\`\`html\n${newHtml}\n\`\`\``) } : null)
      }
    } catch (err) {
      console.error('Auto-save failed:', err)
    }
  }, [selected, description, html, css])

  const tabs = [
    { id: 'preview' as TabType, label: 'Preview', icon: Eye },
    { id: 'visual-editor' as TabType, label: 'Visual Editor', icon: Palette },
    { id: 'html' as TabType, label: 'HTML', icon: Code },
    { id: 'css' as TabType, label: 'CSS', icon: FileCode },
    { id: 'code' as TabType, label: 'Full Code', icon: Code },
  ]

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-gray-900">Design System</h1>
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('components')}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'components'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Code className="w-4 h-4" />
              Components
            </button>
            <button
              onClick={() => setViewMode('icons')}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'icons'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              Icons
            </button>
            <button
              onClick={() => setViewMode('rules')}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'rules'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Settings className="w-4 h-4" />
              Rules
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {viewMode === 'components' && (
            <>
              <span className="text-sm text-gray-500">{components.length} components</span>
              <button
                onClick={() => setIsImportModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Plus className="w-4 h-4" />
                Import Component
              </button>
            </>
          )}
        </div>
      </div>

      {viewMode === 'components' ? (
        <>
          <ImportComponentModal
            isOpen={isImportModalOpen}
            onClose={() => setIsImportModalOpen(false)}
            onSubmit={handleImport}
            mode="create"
          />

          <ImportComponentModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSubmit={handleEdit}
            initialData={editData}
            mode="edit"
          />

          {/* Delete Confirmation Modal */}
          {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={() => setIsDeleteConfirmOpen(false)}
          />
          <div className="relative min-h-screen flex items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Component</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>{selected?.name}</strong>? This action cannot be undone.
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

      {/* Component Selector Bar */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
        {/* Search Input */}
        <div className="relative flex-shrink-0 w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search components..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Status Filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="flex-shrink-0 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="reviewed">Reviewed</option>
          <option value="approved">Approved</option>
        </select>

        {/* Horizontal Component List */}
        <div className="flex gap-2 overflow-x-auto flex-1 pb-1">
          {filteredComponents.length === 0 ? (
            <span className="text-gray-500 text-sm py-2">
              {components.length === 0 ? 'No components yet' : 'No matching components'}
            </span>
          ) : (
            filteredComponents.map(name => (
              <button
                key={name}
                onClick={() => handleSelect(name)}
                className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-colors ${
                  selected?.name === name
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {name}
              </button>
            ))
          )}
        </div>
      </div>

      {/* Component Detail - Full Width */}
      <div>
          {selected ? (
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
                      onChange={(e) => handleStatusChange(e.target.value)}
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
                      onClick={() => setIsEditModalOpen(true)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => setIsDeleteConfirmOpen(true)}
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
                      onClick={async () => {
                        if (!selected) return
                        try {
                          const res = await fetch(`/api/design-system/${selected.name}`)
                          if (!res.ok) throw new Error('Failed to fetch')
                          const data = await res.json()
                          setSelected(data)
                          setToast({ message: 'Component refreshed', type: 'success' })
                        } catch {
                          setToast({ message: 'Failed to refresh', type: 'error' })
                        }
                      }}
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
                        onChange={handleVisualEditorChange}
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
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
              <Eye className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Select a component to preview</p>
            </div>
          )}
      </div>
        </>
      ) : viewMode === 'icons' ? (
        /* Icons View */
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden" style={{ minHeight: '600px' }}>
          <IconManager />
        </div>
      ) : (
        /* Rules View */
        <div className="bg-white rounded-lg border border-gray-200 p-6" style={{ minHeight: '600px' }}>
          <RulesEditor />
        </div>
      )}

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
