import fs from 'fs/promises'
import path from 'path'
import {
  DS_SOURCE_DIR,
  IDesignRule,
  IDesignRulesData,
  getCached,
  setCache,
  invalidateCache,
} from './DesignSystemTypes'

export class DesignSystemRulesService {
  static async getRules(): Promise<IDesignRulesData> {
    const cached = getCached<IDesignRulesData>('rules')
    if (cached) return cached

    try {
      const rulePath = path.join(DS_SOURCE_DIR, 'rule', 'RULE.md')
      const content = await fs.readFile(rulePath, 'utf-8')

      const fontFamilyMatch = content.match(/font-family:\s*'([^']+)'/)
      const fontFamily = fontFamilyMatch ? fontFamilyMatch[1] : 'Open Sans'

      const coreRules: IDesignRule[] = [
        { id: 'text-primary', token: '--color-text-primary', value: '#141414', usage: 'Primary text, headings, body text', type: 'color', isCore: true },
        { id: 'text-white', token: '--color-text-white', value: '#FFFFFF', usage: 'Text on dark/colored backgrounds', type: 'color', isCore: true },
        { id: 'bg-white', token: '--color-bg-white', value: '#FFFFFF', usage: 'Component backgrounds, cards, modals', type: 'color', isCore: true },
        { id: 'btn-action', token: '--color-btn-action', value: '#184EFF', usage: 'Primary/action button background', type: 'color', isCore: true },
        { id: 'btn-action-hover', token: '--color-btn-action-hover', value: '#1241CC', usage: 'Primary button hover state', type: 'color', isCore: true },
        { id: 'btn-cancel-hover', token: '--color-btn-cancel-hover', value: '#F5F7F9', usage: 'Cancel button hover state', type: 'color', isCore: true }
      ]

      coreRules.forEach(rule => {
        const regex = new RegExp(`\`${rule.token.replace(/[-]/g, '[-]')}\`\\s*\\|\\s*\`([^\`]+)\`\\s*\\|\\s*([^|\\n]+)`)
        const match = content.match(regex)
        if (match) {
          rule.value = match[1].trim()
          if (match[2]) {
            rule.usage = match[2].trim()
          }
        }
      })

      const customRules: IDesignRule[] = []
      const customSectionMatch = content.match(/## Custom Rules\n\n\| Token \| Value \| Usage \| Type \|\n\|[^\n]+\|\n([\s\S]*?)(?=\n---|\n##|$)/)
      if (customSectionMatch) {
        const tableRows = customSectionMatch[1].trim().split('\n')
        tableRows.forEach((row) => {
          const cols = row.split('|').map(c => c.trim()).filter(Boolean)
          if (cols.length >= 4) {
            const typeValue = cols[3].toLowerCase()
            let ruleType: 'color' | 'text' | 'opacity' | 'gradient' | 'css' = 'text'

            if (typeValue === 'color') ruleType = 'color'
            else if (typeValue === 'text') ruleType = 'text'
            else if (typeValue === 'opacity') ruleType = 'opacity'
            else if (typeValue === 'gradient') ruleType = 'gradient'
            else if (typeValue === 'css') ruleType = 'css'

            const tokenId = cols[0].replace(/`/g, '').replace(/[^a-zA-Z0-9-]/g, '_')
            customRules.push({
              id: `custom_${tokenId}`,
              token: cols[0].replace(/`/g, ''),
              value: cols[1].replace(/`/g, ''),
              usage: cols[2],
              type: ruleType,
              isCore: false
            })
          }
        })
      }

      const result = {
        fontFamily,
        rules: [...coreRules, ...customRules]
      }

      setCache('rules', result)
      return result
    } catch (error) {
      throw new Error('Failed to parse RULE.md')
    }
  }

  static async updateRules(rulesData: IDesignRulesData): Promise<{ success: boolean }> {
    try {
      const rulePath = path.join(DS_SOURCE_DIR, 'rule', 'RULE.md')

      const getRule = (token: string) => rulesData.rules.find(r => r.token === token)

      const textPrimary = getRule('--color-text-primary')?.value || '#141414'
      const textWhite = getRule('--color-text-white')?.value || '#FFFFFF'
      const bgWhite = getRule('--color-bg-white')?.value || '#FFFFFF'
      const btnAction = getRule('--color-btn-action')?.value || '#184EFF'
      const btnActionHover = getRule('--color-btn-action-hover')?.value || '#1241CC'
      const btnCancelHover = getRule('--color-btn-cancel-hover')?.value || '#F5F7F9'
      const fontFamily = rulesData.fontFamily || 'Open Sans'

      const customRules = rulesData.rules.filter(r => !r.isCore)

      let customRulesSection = ''
      if (customRules.length > 0) {
        customRulesSection = `

---

## Custom Rules

| Token | Value | Usage | Type |
|-------|-------|-------|------|
${customRules.map(r => `| \`${r.token}\` | \`${r.value}\` | ${r.usage} | ${r.type} |`).join('\n')}
`
      }

      const content = `# Design System Rules

This file defines the baseline styling rules for all components in the design system. All imported components MUST follow these rules.

---

## Typography

### Font Family
\`\`\`css
font-family: '${fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
\`\`\`

**Installation (if not available):**
\`\`\`html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}:wght@400;500;600;700&display=swap" rel="stylesheet">
\`\`\`

### Font Colors
| Token | Value | Usage |
|-------|-------|-------|
| \`--color-text-primary\` | \`${textPrimary}\` | ${getRule('--color-text-primary')?.usage || 'Primary text, headings, body text'} |
| \`--color-text-white\` | \`${textWhite}\` | ${getRule('--color-text-white')?.usage || 'Text on dark/colored backgrounds'} |

---

## Colors

### Backgrounds
| Token | Value | Usage |
|-------|-------|-------|
| \`--color-bg-white\` | \`${bgWhite}\` | ${getRule('--color-bg-white')?.usage || 'Component backgrounds, cards, modals'} |

### Buttons
| Token | Value | Usage |
|-------|-------|-------|
| \`--color-btn-action\` | \`${btnAction}\` | ${getRule('--color-btn-action')?.usage || 'Primary/action button background'} |
| \`--color-btn-action-hover\` | \`${btnActionHover}\` | ${getRule('--color-btn-action-hover')?.usage || 'Primary button hover state'} |
| \`--color-btn-cancel\` | \`linear-gradient(0deg, #FFFFFF, #FFFFFF), linear-gradient(0deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05))\` | Cancel/secondary button background |
| \`--color-btn-cancel-hover\` | \`${btnCancelHover}\` | ${getRule('--color-btn-cancel-hover')?.usage || 'Cancel button hover state'} |
${customRulesSection}
---

## CSS Variables

Include these variables in your component styles:

\`\`\`css
:root {
  /* Typography */
  --font-family: '${fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --color-text-primary: ${textPrimary};
  --color-text-white: ${textWhite};

  /* Backgrounds */
  --color-bg-white: ${bgWhite};

  /* Buttons */
  --color-btn-action: ${btnAction};
  --color-btn-action-hover: ${btnActionHover};
  --color-btn-cancel-hover: ${btnCancelHover};
${customRules.map(r => `  ${r.token}: ${r.value};`).join('\n')}
}
\`\`\`

---

## Button Styles

### Action Button (Primary)
\`\`\`css
.btn-action {
  background-color: ${btnAction};
  color: ${textWhite};
  border: none;
  font-family: '${fontFamily}', sans-serif;
}

.btn-action:hover {
  background-color: ${btnActionHover};
}
\`\`\`

**Tailwind:**
\`\`\`html
<button class="bg-[${btnAction}] text-white hover:bg-[${btnActionHover}] font-['${fontFamily.replace(/\s+/g, '_')}']">
  Action
</button>
\`\`\`

### Cancel Button (Secondary)
\`\`\`css
.btn-cancel {
  background: linear-gradient(0deg, #FFFFFF, #FFFFFF), linear-gradient(0deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05));
  color: ${textPrimary};
  border: 1px solid #E5E7EB;
  font-family: '${fontFamily}', sans-serif;
}

.btn-cancel:hover {
  background: ${btnCancelHover};
}
\`\`\`

**Tailwind:**
\`\`\`html
<button class="bg-white text-[${textPrimary}] border border-gray-200 hover:bg-[${btnCancelHover}] font-['${fontFamily.replace(/\s+/g, '_')}']">
  Cancel
</button>
\`\`\`

---

## Component Template

When creating new components, use this baseline:

\`\`\`css
.component {
  background-color: ${bgWhite};
  font-family: '${fontFamily}', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: ${textPrimary};
}
\`\`\`

**Tailwind baseline:**
\`\`\`html
<div class="bg-white text-[${textPrimary}] font-['${fontFamily.replace(/\s+/g, '_')}']">
  <!-- Component content -->
</div>
\`\`\`

---

## Quick Reference

| Property | Value |
|----------|-------|
| Background (component) | \`${bgWhite}\` |
| Font | \`${fontFamily}\` |
| Text color (dark) | \`${textPrimary}\` |
| Text color (light) | \`${textWhite}\` |
| Action button bg | \`${btnAction}\` |
| Action button hover | \`${btnActionHover}\` |
| Cancel button bg | \`#FFFFFF\` with subtle gradient |
| Cancel button hover | \`${btnCancelHover}\` |

---

## Rules for Import

When importing components via \`import-design\` or \`import-design-by-image\`:

1. **MUST** use \`${fontFamily}\` font (include Google Fonts link if needed)
2. **MUST** use \`${bgWhite}\` for component backgrounds
3. **MUST** use \`${textPrimary}\` for primary text color
4. **MUST** use \`${btnAction}\` for action/primary buttons
5. **MUST** use the gradient background for cancel/secondary buttons
6. **MUST** use \`${btnCancelHover}\` for cancel button hover state
7. **REPLACE** any blue (#3b82f6, etc.) with \`${btnAction}\` for action buttons
8. **REPLACE** any gray button backgrounds with the cancel button gradient
`

      await fs.writeFile(rulePath, content)

      invalidateCache('rules')

      return { success: true }
    } catch (error) {
      throw new Error('Failed to update RULE.md')
    }
  }
}
