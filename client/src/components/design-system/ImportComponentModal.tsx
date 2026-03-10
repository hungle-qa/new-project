import { useState, useMemo, useEffect } from 'react'
import { X, Check } from 'lucide-react'
import { validateComponent } from './utils/validateComponent'
import { ValidationMessage } from './ValidationMessage'
import { ComponentPreview } from './ComponentPreview'

export interface ComponentData {
  name: string
  category: string
  description: string
  html: string
  css: string // Kept for backwards compatibility, always empty for new imports
  tailwindHtml: string // Primary field - HTML with Tailwind classes
}

interface ImportComponentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ComponentData) => Promise<void>
  initialData?: ComponentData
  mode?: 'create' | 'edit'
}

const CATEGORIES = [
  { value: 'buttons', label: 'Buttons' },
  { value: 'cards', label: 'Cards' },
  { value: 'forms', label: 'Forms' },
  { value: 'layout', label: 'Layout' },
  { value: 'navigation', label: 'Navigation' },
  { value: 'feedback', label: 'Feedback' },
]

export function ImportComponentModal({ isOpen, onClose, onSubmit, initialData, mode = 'create' }: ImportComponentModalProps) {
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const [name, setName] = useState('')
  const [category, setCategory] = useState('buttons')
  const [description, setDescription] = useState('')
  const [tailwindHtml, setTailwindHtml] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [showPreview, setShowPreview] = useState(true)

  const isEditMode = mode === 'edit'

  // Reset form when modal opens or populate with initial data for edit mode
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setName(initialData.name)
        setCategory(initialData.category || 'buttons')
        setDescription(initialData.description)
        // Prefer tailwindHtml, fallback to html for backwards compatibility
        setTailwindHtml(initialData.tailwindHtml || initialData.html || '')
      } else {
        setName('')
        setCategory('buttons')
        setDescription('')
        setTailwindHtml('')
      }
      setSubmitError(null)
    }
  }, [isOpen, initialData])

  // Validation
  const validation = useMemo(() => {
    return validateComponent({ name, html: tailwindHtml })
  }, [name, tailwindHtml])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validation.valid) {
      return
    }

    setSubmitting(true)
    setSubmitError(null)

    try {
      await onSubmit({
        name,
        category,
        description,
        html: tailwindHtml, // Map to html for backwards compatibility
        css: '', // No longer used
        tailwindHtml,
      })
      onClose()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : `Failed to ${isEditMode ? 'update' : 'import'} component`)
    } finally {
      setSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditMode ? 'Edit Component' : 'Import Component'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <form id="import-form" onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Info Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Component Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Component Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., PrimaryButton"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the component and its use cases..."
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* HTML with Tailwind Classes */}
              <div>
                <label htmlFor="tailwindHtml" className="block text-sm font-medium text-gray-700 mb-1">
                  HTML with Tailwind Classes <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-2">
                  Use Tailwind utility classes only. No custom CSS or inline styles allowed.
                </p>
                <textarea
                  id="tailwindHtml"
                  value={tailwindHtml}
                  onChange={(e) => setTailwindHtml(e.target.value)}
                  placeholder='<button class="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-lg transition-colors">Click me</button>'
                  rows={8}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-none"
                />
              </div>

              {/* Validation Messages */}
              {(validation.errors.length > 0 || validation.warnings.length > 0) && (
                <div className="space-y-2">
                  {validation.errors.map((error, i) => (
                    <ValidationMessage key={`error-${i}`} error={error} />
                  ))}
                  {validation.warnings.map((warning, i) => (
                    <ValidationMessage key={`warning-${i}`} error={warning} />
                  ))}
                </div>
              )}

              {/* Preview Section */}
              <ComponentPreview
                tailwindHtml={tailwindHtml}
                showPreview={showPreview}
                onTogglePreview={() => setShowPreview(!showPreview)}
              />

              {/* Submit Error */}
              {submitError && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
                  <X className="w-4 h-4 flex-shrink-0" />
                  {submitError}
                </div>
              )}
            </form>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="import-form"
              disabled={!validation.valid || submitting}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {isEditMode ? 'Saving...' : 'Importing...'}
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  {isEditMode ? 'Save Changes' : 'Import Component'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
