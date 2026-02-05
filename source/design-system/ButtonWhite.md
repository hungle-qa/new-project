---
name: ButtonWhite
category: buttons
created: 2026-02-04T00:00:00.000Z
updated: 2026-02-04T03:30:00.000Z
status: approved
---

# ButtonWhite

## Preview
A white button with border and icon. Features:
- White background with border
- Plus icon on the left
- Text label
- Hover state with light purple background and blue text/icon
- No dropdown arrow

**Font:** Open Sans (`font-family: 'Open Sans', sans-serif`)

**Google Fonts Import:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

## Usage
Use for secondary actions like "Add New", "Create", or "Upload". Provides clear visual distinction from primary action buttons while maintaining prominence.

## HTML
```html
<button type="button" class="btn-white">
  <svg class="btn-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  <span class="btn-text">Add New Ingredient</span>
</button>
```

## CSS
```css
:root {
  --font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --color-text-primary: #141414;
  --color-text-blue: #184EFF;
  --color-bg-white: #FFFFFF;
  --color-bg-button-hover: #F0F1FF;
}

/* Button White */
.btn-white {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: var(--color-bg-white);
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-family: var(--font-family);
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  height: 40px;
  white-space: nowrap;
}

.btn-white:hover {
  background-color: var(--color-bg-button-hover);
  border-color: #D1D5DB;
  color: var(--color-text-blue);
}

.btn-white:hover .btn-icon {
  color: var(--color-text-blue);
}

.btn-white:active {
  background-color: #E0EAFF;
}

.btn-white:focus {
  outline: 2px solid #184EFF;
  outline-offset: 2px;
}

.btn-white:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: var(--color-bg-white);
}

/* Button Icon */
.btn-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  color: var(--color-text-primary);
  transition: color 0.15s ease;
}

/* Button Text */
.btn-text {
  line-height: 20px;
}
```

## JavaScript
```javascript
// ButtonWhite - Click handler and event emission
document.addEventListener('DOMContentLoaded', function() {
  const buttons = document.querySelectorAll('.btn-white');

  if (buttons.length === 0) {
    console.log('ButtonWhite: No buttons found');
    return;
  }

  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      // Prevent default if needed
      if (this.type !== 'submit') {
        e.preventDefault();
      }

      // Emit custom event for integration
      const clickEvent = new CustomEvent('buttonWhiteClick', {
        detail: {
          text: this.querySelector('.btn-text')?.textContent,
          button: this
        }
      });
      document.dispatchEvent(clickEvent);

      console.log('ButtonWhite: Clicked -', this.querySelector('.btn-text')?.textContent);
    });
  });

  console.log('ButtonWhite: Initialized', buttons.length, 'buttons');
});
```

## Component States

| State | Trigger | Visual Changes | CSS Classes |
|-------|---------|----------------|-------------|
| Default | - | White bg, gray border, black text/icon | `.btn-white` |
| Hover | Mouse over | Light purple bg #F0F1FF, blue text/icon #184EFF | `.btn-white:hover` |
| Active | Click/press | Darker purple bg #E0EAFF | `.btn-white:active` |
| Focus | Tab key | Blue outline ring | `.btn-white:focus` |
| Disabled | disabled attr | 50% opacity, no hover | `.btn-white:disabled` |

## Props/Variants

| Variant | HTML | Description |
|---------|------|-------------|
| With icon | `<svg class="btn-icon">` | Plus icon on left |
| Text only | Remove `<svg>` | Button without icon |
| Custom text | Change `.btn-text` content | Any label text |
| Disabled | Add `disabled` attribute | Non-interactive state |

## Icon Variants

Common icons for white buttons:

### Plus Icon (Add)
```html
<svg class="btn-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

### Upload Icon
```html
<svg class="btn-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M17 13v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4M13 6l-3-3m0 0L7 6m3-3v12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

### Download Icon
```html
<svg class="btn-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
  <path d="M17 13v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4M7 10l3 3m0 0l3-3m-3 3V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

## Integration

This component emits a custom `buttonWhiteClick` event:

```javascript
document.addEventListener('buttonWhiteClick', function(e) {
  const buttonText = e.detail.text;
  // Handle button click action
  console.log('Button clicked:', buttonText);
});
```

## Accessibility
- Uses semantic `<button>` element
- Clear focus state with outline ring
- Disabled state prevents interaction
- Icon and text both visible for clarity
- Keyboard accessible (Space, Enter)
- Proper color contrast ratio

## Notes
- Created on 2026-02-04
- Updated on 2026-02-04 (added blue hover effect for text and icon)
- White background with 1px gray border
- Hover: light purple bg #F0F1FF + blue text/icon #184EFF
- Active: darker purple #E0EAFF
- Height: 40px
- Icon size: 20x20px
- No dropdown arrow (simplified)
- Emits custom event for integration
- Font weight: 500 (medium)
- Border radius: 8px
