import { useState, useEffect } from 'react'

export interface AISettings {
  provider: 'gemini'
  apiKey: string
  model: string
  savedAt?: string
}

const STORAGE_KEY = 'ai_studio_settings'

const defaultSettings: AISettings = {
  provider: 'gemini',
  apiKey: '',
  model: 'gemini-2.0-flash',
}

export function useAISettings() {
  const [settings, setSettings] = useState<AISettings>(defaultSettings)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as AISettings
        setSettings(parsed)
      }
    } catch (error) {
      console.error('Failed to load AI settings:', error)
    }
    setIsLoaded(true)
  }, [])

  // Save settings to localStorage
  const saveSettings = (newSettings: Partial<AISettings>) => {
    const updated: AISettings = {
      ...settings,
      ...newSettings,
      savedAt: new Date().toISOString(),
    }
    setSettings(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    return updated
  }

  // Clear settings
  const clearSettings = () => {
    setSettings(defaultSettings)
    localStorage.removeItem(STORAGE_KEY)
  }

  // Refresh settings from localStorage (call after external changes)
  const refreshSettings = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as AISettings
        setSettings(parsed)
      }
    } catch (error) {
      console.error('Failed to refresh AI settings:', error)
    }
  }

  // Check if API key is configured
  const isConfigured = Boolean(settings.apiKey)

  return {
    settings,
    saveSettings,
    clearSettings,
    refreshSettings,
    isConfigured,
    isLoaded,
  }
}

// Standalone function to get settings (for use outside React components)
export function getAISettings(): AISettings | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored) as AISettings
    }
  } catch (error) {
    console.error('Failed to get AI settings:', error)
  }
  return null
}
