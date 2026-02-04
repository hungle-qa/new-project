interface CardProps {
  title: string
  description?: string
  onClick?: () => void
  actions?: React.ReactNode
}

export function Card({ title, description, onClick, actions }: CardProps) {
  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-4 ${
        onClick ? 'cursor-pointer hover:border-gray-300 hover:shadow-sm transition-all' : ''
      }`}
      onClick={onClick}
    >
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-gray-600 line-clamp-2">{description}</p>
      )}
      {actions && <div className="mt-4 flex gap-2">{actions}</div>}
    </div>
  )
}
