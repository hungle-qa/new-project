import { useState, useCallback } from 'react'
import { parseHtmlToTree, treeToHtml, HtmlNode } from '../utils/parseHtmlTree'

interface EditorState {
  disabledClasses: Map<string, Set<string>>
  addedClasses: Map<string, string[]>
  hasChanges: boolean
  editorMode: 'visual' | 'code'
  rawHtml: string
}

interface EditorActions {
  setDisabledClasses: React.Dispatch<React.SetStateAction<Map<string, Set<string>>>>
  setAddedClasses: React.Dispatch<React.SetStateAction<Map<string, string[]>>>
  setHasChanges: React.Dispatch<React.SetStateAction<boolean>>
  setEditorMode: React.Dispatch<React.SetStateAction<'visual' | 'code'>>
  setRawHtml: React.Dispatch<React.SetStateAction<string>>
  setHtmlTree: React.Dispatch<React.SetStateAction<HtmlNode[]>>
  setSelectedPath: React.Dispatch<React.SetStateAction<number[]>>
  handleToggleClass: (className: string) => void
  handleRemoveClass: (className: string) => void
  handleAddClass: (className: string) => void
  handleRawHtmlChange: (newRawHtml: string) => void
  handleSave: () => void
  handleModeSwitch: (mode: 'visual' | 'code') => void
}

interface UseEditorStateParams {
  initialHtml: string
  htmlTree: HtmlNode[]
  selectedNode: HtmlNode | null
  selectedPath: number[]
  nodeKey: string
  currentDisabledClasses: Set<string>
  currentAddedClasses: string[]
  allClasses: string[]
  onChange: (newHtml: string) => void
  lastHtmlRef: React.MutableRefObject<string | null>
}

export function useEditorState({
  initialHtml,
  htmlTree,
  selectedNode,
  selectedPath,
  nodeKey,
  currentDisabledClasses,
  currentAddedClasses,
  allClasses,
  onChange,
  lastHtmlRef
}: UseEditorStateParams & {
  setDisabledClasses: React.Dispatch<React.SetStateAction<Map<string, Set<string>>>>
  setAddedClasses: React.Dispatch<React.SetStateAction<Map<string, string[]>>>
  setHasChanges: React.Dispatch<React.SetStateAction<boolean>>
  setEditorMode: React.Dispatch<React.SetStateAction<'visual' | 'code'>>
  setRawHtml: React.Dispatch<React.SetStateAction<string>>
  setHtmlTree: React.Dispatch<React.SetStateAction<HtmlNode[]>>
  setSelectedPath: React.Dispatch<React.SetStateAction<number[]>>
  disabledClasses: Map<string, Set<string>>
  addedClasses: Map<string, string[]>
  editorMode: 'visual' | 'code'
  rawHtml: string
}): Omit<EditorActions, 'setDisabledClasses' | 'setAddedClasses' | 'setHasChanges' | 'setEditorMode' | 'setRawHtml' | 'setHtmlTree' | 'setSelectedPath'> {
  const {
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
  } = arguments[0] as any

  // Toggle class enabled/disabled (for preview only, not saved)
  const handleToggleClass = useCallback((className: string) => {
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
  }, [disabledClasses, currentDisabledClasses, nodeKey, setDisabledClasses, setHasChanges])

  // Remove class completely (from original or added)
  const handleRemoveClass = useCallback((className: string) => {
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
  }, [selectedNode, currentAddedClasses, currentDisabledClasses, addedClasses, disabledClasses, nodeKey, setAddedClasses, setDisabledClasses, setHasChanges])

  // Add new class (locally, not saved yet)
  const handleAddClass = useCallback((className: string) => {
    if (!selectedNode) return
    if (allClasses.includes(className)) return

    const newAdded = new Map(addedClasses)
    newAdded.set(nodeKey, [...currentAddedClasses, className])
    setAddedClasses(newAdded)
    setHasChanges(true)
  }, [selectedNode, allClasses, addedClasses, nodeKey, currentAddedClasses, setAddedClasses, setHasChanges])

  // Handle raw HTML changes in code editor
  const handleRawHtmlChange = useCallback((newRawHtml: string) => {
    setRawHtml(newRawHtml)
    setHasChanges(true)
  }, [setRawHtml, setHasChanges])

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
      lastHtmlRef.current = rawHtml
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
  }, [editorMode, rawHtml, htmlTree, disabledClasses, addedClasses, onChange, setHasChanges, setHtmlTree, setSelectedPath, setDisabledClasses, setAddedClasses, setRawHtml, lastHtmlRef])

  // Switch editor mode
  const handleModeSwitch = useCallback((mode: 'visual' | 'code') => {
    if (mode === editorMode) return

    const hasChanges = disabledClasses.size > 0 || addedClasses.size > 0

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
  }, [editorMode, disabledClasses, addedClasses, rawHtml, htmlTree, setHtmlTree, setSelectedPath, setDisabledClasses, setAddedClasses, setRawHtml, setEditorMode])

  return {
    handleToggleClass,
    handleRemoveClass,
    handleAddClass,
    handleRawHtmlChange,
    handleSave,
    handleModeSwitch
  }
}
