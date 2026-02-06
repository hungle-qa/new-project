---
name: CreateButtonBlue
description: >-
  Primary action button with blue background and white text. Used for main CTAs
  like creating, submitting, or confirming actions.
category: buttons
status: approved
tags:
  - button
  - primary
  - action
  - CTA
  - blue
  - create
created: 2026-02-06T08:00:00.000Z
updated: 2026-02-06T08:00:00.000Z
---

# CreateButtonBlue

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
<button type="button" class="btn-create-blue">
  <svg class="btn-icon" width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.063 6.963H11.9a.392.392 0 100-.784H7.063V1.34a.392.392 0 10-.785 0v4.838H1.44a.392.392 0 000 .784h4.838v4.839a.392.392 0 10.784 0V6.962z" fill="#FFFFFF" stroke="#FFFFFF"/>
  </svg>
  <span class="btn-text">Create Meal Plan</span>
</button>
```

## CSS
```css
:root {
  /* Typography - per RULE.md */
  --font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --color-text-white: #FFFFFF;

  /* Buttons - per RULE.md */
  --color-btn-action: #184EFF;
  --color-btn-add-hover: #1649ED;
}

/* Create Button Blue - follows RULE.md */
.btn-create-blue {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: var(--color-btn-action);
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

.btn-create-blue:hover {
  background-color: var(--color-btn-add-hover);
}

.btn-create-blue:focus {
  outline: 2px solid var(--color-btn-action);
  outline-offset: 2px;
}

.btn-create-blue:disabled {
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

## Tailwind CSS
```html
<button type="button" class="inline-flex items-center gap-2 px-4 py-2.5 bg-[#184EFF] hover:bg-[#1649ED] text-white font-['Open_Sans'] font-semibold text-sm rounded-lg transition-colors duration-200 h-10 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#184EFF] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed">
  <svg class="w-[13px] h-[13px] flex-shrink-0" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.063 6.963H11.9a.392.392 0 100-.784H7.063V1.34a.392.392 0 10-.785 0v4.838H1.44a.392.392 0 000 .784h4.838v4.839a.392.392 0 10.784 0V6.962z" fill="currentColor" stroke="currentColor"/>
  </svg>
  <span class="leading-none">Create Meal Plan</span>
</button>
```

## Tailwind Classes Used

| Class | Purpose |
|-------|---------|
| `inline-flex` | Flexbox for icon + text |
| `items-center` | Vertical alignment |
| `gap-2` | 8px spacing between icon and text |
| `bg-[#184EFF]` | Primary blue background (RULE: --color-btn-action) |
| `hover:bg-[#1649ED]` | Hover state (RULE: --color-btn-add-hover) |
| `text-white` | White text color |
| `font-['Open_Sans']` | Open Sans font family (RULE required) |
| `font-semibold` | Font weight 600 |
| `text-sm` | 14px font size |
| `px-4` | 16px horizontal padding |
| `py-2.5` | 10px vertical padding |
| `rounded-lg` | 8px border radius |
| `transition-colors` | Smooth color transition |
| `duration-200` | 200ms transition |
| `h-10` | 40px height |
| `whitespace-nowrap` | Prevent text wrap |
| `focus:ring-2` | Focus ring width |
| `focus:ring-[#184EFF]` | Focus ring color |
| `disabled:opacity-50` | Disabled state opacity |

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
| Hover | Mouse over | Darker blue (#1649ED) | `hover:bg-[#1649ED]` |
| Focus | Tab/keyboard | Blue outline ring | `focus:ring-2 focus:ring-[#184EFF]` |
| Disabled | `disabled` attr | 50% opacity, no cursor | `disabled:opacity-50 disabled:cursor-not-allowed` |

## Accessibility

- Use `aria-label` for icon-only buttons
- Include `disabled` attribute when non-interactive
- Color contrast ratio: 4.5:1 (white on blue passes)
- Support keyboard focus with visible focus ring
- Use semantic `<button>` element with `type="button"`

## Notes

- Renamed from ButtonBlue on 2026-02-06
- Updated to follow RULE.md color tokens
- Hover uses `--color-btn-add-hover: #1649ED` per RULE.md for CREATE/ADD buttons
- Primary action button - limit to ONE per page section
- Pair with ButtonWhite for secondary actions
