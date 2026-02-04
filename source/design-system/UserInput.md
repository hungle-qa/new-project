---
name: UserInput
category: forms
created: 2026-02-03T00:00:00.000Z
status: approved
---

# UserInput

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
  class="user-input"
  placeholder="Enter user..."
  aria-label="Enter user"
/>
```

## CSS
```css
.user-input {
  width: 100%;
  padding: 12px 16px;
  font-size: 16px;
  font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #141414;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  outline: none;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.user-input::placeholder {
  color: #9ca3af;
}

.user-input:focus {
  border-color: #184EFF;
  box-shadow: 0 0 0 3px rgba(24, 78, 255, 0.1);
}

.user-input:hover {
  border-color: #9ca3af;
}
```

## Tailwind CSS
```html
<input
  type="text"
  class="w-full px-4 py-3 text-[#141414] bg-white border border-gray-300 rounded-md placeholder-gray-400 focus:border-[#184EFF] focus:ring-2 focus:ring-[#184EFF]/10 focus:outline-none hover:border-gray-400 transition-colors font-['Open_Sans']"
  placeholder="Enter user..."
  aria-label="Enter user"
/>
```

## Props/Variants
| Variant | Class | Description |
|---------|-------|-------------|
| default | `.user-input` | Standard gray border input |
| focused | `.user-input:focus` | Focused state with blue ring |
| disabled | `.user-input:disabled` | Disabled state with reduced opacity |

## Accessibility
- Include `aria-label` for screen readers when no visible label is present
- Ensure sufficient color contrast for placeholder text
- Provide visible focus state for keyboard navigation
- Use `<label>` element when possible for better accessibility

## Notes
- Imported via web UI on 2026-02-03
- Simple gray border for standard form inputs
