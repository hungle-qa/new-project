import { useState, useEffect, useCallback } from 'react'
import { Plus, Trash2, Save, ChevronRight, ChevronDown } from 'lucide-react'
import { genId, getMaxDepth, flattenTree } from './LevelsHelpers'
import { StructureTemplatePreview } from './StructureTemplatePreview'

export interface StructureNode {
  id: string
  name: string
  children: StructureNode[]
}

interface StructureTabProps {
  feature: string
  structure: StructureNode[]
  onSave: (structure: StructureNode[]) => Promise<void>
  onDirtyChange?: (dirty: boolean) => void
  saveRef?: (saveFn: (() => Promise<void>) | null) => void
}

export function StructureTab({ feature, structure: initialStructure, onSave, onDirtyChange, saveRef }: StructureTabProps) {
  const [structure, setStructure] = useState<StructureNode[]>(initialStructure)
  const [saving, setSaving] = useState(false)
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')

  const hasChanges = JSON.stringify(structure) !== JSON.stringify(initialStructure)

  const handleSave = useCallback(async () => {
    setSaving(true)
    try {
      await onSave(structure)
    } finally {
      setSaving(false)
    }
  }, [structure, onSave])

  useEffect(() => {
    onDirtyChange?.(hasChanges)
  }, [hasChanges])

  useEffect(() => {
    saveRef?.(hasChanges ? handleSave : null)
    return () => saveRef?.(null)
  }, [hasChanges, handleSave])

  useEffect(() => {
    setStructure(initialStructure)
  }, [initialStructure, feature])

  // Tree mutation helpers (immutable updates)
  function updateNode(nodes: StructureNode[], id: string, updater: (n: StructureNode) => StructureNode): StructureNode[] {
    return nodes.map(node => {
      if (node.id === id) return updater(node)
      return { ...node, children: updateNode(node.children, id, updater) }
    })
  }

  function removeNode(nodes: StructureNode[], id: string): StructureNode[] {
    return nodes
      .filter(node => node.id !== id)
      .map(node => ({ ...node, children: removeNode(node.children, id) }))
  }

  function addChild(nodes: StructureNode[], parentId: string, child: StructureNode): StructureNode[] {
    return nodes.map(node => {
      if (node.id === parentId) {
        return { ...node, children: [...node.children, child] }
      }
      return { ...node, children: addChild(node.children, parentId, child) }
    })
  }

  const handleAddRoot = () => {
    const newNode: StructureNode = { id: genId(), name: '', children: [] }
    setStructure([...structure, newNode])
    setEditingId(newNode.id)
    setEditText('')
  }

  const handleAddChild = (parentId: string) => {
    const newNode: StructureNode = { id: genId(), name: '', children: [] }
    setStructure(addChild(structure, parentId, newNode))
    // Ensure parent is expanded
    setCollapsed(prev => {
      const next = new Set(prev)
      next.delete(parentId)
      return next
    })
    setEditingId(newNode.id)
    setEditText('')
  }

  const handleRemove = (id: string) => {
    setStructure(removeNode(structure, id))
    if (editingId === id) setEditingId(null)
  }

  const handleRename = (id: string, name: string) => {
    setStructure(updateNode(structure, id, n => ({ ...n, name })))
    setEditingId(null)
  }

  const startEdit = (id: string, currentName: string) => {
    setEditingId(id)
    setEditText(currentName)
  }

  const toggleCollapse = (id: string) => {
    setCollapsed(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // Render tree recursively
  function renderNode(node: StructureNode, depth: number, isLast: boolean) {
    const hasChildren = node.children.length > 0
    const isCollapsed = collapsed.has(node.id)
    const isEditing = editingId === node.id
    const indent = depth * 24

    return (
      <div key={node.id}>
        <div
          className="flex items-center gap-1 group hover:bg-gray-50 rounded py-1 pr-2"
          style={{ paddingLeft: `${indent + 8}px` }}
        >
          {/* Tree line indicator */}
          {depth > 0 && (
            <span className="text-gray-300 text-xs w-4 flex-shrink-0 text-center select-none">
              {isLast ? '└' : '├'}
            </span>
          )}

          {/* Expand/collapse toggle */}
          <button
            onClick={() => hasChildren && toggleCollapse(node.id)}
            className={`flex-shrink-0 w-5 h-5 flex items-center justify-center rounded ${
              hasChildren ? 'text-gray-500 hover:bg-gray-200' : 'text-transparent'
            }`}
            tabIndex={hasChildren ? 0 : -1}
          >
            {hasChildren && (
              isCollapsed
                ? <ChevronRight className="w-3.5 h-3.5" />
                : <ChevronDown className="w-3.5 h-3.5" />
            )}
          </button>

          {/* Node name */}
          {isEditing ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={() => handleRename(node.id, editText.trim())}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename(node.id, editText.trim())
                if (e.key === 'Escape') { setEditingId(null); setEditText('') }
              }}
              autoFocus
              placeholder="Node name..."
              className="flex-1 px-2 py-0.5 text-sm border border-blue-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 min-w-0"
            />
          ) : (
            <button
              onClick={() => startEdit(node.id, node.name)}
              className="flex-1 text-left text-sm text-gray-800 px-2 py-0.5 rounded hover:bg-blue-50 truncate min-w-0"
              title="Click to rename"
            >
              {node.name || <span className="text-gray-400 italic">unnamed</span>}
            </button>
          )}

          {/* Actions */}
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
            <button
              onClick={() => handleAddChild(node.id)}
              className="flex items-center gap-0.5 px-1.5 py-0.5 text-xs text-blue-600 hover:bg-blue-100 rounded"
              title="Add child"
            >
              <Plus className="w-3 h-3" />
              <span className="hidden sm:inline">Child</span>
            </button>
            <button
              onClick={() => handleRemove(node.id)}
              className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded"
              title="Delete"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Children */}
        {hasChildren && !isCollapsed && (
          <div>
            {node.children.map((child, i) =>
              renderNode(child, depth + 1, i === node.children.length - 1)
            )}
          </div>
        )}
      </div>
    )
  }

  // Template preview
  const maxDepth = getMaxDepth(structure)
  const flatRows = flattenTree(structure, maxDepth)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-700">Structure</h3>
          <p className="text-xs text-gray-500 mt-0.5">Define the test module hierarchy (replaces Module column in template)</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || !hasChanges}
          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-3 h-3" />
          {saving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Tree editor */}
      <div className="border border-gray-200 rounded-lg bg-white">
        {structure.length === 0 ? (
          <div className="text-center py-8 text-gray-500 text-sm">
            No structure defined. Click "Add Root Node" to start.
          </div>
        ) : (
          <div className="py-2">
            {structure.map((node, i) =>
              renderNode(node, 0, i === structure.length - 1)
            )}
          </div>
        )}

        {/* Add root button */}
        <div className="border-t border-gray-100 px-3 py-2">
          <button
            onClick={handleAddRoot}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md"
          >
            <Plus className="w-4 h-4" />
            Add Root Node
          </button>
        </div>
      </div>

      {/* Template Preview */}
      {maxDepth > 0 && flatRows.length > 0 && (
        <StructureTemplatePreview maxDepth={maxDepth} flatRows={flatRows} />
      )}
    </div>
  )
}
