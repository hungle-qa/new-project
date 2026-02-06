---
name: Scrollbar
category: layout
created: 2026-02-04T00:00:00.000Z
status: approved
---

# Scrollbar

## Preview
Custom styled scrollbar for dropdown lists, modals, and scrollable containers. Features a thin, rounded design with subtle colors that matches the design system.

## Usage
Apply to any scrollable container like dropdown lists, modal content, sidebars, or any element with `overflow-y: auto`.

## HTML
```html
<div class="custom-scrollbar" style="max-height: 300px; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; width: 280px; font-family: 'Open Sans', sans-serif;">
  <div style="color: #141414; font-size: 13px; line-height: 2;">
    <p>Item 1</p>
    <p>Item 2</p>
    <p>Item 3</p>
    <p>Item 4</p>
    <p>Item 5</p>
    <p>Item 6</p>
    <p>Item 7</p>
    <p>Item 8</p>
    <p>Item 9</p>
    <p>Item 10</p>
    <p>Item 11</p>
    <p>Item 12</p>
    <p>Item 13</p>
    <p>Item 14</p>
    <p>Item 15</p>
  </div>
</div>
```

## CSS
```css
/* Custom Scrollbar Styles */
.custom-scrollbar {
  overflow-y: auto;
}

/* Webkit browsers (Chrome, Safari, Edge) */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #e1e1ea;
  border-radius: 3px;
}

/* Firefox */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #e1e1ea transparent;
}
```

## Component States

| State | Visual | CSS |
|-------|--------|-----|
| Default | Light gray thumb | `#e1e1ea` |
| Track | Transparent | `transparent` |

## Accessibility
- Scrollbar remains functional for keyboard/mouse users
- Thin design doesn't obstruct content
- Visible on hover for discoverability

## Notes
- Generated from image on 2026-02-04
- Works in Chrome, Safari, Edge (Webkit)
- Firefox uses `scrollbar-width` and `scrollbar-color`
- For Tailwind, consider `tailwind-scrollbar` plugin
