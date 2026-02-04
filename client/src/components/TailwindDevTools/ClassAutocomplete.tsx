import { useState, useRef, useEffect } from 'react'
import { Plus } from 'lucide-react'
import { COMMON_CLASSES } from '../../utils/tailwindCategories'

interface ClassAutocompleteProps {
  existingClasses: string[]
  onAddClass: (className: string) => void
}

export function ClassAutocomplete({ existingClasses, onAddClass }: ClassAutocompleteProps) {
  const [value, setValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)

  const existingSet = new Set(existingClasses)

  const suggestions = value.trim()
    ? COMMON_CLASSES.filter(
        cls => cls.includes(value.toLowerCase()) && !existingSet.has(cls)
      ).slice(0, 10)
    : []

  useEffect(() => {
    setSelectedIndex(0)
  }, [suggestions.length])

  useEffect(() => {
    if (listRef.current && selectedIndex >= 0) {
      const item = listRef.current.children[selectedIndex] as HTMLElement
      if (item) {
        item.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [selectedIndex])

  const handleAdd = (className: string) => {
    const trimmed = className.trim()
    if (trimmed && !existingSet.has(trimmed)) {
      onAddClass(trimmed)
      setValue('')
      setShowSuggestions(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(prev => Math.max(prev - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (suggestions[selectedIndex]) {
        handleAdd(suggestions[selectedIndex])
      } else if (value.trim()) {
        handleAdd(value)
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
    }
  }

  return (
    <div className="relative mt-3">
      <div className="flex items-center gap-2">
        <Plus className="w-4 h-4 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={e => {
            setValue(e.target.value)
            setShowSuggestions(true)
          }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder="Add class..."
          className="flex-1 text-sm font-mono px-2 py-1 border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <ul
          ref={listRef}
          className="absolute left-6 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto z-10"
        >
          {suggestions.map((cls, index) => (
            <li
              key={cls}
              onClick={() => handleAdd(cls)}
              className={`px-3 py-1.5 text-sm font-mono cursor-pointer ${
                index === selectedIndex
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {cls}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
