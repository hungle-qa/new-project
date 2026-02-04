export interface TailwindCategory {
  name: string
  pattern: RegExp
  label: string
}

export const CATEGORIES: TailwindCategory[] = [
  { name: 'layout', pattern: /^(flex|grid|block|inline|hidden|absolute|relative|fixed|sticky|static)/, label: 'Layout' },
  { name: 'flexbox', pattern: /^(items-|justify-|flex-|self-|order-|grow|shrink|basis-)/, label: 'Flexbox & Grid' },
  { name: 'spacing', pattern: /^(p-|px-|py-|pt-|pr-|pb-|pl-|m-|mx-|my-|mt-|mr-|mb-|ml-|gap-|space-)/, label: 'Spacing' },
  { name: 'sizing', pattern: /^(w-|h-|min-w-|min-h-|max-w-|max-h-|size-)/, label: 'Sizing' },
  { name: 'typography', pattern: /^(text-(?!.*(gray|red|blue|green|yellow|purple|pink|indigo|orange|teal|cyan|emerald|violet|fuchsia|rose|lime|amber|sky|slate|zinc|neutral|stone|white|black|transparent|current|inherit))|font-|tracking-|leading-|truncate|uppercase|lowercase|capitalize|normal-case|italic|not-italic|underline|line-through|no-underline|antialiased|subpixel-antialiased)/, label: 'Typography' },
  { name: 'colors', pattern: /^(bg-|text-|border-|ring-|outline-|shadow-|accent-|caret-|fill-|stroke-).*(gray|red|blue|green|yellow|purple|pink|indigo|orange|teal|cyan|emerald|violet|fuchsia|rose|lime|amber|sky|slate|zinc|neutral|stone|white|black|transparent|current|inherit)/, label: 'Colors' },
  { name: 'borders', pattern: /^(border(?!-.*(gray|red|blue|green|yellow|purple|pink|indigo|orange|teal|cyan|emerald|violet|fuchsia|rose|lime|amber|sky|slate|zinc|neutral|stone|white|black|transparent|current|inherit))|rounded|ring(?!-.*(gray|red|blue|green|yellow|purple|pink|indigo|orange|teal|cyan|emerald|violet|fuchsia|rose|lime|amber|sky|slate|zinc|neutral|stone))|outline(?!-.*(gray|red|blue|green|yellow|purple|pink|indigo|orange|teal|cyan|emerald|violet|fuchsia|rose|lime|amber|sky|slate|zinc|neutral|stone)))/, label: 'Borders' },
  { name: 'effects', pattern: /^(shadow(?!-.*(gray|red|blue|green|yellow|purple|pink|indigo|orange|teal|cyan|emerald|violet|fuchsia|rose|lime|amber|sky|slate|zinc|neutral|stone))|opacity|blur|brightness|contrast|grayscale|hue-rotate|invert|saturate|sepia|backdrop-|mix-blend-)/, label: 'Effects' },
  { name: 'transitions', pattern: /^(transition|duration-|ease-|delay-|animate-)/, label: 'Transitions' },
  { name: 'transforms', pattern: /^(scale-|rotate-|translate-|skew-|origin-|transform)/, label: 'Transforms' },
  { name: 'interactivity', pattern: /^(cursor-|pointer-events-|resize|select-|scroll-|snap-|touch-|will-change-)/, label: 'Interactivity' },
  { name: 'states', pattern: /^(hover:|focus:|active:|disabled:|visited:|first:|last:|odd:|even:|group-|peer-|focus-within:|focus-visible:|dark:|sm:|md:|lg:|xl:|2xl:)/, label: 'States & Responsive' },
]

