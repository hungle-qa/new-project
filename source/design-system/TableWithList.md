---
name: TableWithList
category: layout
created: 2026-02-04
status: draft
---

# TableWithList

## Preview
A data table component with sortable columns, thumbnail/checkbox hover interaction, scrollable area with custom scrollbar, and three-dots action menu. Features:
- Table header with sortable columns (Thumbnail, Name, Category, Unit, Most recent, Actions)
- "Most recent" column default sort with blue text (#184EFF)
- 10 table rows with realistic ingredient data
- Thumbnail → checkbox on hover behavior (absolute positioning)
- Scrollable table area with custom scrollbar
- Three dots menu (⋮) for each row

**Font:** Open Sans (`font-family: 'Open Sans', sans-serif`)

**Google Fonts Import:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

## Usage
Use in list/table views where data needs to be displayed with sorting, selection, and row actions. Integrates with pagination components for large datasets.

## HTML
```html
<!-- Table Container with Scroll -->
<div class="table-container">
  <table class="data-table">
    <thead class="table-header">
      <tr>
        <th class="th-thumbnail">
          <span class="th-content">Thumbnail</span>
        </th>
        <th class="th-sortable" data-column="name">
          <button class="sort-btn">
            <span class="th-content">Ingredients (42)</span>
            <svg class="sort-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 4v8M4 8l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </th>
        <th class="th-sortable" data-column="category">
          <button class="sort-btn">
            <span class="th-content">Category</span>
            <svg class="sort-icon-inactive" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3l3 3M8 3L5 6M8 3v10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </th>
        <th class="th-sortable" data-column="unit">
          <button class="sort-btn">
            <span class="th-content">Unit</span>
            <svg class="sort-icon-inactive" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3l3 3M8 3L5 6M8 3v10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </th>
        <th class="th-sortable th-sortable-active" data-column="recent">
          <button class="sort-btn">
            <span class="th-content">Most recent</span>
            <svg class="sort-icon-active" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 13l-3-3M8 13l3-3M8 13V3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </th>
        <th class="th-actions">
          <span class="th-content">Actions</span>
        </th>
      </tr>
    </thead>

    <tbody class="table-body">
      <!-- Row 1 -->
      <tr class="table-row">
        <td class="td-thumbnail">
          <div class="thumbnail-wrapper">
            <div class="thumbnail">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="#D1D5DB" stroke-width="2"/>
                <circle cx="8.5" cy="8.5" r="1.5" fill="#D1D5DB"/>
                <path d="M21 15l-5-5L5 21" stroke="#D1D5DB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <input type="checkbox" class="row-checkbox" aria-label="Select nước mắm">
          </div>
        </td>
        <td class="td-name">nước mắm</td>
        <td class="td-category">Seafood</td>
        <td class="td-unit">Milligram (mg)</td>
        <td class="td-recent">25w</td>
        <td class="td-actions">
          <button class="actions-btn" aria-label="More actions">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="5" r="1.5" fill="currentColor"/>
              <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
              <circle cx="10" cy="15" r="1.5" fill="currentColor"/>
            </svg>
          </button>
        </td>
      </tr>

      <!-- Row 2 -->
      <tr class="table-row">
        <td class="td-thumbnail">
          <div class="thumbnail-wrapper">
            <div class="thumbnail">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="#D1D5DB" stroke-width="2"/>
                <circle cx="8.5" cy="8.5" r="1.5" fill="#D1D5DB"/>
                <path d="M21 15l-5-5L5 21" stroke="#D1D5DB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <input type="checkbox" class="row-checkbox" aria-label="Select may29 ingredient">
          </div>
        </td>
        <td class="td-name">may29 ingredient</td>
        <td class="td-category">Seafood</td>
        <td class="td-unit">Teaspoon (tsp)</td>
        <td class="td-recent">35w</td>
        <td class="td-actions">
          <button class="actions-btn" aria-label="More actions">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="5" r="1.5" fill="currentColor"/>
              <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
              <circle cx="10" cy="15" r="1.5" fill="currentColor"/>
            </svg>
          </button>
        </td>
      </tr>

      <!-- Row 3 -->
      <tr class="table-row">
        <td class="td-thumbnail">
          <div class="thumbnail-wrapper">
            <div class="thumbnail">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="#D1D5DB" stroke-width="2"/>
                <circle cx="8.5" cy="8.5" r="1.5" fill="#D1D5DB"/>
                <path d="M21 15l-5-5L5 21" stroke="#D1D5DB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <input type="checkbox" class="row-checkbox" aria-label="Select test 1">
          </div>
        </td>
        <td class="td-name">test 1</td>
        <td class="td-category">Produce</td>
        <td class="td-unit">Small</td>
        <td class="td-recent">45w</td>
        <td class="td-actions">
          <button class="actions-btn" aria-label="More actions">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="5" r="1.5" fill="currentColor"/>
              <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
              <circle cx="10" cy="15" r="1.5" fill="currentColor"/>
            </svg>
          </button>
        </td>
      </tr>

      <!-- Row 4 -->
      <tr class="table-row">
        <td class="td-thumbnail">
          <div class="thumbnail-wrapper">
            <div class="thumbnail">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="#D1D5DB" stroke-width="2"/>
                <circle cx="8.5" cy="8.5" r="1.5" fill="#D1D5DB"/>
                <path d="M21 15l-5-5L5 21" stroke="#D1D5DB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <input type="checkbox" class="row-checkbox" aria-label="Select aa">
          </div>
        </td>
        <td class="td-name">aa</td>
        <td class="td-category">Produce</td>
        <td class="td-unit">Teaspoon (tsp)</td>
        <td class="td-recent">51w</td>
        <td class="td-actions">
          <button class="actions-btn" aria-label="More actions">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="5" r="1.5" fill="currentColor"/>
              <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
              <circle cx="10" cy="15" r="1.5" fill="currentColor"/>
            </svg>
          </button>
        </td>
      </tr>

      <!-- Row 5 -->
      <tr class="table-row">
        <td class="td-thumbnail">
          <div class="thumbnail-wrapper">
            <div class="thumbnail">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="#D1D5DB" stroke-width="2"/>
                <circle cx="8.5" cy="8.5" r="1.5" fill="#D1D5DB"/>
                <path d="M21 15l-5-5L5 21" stroke="#D1D5DB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <input type="checkbox" class="row-checkbox" aria-label="Select bb">
          </div>
        </td>
        <td class="td-name">bb</td>
        <td class="td-category">Produce</td>
        <td class="td-unit">Teaspoon (tsp)</td>
        <td class="td-recent">51w</td>
        <td class="td-actions">
          <button class="actions-btn" aria-label="More actions">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="5" r="1.5" fill="currentColor"/>
              <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
              <circle cx="10" cy="15" r="1.5" fill="currentColor"/>
            </svg>
          </button>
        </td>
      </tr>

      <!-- Row 6 -->
      <tr class="table-row">
        <td class="td-thumbnail">
          <div class="thumbnail-wrapper">
            <div class="thumbnail">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="#D1D5DB" stroke-width="2"/>
                <circle cx="8.5" cy="8.5" r="1.5" fill="#D1D5DB"/>
                <path d="M21 15l-5-5L5 21" stroke="#D1D5DB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <input type="checkbox" class="row-checkbox" aria-label="Select Avocado">
          </div>
        </td>
        <td class="td-name">Avocado</td>
        <td class="td-category">Produce</td>
        <td class="td-unit">Gram (g)</td>
        <td class="td-recent">51w</td>
        <td class="td-actions">
          <button class="actions-btn" aria-label="More actions">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="5" r="1.5" fill="currentColor"/>
              <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
              <circle cx="10" cy="15" r="1.5" fill="currentColor"/>
            </svg>
          </button>
        </td>
      </tr>

      <!-- Row 7 -->
      <tr class="table-row">
        <td class="td-thumbnail">
          <div class="thumbnail-wrapper">
            <div class="thumbnail">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="#D1D5DB" stroke-width="2"/>
                <circle cx="8.5" cy="8.5" r="1.5" fill="#D1D5DB"/>
                <path d="M21 15l-5-5L5 21" stroke="#D1D5DB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <input type="checkbox" class="row-checkbox" aria-label="Select Chia seeds">
          </div>
        </td>
        <td class="td-name">Chia seeds</td>
        <td class="td-category">Health</td>
        <td class="td-unit">Gram (g)</td>
        <td class="td-recent">51w</td>
        <td class="td-actions">
          <button class="actions-btn" aria-label="More actions">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="5" r="1.5" fill="currentColor"/>
              <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
              <circle cx="10" cy="15" r="1.5" fill="currentColor"/>
            </svg>
          </button>
        </td>
      </tr>

      <!-- Row 8 -->
      <tr class="table-row">
        <td class="td-thumbnail">
          <div class="thumbnail-wrapper">
            <div class="thumbnail">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="#D1D5DB" stroke-width="2"/>
                <circle cx="8.5" cy="8.5" r="1.5" fill="#D1D5DB"/>
                <path d="M21 15l-5-5L5 21" stroke="#D1D5DB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <input type="checkbox" class="row-checkbox" aria-label="Select Cá">
          </div>
        </td>
        <td class="td-name">Cá</td>
        <td class="td-category">Seafood</td>
        <td class="td-unit">Gram (g)</td>
        <td class="td-recent">1y</td>
        <td class="td-actions">
          <button class="actions-btn" aria-label="More actions">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="5" r="1.5" fill="currentColor"/>
              <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
              <circle cx="10" cy="15" r="1.5" fill="currentColor"/>
            </svg>
          </button>
        </td>
      </tr>

      <!-- Row 9 -->
      <tr class="table-row">
        <td class="td-thumbnail">
          <div class="thumbnail-wrapper">
            <div class="thumbnail">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="#D1D5DB" stroke-width="2"/>
                <circle cx="8.5" cy="8.5" r="1.5" fill="#D1D5DB"/>
                <path d="M21 15l-5-5L5 21" stroke="#D1D5DB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <input type="checkbox" class="row-checkbox" aria-label="Select Chicken Breast">
          </div>
        </td>
        <td class="td-name">Chicken Breast</td>
        <td class="td-category">Protein</td>
        <td class="td-unit">Gram (g)</td>
        <td class="td-recent">2w</td>
        <td class="td-actions">
          <button class="actions-btn" aria-label="More actions">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="5" r="1.5" fill="currentColor"/>
              <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
              <circle cx="10" cy="15" r="1.5" fill="currentColor"/>
            </svg>
          </button>
        </td>
      </tr>

      <!-- Row 10 -->
      <tr class="table-row">
        <td class="td-thumbnail">
          <div class="thumbnail-wrapper">
            <div class="thumbnail">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="#D1D5DB" stroke-width="2"/>
                <circle cx="8.5" cy="8.5" r="1.5" fill="#D1D5DB"/>
                <path d="M21 15l-5-5L5 21" stroke="#D1D5DB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <input type="checkbox" class="row-checkbox" aria-label="Select Olive Oil">
          </div>
        </td>
        <td class="td-name">Olive Oil</td>
        <td class="td-category">Fats</td>
        <td class="td-unit">Milliliter (ml)</td>
        <td class="td-recent">8w</td>
        <td class="td-actions">
          <button class="actions-btn" aria-label="More actions">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="5" r="1.5" fill="currentColor"/>
              <circle cx="10" cy="10" r="1.5" fill="currentColor"/>
              <circle cx="10" cy="15" r="1.5" fill="currentColor"/>
            </svg>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

## CSS
```css
:root {
  --font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --color-text-primary: #141414;
  --color-bg-white: #FFFFFF;
  --color-btn-action: #184EFF;
  --color-border-textbox-hover: #184EFF;
  --color-bg-button-hover: #F0F1FF;
  --color-btn-cancel-hover: #F5F7F9;
}

/* Table Container with Scroll */
.table-container {
  overflow-y: auto;
  overflow-x: auto;
  background-color: var(--color-bg-white);
  border-radius: 8px;
  border: 1px solid #E5E7EB;
  max-height: 600px; /* Adjust as needed */
}

/* Custom Scrollbar */
.table-container::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.table-container::-webkit-scrollbar-track {
  background: #F3F4F6;
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb {
  background: #D1D5DB;
  border-radius: 4px;
}

.table-container::-webkit-scrollbar-thumb:hover {
  background: #9CA3AF;
}

/* Data Table */
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--font-family);
}

