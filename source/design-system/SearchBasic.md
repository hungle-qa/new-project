---
name: SearchBasic
category: forms
created: 2026-02-04T00:00:00.000Z
status: approved
---

# SearchBasic

## Preview
A simple search input with search icon. Features:
- Search icon on the left
- Placeholder text
- Border changes on hover/focus
- No filter button (simplified version)

**Font:** Open Sans (`font-family: 'Open Sans', sans-serif`)

## Usage
Use for simple search functionality in lists, tables, or data grids. Provides real-time filtering with visual feedback on hover and focus.

## HTML
```html
<div class="search-basic">
  <svg class="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM18 18l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  <input
    type="text"
    class="search-input"
    placeholder="Search ingredient name"
    id="searchInput"
    aria-label="Search ingredients"
  >
</div>
```

## CSS
```css
:root {
  --font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --color-text-primary: #141414;
  --color-bg-white: #FFFFFF;
  --color-border-textbox-hover: #184EFF;
}

/* Search Container */
.search-basic {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: var(--color-bg-white);
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  transition: border-color 0.15s ease;
  font-family: var(--font-family);
  width: 100%;
  max-width: 400px;
}

.search-basic:hover {
  border-color: var(--color-border-textbox-hover);
}

.search-basic:focus-within {
  border-color: var(--color-border-textbox-hover);
  outline: none;
}

/* Search Icon */
.search-icon {
  flex-shrink: 0;
  color: #6B7280;
  width: 20px;
  height: 20px;
}

/* Search Input */
.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 13px;
  font-weight: 400;
  color: var(--color-text-primary);
  font-family: var(--font-family);
  line-height: 20px;
}

.search-input::placeholder {
  color: #9CA3AF;
}

.search-input:focus {
  outline: none;
}
```

## JavaScript
```javascript
// SearchBasic - Simple search with filter functionality
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('searchInput');

  if (!searchInput) {
    console.log('SearchBasic: Element not found');
    return;
  }

  // Search/Filter functionality
  searchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase().trim();

    // Emit custom event for other components to listen
    const searchEvent = new CustomEvent('searchInput', {
      detail: { searchTerm: searchTerm }
    });
    document.dispatchEvent(searchEvent);

    console.log('SearchBasic: Search term:', searchTerm);
  });

  // Clear search on Escape
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      this.value = '';
      this.blur();

      // Emit clear event
      const clearEvent = new CustomEvent('searchInput', {
        detail: { searchTerm: '' }
      });
      document.dispatchEvent(clearEvent);
    }
  });

  console.log('SearchBasic: Initialized');
});
```

## Component States

| State | Trigger | Visual Changes | CSS Classes |
|-------|---------|----------------|-------------|
| Default | - | Gray border #E5E7EB | `.search-basic` |
| Hover | Mouse over | Blue border #184EFF | `.search-basic:hover` |
| Focus | Click/Tab into input | Blue border #184EFF | `.search-basic:focus-within` |
| Typing | Input text | Border stays blue | - |

## Accessibility
- Input has `aria-label` for screen readers
- Semantic HTML with proper input type
- Clear focus state with blue border
- Keyboard accessible (Tab, Escape to clear)
- Icon has descriptive SVG path

## Notes
- Created on 2026-02-04
- Simplified version without filter button
- Border color changes to #184EFF on hover/focus
- Emits custom event for integration with tables/lists
- Escape key clears search and removes focus
- Icon color: #6B7280 (gray)
- Max width: 400px (adjustable)
- Height: 40px (from padding)