export const COLOR_MAP: Record<string, string> = {
  // Slate
  'slate-50': '#f8fafc', 'slate-100': '#f1f5f9', 'slate-200': '#e2e8f0', 'slate-300': '#cbd5e1',
  'slate-400': '#94a3b8', 'slate-500': '#64748b', 'slate-600': '#475569', 'slate-700': '#334155',
  'slate-800': '#1e293b', 'slate-900': '#0f172a', 'slate-950': '#020617',

  // Gray
  'gray-50': '#f9fafb', 'gray-100': '#f3f4f6', 'gray-200': '#e5e7eb', 'gray-300': '#d1d5db',
  'gray-400': '#9ca3af', 'gray-500': '#6b7280', 'gray-600': '#4b5563', 'gray-700': '#374151',
  'gray-800': '#1f2937', 'gray-900': '#111827', 'gray-950': '#030712',

  // Zinc
  'zinc-50': '#fafafa', 'zinc-100': '#f4f4f5', 'zinc-200': '#e4e4e7', 'zinc-300': '#d4d4d8',
  'zinc-400': '#a1a1aa', 'zinc-500': '#71717a', 'zinc-600': '#52525b', 'zinc-700': '#3f3f46',
  'zinc-800': '#27272a', 'zinc-900': '#18181b', 'zinc-950': '#09090b',

  // Red
  'red-50': '#fef2f2', 'red-100': '#fee2e2', 'red-200': '#fecaca', 'red-300': '#fca5a5',
  'red-400': '#f87171', 'red-500': '#ef4444', 'red-600': '#dc2626', 'red-700': '#b91c1c',
  'red-800': '#991b1b', 'red-900': '#7f1d1d', 'red-950': '#450a0a',

  // Orange
  'orange-50': '#fff7ed', 'orange-100': '#ffedd5', 'orange-200': '#fed7aa', 'orange-300': '#fdba74',
  'orange-400': '#fb923c', 'orange-500': '#f97316', 'orange-600': '#ea580c', 'orange-700': '#c2410c',
  'orange-800': '#9a3412', 'orange-900': '#7c2d12', 'orange-950': '#431407',

  // Amber
  'amber-50': '#fffbeb', 'amber-100': '#fef3c7', 'amber-200': '#fde68a', 'amber-300': '#fcd34d',
  'amber-400': '#fbbf24', 'amber-500': '#f59e0b', 'amber-600': '#d97706', 'amber-700': '#b45309',
  'amber-800': '#92400e', 'amber-900': '#78350f', 'amber-950': '#451a03',

  // Yellow
  'yellow-50': '#fefce8', 'yellow-100': '#fef9c3', 'yellow-200': '#fef08a', 'yellow-300': '#fde047',
  'yellow-400': '#facc15', 'yellow-500': '#eab308', 'yellow-600': '#ca8a04', 'yellow-700': '#a16207',
  'yellow-800': '#854d0e', 'yellow-900': '#713f12', 'yellow-950': '#422006',

  // Lime
  'lime-50': '#f7fee7', 'lime-100': '#ecfccb', 'lime-200': '#d9f99d', 'lime-300': '#bef264',
  'lime-400': '#a3e635', 'lime-500': '#84cc16', 'lime-600': '#65a30d', 'lime-700': '#4d7c0f',
  'lime-800': '#3f6212', 'lime-900': '#365314', 'lime-950': '#1a2e05',

  // Green
  'green-50': '#f0fdf4', 'green-100': '#dcfce7', 'green-200': '#bbf7d0', 'green-300': '#86efac',
  'green-400': '#4ade80', 'green-500': '#22c55e', 'green-600': '#16a34a', 'green-700': '#15803d',
  'green-800': '#166534', 'green-900': '#14532d', 'green-950': '#052e16',

  // Emerald
  'emerald-50': '#ecfdf5', 'emerald-100': '#d1fae5', 'emerald-200': '#a7f3d0', 'emerald-300': '#6ee7b7',
  'emerald-400': '#34d399', 'emerald-500': '#10b981', 'emerald-600': '#059669', 'emerald-700': '#047857',
  'emerald-800': '#065f46', 'emerald-900': '#064e3b', 'emerald-950': '#022c22',

  // Teal
  'teal-50': '#f0fdfa', 'teal-100': '#ccfbf1', 'teal-200': '#99f6e4', 'teal-300': '#5eead4',
  'teal-400': '#2dd4bf', 'teal-500': '#14b8a6', 'teal-600': '#0d9488', 'teal-700': '#0f766e',
  'teal-800': '#115e59', 'teal-900': '#134e4a', 'teal-950': '#042f2e',

  // Cyan
  'cyan-50': '#ecfeff', 'cyan-100': '#cffafe', 'cyan-200': '#a5f3fc', 'cyan-300': '#67e8f9',
  'cyan-400': '#22d3ee', 'cyan-500': '#06b6d4', 'cyan-600': '#0891b2', 'cyan-700': '#0e7490',
  'cyan-800': '#155e75', 'cyan-900': '#164e63', 'cyan-950': '#083344',

  // Sky
  'sky-50': '#f0f9ff', 'sky-100': '#e0f2fe', 'sky-200': '#bae6fd', 'sky-300': '#7dd3fc',
  'sky-400': '#38bdf8', 'sky-500': '#0ea5e9', 'sky-600': '#0284c7', 'sky-700': '#0369a1',
  'sky-800': '#075985', 'sky-900': '#0c4a6e', 'sky-950': '#082f49',

  // Blue
  'blue-50': '#eff6ff', 'blue-100': '#dbeafe', 'blue-200': '#bfdbfe', 'blue-300': '#93c5fd',
  'blue-400': '#60a5fa', 'blue-500': '#3b82f6', 'blue-600': '#2563eb', 'blue-700': '#1d4ed8',
  'blue-800': '#1e40af', 'blue-900': '#1e3a8a', 'blue-950': '#172554',

  // Indigo
  'indigo-50': '#eef2ff', 'indigo-100': '#e0e7ff', 'indigo-200': '#c7d2fe', 'indigo-300': '#a5b4fc',
  'indigo-400': '#818cf8', 'indigo-500': '#6366f1', 'indigo-600': '#4f46e5', 'indigo-700': '#4338ca',
  'indigo-800': '#3730a3', 'indigo-900': '#312e81', 'indigo-950': '#1e1b4b',

  // Violet
  'violet-50': '#f5f3ff', 'violet-100': '#ede9fe', 'violet-200': '#ddd6fe', 'violet-300': '#c4b5fd',
  'violet-400': '#a78bfa', 'violet-500': '#8b5cf6', 'violet-600': '#7c3aed', 'violet-700': '#6d28d9',
  'violet-800': '#5b21b6', 'violet-900': '#4c1d95', 'violet-950': '#2e1065',

  // Purple
  'purple-50': '#faf5ff', 'purple-100': '#f3e8ff', 'purple-200': '#e9d5ff', 'purple-300': '#d8b4fe',
  'purple-400': '#c084fc', 'purple-500': '#a855f7', 'purple-600': '#9333ea', 'purple-700': '#7e22ce',
  'purple-800': '#6b21a8', 'purple-900': '#581c87', 'purple-950': '#3b0764',

  // Fuchsia
  'fuchsia-50': '#fdf4ff', 'fuchsia-100': '#fae8ff', 'fuchsia-200': '#f5d0fe', 'fuchsia-300': '#f0abfc',
  'fuchsia-400': '#e879f9', 'fuchsia-500': '#d946ef', 'fuchsia-600': '#c026d3', 'fuchsia-700': '#a21caf',
  'fuchsia-800': '#86198f', 'fuchsia-900': '#701a75', 'fuchsia-950': '#4a044e',

  // Pink
  'pink-50': '#fdf2f8', 'pink-100': '#fce7f3', 'pink-200': '#fbcfe8', 'pink-300': '#f9a8d4',
  'pink-400': '#f472b6', 'pink-500': '#ec4899', 'pink-600': '#db2777', 'pink-700': '#be185d',
  'pink-800': '#9d174d', 'pink-900': '#831843', 'pink-950': '#500724',

  // Rose
  'rose-50': '#fff1f2', 'rose-100': '#ffe4e6', 'rose-200': '#fecdd3', 'rose-300': '#fda4af',
  'rose-400': '#fb7185', 'rose-500': '#f43f5e', 'rose-600': '#e11d48', 'rose-700': '#be123c',
  'rose-800': '#9f1239', 'rose-900': '#881337', 'rose-950': '#4c0519',

  // Neutral
  'white': '#ffffff',
  'black': '#000000',
  'transparent': 'transparent',
}

