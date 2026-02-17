import { useState, useCallback } from 'react'
import { DesignRule } from './AddRuleForm'

interface DesignRulesData {
  fontFamily: string
  rules: DesignRule[]
}

export function useRulesValidation() {
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const validateHexColor = (value: string): boolean => {
    return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6}|[0-9A-Fa-f]{8})$/.test(value)
  }

  const validateForm = useCallback((rulesData: DesignRulesData | null): boolean => {
    if (!rulesData) return false

    const errors: Record<string, string> = {}

    if (!rulesData.fontFamily.trim()) {
      errors.fontFamily = 'Font family is required'
    }

    rulesData.rules.forEach(rule => {
      if (rule.type === 'color' && !validateHexColor(rule.value)) {
        errors[rule.id] = 'Invalid hex color format'
      }
      if (rule.type === 'opacity') {
        const num = parseFloat(rule.value)
        if (isNaN(num) || num < 0 || num > 1) {
          errors[rule.id] = 'Opacity must be between 0 and 1'
        }
      }
      if (!rule.token.trim()) {
        errors[`${rule.id}_token`] = 'Token name is required'
      }
    })

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }, [])

  const clearValidationError = useCallback((keys: string[]) => {
    setValidationErrors(prev => {
      const newErrors = { ...prev }
      keys.forEach(key => delete newErrors[key])
      return newErrors
    })
  }, [])

  return {
    validationErrors,
    validateForm,
    clearValidationError,
  }
}
