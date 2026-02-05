---
name: Header
category: layout
created: 2026-02-04T00:00:00.000Z
updated: 2026-02-04T00:00:00.000Z
status: approved
---

# Header

## Preview
A complete page layout with data table. Features:
- Two-line header: hamburger + title (line 1), search + button (line 2)
- Data table with sortable columns (see **TableWithList.md**)
- Pagination controls (see **Pagination.md**)

**Modular Components:**
This layout integrates the following components:
- **TableWithList.md**: Data table with sorting, selection, and actions
- **Pagination.md**: Navigation controls for paged data
- **SearchBasic.md**: Search input in header
- **ButtonWhite.md**: Action button in header

**Font:** Open Sans (`font-family: 'Open Sans', sans-serif`)

**Google Fonts Import:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

## Usage
Use for list/table views in content management systems. Integrates with LeftSidebar (collapse trigger), SearchBasic (filtering), and ButtonWhite (add action). The table and pagination are now separate reusable components.

## HTML
```html
<div class="main-page">
  <!-- Header: Two Lines -->
  <header class="main-header">
    <!-- Line 1: Hamburger + Title -->
    <div class="header-line-1">
      <button type="button" class="hamburger-btn" id="hamburgerBtn" aria-label="Toggle sidebar">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <h1 class="page-title">Your Ingredients</h1>
    </div>

    <!-- Line 2: Search + Button -->
    <div class="header-line-2">
      <div class="search-basic">
        <svg class="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM18 18l-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <input type="text" class="search-input" placeholder="Search ingredient name" id="searchInput" aria-label="Search ingredients">
      </div>

      <button type="button" class="btn-white">
        <svg class="btn-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10 4v12M4 10h12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="btn-text">Add New Ingredient</span>
      </button>
    </div>
  </header>

  <!-- Table Component: See TableWithList.md -->
  <!-- Full table HTML omitted for brevity - refer to TableWithList.md -->
  <div class="table-container">
    <!-- TableWithList component goes here -->
  </div>

  <!-- Pagination Component: See Pagination.md -->
  <footer class="main-footer">
    <!-- Pagination component goes here -->
  </footer>
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

/* Main Page Container */
.main-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #F9FAFB;
  font-family: var(--font-family);
  margin-left: 240px; /* Space for sidebar */
  transition: margin-left 0.3s ease;
}

.main-page.sidebar-collapsed {
  margin-left: 0;
}

/* Header: Two Lines */
.main-header {
  background-color: var(--color-bg-white);
  border-bottom: 1px solid #E5E7EB;
  padding: 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Header Line 1: Hamburger + Title */
.header-line-1 {
  display: flex;
  align-items: center;
  gap: 12px;
}

.hamburger-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  color: var(--color-text-primary);
  transition: background-color 0.15s ease;
}

.hamburger-btn:hover {
  background-color: var(--color-btn-cancel-hover);
}

.hamburger-btn:active {
  background-color: #E5E7EB;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  font-family: var(--font-family);
}

/* Header Line 2: Search + Button */
.header-line-2 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

/* Search Basic (embedded) */
.search-basic {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: var(--color-bg-white);
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  transition: border-color 0.15s ease;
  flex: 0 0 400px;
}

.search-basic:hover,
.search-basic:focus-within {
  border-color: var(--color-border-textbox-hover);
}

.search-icon {
  flex-shrink: 0;
  color: #6B7280;
  width: 20px;
  height: 20px;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  font-weight: 400;
  color: var(--color-text-primary);
  font-family: var(--font-family);
}

.search-input::placeholder {
  color: #9CA3AF;
}

/* Button White (embedded) */
.btn-white {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background-color: var(--color-bg-white);
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-family: var(--font-family);
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  cursor: pointer;
  transition: background-color 0.15s ease;
  height: 40px;
  white-space: nowrap;
}

.btn-white:hover {
  background-color: var(--color-bg-button-hover);
}

.btn-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
}

/* Table Container: See TableWithList.md for full styles */
.table-container {
  flex: 1;
  margin: 16px 24px;
}

/* Footer: Pagination - See Pagination.md for full styles */
.main-footer {
  background-color: var(--color-bg-white);
  border-top: 1px solid #E5E7EB;
  padding: 0;
}
```

