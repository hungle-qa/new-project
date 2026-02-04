import { extractColorFromClass } from '../../utils/tailwindCategories'

interface ColorSwatchProps {
  className: string
}

export function ColorSwatch({ className }: ColorSwatchProps) {
  const color = extractColorFromClass(className)

  if (!color) return null

  const isTransparent = color === 'transparent'
  const isInherit = color === 'inherit' || color === 'currentColor'

  return (
    <span
      className="inline-block w-3 h-3 rounded border border-gray-300 flex-shrink-0"
      style={{
        backgroundColor: isTransparent || isInherit ? undefined : color,
        backgroundImage: isTransparent
          ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)'
          : undefined,
        backgroundSize: isTransparent ? '6px 6px' : undefined,
        backgroundPosition: isTransparent ? '0 0, 0 3px, 3px -3px, -3px 0px' : undefined,
      }}
      title={`${className}: ${color}`}
    />
  )
}
