import { useState, useEffect, useRef, useCallback } from 'react'
import { CheckSquare, Copy, Check } from 'lucide-react'

interface CornerCaseQuestion {
  id: number
  question: string
  approved: boolean
  note: string
}

interface CornerCasesTabProps {
  feature: string
}

export function CornerCasesTab({ feature }: CornerCasesTabProps) {
  const [questions, setQuestions] = useState<CornerCaseQuestion[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedCmd, setCopiedCmd] = useState(false)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/testcase/${feature}/corner-cases`)
      .then(r => r.json())
      .then((data: CornerCaseQuestion[]) => {
        setQuestions(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [feature])

  const debouncedSave = useCallback((updated: CornerCaseQuestion[]) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      fetch(`/api/testcase/${feature}/corner-cases`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      }).catch(() => {})
    }, 500)
  }, [feature])

  const handleApproveToggle = (id: number) => {
    setQuestions(prev => {
      const updated = prev.map(q =>
        q.id === id ? { ...q, approved: !q.approved } : q
      )
      debouncedSave(updated)
      return updated
    })
  }

  const handleNoteChange = (id: number, note: string) => {
    setQuestions(prev => {
      const updated = prev.map(q =>
        q.id === id ? { ...q, note } : q
      )
      debouncedSave(updated)
      return updated
    })
  }

  const handleCopyCommand = () => {
    const approved = questions.filter(q => q.approved)
    if (approved.length === 0) return

    const lines = approved.map(q => {
      const notePart = q.note.trim() ? ` — Note: ${q.note.trim()}` : ''
      return `${q.id}. ${q.question}${notePart}`
    }).join('\n')

    const cmd = `/testcase update ${feature}\nAdd the following approved corner cases:\n${lines}`
    navigator.clipboard.writeText(cmd)
    setCopiedCmd(true)
    setTimeout(() => setCopiedCmd(false), 2000)
  }

  if (loading) {
    return <div className="text-center py-8 text-gray-500 text-sm">Loading corner cases...</div>
  }

  if (questions.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
        <CheckSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500 text-sm mb-1">No corner case questions yet</p>
        <p className="text-xs text-gray-400">
          Run <code className="bg-gray-100 px-1 py-0.5 rounded">/testcase write-lite-v2 {feature}</code> to generate
        </p>
      </div>
    )
  }

  const approvedCount = questions.filter(q => q.approved).length

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">
          Corner Case Questions
          {approvedCount > 0 && (
            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 border border-green-200">
              {approvedCount} approved
            </span>
          )}
        </h3>
        <button
          onClick={handleCopyCommand}
          disabled={approvedCount === 0}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-md transition-colors ${
            copiedCmd
              ? 'text-green-600 bg-green-50 border border-green-200'
              : approvedCount === 0
              ? 'text-gray-400 bg-gray-100 border border-gray-200 cursor-not-allowed'
              : 'text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-200'
          }`}
        >
          {copiedCmd ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copiedCmd ? 'Copied!' : 'Copy update command'}
        </button>
      </div>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 w-10">No.</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">AI Question</th>
              <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 w-20">Approve</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 w-56">Note</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {questions.map((q) => (
              <tr key={q.id} className={q.approved ? 'bg-green-50' : 'bg-white'}>
                <td className="px-3 py-2.5 text-xs text-gray-400 align-top">{q.id}</td>
                <td className="px-3 py-2.5 text-sm text-gray-800 align-top leading-relaxed">{q.question}</td>
                <td className="px-3 py-2.5 text-center align-top">
                  <input
                    type="checkbox"
                    checked={q.approved}
                    onChange={() => handleApproveToggle(q.id)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 cursor-pointer"
                  />
                </td>
                <td className="px-3 py-2.5 align-top">
                  <textarea
                    value={q.note}
                    onChange={(e) => handleNoteChange(q.id, e.target.value)}
                    disabled={!q.approved}
                    placeholder={q.approved ? 'Optional note...' : ''}
                    rows={1}
                    className={`w-full text-xs border rounded px-2 py-1 resize-none focus:outline-none focus:ring-1 focus:ring-blue-400 transition-colors ${
                      q.approved
                        ? 'border-gray-300 bg-white text-gray-700'
                        : 'border-transparent bg-transparent text-gray-400 cursor-not-allowed'
                    }`}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
