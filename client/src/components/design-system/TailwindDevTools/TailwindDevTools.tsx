import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { Save, Code, Layers } from 'lucide-react'
import { ElementTree } from './ElementTree'
import { StylesPanel } from './StylesPanel'
import {
  parseHtmlToTree,
  getNodeByPath,
  HtmlNode
} from '../utils/parseHtmlTree'
import { generateVisualPreviewHtml, generateCodePreviewHtml } from './usePreviewHtml'
import { useEditorState } from './useEditorState'

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
    return generateVisualPreviewHtml(htmlTree, selectedPath, getEffectiveClasses)
  }, [htmlTree, selectedPath, getEffectiveClasses])

  // Preview HTML for code editor mode (uses rawHtml directly)
  const codeEditorPreviewHtml = useMemo(() => {
    return generateCodePreviewHtml(rawHtml)
  }, [rawHtml])

  // Use editor state hook
  const {
    handleToggleClass,
    handleRemoveClass,
    handleAddClass,
    handleRawHtmlChange,
    handleSave,
    handleModeSwitch
  } = useEditorState({
    initialHtml: html,
    htmlTree,
    selectedNode,
    selectedPath,
    nodeKey,
    currentDisabledClasses,
    currentAddedClasses,
    allClasses,
    onChange,
    lastHtmlRef: lastHtml,
    setDisabledClasses,
    setAddedClasses,
    setHasChanges,
    setEditorMode,
    setRawHtml,
    setHtmlTree,
    setSelectedPath,
    disabledClasses,
    addedClasses,
    editorMode,
    rawHtml
  } as any)

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
