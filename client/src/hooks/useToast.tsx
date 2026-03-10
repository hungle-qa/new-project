import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error'
}

interface ToastContextValue {
  showToast: (message: string, type?: 'success' | 'error') => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

let nextId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    const id = ++nextId
    setToasts(prev => [...prev, { id, message, type }])
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map(toast => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000)
    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="animate-slide-in">
      <div className={`flex items-center gap-3 min-w-[320px] max-w-[400px] rounded-lg shadow-lg p-4 ${
        toast.type === 'error' ? 'bg-[#EA314A]' : 'bg-[#2D3748]'
      }`}>
        <p className="flex-1 text-white text-sm font-medium">{toast.message}</p>
        <button onClick={onClose} className="flex-shrink-0 focus:outline-none">
          <svg className="w-3 h-3" width="11" height="11" viewBox="0 0 11 11" xmlns="http://www.w3.org/2000/svg">
            <path d="M5.183 5.867L1.425 9.625a.483.483 0 11-.683-.683L4.5 5.183.742 1.425a.483.483 0 01.683-.683L5.183 4.5 8.942.742a.483.483 0 01.683.683L5.867 5.183l3.758 3.759a.483.483 0 01-.683.683L5.183 5.867z" fill="#FFF" stroke="#FFF" strokeWidth=".5" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
