import { useState, useEffect, useMemo, useCallback } from 'react'
import { Eye } from 'lucide-react'
import { ImportComponentModal, ComponentData } from '../../components/design-system/ImportComponentModal'
import { ComponentDetailPanel } from './ComponentDetailPanel'
import { DeleteComponentModal } from './DeleteComponentModal'
import { ComponentSelectorBar } from './ComponentSelectorBar'
import { parseComponentContent } from './parseComponentContent'
import { usePreviewHtml } from './usePreviewHtml'

interface DesignComponent {
  name: string
  category: string
  created: string
  status: string
  content: string
}

interface ComponentsViewProps {
  components: string[]
  onComponentsChange: () => void
  onImportModalOpen: (handler: () => void) => void
}


export function ComponentsView({ components, onComponentsChange, onImportModalOpen }: ComponentsViewProps) {
  // Pass the import modal opener to parent
  useEffect(() => {
    onImportModalOpen(() => setIsImportModalOpen(true))
  }, [])
  const [selected, setSelected] = useState<DesignComponent | null>(null)
  const [isImportModalOpen, setIsImportModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [componentStatuses, setComponentStatuses] = useState<Record<string, string>>({})

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
    onComponentsChange()

    // Select the newly imported component
    if (result.name) {
      handleSelect(result.name)
    }
  }

  const handleSelect = async (name: string) => {
    const res = await fetch(`/api/design-system/${name}`)
    const data = await res.json()
    setSelected(data)
  }

  // Parse HTML, CSS, JavaScript, and description from markdown content
  const { html, css, tailwindHtml, javascript, description } = useMemo(
    () => parseComponentContent(selected?.content),
    [selected?.content]
  )

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
    onComponentsChange()

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
      onComponentsChange()
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
  const previewHtml = usePreviewHtml(html, css, tailwindHtml, javascript)

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

  // Refresh component data from API
  const handleRefresh = useCallback(async () => {
    if (!selected) return
    const res = await fetch(`/api/design-system/${selected.name}`)
    if (!res.ok) throw new Error('Failed to fetch')
    const data = await res.json()
    setSelected(data)
  }, [selected])

  return (
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
        <DeleteComponentModal
          componentName={selected?.name || ''}
          deleting={deleting}
          onDelete={handleDelete}
          onClose={() => setIsDeleteConfirmOpen(false)}
        />
      )}

      {/* Component Selector Bar */}
      <ComponentSelectorBar
        components={components}
        filteredComponents={filteredComponents}
        selectedName={selected?.name || null}
        searchQuery={searchQuery}
        statusFilter={statusFilter}
        onSearchChange={setSearchQuery}
        onStatusFilterChange={setStatusFilter}
        onSelect={handleSelect}
      />

      {/* Component Detail - Full Width */}
      <div>
        {selected ? (
          <ComponentDetailPanel
            selected={selected}
            html={html}
            css={css}
            tailwindHtml={tailwindHtml}
            description={description}
            previewHtml={previewHtml}
            onEdit={() => setIsEditModalOpen(true)}
            onDelete={() => setIsDeleteConfirmOpen(true)}
            onStatusChange={handleStatusChange}
            onRefresh={handleRefresh}
            onVisualEditorChange={handleVisualEditorChange}
          />
        ) : (
          <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
            <Eye className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Select a component to preview</p>
          </div>
        )}
      </div>
    </>
  )
}
