---
name: MoreOptionsVertical
category: navigation
created: 2026-02-04T08:00:00.000Z
updated: 2026-02-04T08:00:00.000Z
status: draft
---

# MoreOptionsVertical

## Preview
A vertical three-dot menu button (⋮) that opens a dropdown menu with action items. Identical behavior to MoreOptionsHorizontal but uses vertical dots instead of horizontal dots.

**Font:** Open Sans (`font-family: 'Open Sans', sans-serif`)

**Google Fonts Import:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

## Usage
Use for overflow menus, contextual actions on cards/items, or additional options. Shows common actions like Duplicate, Edit, Sharing settings, and Remove. Use vertical dots when horizontal space is limited or for better visual distinction.

## HTML
```html
<!-- More Options Vertical -->
<div class="more-options-wrapper">
  <!-- Three-dot Button (VERTICAL) -->
  <button class="more-options-btn" id="moreOptionsBtnVertical" aria-haspopup="true" aria-expanded="false">
    <span class="more-options-dots-vertical">⋮</span>
  </button>

  <!-- Tooltip (appears on hover ABOVE button) -->
  <div class="more-options-tooltip" role="tooltip">
    More options
    <div class="tooltip-arrow"></div>
  </div>

  <!-- Dropdown Menu (appears on click BELOW button) -->
  <div class="more-options-dropdown" id="moreOptionsDropdownVertical" role="menu">
    <!-- Duplicate -->
    <button class="dropdown-item" role="menuitem">
      <svg class="dropdown-icon" width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
        <g fill="#FFF" fill-rule="nonzero">
          <path d="M9.521 2.667H1.428C.64 2.667 0 3.307 0 4.095v8.093c0 .789.64 1.428 1.428 1.428h8.093c.789 0 1.428-.64 1.428-1.428V4.095c0-.789-.64-1.428-1.428-1.428zm.476 9.52a.476.476 0 01-.476.477H1.428a.476.476 0 01-.476-.476V4.095c0-.263.213-.476.476-.476h8.093c.263 0 .476.213.476.476v8.093z"/>
          <path d="M11.997 0H3.428C2.64 0 2 .64 2 1.428a.476.476 0 10.952 0c0-.263.213-.476.476-.476h8.57c.262 0 .475.213.475.476v8.57a.476.476 0 01-.476.475.476.476 0 100 .952c.789 0 1.428-.639 1.428-1.428V1.428C13.425.64 12.786 0 11.997 0z"/>
        </g>
      </svg>
      <span>Duplicate</span>
    </button>

    <!-- Edit -->
    <button class="dropdown-item" role="menuitem">
      <svg class="dropdown-icon" fill="none" height="24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg" color="#fff">
        <path d="M14 2l4 4L7 17H3v-4L14 2zM3 22h18"/>
      </svg>
      <span>Edit</span>
    </button>

    <!-- Sharing settings -->
    <button class="dropdown-item" role="menuitem">
      <!-- share-white.svg -->
      <svg class="dropdown-icon" width="14" height="14" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
        <g fill="#FFF" fill-rule="nonzero">
          <circle cx="11" cy="2.5" r="2"/>
          <circle cx="11" cy="11.5" r="2"/>
          <circle cx="3" cy="7" r="2"/>
          <path d="M4.7 6.1l4.6-2.7M4.7 7.9l4.6 2.7" stroke="#FFF" stroke-width="1.2" fill="none"/>
        </g>
      </svg>
      <span>Sharing settings</span>
    </button>

    <!-- Remove -->
    <button class="dropdown-item" role="menuitem">
      <svg class="dropdown-icon" width="14" height="15" viewBox="0 0 14 15" xmlns="http://www.w3.org/2000/svg">
        <g fill="#FFF" fill-rule="nonzero" stroke="#FFF">
          <path d="M12.613 2.935H9.815V2.48A1.48 1.48 0 008.335 1h-2.66a1.48 1.48 0 00-1.479 1.48v.455H1.398a.372.372 0 00-.373.374c0 .207.166.373.373.373h.675v8.77c0 1.101.896 1.997 1.996 1.997h5.873c1.1 0 1.996-.896 1.996-1.996V3.682h.675a.372.372 0 00.373-.373.372.372 0 00-.373-.374zm-7.67-.456c0-.403.329-.732.733-.732h2.66c.403 0 .732.329.732.732v.456H4.943V2.48zm6.249 9.974c0 .688-.562 1.25-1.25 1.25H4.069c-.688 0-1.25-.562-1.25-1.25V3.682h8.375v8.77h-.002z" stroke-width=".3"/>
          <path d="M7.006 12.364a.372.372 0 00.373-.373V5.394a.372.372 0 00-.373-.374.372.372 0 00-.374.374v6.594c0 .207.166.376.374.376zM4.57 11.952a.372.372 0 00.373-.373V5.803a.372.372 0 00-.373-.374.372.372 0 00-.374.374v5.776c0 .207.169.373.374.373zM9.441 11.952a.372.372 0 00.374-.373V5.803a.372.372 0 00-.374-.374.372.372 0 00-.373.374v5.776c0 .207.166.373.373.373z" stroke-width=".2"/>
        </g>
      </svg>
      <span>Remove</span>
    </button>
  </div>
</div>
```

