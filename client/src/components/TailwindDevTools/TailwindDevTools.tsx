import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { Save, Code, Layers } from 'lucide-react'
import { ElementTree } from './ElementTree'
import { StylesPanel } from './StylesPanel'
import {
  parseHtmlToTree,
  treeToHtml,
  getNodeByPath,
  HtmlNode
} from '../../utils/parseHtmlTree'

interface TailwindDevToolsProps {
  html: string
  onChange: (newHtml: string) => void
}

export function TailwindDevTools({ html, onChange }: TailwindDevToolsProps) {
  const [htmlTree, setHtmlTree] = useState<HtmlNode[]>([])
  const [selectedPath, setSelectedPath] = useState<number[]>([])
  const [hoveredPath, setHoveredPath] = useState<number[] | null>(null)
  // Track disabled (unchecked) classes per node - these are hidden in preview but kept in list
  const [disabledClasses, setDisabledClasses] = useState<Map<string, Set<string>>>(new Map())
  // Track added classes per node (not yet saved)
  const [addedClasses, setAddedClasses] = useState<Map<string, string[]>>(new Map())
  const [hasChanges, setHasChanges] = useState(false)
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const lastHtml = useRef<string | null>(null)
  // Editor mode: 'visual' for tree+styles, 'code' for HTML editor
  const [editorMode, setEditorMode] = useState<'visual' | 'code'>('visual')
  // Raw HTML for code editor
  const [rawHtml, setRawHtml] = useState(html || '')

  // Parse HTML to tree on mount or when HTML changes externally
  useEffect(() => {
    if (!html) {
      setHtmlTree([])
      setSelectedPath([])
      setRawHtml('')
      lastHtml.current = html
      return
    }

    const tree = parseHtmlToTree(html)
    setHtmlTree(tree)

    // Reset selection on initial mount (lastHtml is null) or when HTML changes externally
    if (lastHtml.current === null || html !== lastHtml.current) {
      if (tree.length > 0) {
        setSelectedPath([0])
      } else {
        setSelectedPath([])
      }
      // Reset local changes when HTML changes externally
      setDisabledClasses(new Map())
      setAddedClasses(new Map())
      setHasChanges(false)
      setRawHtml(html)
    }
    lastHtml.current = html
  }, [html])

  const selectedNode = useMemo(
    () => (htmlTree.length > 0 && selectedPath.length > 0)
      ? getNodeByPath(htmlTree, selectedPath)
      : null,
    [htmlTree, selectedPath]
  )

  // Get disabled and added classes for current node
  const nodeKey = selectedPath.length > 0 ? selectedPath.join('-') : ''
  const currentDisabledClasses = nodeKey ? (disabledClasses.get(nodeKey) || new Set()) : new Set<string>()
  const currentAddedClasses = nodeKey ? (addedClasses.get(nodeKey) || []) : []

  // Combined classes for selected node (original + added)
  const allClasses = useMemo(() => {
    if (!selectedNode) return []
    return [...selectedNode.classes, ...currentAddedClasses]
  }, [selectedNode, currentAddedClasses])

  // Compute effective classes for preview (excluding disabled ones)
  const getEffectiveClasses = useCallback((node: HtmlNode, path: number[]): string[] => {
    const key = path.join('-')
    const disabled = disabledClasses.get(key) || new Set()
    const added = addedClasses.get(key) || []
    const allCls = [...node.classes, ...added]
    return allCls.filter(cls => !disabled.has(cls))
  }, [disabledClasses, addedClasses])

  // Generate preview HTML with highlights
  const previewHtml = useMemo(() => {
    const generateNodeHtml = (node: HtmlNode, path: number[]): string => {
      const effectiveClasses = getEffectiveClasses(node, path)
      const isSelected = JSON.stringify(path) === JSON.stringify(selectedPath)

      const highlightStyle = isSelected ? 'outline: 2px dashed #3b82f6; outline-offset: 2px;' : ''

      const classAttr = effectiveClasses.length > 0 ? ` class="${effectiveClasses.join(' ')}"` : ''
      const styleAttr = highlightStyle ? ` style="${highlightStyle}"` : ''
      const dataAttr = ` data-path="${path.join('-')}"`

      const otherAttrs = Object.entries(node.attributes)
        .map(([key, value]) => ` ${key}="${value}"`)
        .join('')

      const selfClosingTags = ['img', 'br', 'hr', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'param', 'source', 'track', 'wbr']

      if (selfClosingTags.includes(node.tagName)) {
        return `<${node.tagName}${classAttr}${otherAttrs}${styleAttr}${dataAttr} />`
      }

      const childrenHtml = node.children
        .map((child, i) => generateNodeHtml(child, [...path, i]))
        .join('')

      const textContent = node.textContent || ''

      return `<${node.tagName}${classAttr}${otherAttrs}${styleAttr}${dataAttr}>${textContent}${childrenHtml}</${node.tagName}>`
    }

    const bodyContent = htmlTree.map((node, i) => generateNodeHtml(node, [i])).join('')

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
    }
    [data-path] {
      cursor: pointer;
    }
    [data-path].hovered {
      outline: 1px dashed #9ca3af !important;
      outline-offset: 1px;
    }
  </style>
</head>
<body>
  ${bodyContent}
  <script>
    let hoveredEl = null;
    document.querySelectorAll('[data-path]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        const path = el.dataset.path;
        window.parent.postMessage({ type: 'select', path }, '*');
      });
      el.addEventListener('mouseenter', (e) => {
        e.stopPropagation();
        if (hoveredEl) hoveredEl.classList.remove('hovered');
        el.classList.add('hovered');
        hoveredEl = el;
        window.parent.postMessage({ type: 'hover', path: el.dataset.path }, '*');
      });
      el.addEventListener('mouseleave', (e) => {
        el.classList.remove('hovered');
        hoveredEl = null;
        window.parent.postMessage({ type: 'hover', path: null }, '*');
      });
    });
  </script>
