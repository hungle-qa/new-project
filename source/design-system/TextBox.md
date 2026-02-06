---
name: TextBox
category: forms
created: 2026-02-03T00:00:00.000Z
status: approved
---

# TextBox

## Preview
A simple text input field with a solid gray border, used for user entry fields.

## Usage
Use this component for:
- User search or lookup fields
- Standard form inputs
- Text entry fields

## HTML
```html
<input
  type="text"
  class="text-box"
  placeholder="Enter user..."
  aria-label="Enter user"
/>
```

## CSS
```css
.text-box {
  width: 320px;
  padding: 12px 16px;
  font-size: 13px;
  font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #141414;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.text-box::placeholder {
  color: #9ca3af;
}

.text-box:focus {
  border-color: #184EFF;
  box-shadow: 0 0 0 3px rgba(24, 78, 255, 0.1);
}

.text-box:hover {
  border-color: #184EFF;
}
```

## Accessibility
- Include `aria-label` for screen readers when no visible label is present
- Ensure sufficient color contrast for placeholder text
- Provide visible focus state for keyboard navigation
- Use `<label>` element when possible for better accessibility

## Notes
- Imported via web UI on 2026-02-03
- Simple gray border for standard form inputs
- Updated 2026-02-05: Width reduced to 320px (w-80), hover border fixed to #184EFF per RULE.md
- Renamed from UserInput to TextBox
