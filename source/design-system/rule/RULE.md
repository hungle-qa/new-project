# Design System Rules

This file defines the baseline styling rules for all components in the design system. All imported components MUST follow these rules.

---

## Typography

### Font Family
```css
font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

**Installation (if not available):**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Font Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--color-text-primary` | `#141414` | Primary text, headings, body text |
| `--color-text-white` | `#FFFFFF` | Text on dark/colored backgrounds |

---

## Colors

### Backgrounds
| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg-white` | `#FFFFFF` | Component backgrounds, cards, modals |

### Buttons
| Token | Value | Usage |
|-------|-------|-------|
| `--color-btn-action` | `#184EFF` | Primary/action button background |
| `--color-btn-action-hover` | `#184EFFE6` | Primary button hover state |
| `--color-btn-cancel` | `linear-gradient(0deg, #FFFFFF, #FFFFFF), linear-gradient(0deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05))` | Cancel/secondary button background |
| `--color-btn-cancel-hover` | `#F5F7F9` | Cancel button hover state |


---

## Custom Rules

| Token | Value | Usage | Type |
|-------|-------|-------|------|
| `--color-bg-combobox-hover` | `#F0F1FF` | Hover on the item on the combobox, dropdown | color |
| `--color-border-textbox-hover` | `#184EFF` | border when hovering the textbox, search box, datebox... Always 1px. | color |
| `--color-text-blue` | `#184EFF` | Hovering the button with text is black | color |
| `--color-bg-button-hover` | `#F0F1FF` | Hovering the button color is white | color |
| `--color-text-secondary` | `#222222` | Main section, Sub section, text in the item (list, dropdownlist) | color |

---

## CSS Variables

Include these variables in your component styles:

```css
:root {
  /* Typography */
  --font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --color-text-primary: #141414;
  --color-text-white: #FFFFFF;

  /* Backgrounds */
  --color-bg-white: #FFFFFF;

  /* Buttons */
  --color-btn-action: #184EFF;
  --color-btn-action-hover: #184EFFE6;
  --color-btn-cancel-hover: #F5F7F9;
  --color-bg-combobox-hover: #F0F1FF;
  --color-border-textbox-hover: #184EFF;
  --color-text-blue: #184EFF;
  --color-bg-button-hover: #F0F1FF;
  --color-text-secondary: #222222;
}
```

---

## Button Styles

### Action Button (Primary)
```css
.btn-action {
  background-color: #184EFF;
  color: #FFFFFF;
  border: none;
  font-family: 'Open Sans', sans-serif;
}

.btn-action:hover {
  background-color: #184EFFE6;
}
```

**Tailwind:**
```html
<button class="bg-[#184EFF] text-white hover:bg-[#184EFFE6] font-['Open_Sans']">
  Action
</button>
```

### Cancel Button (Secondary)
```css
.btn-cancel {
  background: linear-gradient(0deg, #FFFFFF, #FFFFFF), linear-gradient(0deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05));
  color: #141414;
  border: 1px solid #E5E7EB;
  font-family: 'Open Sans', sans-serif;
}

.btn-cancel:hover {
  background: #F5F7F9;
}
```

**Tailwind:**
```html
<button class="bg-white text-[#141414] border border-gray-200 hover:bg-[#F5F7F9] font-['Open_Sans']">
  Cancel
</button>
```

---

## Component Template

When creating new components, use this baseline:

```css
.component {
  background-color: #FFFFFF;
  font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #141414;
}
```

**Tailwind baseline:**
```html
<div class="bg-white text-[#141414] font-['Open_Sans']">
  <!-- Component content -->
</div>
```

---

## Quick Reference

| Property | Value |
|----------|-------|
| Background (component) | `#FFFFFF` |
| Font | `Open Sans` |
| Text color (dark) | `#141414` |
| Text color (light) | `#FFFFFF` |
| Action button bg | `#184EFF` |
| Action button hover | `#184EFFE6` |
| Cancel button bg | `#FFFFFF` with subtle gradient |
| Cancel button hover | `#F5F7F9` |

---

## Rules for Import

When importing components via `import-design` or `import-design-by-image`:

1. **MUST** use `Open Sans` font (include Google Fonts link if needed)
2. **MUST** use `#FFFFFF` for component backgrounds
3. **MUST** use `#141414` for primary text color
4. **MUST** use `#184EFF` for action/primary buttons
5. **MUST** use the gradient background for cancel/secondary buttons
6. **MUST** use `#F5F7F9` for cancel button hover state
7. **REPLACE** any blue (#3b82f6, etc.) with `#184EFF` for action buttons
8. **REPLACE** any gray button backgrounds with the cancel button gradient
