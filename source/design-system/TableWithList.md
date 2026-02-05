---
name: TableWithList
category: layout
created: 2026-02-04T00:00:00.000Z
updated: 2026-02-04T09:45:00.000Z
status: approved
---

# TableWithList

## Preview
A data table component with sortable columns, select-all checkbox, thumbnail/checkbox hover interaction, scrollable area with custom scrollbar, and three-dots action menu. Features:
- Table header with select-all checkbox and sortable columns (Name, Category, Unit, Most recent)
- "Most recent" column default sort with blue text (#184EFF)
- 10 table rows with realistic ingredient data (includes long names with text wrapping)
- Thumbnail → checkbox on hover behavior (absolute positioning)
- Scrollable table area with custom scrollbar
- Three dots menu (⋮) for each row
- Click column headers to sort with visual indicators (↑ ascending, ↓ descending)
- Active sorted column header text = blue (#184EFF)

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
          <input type="checkbox" id="select-all-checkbox" class="select-all-checkbox" aria-label="Select all">
        </th>
        <th class="th-sortable" data-column="name">
          <button class="sort-btn">
            <span class="th-content">Ingredients (10)</span>
            <svg class="sort-icon-inactive" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3l3 3M8 3L5 6M8 3v10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
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
        <th class="th-actions"></th>
      </tr>
    </thead>

    <tbody class="table-body">
      <!-- Row 1 -->
      <tr class="table-row" data-name="Chicken Breast (Skinless, Boneless)" data-category="Protein" data-unit="Gram (g)" data-recent="2w" data-recent-value="2">
        <td class="td-thumbnail">
          <div class="thumbnail-wrapper">
            <div class="thumbnail">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="#D1D5DB" stroke-width="2"/>
                <circle cx="8.5" cy="8.5" r="1.5" fill="#D1D5DB"/>
                <path d="M21 15l-5-5L5 21" stroke="#D1D5DB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <input type="checkbox" class="row-checkbox" aria-label="Select Chicken Breast (Skinless, Boneless)">
          </div>
        </td>
        <td class="td-name">Chicken Breast (Skinless, Boneless)</td>
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

      <!-- Row 2 -->
      <tr class="table-row" data-name="Organic Brown Rice (Long Grain)" data-category="Grains" data-unit="Cup" data-recent="5w" data-recent-value="5">
        <td class="td-thumbnail">
          <div class="thumbnail-wrapper">
            <div class="thumbnail">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="#D1D5DB" stroke-width="2"/>
                <circle cx="8.5" cy="8.5" r="1.5" fill="#D1D5DB"/>
                <path d="M21 15l-5-5L5 21" stroke="#D1D5DB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <input type="checkbox" class="row-checkbox" aria-label="Select Organic Brown Rice (Long Grain)">
          </div>
        </td>
        <td class="td-name">Organic Brown Rice (Long Grain)</td>
        <td class="td-category">Grains</td>
        <td class="td-unit">Cup</td>
        <td class="td-recent">5w</td>
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
      <tr class="table-row" data-name="Organic Extra Virgin Olive Oil (Cold Pressed, Italian Import, First Harvest)" data-category="Fats" data-unit="Tablespoon (tbsp)" data-recent="1m" data-recent-value="4">
        <td class="td-thumbnail">
          <div class="thumbnail-wrapper">
            <div class="thumbnail">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="#D1D5DB" stroke-width="2"/>
                <circle cx="8.5" cy="8.5" r="1.5" fill="#D1D5DB"/>
                <path d="M21 15l-5-5L5 21" stroke="#D1D5DB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <input type="checkbox" class="row-checkbox" aria-label="Select Organic Extra Virgin Olive Oil (Cold Pressed, Italian Import, First Harvest)">
          </div>
        </td>
        <td class="td-name">Organic Extra Virgin Olive Oil (Cold Pressed, Italian Import, First Harvest)</td>
        <td class="td-category">Fats</td>
        <td class="td-unit">Tablespoon (tbsp)</td>
        <td class="td-recent">1m</td>
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
      <tr class="table-row" data-name="Wild-Caught Atlantic Salmon Fillet (Fresh, Never Frozen, Sustainably Sourced)" data-category="Protein" data-unit="Gram (g)" data-recent="3m" data-recent-value="12">
        <td class="td-thumbnail">
          <div class="thumbnail-wrapper">
            <div class="thumbnail">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="#D1D5DB" stroke-width="2"/>
                <circle cx="8.5" cy="8.5" r="1.5" fill="#D1D5DB"/>
                <path d="M21 15l-5-5L5 21" stroke="#D1D5DB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <input type="checkbox" class="row-checkbox" aria-label="Select Wild-Caught Atlantic Salmon Fillet (Fresh, Never Frozen, Sustainably Sourced)">
          </div>
        </td>
        <td class="td-name">Wild-Caught Atlantic Salmon Fillet (Fresh, Never Frozen, Sustainably Sourced)</td>
        <td class="td-category">Protein</td>
        <td class="td-unit">Gram (g)</td>
        <td class="td-recent">3m</td>
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
      <tr class="table-row" data-name="Greek Yogurt (Non-Fat, Plain, Probiotic, Organic)" data-category="Dairy" data-unit="Cup" data-recent="2w" data-recent-value="2">
        <td class="td-thumbnail">
          <div class="thumbnail-wrapper">
            <div class="thumbnail">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="#D1D5DB" stroke-width="2"/>
                <circle cx="8.5" cy="8.5" r="1.5" fill="#D1D5DB"/>
                <path d="M21 15l-5-5L5 21" stroke="#D1D5DB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <input type="checkbox" class="row-checkbox" aria-label="Select Greek Yogurt (Non-Fat, Plain, Probiotic, Organic)">
          </div>
        </td>
        <td class="td-name">Greek Yogurt (Non-Fat, Plain, Probiotic, Organic)</td>
        <td class="td-category">Dairy</td>
        <td class="td-unit">Cup</td>
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

      <!-- Row 6 -->
      <tr class="table-row" data-name="Raw Almonds (Unsalted)" data-category="Nuts" data-unit="Ounce (oz)" data-recent="6m" data-recent-value="24">
        <td class="td-thumbnail">
          <div class="thumbnail-wrapper">
            <div class="thumbnail">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="#D1D5DB" stroke-width="2"/>
                <circle cx="8.5" cy="8.5" r="1.5" fill="#D1D5DB"/>
                <path d="M21 15l-5-5L5 21" stroke="#D1D5DB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <input type="checkbox" class="row-checkbox" aria-label="Select Raw Almonds (Unsalted)">
          </div>
        </td>
        <td class="td-name">Raw Almonds (Unsalted)</td>
        <td class="td-category">Nuts</td>
        <td class="td-unit">Ounce (oz)</td>
        <td class="td-recent">6m</td>
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
      <tr class="table-row" data-name="Baby Spinach Leaves (Organic)" data-category="Vegetables" data-unit="Gram (g)" data-recent="1w" data-recent-value="1">
        <td class="td-thumbnail">
          <div class="thumbnail-wrapper">
            <div class="thumbnail">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="#D1D5DB" stroke-width="2"/>
                <circle cx="8.5" cy="8.5" r="1.5" fill="#D1D5DB"/>
                <path d="M21 15l-5-5L5 21" stroke="#D1D5DB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <input type="checkbox" class="row-checkbox" aria-label="Select Baby Spinach Leaves (Organic)">
          </div>
        </td>
        <td class="td-name">Baby Spinach Leaves (Organic)</td>
        <td class="td-category">Vegetables</td>
        <td class="td-unit">Gram (g)</td>
        <td class="td-recent">1w</td>
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
      <tr class="table-row" data-name="Hass Avocado (Ripe)" data-category="Fats" data-unit="Piece" data-recent="3w" data-recent-value="3">
        <td class="td-thumbnail">
          <div class="thumbnail-wrapper">
            <div class="thumbnail">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="#D1D5DB" stroke-width="2"/>
                <circle cx="8.5" cy="8.5" r="1.5" fill="#D1D5DB"/>
                <path d="M21 15l-5-5L5 21" stroke="#D1D5DB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <input type="checkbox" class="row-checkbox" aria-label="Select Hass Avocado (Ripe)">
          </div>
        </td>
        <td class="td-name">Hass Avocado (Ripe)</td>
        <td class="td-category">Fats</td>
        <td class="td-unit">Piece</td>
        <td class="td-recent">3w</td>
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
      <tr class="table-row" data-name="Tri-Color Quinoa (Pre-Washed)" data-category="Grains" data-unit="Cup" data-recent="4w" data-recent-value="4">
        <td class="td-thumbnail">
          <div class="thumbnail-wrapper">
            <div class="thumbnail">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="#D1D5DB" stroke-width="2"/>
                <circle cx="8.5" cy="8.5" r="1.5" fill="#D1D5DB"/>
                <path d="M21 15l-5-5L5 21" stroke="#D1D5DB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <input type="checkbox" class="row-checkbox" aria-label="Select Tri-Color Quinoa (Pre-Washed)">
          </div>
        </td>
        <td class="td-name">Tri-Color Quinoa (Pre-Washed)</td>
        <td class="td-category">Grains</td>
        <td class="td-unit">Cup</td>
        <td class="td-recent">4w</td>
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
      <tr class="table-row" data-name="Free-Range Eggs (Large, Grade A)" data-category="Protein" data-unit="Piece" data-recent="1w" data-recent-value="1">
        <td class="td-thumbnail">
          <div class="thumbnail-wrapper">
            <div class="thumbnail">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke="#D1D5DB" stroke-width="2"/>
                <circle cx="8.5" cy="8.5" r="1.5" fill="#D1D5DB"/>
                <path d="M21 15l-5-5L5 21" stroke="#D1D5DB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            <input type="checkbox" class="row-checkbox" aria-label="Select Free-Range Eggs (Large, Grade A)">
          </div>
        </td>
        <td class="td-name">Free-Range Eggs (Large, Grade A)</td>
        <td class="td-category">Protein</td>
        <td class="td-unit">Piece</td>
        <td class="td-recent">1w</td>
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
  text-align: center;
}

.select-all-checkbox {
  width: 16px;
  height: 16px;
  cursor: pointer;
  display: block;
  margin: 0 auto;
}

.th-sortable {
  cursor: pointer;
}

.th-sortable-active .th-content {
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

.th-content {
  color: #A3A3B5;
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
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: normal;
  max-width: 250px;
  line-height: 1.4;
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
// TableWithList - Sorting, checkbox interactions, and select-all functionality
document.addEventListener('DOMContentLoaded', function() {
  const tableContainer = document.querySelector('.table-container');

  if (!tableContainer) {
    console.log('TableWithList: Element not found');
    return;
  }

  const tableBody = tableContainer.querySelector('.table-body');
  const tableRows = tableContainer.querySelectorAll('.table-row');
  const sortBtns = tableContainer.querySelectorAll('.th-sortable');
  const selectAllCheckbox = tableContainer.querySelector('#select-all-checkbox');

  // --- 1. SELECT ALL CHECKBOX ---
  if (selectAllCheckbox) {
    selectAllCheckbox.addEventListener('change', function() {
      const rowCheckboxes = tableContainer.querySelectorAll('.row-checkbox');
      rowCheckboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
        const row = checkbox.closest('.table-row');
        if (this.checked) {
          row.classList.add('row-checked');
        } else {
          row.classList.remove('row-checked');
        }
      });
    });
  }

  // --- 2. INDIVIDUAL ROW CHECKBOX ---
  tableRows.forEach(row => {
    const checkbox = row.querySelector('.row-checkbox');

    if (checkbox) {
      checkbox.addEventListener('change', function() {
        if (this.checked) {
          row.classList.add('row-checked');
        } else {
          row.classList.remove('row-checked');
        }

        // Update select-all checkbox state
        const allCheckboxes = tableContainer.querySelectorAll('.row-checkbox');
        const checkedCheckboxes = tableContainer.querySelectorAll('.row-checkbox:checked');
        if (selectAllCheckbox) {
          selectAllCheckbox.checked = allCheckboxes.length === checkedCheckboxes.length;
          selectAllCheckbox.indeterminate = checkedCheckboxes.length > 0 && checkedCheckboxes.length < allCheckboxes.length;
        }
      });
    }
  });

  // --- 3. SORT: Click Column Header ---
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
        currentSort.direction = 'asc';
      }

      // Update visual state
      sortBtns.forEach(b => {
        const headerTh = b.closest('th');
        headerTh.classList.remove('th-sortable-active');
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

        // Update arrow direction
        if (currentSort.direction === 'asc') {
          // Up arrow (ascending)
          activeIcon.innerHTML = '<path d="M8 3l3 3M8 3L5 6M8 3v10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>';
        } else {
          // Down arrow (descending)
          activeIcon.innerHTML = '<path d="M8 13l-3-3M8 13l3-3M8 13V3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>';
        }
      }

      // Sort rows
      sortTable(column, currentSort.direction);

      // Emit custom event for external handling
      const sortEvent = new CustomEvent('tableSort', {
        detail: { column, direction: currentSort.direction }
      });
      tableContainer.dispatchEvent(sortEvent);

      console.log('TableWithList: Sorting by', column, currentSort.direction);
    });
  });

  // --- 4. SORT FUNCTION: Reorder DOM rows ---
  function sortTable(column, direction) {
    const rowsArray = Array.from(tableRows);

    rowsArray.sort((a, b) => {
      let aValue, bValue;

      if (column === 'recent') {
        // Sort by time value (1w, 2w, 1m, etc.)
        aValue = parseInt(a.dataset.recentValue) || 0;
        bValue = parseInt(b.dataset.recentValue) || 0;
      } else {
        // Sort alphabetically for name, category, unit
        aValue = a.dataset[column]?.toLowerCase() || '';
        bValue = b.dataset[column]?.toLowerCase() || '';
      }

      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });

    // Reorder DOM
    rowsArray.forEach(row => tableBody.appendChild(row));
  }

  console.log('TableWithList: Initialized');
});
```

## Component States

| State | Trigger | Visual Changes | CSS Classes |
|-------|---------|----------------|-------------|
| Default | - | White background, all rows visible | `.table-row` |
| Row hover | Mouse over row | Light gray background | `.table-row:hover` |
| Row checked | Check checkbox | Light blue background | `.row-checked` |
| All selected | Check select-all checkbox | All row checkboxes checked, all rows blue bg | `.row-checked` |
| Thumbnail hover | Mouse over thumbnail cell | Thumbnail fades, checkbox appears | `.thumbnail-wrapper:hover` |
| Sort active | Click column header | Blue text and active arrow icon | `.th-sortable-active` |
| Actions hover | Mouse over three dots | Gray background | `.actions-btn:hover` |

## Props/Variants

| Variant | Description |
|---------|-------------|
| Sortable columns | Click headers to sort, toggle asc/desc, reorder rows |
| Selectable rows | Individual checkboxes + select-all checkbox |
| Text wrapping | Long names wrap properly with max-width: 250px |
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
- Select-all checkbox with indeterminate state support
- Keyboard accessible (Tab, Space for checkboxes, Enter for buttons)
- Clear visual feedback on hover and selection
- Sticky header maintains context during scroll

## Notes
- Created on 2026-02-04
- Updated on 2026-02-04T16:45:00+07:00 (fixed checkbox alignment, column title colors, added 2-line names)
- 10 table rows with realistic long ingredient names (3 items with 2-line names)
- Thumbnail → checkbox transition using absolute positioning
- Default sort: "Most recent" (blue text #184EFF, down arrow ↓ = descending)
- Sort arrows: up ↑ = ascending, down ↓ = descending
- Column titles: gray (#A3A3B5) by default, blue (#184EFF) when sorted
- Select-all checkbox centered and aligned with row checkboxes
- Actions column header text removed (column kept for three-dots menu)
- Text wrapping for long names: word-wrap, overflow-wrap, white-space: normal, max-width: 250px
- Actual DOM row reordering on sort (not just visual)
- Emits `tableSort` event for external handling
- Custom scrollbar styling for webkit browsers
