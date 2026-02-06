---
name: Avatar
category: forms
created: 2026-02-04T00:00:00.000Z
status: approved
---

# Avatar

## Preview
A versatile avatar component that displays user initials in colored circular badges or group icons. Supports multiple color variants (blue, orange, purple, green) and can show either text initials or icon placeholders.

## Usage
Use avatars to represent users or groups in lists, dropdowns, and user interfaces. The component automatically handles initials display and provides distinct color variants for visual differentiation.

## HTML
```html
<!-- User Avatar with Initials -->
<div class="avatar avatar-blue">
  <span class="avatar-text">CZ</span>
</div>

<div class="avatar avatar-orange">
  <span class="avatar-text">JL</span>
</div>

<div class="avatar avatar-purple">
  <span class="avatar-text">DD</span>
</div>

<div class="avatar avatar-green">
  <span class="avatar-text">NC</span>
</div>

<!-- Group Avatar with Icon -->
<div class="avatar avatar-blue">
  <svg class="avatar-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 14v-1.333A2.667 2.667 0 009.333 10H6.667a2.667 2.667 0 00-2.667 2.667V14M8 7.333A2.667 2.667 0 108 2a2.667 2.667 0 000 5.333zM13.333 14v-1.333a2.667 2.667 0 00-2-2.584M10.667 2.084a2.667 2.667 0 010 5.166" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
</div>
```

## CSS
```css
:root {
  --font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --color-text-white: #FFFFFF;
}

/* Base Avatar Styles */
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-family: var(--font-family);
}

.avatar-text {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-white);
  line-height: 1;
  text-transform: uppercase;
}

.avatar-icon {
  color: var(--color-text-white);
}

/* Color Variants */
.avatar-blue {
  background-color: #184EFF;
}

.avatar-orange {
  background-color: #FB923C;
}

.avatar-purple {
  background-color: #A855F7;
}

.avatar-green {
  background-color: #22C55E;
}
```

## Accessibility
- Use descriptive aria-labels for avatars: `aria-label="User initials CZ"`
- For group icons: `aria-label="Group icon"`
- Ensure sufficient color contrast for text on backgrounds

## Notes
- Generated from image on 2026-02-04
- Avatar size: 32x32px
- Text size: 12px, font-weight: 600
- Icon size: 16x16px
- Always use uppercase for initials
