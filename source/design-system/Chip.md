---
name: Chip
category: forms
created: 2026-02-04T00:00:00.000Z
status: approved
---

# Chip

## Preview
A removable chip/tag component used for displaying selected items. Features a label and an X button for removal. All chips use the same blue background style (`#EBF3FF`) with blue X buttons (`#184EFF`). Used in multi-select inputs, filters, and tag displays.

**Font:** Open Sans (`font-family: 'Open Sans', sans-serif`)

**Google Fonts Import:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

## Usage
Use chips to display selected items in multi-select comboboxes, applied filters, or tags. Each chip can be removed by clicking the X button. All chips now use the same unified blue style regardless of whether they represent groups or individual clients.

## HTML
```html
<!-- Multiple Chips in Container (Mixed: Groups + Clients) -->
<div class="flex flex-wrap gap-1 p-2 border border-[#184EFF] rounded-md bg-white max-h-[84px] overflow-y-auto">
  <!-- Group chips (blue background - same as client style) -->
  <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-[#EBF3FF] rounded text-sm text-[#141414]">
    Marketing Team (12 members)
    <button type="button" class="ml-1 text-[#184EFF] hover:text-[#1241CC] focus:outline-none">
      <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none">
        <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>
  </span>
  <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-[#EBF3FF] rounded text-sm text-[#141414]">
    Sales Department (23 members)
    <button type="button" class="ml-1 text-[#184EFF] hover:text-[#1241CC] focus:outline-none">
      <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none">
        <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>
  </span>

  <!-- Client chips (blue background) -->
  <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-[#EBF3FF] rounded text-sm text-[#141414]">
    Sarah Mitchell
    <button type="button" class="ml-1 text-[#184EFF] hover:text-[#1241CC] focus:outline-none">
      <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none">
        <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>
  </span>
  <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-[#EBF3FF] rounded text-sm text-[#141414]">
    James Rodriguez
    <button type="button" class="ml-1 text-[#184EFF] hover:text-[#1241CC] focus:outline-none">
      <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none">
        <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>
  </span>
  <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-[#EBF3FF] rounded text-sm text-[#141414]">
    Emily Chen
    <button type="button" class="ml-1 text-[#184EFF] hover:text-[#1241CC] focus:outline-none">
      <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none">
        <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>
  </span>
  <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-[#EBF3FF] rounded text-sm text-[#141414]">
    Michael O'Brien
    <button type="button" class="ml-1 text-[#184EFF] hover:text-[#1241CC] focus:outline-none">
      <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none">
        <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>
  </span>
  <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-[#EBF3FF] rounded text-sm text-[#141414]">
    Jessica Taylor
    <button type="button" class="ml-1 text-[#184EFF] hover:text-[#1241CC] focus:outline-none">
      <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none">
        <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>
  </span>
  <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-[#EBF3FF] rounded text-sm text-[#141414]">
    David Park
    <button type="button" class="ml-1 text-[#184EFF] hover:text-[#1241CC] focus:outline-none">
      <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none">
        <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>
  </span>
</div>
```

**Additional Examples:**

### Single Group Chip (Blue Background)
```html
<span class="inline-flex items-center gap-1 px-2 py-0.5 bg-[#EBF3FF] rounded text-sm text-[#141414] font-['Open_Sans']">
  Marketing Team (12 members)
  <button type="button" class="ml-1 text-[#184EFF] hover:text-[#1241CC] focus:outline-none">
    <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  </button>
</span>
```

### Single Client Chip (Blue Background)
```html
<span class="inline-flex items-center gap-1 px-2 py-0.5 bg-[#EBF3FF] rounded text-sm text-[#141414] font-['Open_Sans']">
  Sarah Mitchell
  <button type="button" class="ml-1 text-[#184EFF] hover:text-[#1241CC] focus:outline-none">
    <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  </button>
</span>
```

## CSS
```css
:root {
  --font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --color-text-primary: #141414;
  --color-chip-bg: #EBF3FF;
  --color-chip-x: #184EFF;
  --color-chip-x-hover: #1241CC;
}

/* Base chip styles */
.chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 14px;
  color: var(--color-text-primary);
  font-family: var(--font-family);
  white-space: nowrap;
  background-color: var(--color-chip-bg);
}

/* Chip remove button */
.chip-remove {
  margin-left: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-chip-x);
}

.chip-remove:hover {
  color: var(--color-chip-x-hover);
}

.chip-container {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  padding: 8px;
  border: 1px solid #184EFF;
  border-radius: 6px;
  background: white;
  max-height: 84px;
  overflow-y: auto;
}
```

## JavaScript
```javascript
document.addEventListener('DOMContentLoaded', function() {
  // Remove chip on X button click
  document.querySelectorAll('.chip-remove').forEach(button => {
    button.addEventListener('click', function(e) {
      e.stopPropagation();
      const chip = this.closest('.chip');
      if (chip) {
        const value = chip.dataset.value;
        chip.remove();
        console.log('Chip removed:', value);

        // Dispatch custom event
        document.dispatchEvent(new CustomEvent('chip-removed', {
          detail: { value }
        }));
      }
    });
  });
});
```

## Component States

### All Chip States (Unified Style)
| State | Visual | Tailwind Classes |
|-------|--------|------------------|
| Default | Light blue bg, dark text | `bg-[#EBF3FF] text-[#141414]` |
| X Default | Blue icon | `text-[#184EFF]` |
| X Hover | Darker blue icon | `hover:text-[#1241CC]` |

## Specifications

### All Chips (Unified Blue Style)
| Property | Value |
|----------|-------|
| Background | `#EBF3FF` |
| Text color | `#141414` |
| Font size | 14px (text-sm) |
| Padding | 2px 8px |
| Border radius | 4px |
| Gap (icon) | 4px |
| X icon size | 16px (w-4 h-4) |
| X color | `#184EFF` |
| X hover | `#1241CC` |

## Props/Variants

| Variant | Description | Background Classes | X Button Classes |
|---------|-------------|-------------------|------------------|
| Default | All chips (groups and clients) | `bg-[#EBF3FF]` | `text-[#184EFF] hover:text-[#1241CC]` |
| In container | With blue border container | Container: `border-[#184EFF]` | - |

## Accessibility
- X button is focusable with `button` element
- Clear hover state for X button
- `type="button"` prevents form submission

## Notes
- Generated from image on 2026-02-04
- Updated on 2026-02-04 to unified blue style for all chips
- All chips now use the same style: blue background (`#EBF3FF`) and blue X button (`#184EFF`)
- Used in ComboboxWithSearch for selected items
- Container max-height 84px (~3 rows) with scroll
- X uses SVG icon with consistent blue styling
