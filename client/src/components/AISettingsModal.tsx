import { useState, useEffect } from 'react'
import { X, Key, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react'
import { useAISettings, AISettings } from '../hooks/useAISettings'

interface AISettingsModalProps {
  isOpen: boolean
  onClose: () => void
  onSave?: (settings: AISettings) => void
}

export function AISettingsModal({ isOpen, onClose, onSave }: AISettingsModalProps) {
  const { settings, saveSettings, isConfigured } = useAISettings()
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState('gemini-2.0-flash')
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null)
  const [errorMessage, setErrorMessage] = useState('')

  // Load current settings when modal opens
  useEffect(() => {
    if (isOpen) {
      setApiKey(settings.apiKey)
      setModel(settings.model)
      setTestResult(null)
      setErrorMessage('')
    }
  }, [isOpen, settings])

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setErrorMessage('Please enter an API key')
      setTestResult('error')
      return
    }

    setTesting(true)
    setTestResult(null)
    setErrorMessage('')

    try {
      const response = await fetch('/api/ai/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-AI-API-Key': apiKey,
        },
        body: JSON.stringify({ provider: 'gemini', model }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setTestResult('success')
      } else {
        setTestResult('error')
        setErrorMessage(data.error || 'Connection test failed')
      }
    } catch (error) {
      setTestResult('error')
      setErrorMessage('Failed to connect to server')
    } finally {
      setTesting(false)
    }
  }

  const handleSave = () => {
    const newSettings = saveSettings({
      provider: 'gemini',
      apiKey,
      model,
    })
    onSave?.(newSettings)
    onClose()
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
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Key className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">AI Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-4">
            {/* Provider Info */}
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-blue-700">Google AI Studio (Gemini)</span>
                <a
                  href="https://aistudio.google.com/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                >
                  Get API Key
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* API Key Input */}
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
                API Key
              </label>
              <input
                type="password"
                id="apiKey"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value)
                  setTestResult(null)
                }}
                placeholder="Enter your Gemini API key"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Stored securely in your browser's localStorage
              </p>
            </div>

            {/* Model Selection */}
            <div>
              <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
                Model
              </label>
              <select
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="gemini-2.0-flash">Gemini 2.0 Flash (Recommended)</option>
                <option value="gemini-1.5-flash">Gemini 1.5 Flash</option>
                <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
              </select>
            </div>

            {/* Test Connection Button */}
            <button
              onClick={handleTestConnection}
              disabled={testing || !apiKey.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {testing ? (
                <>
                  <div className="w-4 h-4 border-2 border-blue-700 border-t-transparent rounded-full animate-spin" />
                  Testing...
                </>
              ) : (
                'Test Connection'
              )}
            </button>

            {/* Test Result */}
            {testResult === 'success' && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">Connection successful!</span>
              </div>
            )}

            {testResult === 'error' && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{errorMessage}</span>
              </div>
            )}

            {/* Current Status */}
            {isConfigured && !apiKey && (
              <div className="text-xs text-gray-500 text-center">
                API key is currently configured
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!apiKey.trim()}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