## CSS
```css
:root {
  --font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --color-text-primary: #141414;
  --color-text-white: #FFFFFF;
  --color-bg-white: #FFFFFF;
  --color-tooltip-bg: #1F2937;
  --color-dropdown-bg: #1F2937;
  --color-dropdown-hover: #374151;
  --color-btn-hover: #F5F7F9;
}

/* Wrapper */
.more-options-wrapper {
  position: relative;
  display: inline-block;
}

/* Three-dot Button (VERTICAL DOTS) */
.more-options-btn {
  background-color: var(--color-bg-white);
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  font-family: var(--font-family);
  transition: background-color 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.more-options-btn:hover {
  background-color: var(--color-btn-hover);
}

.more-options-dots-vertical {
  font-size: 20px;
  color: var(--color-text-primary);
  line-height: 0.8;
  letter-spacing: 0;
}

/* Tooltip (appears ABOVE button on hover) */
.more-options-tooltip {
  position: absolute;
  bottom: calc(100% + 8px);
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
  z-index: 999;
}

/* Tooltip Arrow (pointing DOWN) */
.tooltip-arrow {
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid var(--color-tooltip-bg);
}

/* Show tooltip on hover (only when dropdown is closed) */
.more-options-wrapper:hover .more-options-tooltip {
  opacity: 1;
  visibility: visible;
}

.more-options-wrapper.dropdown-open .more-options-tooltip {
  opacity: 0;
  visibility: hidden;
}

/* Dropdown Menu (appears BELOW button on click) */
.more-options-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background-color: var(--color-dropdown-bg);
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  padding: 4px 0;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: opacity 0.2s ease, visibility 0.2s ease, transform 0.2s ease;
  z-index: 1000;
}

.more-options-dropdown.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

/* Dropdown Item */
.dropdown-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 16px;
  background: none;
  border: none;
  color: var(--color-text-white);
  font-size: 14px;
  font-family: var(--font-family);
  text-align: left;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.dropdown-item:hover {
  background-color: var(--color-dropdown-hover);
}

/* Dropdown Icon */
.dropdown-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.dropdown-item span {
  flex: 1;
}
```