export function categorizeClass(className: string): string {
  // Remove state/responsive prefixes for categorization
  const baseClass = className.replace(/^(hover:|focus:|active:|disabled:|sm:|md:|lg:|xl:|2xl:|dark:|group-|peer-)+/, '')

  for (const category of CATEGORIES) {
    if (category.pattern.test(baseClass)) {
      return category.name
    }
    // Also check if the original class with prefix matches states category
    if (className !== baseClass && category.name === 'states') {
      return 'states'
    }
  }

  return 'other'
}

export function groupClassesByCategory(classes: string[]): Record<string, string[]> {
  const groups: Record<string, string[]> = {}

  for (const cls of classes) {
    const category = categorizeClass(cls)
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(cls)
  }

  return groups
}

export function extractColorFromClass(className: string): string | null {
  // Match color patterns like bg-blue-500, text-red-400, border-gray-300
  const colorMatch = className.match(/(bg|text|border|ring|outline|shadow|accent|caret|fill|stroke)-(.+)$/)

  if (!colorMatch) return null

  const colorValue = colorMatch[2]

  // Check direct color name match
  if (COLOR_MAP[colorValue]) {
    return COLOR_MAP[colorValue]
  }

  // Check for special values
  if (colorValue === 'white') return '#ffffff'
  if (colorValue === 'black') return '#000000'
  if (colorValue === 'transparent') return 'transparent'
  if (colorValue === 'current') return 'currentColor'
  if (colorValue === 'inherit') return 'inherit'

  return null
}

