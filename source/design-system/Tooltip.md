---
name: Tooltip
category: feedback
created: 2026-02-04T08:00:00.000Z
updated: 2026-02-04T08:00:00.000Z
status: draft
---

# Tooltip

## Preview
A tooltip component that displays helpful text above a trigger element. Features dark background with white text and a downward-pointing arrow.

**Font:** Open Sans (`font-family: 'Open Sans', sans-serif`)

**Google Fonts Import:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

## Usage
Use tooltips to provide contextual information or labels for buttons, icons, or interactive elements. Appears on hover and positioned above the trigger element.

## HTML
```html
<!-- Tooltip Container -->
<div class="tooltip-wrapper">
  <!-- Trigger Element (Button Example) -->
  <button class="tooltip-trigger" aria-describedby="tooltip-1">
    <span>⋯</span>
  </button>

  <!-- Tooltip (hidden by default) -->
  <div class="tooltip" id="tooltip-1" role="tooltip">
    More options
    <div class="tooltip-arrow"></div>
  </div>
</div>
```

**With different content:**
```html
<div class="tooltip-wrapper">
  <button class="tooltip-trigger" aria-describedby="tooltip-2">
    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>
  </button>

  <div class="tooltip" id="tooltip-2" role="tooltip">
    More information
    <div class="tooltip-arrow"></div>
  </div>
</div>
```

## CSS
```css
:root {
  --font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --color-text-white: #FFFFFF;
  --color-tooltip-bg: #1F2937;
}

/* Tooltip Wrapper */
.tooltip-wrapper {
  position: relative;
  display: inline-block;
}

/* Tooltip */
.tooltip {
  position: absolute;
  bottom: calc(100% + 8px); /* Position above trigger */
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--color-tooltip-bg);
  color: var(--color-text-white);
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  font-family: var(--font-family);
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease, visibility 0.2s ease;
  pointer-events: none;
  z-index: 1000;
}

/* Tooltip Arrow (pointing DOWN to trigger) */
.tooltip-arrow {
  position: absolute;
  top: 100%; /* Position at bottom of tooltip */
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid var(--color-tooltip-bg);
}

/* Show Tooltip on Hover */
.tooltip-wrapper:hover .tooltip {
  opacity: 1;
  visibility: visible;
}

/* Trigger Button (optional styling) */
.tooltip-trigger {
  background: white;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  font-family: var(--font-family);
  transition: background-color 0.15s ease;
}

.tooltip-trigger:hover {
  background-color: #F5F7F9;
}
```

## Tailwind CSS
```html
<!-- Tooltip with Tailwind -->
<div class="relative inline-block group font-['Open_Sans']">
  <!-- Trigger Button -->
  <button
    class="bg-white border border-gray-200 rounded-md px-3 py-2 hover:bg-[#F5F7F9] transition-colors"
    aria-describedby="tooltip-tailwind"
  >
    <span class="text-[#141414]">⋯</span>
  </button>

  <!-- Tooltip -->
  <div
    id="tooltip-tailwind"
    class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[#1F2937] text-white text-xs font-medium rounded-md whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all pointer-events-none z-[1000]"
    role="tooltip"
  >
    More options
    <!-- Arrow pointing DOWN -->
    <div class="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#1F2937]"></div>
  </div>
</div>
```

## JavaScript
```javascript
// Tooltip - Show/Hide on Hover (if not using CSS :hover)
document.addEventListener('DOMContentLoaded', function() {
  const tooltipWrappers = document.querySelectorAll('.tooltip-wrapper');

  tooltipWrappers.forEach(wrapper => {
    const trigger = wrapper.querySelector('.tooltip-trigger');
    const tooltip = wrapper.querySelector('.tooltip');

    if (!trigger || !tooltip) return;

    // Show tooltip on mouseenter
    trigger.addEventListener('mouseenter', function() {
      tooltip.style.opacity = '1';
      tooltip.style.visibility = 'visible';
    });

    // Hide tooltip on mouseleave
    trigger.addEventListener('mouseleave', function() {
      tooltip.style.opacity = '0';
      tooltip.style.visibility = 'hidden';
    });

    // Show on focus (keyboard accessibility)
    trigger.addEventListener('focus', function() {
      tooltip.style.opacity = '1';
      tooltip.style.visibility = 'visible';
    });

    // Hide on blur
    trigger.addEventListener('blur', function() {
      tooltip.style.opacity = '0';
      tooltip.style.visibility = 'hidden';
    });
  });
});
```

## Component States

| State | Trigger | Visual Changes | CSS Classes |
|-------|---------|----------------|-------------|
| Hidden | Default | Invisible, opacity 0 | `opacity: 0; visibility: hidden;` |
| Visible | Hover/Focus | Visible, opacity 1 | `opacity: 1; visibility: visible;` |

## Positioning Options

| Position | CSS Modification |
|----------|------------------|
| Above (default) | `bottom: calc(100% + 8px);` |
| Below | `top: calc(100% + 8px);` (flip arrow direction) |
| Left | `right: calc(100% + 8px); top: 50%; transform: translateY(-50%);` |
| Right | `left: calc(100% + 8px); top: 50%; transform: translateY(-50%);` |

## Props/Variants

| Variant | Description | Classes |
|---------|-------------|---------|
| default | Dark background, white text | `bg-[#1F2937] text-white` |
| above | Positioned above trigger (default) | `bottom-full mb-2` |
| arrow-down | Arrow points down to trigger | `border-t-[#1F2937]` |

## Accessibility
- Uses `role="tooltip"` for screen readers
- Trigger has `aria-describedby` pointing to tooltip ID
- Keyboard accessible (shows on focus)
- `pointer-events: none` prevents interference with hover

## Notes
- Created on 2026-02-04 (GMT+7)
- Tooltip appears ABOVE trigger element
- Arrow points DOWN to trigger
- Dark background #1F2937 with white text
- Uses CSS transitions for smooth show/hide
- JavaScript optional (CSS :hover works for mouse users)
- Positioned with `position: absolute` and centered with `transform`