## Tailwind CSS
```html
<!-- More Options Vertical with Tailwind -->
<div class="relative inline-block font-['Open_Sans']" id="moreOptionsWrapperVertical">
  <!-- Button (VERTICAL DOTS) -->
  <button
    id="moreOptionsBtnTailwindVertical"
    class="bg-white border border-gray-200 rounded-md px-3 py-2 hover:bg-[#F5F7F9] transition-colors flex items-center justify-center"
    aria-haspopup="true"
    aria-expanded="false"
  >
    <span class="text-[#141414] text-xl leading-none">⋮</span>
  </button>

  <!-- Tooltip -->
  <div
    class="more-options-tooltip-vertical absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-[#1F2937] text-white text-xs font-medium rounded-md whitespace-nowrap opacity-0 invisible transition-all pointer-events-none z-[999]"
  >
    More options
    <div class="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-[#1F2937]"></div>
  </div>

  <!-- Dropdown -->
  <div
    id="moreOptionsDropdownTailwindVertical"
    class="absolute top-full right-0 mt-2 bg-[#1F2937] rounded-lg shadow-xl min-w-[200px] py-1 opacity-0 invisible -translate-y-2 transition-all z-[1000]"
    role="menu"
  >
    <!-- Duplicate -->
    <button class="flex items-center gap-3 w-full px-4 py-2.5 text-white text-sm hover:bg-[#374151] transition-colors" role="menuitem">
      <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
        <g fill="#FFF" fill-rule="nonzero">
          <path d="M9.521 2.667H1.428C.64 2.667 0 3.307 0 4.095v8.093c0 .789.64 1.428 1.428 1.428h8.093c.789 0 1.428-.64 1.428-1.428V4.095c0-.789-.64-1.428-1.428-1.428zm.476 9.52a.476.476 0 01-.476.477H1.428a.476.476 0 01-.476-.476V4.095c0-.263.213-.476.476-.476h8.093c.263 0 .476.213.476.476v8.093z"/>
          <path d="M11.997 0H3.428C2.64 0 2 .64 2 1.428a.476.476 0 10.952 0c0-.263.213-.476.476-.476h8.57c.262 0 .475.213.475.476v8.57a.476.476 0 01-.476.475.476.476 0 100 .952c.789 0 1.428-.639 1.428-1.428V1.428C13.425.64 12.786 0 11.997 0z"/>
        </g>
      </svg>
      <span>Duplicate</span>
    </button>

    <!-- Edit -->
    <button class="flex items-center gap-3 w-full px-4 py-2.5 text-white text-sm hover:bg-[#374151] transition-colors" role="menuitem">
      <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24">
        <path d="M14 2l4 4L7 17H3v-4L14 2zM3 22h18"/>
      </svg>
      <span>Edit</span>
    </button>

    <!-- Sharing settings -->
    <button class="flex items-center gap-3 w-full px-4 py-2.5 text-white text-sm hover:bg-[#374151] transition-colors" role="menuitem">
      <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
        <g fill="#FFF" fill-rule="nonzero">
          <circle cx="11" cy="2.5" r="2"/>
          <circle cx="11" cy="11.5" r="2"/>
          <circle cx="3" cy="7" r="2"/>
          <path d="M4.7 6.1l4.6-2.7M4.7 7.9l4.6 2.7" stroke="#FFF" stroke-width="1.2" fill="none"/>
        </g>
      </svg>
      <span>Sharing settings</span>
    </button>

    <!-- Remove -->
    <button class="flex items-center gap-3 w-full px-4 py-2.5 text-white text-sm hover:bg-[#374151] transition-colors" role="menuitem">
      <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 14 15" xmlns="http://www.w3.org/2000/svg">
        <g fill="#FFF" fill-rule="nonzero" stroke="#FFF">
          <path d="M12.613 2.935H9.815V2.48A1.48 1.48 0 008.335 1h-2.66a1.48 1.48 0 00-1.479 1.48v.455H1.398a.372.372 0 00-.373.374c0 .207.166.373.373.373h.675v8.77c0 1.101.896 1.997 1.996 1.997h5.873c1.1 0 1.996-.896 1.996-1.996V3.682h.675a.372.372 0 00.373-.373.372.372 0 00-.373-.374zm-7.67-.456c0-.403.329-.732.733-.732h2.66c.403 0 .732.329.732.732v.456H4.943V2.48zm6.249 9.974c0 .688-.562 1.25-1.25 1.25H4.069c-.688 0-1.25-.562-1.25-1.25V3.682h8.375v8.77h-.002z" stroke-width=".3"/>
          <path d="M7.006 12.364a.372.372 0 00.373-.373V5.394a.372.372 0 00-.373-.374.372.372 0 00-.374.374v6.594c0 .207.166.376.374.376zM4.57 11.952a.372.372 0 00.373-.373V5.803a.372.372 0 00-.373-.374.372.372 0 00-.374.374v5.776c0 .207.169.373.374.373zM9.441 11.952a.372.372 0 00.374-.373V5.803a.372.372 0 00-.374-.374.372.372 0 00-.373.374v5.776c0 .207.166.373.373.373z" stroke-width=".2"/>
        </g>
      </svg>
      <span>Remove</span>
    </button>
  </div>
</div>
```

