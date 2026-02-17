import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { HtmlNode } from '../utils/parseHtmlTree'

interface ElementTreeProps {
  nodes: HtmlNode[]
  selectedPath: number[]
  hoveredPath: number[] | null
  onSelect: (path: number[]) => void
  onHover: (path: number[] | null) => void
}

interface TreeNodeProps {
  node: HtmlNode
  depth: number
  selectedPath: number[]
  hoveredPath: number[] | null
  onSelect: (path: number[]) => void
  onHover: (path: number[] | null) => void
}

function TreeNode({
  node,
  depth,
  selectedPath,
  hoveredPath,
  onSelect,
  onHover
}: TreeNodeProps) {
  const [expanded, setExpanded] = useState(true)
  const hasChildren = node.children.length > 0

  const isSelected = JSON.stringify(selectedPath) === JSON.stringify(node.path)
  const isHovered = hoveredPath && JSON.stringify(hoveredPath) === JSON.stringify(node.path)

  const classPreview = node.classes.length > 0
    ? node.classes.slice(0, 2).join(' ') + (node.classes.length > 2 ? '...' : '')
    : ''

  return (
    <div>
      <div
        className={`flex items-center gap-1 py-1 px-2 cursor-pointer rounded text-sm ${
          isSelected
            ? 'bg-blue-100 text-blue-800'
            : isHovered
            ? 'bg-gray-100'
            : 'hover:bg-gray-50'
        }`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => onSelect(node.path)}
        onMouseEnter={() => onHover(node.path)}
        onMouseLeave={() => onHover(null)}
      >
        {hasChildren ? (
          <button
            onClick={e => {
              e.stopPropagation()
              setExpanded(!expanded)
            }}
            className="p-0.5 hover:bg-gray-200 rounded"
          >
            {expanded ? (
              <ChevronDown className="w-3 h-3 text-gray-400" />
            ) : (
              <ChevronRight className="w-3 h-3 text-gray-400" />
            )}
          </button>
        ) : (
          <span className="w-4" />
        )}

        <span className="font-mono">
          <span className="text-purple-600">&lt;{node.tagName}</span>
          {classPreview && (
            <span className="text-gray-500 ml-1">
              class="<span className="text-green-600">{classPreview}</span>"
            </span>
          )}
          <span className="text-purple-600">&gt;</span>
        </span>

        {node.textContent && !hasChildren && (
          <span className="text-gray-400 truncate ml-1 text-xs">
            {node.textContent.length > 20
              ? node.textContent.substring(0, 20) + '...'
              : node.textContent}
          </span>
        )}
      </div>

      {hasChildren && expanded && (
        <div>
          {node.children.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              depth={depth + 1}
              selectedPath={selectedPath}
              hoveredPath={hoveredPath}
              onSelect={onSelect}
              onHover={onHover}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function ElementTree({
  nodes,
  selectedPath,
  hoveredPath,
  onSelect,
  onHover
}: ElementTreeProps) {
  if (nodes.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 text-sm p-4">
        No HTML elements found
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto py-2">
      {nodes.map(node => (
        <TreeNode
          key={node.id}
          node={node}
          depth={0}
          selectedPath={selectedPath}
          hoveredPath={hoveredPath}
          onSelect={onSelect}
          onHover={onHover}
        />
      ))}
    </div>
  )
}
