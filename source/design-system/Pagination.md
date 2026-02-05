---
name: Pagination
category: navigation
created: 2026-02-04T00:00:00.000Z
status: approved
---

# Pagination

## Preview
A simple pagination component with previous/next navigation and current range display. Features:
- Previous arrow button (◀)
- Current range text "1 - 20 of 42"
- Next arrow button (▶)
- Default 20 items per page
- Disabled state when at first/last page
- Click handlers for navigation

**Font:** Open Sans (`font-family: 'Open Sans', sans-serif`)

**Google Fonts Import:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

**Structure:**
```
┌─────────────────────────────────┐
│     ◀   1 - 20 of 42   ▶       │
└─────────────────────────────────┘
```

## Usage
Use at the bottom of tables or lists to navigate through paginated data. Typically paired with TableWithList or other list components.

## HTML
```html
<!-- Pagination -->
<div class="pagination">
  <button class="pagination-btn" id="prevBtn" aria-label="Previous page">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M12 16l-6-6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>
  <span class="pagination-text">1 - 20 of 42</span>
  <button class="pagination-btn" id="nextBtn" aria-label="Next page">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M8 4l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  </button>
</div>
```

## CSS
```css
:root {
  --font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --color-text-primary: #141414;
  --color-bg-white: #FFFFFF;
  --color-btn-cancel-hover: #F5F7F9;
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 16px;
  background-color: var(--color-bg-white);
}

.pagination-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  cursor: pointer;
  color: var(--color-text-primary);
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.pagination-btn:hover:not(:disabled) {
  background-color: var(--color-btn-cancel-hover);
  border-color: #D1D5DB;
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination-text {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  min-width: 100px;
  text-align: center;
  font-family: var(--font-family);
}
```

## JavaScript
```javascript
// Pagination - Navigation controls
document.addEventListener('DOMContentLoaded', function() {
  const pagination = document.querySelector('.pagination');

  if (!pagination) {
    console.log('Pagination: Element not found');
    return;
  }

  const prevBtn = pagination.querySelector('#prevBtn');
  const nextBtn = pagination.querySelector('#nextBtn');
  const paginationText = pagination.querySelector('.pagination-text');

  // Configuration
  let currentPage = 1;
  const itemsPerPage = 20;
  const totalItems = 42; // Update this based on your data
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Update pagination display
  function updatePagination() {
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);

    if (paginationText) {
      paginationText.textContent = `${start} - ${end} of ${totalItems}`;
    }

    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages;

    // Emit custom event for external handling
    const pageChangeEvent = new CustomEvent('pageChange', {
      detail: { currentPage, itemsPerPage, start, end, totalItems }
    });
    pagination.dispatchEvent(pageChangeEvent);
  }

  // Previous button handler
  if (prevBtn) {
    prevBtn.addEventListener('click', function() {
      if (currentPage > 1) {
        currentPage--;
        updatePagination();
        console.log('Pagination: Previous page', currentPage);
      }
    });
  }

  // Next button handler
  if (nextBtn) {
    nextBtn.addEventListener('click', function() {
      if (currentPage < totalPages) {
        currentPage++;
        updatePagination();
        console.log('Pagination: Next page', currentPage);
      }
    });
  }

  // Public API for external control
  pagination.goToPage = function(page) {
    if (page >= 1 && page <= totalPages) {
      currentPage = page;
      updatePagination();
    }
  };

  pagination.setTotalItems = function(total) {
    totalItems = total;
    totalPages = Math.ceil(totalItems / itemsPerPage);
    currentPage = 1;
    updatePagination();
  };

  // Initialize
  updatePagination();
  console.log('Pagination: Initialized');
});
```

## Component States

| State | Trigger | Visual Changes | CSS Classes |
|-------|---------|----------------|-------------|
| Default | - | Both buttons enabled | `.pagination-btn` |
| Previous disabled | At first page | Previous button grayed out | `.pagination-btn:disabled` |
| Next disabled | At last page | Next button grayed out | `.pagination-btn:disabled` |
| Button hover | Mouse over button | Gray background | `.pagination-btn:hover` |

## Props/Variants

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `currentPage` | Number | 1 | Current active page |
| `itemsPerPage` | Number | 20 | Items displayed per page |
| `totalItems` | Number | 42 | Total number of items in dataset |

## Integration

This component works with:
- **TableWithList.md**: Place below table for navigation
- **MainPageWithList.md**: Embedded in footer section
- Emits `pageChange` custom event with page details
- Provides public API: `goToPage(page)` and `setTotalItems(total)`

## Accessibility
- ARIA labels on navigation buttons
- Keyboard accessible (Tab, Enter, Space)
- Disabled state for boundary pages (first/last)
- Clear visual feedback on hover and disabled states
- Semantic button elements

## Notes
- Created on 2026-02-04
- Extracted from MainPageWithList.md
- Default: 20 items per page
- Simple range display format: "start - end of total"
- Buttons disabled at boundaries to prevent invalid navigation
- Emits `pageChange` event for external data fetching
- Public API allows programmatic control
- Responsive center-aligned layout