/* Table Header */
.table-header {
  background-color: #F9FAFB;
  border-bottom: 1px solid #E5E7EB;
  position: sticky;
  top: 0;
  z-index: 10;
}

.table-header th {
  padding: 12px 16px;
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  white-space: nowrap;
}

.th-thumbnail {
  width: 60px;
}

.th-sortable {
  cursor: pointer;
}

.th-sortable-active {
  color: var(--color-btn-action);
}

.sort-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  cursor: pointer;
  font-family: var(--font-family);
  font-size: 14px;
  font-weight: 600;
  color: inherit;
  padding: 0;
}

.sort-icon,
.sort-icon-inactive,
.sort-icon-active {
  flex-shrink: 0;
}

.sort-icon-inactive {
  color: #9CA3AF;
}

.sort-icon-active {
  color: var(--color-btn-action);
}

.th-actions {
  width: 60px;
  text-align: center;
}

/* Table Body */
.table-body {
  background-color: var(--color-bg-white);
}

.table-row {
  border-bottom: 1px solid #E5E7EB;
  transition: background-color 0.15s ease;
}

.table-row:hover {
  background-color: #F9FAFB;
}

.table-row.row-checked {
  background-color: #F0F7FF;
}

.table-row td {
  padding: 12px 16px;
  font-size: 14px;
  color: var(--color-text-primary);
}

