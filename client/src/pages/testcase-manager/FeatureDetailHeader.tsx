import { Trash2, RefreshCw, Check, Pencil } from 'lucide-react'

interface FeatureDetailHeaderProps {
  feature: string
  isEditing: boolean
  editName: string
  setEditName: (name: string) => void
  setIsEditing: (editing: boolean) => void
  handleRename: () => Promise<void>
  digestUpdating: boolean
  digestDone: boolean
  digestWarnings: string[]
  showDigestWarnings: boolean
  setDigestUpdating: (updating: boolean) => void
  setDigestDone: (done: boolean) => void
  setDigestWarnings: (warnings: string[]) => void
  setShowDigestWarnings: (show: boolean) => void
  digestLiteUpdating: boolean
  digestLiteDone: boolean
  digestLiteWarnings: string[]
  showDigestLiteWarnings: boolean
  setDigestLiteUpdating: (updating: boolean) => void
  setDigestLiteDone: (done: boolean) => void
  setDigestLiteWarnings: (warnings: string[]) => void
  setShowDigestLiteWarnings: (show: boolean) => void
  onDelete: () => void
}

export function FeatureDetailHeader({
  feature,
  isEditing,
  editName,
  setEditName,
  setIsEditing,
  handleRename,
  digestUpdating,
  digestDone,
  digestWarnings,
  showDigestWarnings,
  setDigestUpdating,
  setDigestDone,
  setDigestWarnings,
  setShowDigestWarnings,
  digestLiteUpdating,
  digestLiteDone,
  digestLiteWarnings,
  showDigestLiteWarnings,
  setDigestLiteUpdating,
  setDigestLiteDone,
  setDigestLiteWarnings,
  setShowDigestLiteWarnings,
  onDelete,
}: FeatureDetailHeaderProps) {
  const handleUpdateContext = async () => {
    if (!feature || digestUpdating) return
    setDigestUpdating(true)
    setDigestDone(false)
    setDigestWarnings([])
    setShowDigestWarnings(false)
    try {
      const res = await fetch(`/api/testcase/${feature}/context-digest`, { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        setDigestDone(true)
        if (data.warnings?.length > 0) {
          setDigestWarnings(data.warnings)
        }
        setTimeout(() => setDigestDone(false), 3000)
      }
    } finally {
      setDigestUpdating(false)
    }
  }

  const handleUpdateContextLite = async () => {
    if (!feature || digestLiteUpdating) return
    setDigestLiteUpdating(true)
    setDigestLiteDone(false)
    setDigestLiteWarnings([])
    setShowDigestLiteWarnings(false)
    try {
      const res = await fetch(`/api/testcase/${feature}/context-digest-lite`, { method: 'POST' })
      if (res.ok) {
        const data = await res.json()
        setDigestLiteDone(true)
        if (data.warnings?.length > 0) {
          setDigestLiteWarnings(data.warnings)
        }
        setTimeout(() => setDigestLiteDone(false), 3000)
      }
    } finally {
      setDigestLiteUpdating(false)
    }
  }

  return (
    <div className="px-4 py-3 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isEditing ? (
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setIsEditing(false) }}
              autoFocus
              className="text-lg font-semibold text-gray-900 px-2 py-0.5 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[400px]"
            />
          ) : (
            <button
              onClick={() => { setEditName(feature.replace(/-/g, ' ')); setIsEditing(true) }}
              className="flex items-center gap-2 text-lg font-semibold text-gray-900 hover:text-blue-600 group"
              title="Click to rename"
            >
              {feature.replace(/-/g, ' ')}
              <Pencil className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleUpdateContext}
            disabled={digestUpdating}
            className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-md transition-colors ${
              digestDone
                ? 'text-green-600 bg-green-50 border border-green-200'
                : 'text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200'
            } disabled:opacity-50`}
          >
            {digestUpdating ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                Updating...
              </>
            ) : digestDone ? (
              <>
                <Check className="w-4 h-4" />
                Updated!
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Update Context
              </>
            )}
          </button>
          {digestWarnings.length > 0 && (
            <button
              onClick={() => setShowDigestWarnings(!showDigestWarnings)}
              className="flex items-center gap-1 px-2 py-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md hover:bg-amber-100"
              title="Digest generation warnings"
            >
              <span className="font-medium">{digestWarnings.length}</span> warning{digestWarnings.length > 1 ? 's' : ''}
            </button>
          )}
          <button
            onClick={handleUpdateContextLite}
            disabled={digestLiteUpdating}
            className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-md transition-colors ${
              digestLiteDone
                ? 'text-green-600 bg-green-50 border border-green-200'
                : 'text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200'
            } disabled:opacity-50`}
          >
            {digestLiteUpdating ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                Updating...
              </>
            ) : digestLiteDone ? (
              <>
                <Check className="w-4 h-4" />
                Updated!
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                Update Context Lite
              </>
            )}
          </button>
          {digestLiteWarnings.length > 0 && (
            <button
              onClick={() => setShowDigestLiteWarnings(!showDigestLiteWarnings)}
              className="flex items-center gap-1 px-2 py-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-md hover:bg-amber-100"
              title="Digest lite generation warnings"
            >
              <span className="font-medium">{digestLiteWarnings.length}</span> warning{digestLiteWarnings.length > 1 ? 's' : ''}
            </button>
          )}
          <button
            onClick={onDelete}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-red-600 bg-red-50 rounded-md hover:bg-red-100"
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      </div>
      {showDigestWarnings && digestWarnings.length > 0 && (
        <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md">
          <ul className="space-y-1">
            {digestWarnings.map((w, i) => (
              <li key={i} className="text-xs text-amber-800 flex items-start gap-1.5">
                <span className="mt-0.5 shrink-0">&#x26A0;</span>
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}
      {showDigestLiteWarnings && digestLiteWarnings.length > 0 && (
        <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded-md">
          <p className="text-xs font-medium text-amber-800 mb-1">Context Lite warnings:</p>
          <ul className="space-y-1">
            {digestLiteWarnings.map((w, i) => (
              <li key={i} className="text-xs text-amber-800 flex items-start gap-1.5">
                <span className="mt-0.5 shrink-0">&#x26A0;</span>
                {w}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
