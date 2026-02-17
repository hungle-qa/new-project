export interface ValidationError {
  type: 'error' | 'warning'
  field: 'html' | 'name' | 'general'
  message: string
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  warnings: ValidationError[]
}

export function validateComponentName(name: string): ValidationError[] {
  const errors: ValidationError[] = []

  if (!name || name.trim() === '') {
    errors.push({
      type: 'error',
      field: 'name',
      message: 'Component name is required'
    })
    return errors
  }

  // Check for valid characters (alphanumeric, hyphens, underscores)
  if (!/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(name)) {
    errors.push({
      type: 'error',
      field: 'name',
      message: 'Name must start with a letter and contain only letters, numbers, hyphens, and underscores'
    })
  }

  // Check length
  if (name.length > 50) {
    errors.push({
      type: 'warning',
      field: 'name',
      message: 'Name is quite long. Consider using a shorter, more concise name.'
    })
  }

  return errors
}

export function validateHTML(html: string): ValidationError[] {
  const errors: ValidationError[] = []

  if (!html || html.trim() === '') {
    errors.push({
      type: 'error',
      field: 'html',
      message: 'HTML with Tailwind classes is required'
    })
    return errors
  }

  // Check for inline styles - ERROR (Tailwind only)
  if (/style\s*=\s*["'][^"']+["']/i.test(html)) {
    errors.push({
      type: 'error',
      field: 'html',
      message: 'Inline styles not allowed. Use Tailwind classes instead (e.g., style="color: red" → class="text-red-500")'
    })
  }

  // Check for <style> tags - ERROR (Tailwind only)
  if (/<style[\s>]/i.test(html)) {
    errors.push({
      type: 'error',
      field: 'html',
      message: 'Style tags not allowed. Use Tailwind utility classes directly in HTML elements'
    })
  }

  // Check for single root element
  const trimmedHtml = html.trim()
  const parser = new DOMParser()
  const doc = parser.parseFromString(`<div id="__wrapper__">${trimmedHtml}</div>`, 'text/html')
  const wrapper = doc.getElementById('__wrapper__')

  if (wrapper) {
    const childElements = Array.from(wrapper.children).filter(
      el => el.nodeType === Node.ELEMENT_NODE
    )

    if (childElements.length === 0) {
      errors.push({
        type: 'error',
        field: 'html',
        message: 'No valid HTML elements found'
      })
    } else if (childElements.length > 1) {
      errors.push({
        type: 'warning',
        field: 'html',
        message: 'Multiple root elements detected. Consider wrapping in a single container.'
      })
    }

    // Check for Tailwind classes
    const hasClassAttribute = wrapper.innerHTML.includes('class=')
    const hasTailwindClasses = /class\s*=\s*["'][^"']*(?:bg-|text-|p-|m-|flex|grid|rounded|border|shadow|hover:|focus:|w-|h-|font-|items-|justify-)[^"']*["']/i.test(html)

    if (!hasClassAttribute) {
      errors.push({
        type: 'warning',
        field: 'html',
        message: 'No class attributes found. Use Tailwind classes for styling (e.g., class="bg-blue-500 text-white")'
      })
    } else if (!hasTailwindClasses) {
      errors.push({
        type: 'warning',
        field: 'html',
        message: 'No Tailwind classes detected. Consider using utility classes (e.g., bg-blue-500, text-white, px-4)'
      })
    }
  }

  // Check for script tags (security)
  if (/<script[\s>]/i.test(html)) {
    errors.push({
      type: 'error',
      field: 'html',
      message: 'Script tags are not allowed in component HTML'
    })
  }

  // Check for event handlers (security)
  if (/on\w+\s*=\s*["']/i.test(html)) {
    errors.push({
      type: 'warning',
      field: 'html',
      message: 'Inline event handlers detected. These will not work in the preview.'
    })
  }

  return errors
}

export function validateComponent(data: {
  name: string
  html: string
}): ValidationResult {
  const nameErrors = validateComponentName(data.name)
  const htmlErrors = validateHTML(data.html)

  const allErrors = [...nameErrors, ...htmlErrors]

  const errors = allErrors.filter(e => e.type === 'error')
  const warnings = allErrors.filter(e => e.type === 'warning')

  return {
    valid: errors.length === 0,
    errors,
    warnings
  }
}