</body>
</html>`
  }, [htmlTree, selectedPath, getEffectiveClasses])

  // Listen for messages from iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'select' && event.data.path) {
        const path = event.data.path.split('-').map(Number)
        setSelectedPath(path)
      } else if (event.data?.type === 'hover') {
        if (event.data.path) {
          const path = event.data.path.split('-').map(Number)
          setHoveredPath(path)
        } else {
          setHoveredPath(null)
        }
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  // Toggle class enabled/disabled (for preview only, not saved)
  const handleToggleClass = (className: string) => {
    const newDisabled = new Map(disabledClasses)
    const nodeDisabled = new Set(currentDisabledClasses)

    if (nodeDisabled.has(className)) {
      nodeDisabled.delete(className)
    } else {
      nodeDisabled.add(className)
    }

    newDisabled.set(nodeKey, nodeDisabled)
    setDisabledClasses(newDisabled)
    setHasChanges(true)
  }

  // Remove class completely (from original or added)
  const handleRemoveClass = (className: string) => {
    if (!selectedNode) return

    // Check if it's an added class
    if (currentAddedClasses.includes(className)) {
      const newAdded = new Map(addedClasses)
      newAdded.set(nodeKey, currentAddedClasses.filter(c => c !== className))
      setAddedClasses(newAdded)
    }

    // Also remove from disabled set if present
    if (currentDisabledClasses.has(className)) {
      const newDisabled = new Map(disabledClasses)
      const nodeDisabled = new Set(currentDisabledClasses)
      nodeDisabled.delete(className)
      newDisabled.set(nodeKey, nodeDisabled)
      setDisabledClasses(newDisabled)
    }

    setHasChanges(true)
  }

  // Add new class (locally, not saved yet)
  const handleAddClass = (className: string) => {
    if (!selectedNode) return
    if (allClasses.includes(className)) return

    const newAdded = new Map(addedClasses)
    newAdded.set(nodeKey, [...currentAddedClasses, className])
    setAddedClasses(newAdded)
    setHasChanges(true)
  }

  // Handle raw HTML changes in code editor
  const handleRawHtmlChange = (newRawHtml: string) => {
    setRawHtml(newRawHtml)
    setHasChanges(true)
  }

  // Preview HTML for code editor mode (uses rawHtml directly)
  const codeEditorPreviewHtml = useMemo(() => {
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
    }
  </style>
</head>
<body>
  ${rawHtml}
</body>
</html>`
  }, [rawHtml])

  // Save all changes
  const handleSave = useCallback(() => {
    if (editorMode === 'code') {
      // Code editor mode: save raw HTML directly
      onChange(rawHtml)
      setHasChanges(false)
      // Update tree to match new HTML
      const tree = parseHtmlToTree(rawHtml)
      setHtmlTree(tree)
      if (tree.length > 0) {
        setSelectedPath([0])
      }
      setDisabledClasses(new Map())
      setAddedClasses(new Map())
      lastHtml.current = rawHtml
    } else {
      // Visual editor mode: apply class changes to tree
      let newTree = [...htmlTree]

      // Helper to update node classes recursively
      const applyChangesToNode = (nodes: HtmlNode[], path: number[]): HtmlNode[] => {
        return nodes.map((node, index) => {
          const currentPath = [...path, index]
          const key = currentPath.join('-')
          const disabled = disabledClasses.get(key) || new Set()
          const added = addedClasses.get(key) || []

          // Compute final classes: original + added, minus disabled
          const finalClasses = [...node.classes, ...added].filter(cls => !disabled.has(cls))

          const updatedNode: HtmlNode = {
            ...node,
            classes: finalClasses,
            children: node.children.length > 0 ? applyChangesToNode(node.children, currentPath) : []
          }

          return updatedNode
        })
      }

      newTree = applyChangesToNode(htmlTree, [])

      // Generate new HTML and save
      const newHtml = treeToHtml(newTree)
      onChange(newHtml)
      setRawHtml(newHtml)

      // Reset local state
      setDisabledClasses(new Map())
      setAddedClasses(new Map())
      setHasChanges(false)
    }
  }, [editorMode, rawHtml, htmlTree, disabledClasses, addedClasses, onChange])

  // Switch editor mode
  const handleModeSwitch = (mode: 'visual' | 'code') => {
    if (mode === editorMode) return

    if (hasChanges) {
      // Auto-sync changes when switching modes
      if (editorMode === 'code') {
        // Switching from code to visual: parse rawHtml to tree
        const tree = parseHtmlToTree(rawHtml)
        setHtmlTree(tree)
        if (tree.length > 0) {
          setSelectedPath([0])
        }
        setDisabledClasses(new Map())
        setAddedClasses(new Map())
      } else {
        // Switching from visual to code: apply changes and update rawHtml
        let newTree = [...htmlTree]
        const applyChangesToNode = (nodes: HtmlNode[], path: number[]): HtmlNode[] => {
          return nodes.map((node, index) => {
            const currentPath = [...path, index]
            const key = currentPath.join('-')
            const disabled = disabledClasses.get(key) || new Set()
            const added = addedClasses.get(key) || []
            const finalClasses = [...node.classes, ...added].filter(cls => !disabled.has(cls))
            return {
              ...node,
              classes: finalClasses,
              children: node.children.length > 0 ? applyChangesToNode(node.children, currentPath) : []
            }
          })
        }
        newTree = applyChangesToNode(htmlTree, [])
        const newHtml = treeToHtml(newTree)
        setRawHtml(newHtml)
      }
    } else {
      // No changes - just sync rawHtml with current state
      if (mode === 'code') {
        setRawHtml(treeToHtml(htmlTree))
      }
    }

    setEditorMode(mode)
  }

  return (
    <div className="flex flex-col h-[700px] border border-gray-200 rounded-lg overflow-hidden bg-white">
      {/* Live Preview - Top */}
      <div className="h-[300px] border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between px-3 py-2 bg-gray-100 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-gray-600">Live Preview</span>
            {/* Mode Toggle */}
            <div className="flex items-center bg-gray-200 rounded-md p-0.5">
              <button
                onClick={() => handleModeSwitch('visual')}
                className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded transition-colors ${
                  editorMode === 'visual'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Layers className="w-3 h-3" />
                Visual
              </button>
              <button
                onClick={() => handleModeSwitch('code')}
                className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded transition-colors ${
                  editorMode === 'code'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Code className="w-3 h-3" />
                HTML
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasChanges && (
              <span className="text-xs text-orange-500">Unsaved changes</span>
            )}
            <button
              onClick={handleSave}
              disabled={!hasChanges}
              className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded transition-colors ${
                hasChanges
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Save className="w-3 h-3" />
              Save
            </button>
          </div>
        </div>
        <iframe
          ref={iframeRef}
          srcDoc={editorMode === 'code' ? codeEditorPreviewHtml : previewHtml}
          className="w-full h-[calc(100%-36px)]"
          title="Component Preview"
          sandbox="allow-scripts"
        />
      </div>

      {/* Bottom panels */}
      <div className="flex flex-1 min-h-0">
        {editorMode === 'visual' ? (
          <>
            {/* Element Tree - Left */}
            <div className="w-[35%] border-r border-gray-200 flex flex-col">
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                <span className="text-xs font-medium text-gray-600">Elements</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <ElementTree
                  nodes={htmlTree}
                  selectedPath={selectedPath}
                  hoveredPath={hoveredPath}
                  onSelect={setSelectedPath}
                  onHover={setHoveredPath}
                />
              </div>
            </div>

            {/* Styles Panel - Right */}
            <div className="flex-1 flex flex-col">
              <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
                <span className="text-xs font-medium text-gray-600">Styles</span>
              </div>
              <div className="flex-1 overflow-hidden">
                <StylesPanel
                  selectedNode={selectedNode}
                  allClasses={allClasses}
                  disabledClasses={currentDisabledClasses}
                  onToggleClass={handleToggleClass}
                  onRemoveClass={handleRemoveClass}
                  onAddClass={handleAddClass}
                />
              </div>
            </div>
          </>
        ) : (
          /* HTML Code Editor */
          <div className="flex-1 flex flex-col">
            <div className="px-3 py-2 bg-gray-50 border-b border-gray-200">
              <span className="text-xs font-medium text-gray-600">HTML with Tailwind Classes</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <textarea
                value={rawHtml}
                onChange={(e) => handleRawHtmlChange(e.target.value)}
                className="w-full h-full p-4 font-mono text-sm bg-gray-900 text-gray-100 resize-none focus:outline-none"
                placeholder="Enter HTML with Tailwind classes..."
                spellCheck={false}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
