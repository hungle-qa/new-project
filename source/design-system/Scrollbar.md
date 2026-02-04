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

## Tailwind CSS
```html
<!-- Container with custom scrollbar -->
<div class="max-h-[300px] overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
  <!-- Scrollable content here -->
  <div class="p-4">Content 1</div>
  <div class="p-4">Content 2</div>
  <div class="p-4">Content 3</div>
  <div class="p-4">Content 4</div>
  <div class="p-4">Content 5</div>
  <div class="p-4">Content 6</div>
  <div class="p-4">Content 7</div>
  <div class="p-4">Content 8</div>
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
  background-color: #D1D5DB;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #9CA3AF;
}

/* Firefox */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #D1D5DB transparent;
}

/* Hide scrollbar until hover (optional) */
.custom-scrollbar-hidden {
  overflow-y: auto;
}

.custom-scrollbar-hidden::-webkit-scrollbar-thumb {
  background-color: transparent;
}

.custom-scrollbar-hidden:hover::-webkit-scrollbar-thumb {
  background-color: #D1D5DB;
}
```

## Tailwind Plugin (if using tailwind-scrollbar)
```html
<!-- Requires: npm install tailwind-scrollbar -->
<div class="overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
  <!-- Content -->
</div>
```

## Pure CSS Implementation
```html
<style>
  .scroll-container {
    max-height: 300px;
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: #D1D5DB transparent;
  }

  .scroll-container::-webkit-scrollbar {
    width: 6px;
  }

  .scroll-container::-webkit-scrollbar-track {
    background: transparent;
  }

  .scroll-container::-webkit-scrollbar-thumb {
    background-color: #D1D5DB;
    border-radius: 3px;
  }

  .scroll-container::-webkit-scrollbar-thumb:hover {
    background-color: #9CA3AF;
  }
</style>

<div class="scroll-container">
  <!-- Your scrollable content -->
</div>
```

## Component States

| State | Visual | CSS |
|-------|--------|-----|
| Default | Light gray thumb | `#D1D5DB` |
| Hover | Darker gray thumb | `#9CA3AF` |
| Track | Transparent | `transparent` |

## Specifications

| Property | Value |
|----------|-------|
| Width | 6px |
| Border radius | 3px |
| Thumb color | `#D1D5DB` (gray-300) |
| Thumb hover | `#9CA3AF` (gray-400) |
| Track color | transparent |

## Accessibility
- Scrollbar remains functional for keyboard/mouse users
- Thin design doesn't obstruct content
- Visible on hover for discoverability

## Notes
- Generated from image on 2026-02-04
- Works in Chrome, Safari, Edge (Webkit)
- Firefox uses `scrollbar-width` and `scrollbar-color`
- For Tailwind, consider `tailwind-scrollbar` plugin