/* Thumbnail/Checkbox Column */
.td-thumbnail {
  width: 60px;
}

.thumbnail-wrapper {
  position: relative;
  width: 40px;
  height: 40px;
}

.thumbnail {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  background-color: #F3F4F6;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.15s ease;
}

.row-checkbox {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 16px;
  height: 16px;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.thumbnail-wrapper:hover .thumbnail {
  opacity: 0;
}

.thumbnail-wrapper:hover .row-checkbox {
  opacity: 1;
}

.row-checkbox:checked {
  opacity: 1;
}

.row-checkbox:checked ~ .thumbnail {
  opacity: 0;
}

/* Table Columns */
.td-name {
  font-weight: 500;
}

.td-category,
.td-unit {
  color: #6B7280;
}

.td-recent {
  color: #6B7280;
}

.td-actions {
  text-align: center;
}

.actions-btn {
  width: 32px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: #6B7280;
  transition: background-color 0.15s ease;
}

.actions-btn:hover {
  background-color: var(--color-btn-cancel-hover);
  color: var(--color-text-primary);
}
```

## JavaScript
```javascript
// TableWithList - Sorting and checkbox interactions
document.addEventListener('DOMContentLoaded', function() {
  const tableContainer = document.querySelector('.table-container');

  if (!tableContainer) {
    console.log('TableWithList: Element not found');
    return;
  }

  const tableRows = tableContainer.querySelectorAll('.table-row');
  const sortBtns = tableContainer.querySelectorAll('.th-sortable');

  // --- 1. THUMBNAIL HOVER: Show Checkbox ---
  tableRows.forEach(row => {
    const checkbox = row.querySelector('.row-checkbox');

    if (checkbox) {
      checkbox.addEventListener('change', function() {
        if (this.checked) {
          row.classList.add('row-checked');
        } else {
          row.classList.remove('row-checked');
        }
      });
    }
  });

  // --- 2. SORT: Click Column Header ---
  let currentSort = { column: 'recent', direction: 'desc' };

  sortBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const th = this.closest('th');
      const column = th.dataset.column;

      // Toggle direction if same column
      if (currentSort.column === column) {
        currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
      } else {
        currentSort.column = column;
        currentSort.direction = 'desc';
      }

      // Update visual state
      sortBtns.forEach(b => {
        b.closest('th').classList.remove('th-sortable-active');
        const icon = b.querySelector('svg');
        if (icon) {
          icon.classList.remove('sort-icon-active');
          icon.classList.add('sort-icon-inactive');
        }
      });

      th.classList.add('th-sortable-active');
      const activeIcon = this.querySelector('svg');
      if (activeIcon) {
        activeIcon.classList.remove('sort-icon-inactive');
        activeIcon.classList.add('sort-icon-active');
      }

      // Emit custom event for external handling
      const sortEvent = new CustomEvent('tableSort', {
        detail: { column, direction: currentSort.direction }
      });
      tableContainer.dispatchEvent(sortEvent);

      console.log('TableWithList: Sorting by', column, currentSort.direction);
    });
  });

  console.log('TableWithList: Initialized');
});
```

## Component States

| State | Trigger | Visual Changes | CSS Classes |
|-------|---------|----------------|-------------|
| Default | - | White background, all rows visible | `.table-row` |
| Row hover | Mouse over row | Light gray background | `.table-row:hover` |
| Row checked | Check checkbox | Light blue background | `.row-checked` |
| Thumbnail hover | Mouse over thumbnail cell | Thumbnail fades, checkbox appears | `.thumbnail-wrapper:hover` |
| Sort active | Click column header | Blue text and active arrow icon | `.th-sortable-active` |
| Actions hover | Mouse over three dots | Gray background | `.actions-btn:hover` |

## Props/Variants

| Variant | Description |
|---------|-------------|
| Sortable columns | Click headers to sort (emits `tableSort` event) |
| Selectable rows | Thumbnail → checkbox on hover, persistent when checked |
| Scrollable | Fixed height with custom scrollbar |
| Sticky header | Header stays visible when scrolling |

## Integration

This component works with:
- **Pagination.md**: Use together for paginated lists
- **MainPageWithList.md**: Embedded as the main table section
- External handlers can listen to `tableSort` custom event

## Accessibility
- Semantic HTML table structure
- ARIA labels on checkboxes and action buttons
- Keyboard accessible (Tab, Space for checkboxes, Enter for buttons)
- Clear visual feedback on hover and selection
- Sticky header maintains context during scroll

## Notes
- Created on 2026-02-04
- Extracted from MainPageWithList.md
- 10 table rows with realistic ingredient data
- Thumbnail → checkbox transition using absolute positioning
- Default sort: "Most recent" (blue text, down arrow = descending)
- Sort arrows: down = descending, up = ascending
- Emits `tableSort` event for external handling
- Custom scrollbar styling for webkit browsers