export function getCategoryLabel(categoryName: string): string {
  const category = CATEGORIES.find(c => c.name === categoryName)
  return category?.label || 'Other'
}

// Common Tailwind classes for autocomplete
export const COMMON_CLASSES = [
  // Layout
  'flex', 'inline-flex', 'block', 'inline-block', 'hidden', 'grid', 'inline-grid',
  'absolute', 'relative', 'fixed', 'sticky', 'static',

  // Flexbox
  'items-center', 'items-start', 'items-end', 'items-stretch', 'items-baseline',
  'justify-center', 'justify-start', 'justify-end', 'justify-between', 'justify-around', 'justify-evenly',
  'flex-row', 'flex-col', 'flex-wrap', 'flex-nowrap', 'flex-1', 'flex-auto', 'flex-none',

  // Spacing
  'p-0', 'p-1', 'p-2', 'p-3', 'p-4', 'p-5', 'p-6', 'p-8', 'p-10', 'p-12',
  'px-0', 'px-1', 'px-2', 'px-3', 'px-4', 'px-5', 'px-6', 'px-8', 'px-10', 'px-12',
  'py-0', 'py-1', 'py-2', 'py-3', 'py-4', 'py-5', 'py-6', 'py-8', 'py-10', 'py-12',
  'm-0', 'm-1', 'm-2', 'm-3', 'm-4', 'm-5', 'm-6', 'm-8', 'm-10', 'm-12', 'm-auto',
  'mx-0', 'mx-1', 'mx-2', 'mx-3', 'mx-4', 'mx-5', 'mx-6', 'mx-8', 'mx-auto',
  'my-0', 'my-1', 'my-2', 'my-3', 'my-4', 'my-5', 'my-6', 'my-8', 'my-auto',
  'gap-0', 'gap-1', 'gap-2', 'gap-3', 'gap-4', 'gap-5', 'gap-6', 'gap-8',
  'space-x-1', 'space-x-2', 'space-x-3', 'space-x-4', 'space-y-1', 'space-y-2', 'space-y-3', 'space-y-4',

  // Sizing
  'w-full', 'w-auto', 'w-screen', 'w-fit', 'w-min', 'w-max',
  'w-1', 'w-2', 'w-3', 'w-4', 'w-5', 'w-6', 'w-8', 'w-10', 'w-12', 'w-16', 'w-20', 'w-24', 'w-32', 'w-40', 'w-48', 'w-56', 'w-64',
  'w-1/2', 'w-1/3', 'w-2/3', 'w-1/4', 'w-3/4',
  'h-full', 'h-auto', 'h-screen', 'h-fit', 'h-min', 'h-max',
  'h-1', 'h-2', 'h-3', 'h-4', 'h-5', 'h-6', 'h-8', 'h-10', 'h-12', 'h-16', 'h-20', 'h-24', 'h-32', 'h-40', 'h-48', 'h-56', 'h-64',
  'min-w-0', 'min-w-full', 'max-w-sm', 'max-w-md', 'max-w-lg', 'max-w-xl', 'max-w-2xl', 'max-w-full', 'max-w-screen-sm', 'max-w-screen-md', 'max-w-screen-lg',
  'min-h-0', 'min-h-full', 'min-h-screen', 'max-h-full', 'max-h-screen',

  // Typography
  'text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl',
  'font-thin', 'font-light', 'font-normal', 'font-medium', 'font-semibold', 'font-bold', 'font-extrabold',
  'text-left', 'text-center', 'text-right', 'text-justify',
  'truncate', 'uppercase', 'lowercase', 'capitalize', 'normal-case',
  'tracking-tight', 'tracking-normal', 'tracking-wide',
  'leading-none', 'leading-tight', 'leading-snug', 'leading-normal', 'leading-relaxed', 'leading-loose',

  // Colors - Background
  'bg-white', 'bg-black', 'bg-transparent',
  'bg-gray-50', 'bg-gray-100', 'bg-gray-200', 'bg-gray-300', 'bg-gray-400', 'bg-gray-500', 'bg-gray-600', 'bg-gray-700', 'bg-gray-800', 'bg-gray-900',
  'bg-red-50', 'bg-red-100', 'bg-red-200', 'bg-red-300', 'bg-red-400', 'bg-red-500', 'bg-red-600', 'bg-red-700', 'bg-red-800', 'bg-red-900',
  'bg-blue-50', 'bg-blue-100', 'bg-blue-200', 'bg-blue-300', 'bg-blue-400', 'bg-blue-500', 'bg-blue-600', 'bg-blue-700', 'bg-blue-800', 'bg-blue-900',
  'bg-green-50', 'bg-green-100', 'bg-green-200', 'bg-green-300', 'bg-green-400', 'bg-green-500', 'bg-green-600', 'bg-green-700', 'bg-green-800', 'bg-green-900',
  'bg-yellow-50', 'bg-yellow-100', 'bg-yellow-200', 'bg-yellow-300', 'bg-yellow-400', 'bg-yellow-500', 'bg-yellow-600', 'bg-yellow-700', 'bg-yellow-800', 'bg-yellow-900',
  'bg-purple-50', 'bg-purple-100', 'bg-purple-200', 'bg-purple-300', 'bg-purple-400', 'bg-purple-500', 'bg-purple-600', 'bg-purple-700', 'bg-purple-800', 'bg-purple-900',
  'bg-indigo-50', 'bg-indigo-100', 'bg-indigo-200', 'bg-indigo-300', 'bg-indigo-400', 'bg-indigo-500', 'bg-indigo-600', 'bg-indigo-700', 'bg-indigo-800', 'bg-indigo-900',

  // Colors - Text
  'text-white', 'text-black', 'text-transparent',
  'text-gray-50', 'text-gray-100', 'text-gray-200', 'text-gray-300', 'text-gray-400', 'text-gray-500', 'text-gray-600', 'text-gray-700', 'text-gray-800', 'text-gray-900',
  'text-red-50', 'text-red-100', 'text-red-200', 'text-red-300', 'text-red-400', 'text-red-500', 'text-red-600', 'text-red-700', 'text-red-800', 'text-red-900',
  'text-blue-50', 'text-blue-100', 'text-blue-200', 'text-blue-300', 'text-blue-400', 'text-blue-500', 'text-blue-600', 'text-blue-700', 'text-blue-800', 'text-blue-900',
  'text-green-50', 'text-green-100', 'text-green-200', 'text-green-300', 'text-green-400', 'text-green-500', 'text-green-600', 'text-green-700', 'text-green-800', 'text-green-900',

  // Borders
  'border', 'border-0', 'border-2', 'border-4', 'border-8',
  'border-t', 'border-r', 'border-b', 'border-l',
  'border-gray-100', 'border-gray-200', 'border-gray-300', 'border-gray-400', 'border-gray-500',
  'border-red-500', 'border-blue-500', 'border-green-500',
  'rounded', 'rounded-sm', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-3xl', 'rounded-full', 'rounded-none',
  'ring', 'ring-0', 'ring-1', 'ring-2', 'ring-4', 'ring-8',
  'ring-blue-500', 'ring-red-500', 'ring-green-500', 'ring-gray-300',

  // Effects
  'shadow', 'shadow-sm', 'shadow-md', 'shadow-lg', 'shadow-xl', 'shadow-2xl', 'shadow-none', 'shadow-inner',
  'opacity-0', 'opacity-25', 'opacity-50', 'opacity-75', 'opacity-100',

  // Transitions
  'transition', 'transition-all', 'transition-colors', 'transition-opacity', 'transition-shadow', 'transition-transform',
  'duration-75', 'duration-100', 'duration-150', 'duration-200', 'duration-300', 'duration-500', 'duration-700', 'duration-1000',
  'ease-linear', 'ease-in', 'ease-out', 'ease-in-out',

  // States
  'hover:bg-gray-100', 'hover:bg-gray-200', 'hover:bg-blue-600', 'hover:bg-blue-700',
  'hover:text-gray-600', 'hover:text-gray-700', 'hover:text-blue-600',
  'hover:border-gray-400', 'hover:border-blue-500',
  'hover:shadow-md', 'hover:shadow-lg',
  'hover:opacity-75', 'hover:opacity-80', 'hover:opacity-90',
  'focus:outline-none', 'focus:ring-2', 'focus:ring-blue-500', 'focus:ring-offset-2',
  'focus:border-blue-500', 'focus:border-gray-500',
  'active:bg-gray-200', 'active:bg-blue-700',
  'disabled:opacity-50', 'disabled:cursor-not-allowed',

  // Interactivity
  'cursor-pointer', 'cursor-default', 'cursor-not-allowed', 'cursor-wait', 'cursor-text', 'cursor-move',
  'select-none', 'select-text', 'select-all', 'select-auto',
  'pointer-events-none', 'pointer-events-auto',

  // Overflow
  'overflow-auto', 'overflow-hidden', 'overflow-visible', 'overflow-scroll',
  'overflow-x-auto', 'overflow-x-hidden', 'overflow-y-auto', 'overflow-y-hidden',

  // Position
  'inset-0', 'inset-auto', 'top-0', 'right-0', 'bottom-0', 'left-0',
  'top-1', 'top-2', 'top-4', 'right-1', 'right-2', 'right-4', 'bottom-1', 'bottom-2', 'bottom-4', 'left-1', 'left-2', 'left-4',
  'z-0', 'z-10', 'z-20', 'z-30', 'z-40', 'z-50', 'z-auto',
]