## JavaScript
```javascript
// MoreOptionsVertical - Toggle Dropdown and Tooltip
document.addEventListener('DOMContentLoaded', function() {
  const wrapper = document.getElementById('moreOptionsWrapperVertical');
  const btn = document.getElementById('moreOptionsBtnTailwindVertical');
  const dropdown = document.getElementById('moreOptionsDropdownTailwindVertical');
  const tooltip = wrapper?.querySelector('.more-options-tooltip-vertical');

  if (!btn || !dropdown) return;

  // Toggle dropdown on button click
  btn.addEventListener('click', function(e) {
    e.stopPropagation();
    const isOpen = dropdown.classList.contains('show');

    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  });

  function openDropdown() {
    dropdown.classList.remove('opacity-0', 'invisible', '-translate-y-2');
    dropdown.classList.add('show', 'opacity-100', 'visible', 'translate-y-0');
    btn.setAttribute('aria-expanded', 'true');

    // Hide tooltip when dropdown is open
    if (tooltip) {
      tooltip.classList.add('!opacity-0', '!invisible');
    }
  }

  function closeDropdown() {
    dropdown.classList.add('opacity-0', 'invisible', '-translate-y-2');
    dropdown.classList.remove('show', 'opacity-100', 'visible', 'translate-y-0');
    btn.setAttribute('aria-expanded', 'false');

    // Re-enable tooltip
    if (tooltip) {
      tooltip.classList.remove('!opacity-0', '!invisible');
    }
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    if (!wrapper?.contains(e.target)) {
      closeDropdown();
    }
  });

  // Close dropdown on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && dropdown.classList.contains('show')) {
      closeDropdown();
      btn.focus();
    }
  });

  // Show tooltip on button hover (only when dropdown closed)
  btn.addEventListener('mouseenter', function() {
    if (!dropdown.classList.contains('show') && tooltip) {
      tooltip.classList.remove('opacity-0', 'invisible');
      tooltip.classList.add('opacity-100', 'visible');
    }
  });

  btn.addEventListener('mouseleave', function() {
    if (tooltip) {
      tooltip.classList.add('opacity-0', 'invisible');
      tooltip.classList.remove('opacity-100', 'visible');
    }
  });

  // Dropdown item actions
  const dropdownItems = dropdown.querySelectorAll('button[role="menuitem"]');
  dropdownItems.forEach(item => {
    item.addEventListener('click', function() {
      const action = this.querySelector('span')?.textContent;
      console.log('Action clicked:', action);

      // Close dropdown after action
      closeDropdown();

      // Dispatch custom event
      document.dispatchEvent(new CustomEvent('more-options-action', {
        detail: { action }
      }));
    });
  });

  // Keyboard navigation in dropdown
  dropdownItems.forEach((item, index) => {
    item.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = dropdownItems[index + 1] || dropdownItems[0];
        next.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = dropdownItems[index - 1] || dropdownItems[dropdownItems.length - 1];
        prev.focus();
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });
});
```

## Component States

| State | Trigger | Visual Changes | Classes |
|-------|---------|----------------|---------|
| Default | - | White bg, gray border | `bg-white border-gray-200` |
| Hover (button) | Mouse over | Gray bg, tooltip shows ABOVE | `bg-[#F5F7F9]` |
| Active/Open | Click | Dropdown visible BELOW | `show opacity-100 visible` |
| Dropdown item hover | Mouse over item | Dark gray bg | `bg-[#374151]` |

## Icons Used

| Icon | Source | Action |
|------|--------|--------|
| Clone/Duplicate | `clone_white.svg` | Duplicate item |
| Edit | `edit-white.svg` | Edit item |
| Share | `share-white.svg` | Sharing settings |
| Delete | `delete_white.svg` | Remove item |

## Props/Variants

| Variant | Description | Classes |
|---------|-------------|---------|
| default | Vertical dots (⋮) | `text-xl leading-none` |
| tooltip-above | Tooltip positioned above button | `bottom-full mb-2` |
| dropdown-below | Dropdown below button | `top-full mt-2` |
| dark-dropdown | Dark background dropdown | `bg-[#1F2937]` |

## Accessibility
- Button has `aria-haspopup="true"` and `aria-expanded`
- Dropdown uses `role="menu"`
- Items use `role="menuitem"`
- Keyboard navigation (Arrow Up/Down, Enter, Escape)
- Focus management (returns to button on close)

## Relationship to MoreOptionsHorizontal
This component shares ALL behavior with `MoreOptionsHorizontal.md` except:
- Uses **vertical dots (⋮)** instead of horizontal dots (⋯)
- Line-height adjusted for vertical stacking: `line-height: 0.8` or `leading-none`
- No letter-spacing needed for vertical dots

## Notes
- Created on 2026-02-04 (GMT+7)
- Vertical three-dot menu (⋮)
- Tooltip appears ABOVE button on hover
- Dropdown appears BELOW button on click
- Tooltip hides when dropdown is open
- All dropdown text is WHITE (#FFFFFF)
- Item hover background: #374151 (dark gray)
- Icons embedded inline from design system (same as horizontal version)
- Closes on click outside or Escape key
- Dispatches `more-options-action` custom event
- Identical functionality to MoreOptionsHorizontal, only visual difference is dot orientation