## JavaScript
```javascript
// Header - Page-level interactions (header only)
// TableWithList.md and Pagination.md handle their own interactions
document.addEventListener('DOMContentLoaded', function() {
  const mainPage = document.querySelector('.main-page');
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const searchInput = document.getElementById('searchInput');

  if (!mainPage) {
    console.log('Header: Element not found');
    return;
  }

  // --- 1. HAMBURGER: Toggle Sidebar ---
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', function() {
      mainPage.classList.toggle('sidebar-collapsed');

      // Emit custom event for LeftSidebar to listen
      const toggleEvent = new CustomEvent('toggleSidebar');
      document.dispatchEvent(toggleEvent);

      console.log('Header: Sidebar toggled');
    });
  }

  // --- 2. SEARCH: Filter Table Rows ---
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      const searchTerm = e.target.value.toLowerCase().trim();
      const tableRows = document.querySelectorAll('.table-row');

      tableRows.forEach(row => {
        const name = row.querySelector('.td-name')?.textContent.toLowerCase() || '';
        const category = row.querySelector('.td-category')?.textContent.toLowerCase() || '';
        const unit = row.querySelector('.td-unit')?.textContent.toLowerCase() || '';

        const matches = name.includes(searchTerm) ||
                       category.includes(searchTerm) ||
                       unit.includes(searchTerm);

        row.style.display = matches ? '' : 'none';
      });

      console.log('Header: Search term:', searchTerm);
    });
  }

  // --- 3. TABLE COMPONENT: TableWithList.md handles sorting and checkbox interactions ---
  // --- 4. PAGINATION COMPONENT: Pagination.md handles navigation ---

  console.log('Header: Initialized');
});
```

## Component States

| State | Trigger | Visual Changes | CSS Classes |
|-------|---------|----------------|-------------|
| Default | - | White bg, table visible | `.main-page` |
| Sidebar collapsed | Click hamburger | Sidebar hidden, full width | `.sidebar-collapsed` |
| Row hover | Mouse over row | Light gray bg | `.table-row:hover` |
| Row checked | Check checkbox | Light blue bg | `.row-checked` |
| Thumbnail hover | Mouse over thumbnail | Show checkbox | `.thumbnail-wrapper:hover` |
| Sort active | Click column header | Blue text, active arrow | `.th-sortable-active` |
| Search active | Type in search | Filter rows | `display: none` |

## Props/Variants

| Variant | Description |
|---------|-------------|
| With sidebar | Default layout with left sidebar (240px margin) |
| Collapsed sidebar | Full width when sidebar hidden |
| Sortable columns | Click headers to sort (visual only in demo) |
| Searchable | Real-time filtering by name/category/unit |
| Paginated | Navigate between pages |

## Integration

This layout integrates:
- **TableWithList.md**: Data table component (handles sorting, selection, actions)
- **Pagination.md**: Navigation component (handles page changes)
- **LeftSidebar.md**: Emits `toggleSidebar` event when hamburger clicked
- **SearchBasic.md**: Embedded in header line 2
- **ButtonWhite.md**: Embedded in header line 2

## Accessibility
- Semantic HTML structure
- ARIA labels on interactive buttons
- Keyboard accessible (Tab, Enter, Space)
- Focus states on all interactive elements
- Sticky table header for scrolling
- Clear visual feedback on interactions

## Notes
- Created on 2026-02-04
- Updated: 2026-02-04 - Renamed from MainPageWithList to Header
- Two-line header: hamburger + title, then search + button
- **Table and pagination extracted to separate reusable components:**
  - TableWithList.md - handles sorting, selection, row actions
  - Pagination.md - handles page navigation
- This file now focuses on page layout and header interactions
- Hamburger triggers sidebar collapse
- Search filters table rows by name, category, or unit
- Fixed sidebar width: 240px, page adjusts when collapsed
