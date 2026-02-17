interface RuleValueInputProps {
  type: 'color' | 'text' | 'opacity' | 'gradient' | 'css'
  value: string
  onChange: (value: string) => void
  hasError?: boolean
  disabled?: boolean
}

export function RuleValueInput({ type, value, onChange, hasError, disabled }: RuleValueInputProps) {
  const errorClass = hasError ? 'border-red-300' : 'border-gray-200'

  if (type === 'color') {
    return (
      <div className="flex gap-2 items-center">
        <div
          className="w-8 h-8 rounded border border-gray-300 shrink-0"
          style={{ backgroundColor: value }}
          title={value}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`flex-1 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${errorClass}`}
        />
      </div>
    )
  }

  if (type === 'opacity') {
    return (
      <div className="space-y-1">
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full"
        />
        <input
          type="number"
          min="0"
          max="1"
          step="0.1"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${errorClass}`}
        />
      </div>
    )
  }

  if (type === 'gradient' || type === 'css') {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={3}
        className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono ${errorClass}`}
      />
    )
  }

  // type === 'text'
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      className={`w-full px-2 py-1 text-sm border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 ${errorClass}`}
    />
  )
}
