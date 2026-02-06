---
name: ButtonBlue
description: Primary action button with blue background and white text. Used for main CTAs like creating, submitting, or confirming actions.
category: buttons
status: approved
tags: [button, primary, action, CTA, blue]
created: 2026-02-06T15:00:00+07:00
updated: 2026-02-06T15:00:00+07:00
---

# ButtonBlue

Primary action button with blue background, white text, and optional leading icon.

## Preview

A blue button for primary actions like "Create", "Save", "Submit".

## Usage

Use for primary call-to-action on a page:
- Creating new items (Create, Add, New)
- Submitting forms (Save, Submit, Confirm)
- Important positive actions

Do NOT use for:
- Secondary actions (use ButtonWhite instead)
- Destructive actions (use red/danger button)

## HTML
```html
<button type="button" class="btn-blue">
  <svg class="btn-icon" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.063 6.963H11.9a.392.392 0 100-.784H7.063V1.34a.392.392 0 10-.785 0v4.838H1.44a.392.392 0 000 .784h4.838v4.839a.392.392 0 10.784 0V6.962z" fill="#FFFFFF" stroke="#FFFFFF"/>
  </svg>
  <span class="btn-text">Create Meal Plan</span>
</button>
```

## CSS
```css
:root {
  --font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --color-text-white: #FFFFFF;
  --color-bg-blue: #184EFF;
  --color-bg-blue-hover: #1545E6;
  --color-bg-blue-active: #1240D9;
}

/* Button Blue */
.btn-blue {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: var(--color-bg-blue);
  border: none;
  border-radius: 8px;
  font-family: var(--font-family);
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-white);
  cursor: pointer;
  transition: background-color 0.2s ease;
  height: 40px;
  white-space: nowrap;
}

.btn-blue:hover {
  background-color: var(--color-bg-blue-hover);
}

.btn-blue:active {
  background-color: var(--color-bg-blue-active);
}

.btn-blue:focus {
  outline: 2px solid var(--color-bg-blue);
  outline-offset: 2px;
}

.btn-blue:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Button Icon */
.btn-icon {
  flex-shrink: 0;
  width: 13px;
  height: 13px;
}

/* Button Text */
.btn-text {
  line-height: 1;
}
```

## Tailwind Classes Used

| Class | Purpose |
|-------|---------|
| `inline-flex` | Flexbox for icon + text |
| `items-center` | Vertical alignment |
| `gap-2` | 8px spacing between icon and text |
| `bg-[#184EFF]` | Primary blue background |
| `hover:bg-[#1545E6]` | Hover state |
| `active:bg-[#1240D9]` | Active/pressed state |
| `text-white` | White text color |
| `font-['Open_Sans']` | Open Sans font family |
| `font-semibold` | Font weight 600 |
| `text-sm` | 14px font size |
| `px-4` | 16px horizontal padding |
| `py-2.5` | 10px vertical padding |
| `rounded-lg` | 8px border radius |
| `transition-colors` | Smooth color transition |
| `duration-200` | 200ms transition |

## Props/Variants

| Variant | Classes | Description |
|---------|---------|-------------|
| Default (Medium) | `px-4 py-2.5 text-sm` | Standard size for most actions |
| Small | `px-3 py-1.5 text-xs rounded-md gap-1.5` | Compact size |
| Large | `px-6 py-3 text-base gap-2.5` | Prominent call-to-action |
| Without Icon | Remove SVG element | Text-only button |
| Disabled | Add `disabled` attribute | Non-interactive state |

## Component States

| State | Trigger | Visual Changes | CSS/Tailwind |
|-------|---------|----------------|--------------|
| Default | - | Blue bg (#184EFF), white text | `bg-[#184EFF]` |
| Hover | Mouse over | Darker blue (#1545E6) | `hover:bg-[#1545E6]` |
| Active | Click/press | Even darker (#1240D9) | `active:bg-[#1240D9]` |
| Focus | Tab/keyboard | Blue outline ring | `focus:ring-2 focus:ring-[#184EFF]` |
| Disabled | `disabled` attr | 50% opacity, no cursor | `opacity-50 cursor-not-allowed` |

## Accessibility

- Use `aria-label` for icon-only buttons
- Include `disabled` attribute when non-interactive
- Color contrast ratio: 4.5:1 (white on blue passes)
- Support keyboard focus with visible focus ring
- Use semantic `<button>` element with `type="button"`

## Notes

- Generated from image on 2026-02-06
- Primary action button - limit to ONE per page section
- Pair with ButtonWhite for secondary actions
