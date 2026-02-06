---
name: ComboboxWithSearch
category: forms
created: 2026-02-04T00:00:00.000Z
updated: 2026-02-06T00:00:00.000Z
status: approved
---

# ComboboxWithSearch

## Preview
A multi-select searchable combobox for selecting clients or groups. Features:
- Search input with placeholder
- Dropdown list with avatars (groups use icon, clients use initials)
- Multi-select with removable tag/chip display (unified blue style from Chip.md)
- Focus state with blue border ring
- Dropdown stays open after selection, closes only when clicking outside

**Font:** Open Sans (`font-family: 'Open Sans', sans-serif`)

## Usage
Use for selecting multiple clients or groups, such as assigning licenses, adding team members, or any multi-select scenario with search.

## HTML
```html
<div class="combobox-container" id="comboboxContainer">
  <!-- Input Container: chips + search input (border changes on hover/focus) -->
  <div class="combobox-input-container" id="inputContainer">
    <!-- Tags appear here dynamically -->
    <div class="combobox-tags" id="tagsContainer"></div>
    <input
      type="text"
      class="combobox-input"
      placeholder="Add client..."
      id="clientSearch"
      aria-label="Search clients"
    >
  </div>

  <!-- Dropdown List -->
  <ul class="combobox-list" role="listbox" id="clientList">
    <!-- Group Item -->
    <li class="combobox-item" role="option" data-value="group-99" data-label="Group 99 clients (45 members)">
      <div class="avatar avatar-green">
        <svg class="avatar-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 14v-1.333A2.667 2.667 0 009.333 10H6.667a2.667 2.667 0 00-2.667 2.667V14M8 7.333A2.667 2.667 0 108 2a2.667 2.667 0 000 5.333zM13.333 14v-1.333a2.667 2.667 0 00-2-2.584M10.667 2.084a2.667 2.667 0 010 5.166" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="combobox-item-content">
        <div class="combobox-item-title">Group 99 clients</div>
        <div class="combobox-item-subtitle">45 members</div>
      </div>
    </li>

    <!-- Client Items -->
    <li class="combobox-item" role="option" data-value="client-dec29" data-label="Dec29Local1 Dev">
      <div class="avatar avatar-purple">
        <span class="avatar-text">DD</span>
      </div>
      <div class="combobox-item-content">
        <div class="combobox-item-title">Dec29Local1 Dev</div>
        <div class="combobox-item-subtitle">hungle+dec29l1@everfit.io</div>
      </div>
    </li>

    <li class="combobox-item" role="option" data-value="client-dec12" data-label="Dec12failed1 Le">
      <div class="avatar avatar-blue">
        <span class="avatar-text">DL</span>
      </div>
      <div class="combobox-item-content">
        <div class="combobox-item-title">Dec12failed1 Le</div>
        <div class="combobox-item-subtitle">hungle+dec12failed1@everfit.io</div>
      </div>
    </li>

    <li class="combobox-item" role="option" data-value="client-annie" data-label="Annie Haspay">
      <div class="avatar avatar-green">
        <span class="avatar-text">AH</span>
      </div>
      <div class="combobox-item-content">
        <div class="combobox-item-title">Annie Haspay</div>
        <div class="combobox-item-subtitle">chungngo+dvcl19@everfit.io</div>
      </div>
    </li>

    <li class="combobox-item" role="option" data-value="client-oct22no1" data-label="Oct22no1 Le">
      <div class="avatar avatar-orange">
        <span class="avatar-text">OL</span>
      </div>
      <div class="combobox-item-content">
        <div class="combobox-item-title">Oct22no1 Le</div>
        <div class="combobox-item-subtitle">hungle+oct22no1@everfit.io</div>
      </div>
    </li>

    <li class="combobox-item" role="option" data-value="client-oct22new1" data-label="Oct22new1 Le">
      <div class="avatar avatar-blue">
        <span class="avatar-text">OL</span>
      </div>
      <div class="combobox-item-content">
        <div class="combobox-item-title">Oct22new1 Le</div>
        <div class="combobox-item-subtitle">hungle+oct22new1@everfit.io</div>
      </div>
    </li>

    <li class="combobox-item" role="option" data-value="client-oct20" data-label="Oct20mws A1">
      <div class="avatar avatar-orange">
        <span class="avatar-text">OA</span>
      </div>
      <div class="combobox-item-content">
        <div class="combobox-item-title">Oct20mws A1</div>
        <div class="combobox-item-subtitle">hungle+oct20mws@everfit.io</div>
      </div>
    </li>
  </ul>
</div>
```

## CSS
```css
:root {
  --font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --color-text-primary: #141414;
  --color-bg-white: #FFFFFF;
  --color-btn-action: #184EFF;
  --color-btn-cancel-hover: #F5F7F9;
  --color-chip-bg: #EBF3FF;
  --color-chip-x: #184EFF;
  --color-chip-x-hover: #1241CC;
}

/* Avatar Styles */
.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  font-family: var(--font-family);
}

.avatar-text {
  font-size: 12px;
  font-weight: 600;
  color: #FFFFFF;
  line-height: 1;
  text-transform: uppercase;
}

.avatar-icon {
  color: #FFFFFF;
}

.avatar-blue { background-color: #184EFF; }
.avatar-orange { background-color: #FB923C; }
.avatar-purple { background-color: #A855F7; }
.avatar-green { background-color: #22C55E; }

/* Combobox Container */
.combobox-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  font-family: var(--font-family);
  margin-bottom: 320px; /* Space for dropdown to display below input */
}

/* Input Container: chips + search input with border */
.combobox-input-container {
  background-color: var(--color-bg-white);
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 8px 12px;
  cursor: text;
  transition: border-color 0.15s ease;
  max-height: 84px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #e1e1ea transparent;
}

/* Hover: blue border */
.combobox-input-container:hover {
  border-color: var(--color-btn-action);
}

/* Focus state (set by JS) */
.combobox-input-container.focused {
  border-color: var(--color-btn-action);
}

.combobox-input-container::-webkit-scrollbar {
  width: 6px;
}

.combobox-input-container::-webkit-scrollbar-track {
  background: transparent;
}

.combobox-input-container::-webkit-scrollbar-thumb {
  background-color: #e1e1ea;
  border-radius: 3px;
}

/* Tags container (flex wrap for chips) */
.combobox-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.combobox-tags:empty {
  display: none;
}

/* Chip/Tag (matches Chip.md) */
.combobox-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  background-color: var(--color-chip-bg);
  border-radius: 4px;
  font-size: 13px;
  color: var(--color-text-primary);
  font-family: var(--font-family);
  white-space: nowrap;
}

.combobox-chip-remove {
  margin-left: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  color: var(--color-chip-x);
}

.combobox-chip-remove:hover {
  color: var(--color-chip-x-hover);
}

/* Search Input */
.combobox-input {
  width: 100%;
  border: none;
  outline: none;
  font-size: 13px;
  color: var(--color-text-primary);
  font-family: var(--font-family);
  background: transparent;
  padding: 4px 0;
  min-width: 100px;
}

.combobox-input::placeholder {
  color: #9CA3AF;
}

/* Dropdown List (absolute so input box stays visible) */
.combobox-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 280px;
  overflow-y: auto;
  background-color: var(--color-bg-white);
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 50;
  display: none;
  scrollbar-width: thin;
  scrollbar-color: #e1e1ea transparent;
}

.combobox-list.visible {
  display: block;
}

.combobox-list::-webkit-scrollbar {
  width: 6px;
}

.combobox-list::-webkit-scrollbar-track {
  background: transparent;
}

.combobox-list::-webkit-scrollbar-thumb {
  background-color: #e1e1ea;
  border-radius: 3px;
}

/* List Item - NO default CSS hover (JS controlled) */
.combobox-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

/* Hover state applied by JS only */
.combobox-item.hovered {
  background-color: #F0F1FF;
}

/* Item Content */
.combobox-item-content {
  flex: 1;
  min-width: 0;
}

.combobox-item-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-primary);
  line-height: 1.4;
  margin-bottom: 2px;
}

.combobox-item-subtitle {
  font-size: 12px;
  color: #6B7280;
  line-height: 1.4;
}
```

## Component States

| State | Trigger | Visual Changes | CSS |
|-------|---------|----------------|-----|
| Default | - | Gray border (#E5E7EB), placeholder | `.combobox-input-container` |
| Hover | Mouse over input box | Blue border 1px #184EFF | `.combobox-input-container:hover` |
| Focus | Click/Tab input | Blue border, dropdown visible | `.combobox-input-container.focused` + `.combobox-list.visible` |
| Item hover | Mouse over dropdown item | Light blue bg #F0F1FF (JS only) | `.combobox-item.hovered` |
| Chip added | Click item | Chip in input box, item removed from list, dropdown stays open | `.combobox-chip` |
| Chip removed | Click X on chip | Chip removed, item restored to dropdown | - |
| Scrollable chips | >3 rows of chips | Input container scrolls (max 84px) | `max-height: 84px; overflow-y: auto` |

## JavaScript
```javascript
// ComboboxWithSearch - Multi-Select with Chips
document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('comboboxContainer');
  const inputContainer = document.getElementById('inputContainer');
  const tagsContainer = document.getElementById('tagsContainer');
  const searchInput = document.getElementById('clientSearch');
  const dropdown = document.getElementById('clientList');
  const items = dropdown ? dropdown.querySelectorAll('li[role="option"]') : [];

  if (!container || !inputContainer || !searchInput || !dropdown || items.length === 0) {
    console.log('ComboboxWithSearch: Elements not found');
    return;
  }

  const selectedItems = new Set();

  // --- 1. FOCUS: Show dropdown, add focused class ---
  searchInput.addEventListener('focus', function() {
    inputContainer.classList.add('focused');
    dropdown.classList.add('visible');
  });

  // Click outside to close dropdown and remove focus
  document.addEventListener('click', function(e) {
    if (!container.contains(e.target)) {
      dropdown.classList.remove('visible');
      inputContainer.classList.remove('focused');
    }
  });

  // Click on input container focuses input
  inputContainer.addEventListener('click', function() {
    searchInput.focus();
  });

  // --- 2. SEARCH/FILTER ---
  searchInput.addEventListener('input', function(e) {
    const term = e.target.value.toLowerCase().trim();

    items.forEach(item => {
      if (selectedItems.has(item.dataset.value)) return; // Already selected, stay hidden

      const label = item.dataset.label?.toLowerCase() || '';
      const subtitle = item.querySelector('.combobox-item-subtitle')?.textContent?.toLowerCase() || '';

      const matches = label.includes(term) || subtitle.includes(term);
      item.style.display = matches ? '' : 'none';
    });
  });

  // --- 3. CREATE CHIP (matches Chip.md style) ---
  function createChip(value, label) {
    const chip = document.createElement('span');
    chip.className = 'combobox-chip';
    chip.dataset.value = value;

    const text = document.createTextNode(label + ' ');
    chip.appendChild(text);

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'combobox-chip-remove';
    removeBtn.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';

    removeBtn.addEventListener('click', function(e) {
      e.stopPropagation();
      removeSelection(value);
    });

    chip.appendChild(removeBtn);
    return chip;
  }

  // --- 4. ADD SELECTION ---
  function addSelection(value, label) {
    if (selectedItems.has(value)) return;

    selectedItems.add(value);

    // Add chip to tags container
    const chip = createChip(value, label);
    tagsContainer.appendChild(chip);

    // Hide item from dropdown
    const item = dropdown.querySelector('li[data-value="' + value + '"]');
    if (item) item.style.display = 'none';

    // Clear search and keep dropdown open
    searchInput.value = '';
    searchInput.focus();
    dropdown.classList.add('visible');

    console.log('Selected:', value);
  }

  // --- 5. REMOVE SELECTION ---
  function removeSelection(value) {
    selectedItems.delete(value);

    // Remove chip element
    const chip = tagsContainer.querySelector('span[data-value="' + value + '"]');
    if (chip) chip.remove();

    // Show item back in dropdown
    const item = dropdown.querySelector('li[data-value="' + value + '"]');
    if (item) item.style.display = '';

    searchInput.focus();
    console.log('Removed:', value);
  }

  // --- 6. ITEM CLICK = SELECT ---
  items.forEach(item => {
    item.addEventListener('click', function(e) {
      e.stopPropagation();
      const value = this.dataset.value;
      const label = this.dataset.label;
      addSelection(value, label);
    });

    // Hover effect (JS controlled, no default CSS hover)
    item.addEventListener('mouseenter', function() {
      this.classList.add('hovered');
    });

    item.addEventListener('mouseleave', function() {
      this.classList.remove('hovered');
    });
  });

  // --- 7. KEYBOARD NAVIGATION ---
  searchInput.addEventListener('keydown', function(e) {
    const visibleItems = [...items].filter(i => i.style.display !== 'none');

    if (e.key === 'ArrowDown' && visibleItems.length > 0) {
      e.preventDefault();
      visibleItems[0].focus();
    } else if (e.key === 'Backspace' && this.value === '' && selectedItems.size > 0) {
      const lastValue = [...selectedItems].pop();
      if (lastValue) removeSelection(lastValue);
    } else if (e.key === 'Escape') {
      dropdown.classList.remove('visible');
      inputContainer.classList.remove('focused');
      this.blur();
    }
  });

  items.forEach(item => {
    item.setAttribute('tabindex', '0');

    item.addEventListener('keydown', function(e) {
      const visibleItems = [...items].filter(i => i.style.display !== 'none');
      const currentIndex = visibleItems.indexOf(this);

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const next = visibleItems[currentIndex + 1];
        if (next) next.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentIndex === 0) {
          searchInput.focus();
        } else {
          visibleItems[currentIndex - 1]?.focus();
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        this.click();
      } else if (e.key === 'Escape') {
        dropdown.classList.remove('visible');
        searchInput.focus();
      }
    });

    item.addEventListener('focus', function() {
      this.classList.add('hovered');
    });

    item.addEventListener('blur', function() {
      this.classList.remove('hovered');
    });
  });

  // Pointer cursor on scrollbar hover
  [dropdown, inputContainer].forEach(function(el) {
    if (!el) return;
    el.addEventListener('mousemove', function(e) {
      var rect = this.getBoundingClientRect();
      var onScrollbar = this.scrollHeight > this.clientHeight && e.clientX >= rect.right - 8;
      this.style.cursor = onScrollbar ? 'pointer' : '';
    });
    el.addEventListener('mouseleave', function() {
      this.style.cursor = '';
    });
  });

  console.log('ComboboxWithSearch: Initialized with', items.length, 'items');
});
```

## Accessibility
- Input has `aria-label="Search clients"`
- List uses `role="listbox"`
- Items use `role="option"`
- Selected items have `aria-selected="true"`
- Full keyboard navigation support (Arrow keys, Enter, Space)
- Focusable items with `tabindex="0"`

## Notes
- Updated on 2026-02-06
- Multi-select with removable chips (matches Chip.md style)
- **No default CSS hover on items** — hover is JS-controlled via `.hovered` class (#F0F1FF)
- **Input hover**: border changes to 1px #184EFF (CSS `:hover`)
- **Input focus**: border stays #184EFF via `.focused` class
- Selected items hidden from dropdown, shown as chips in input
- Removing a chip restores the item to dropdown
- Chips container: max 3 rows (84px) with scrollbar
- Backspace on empty input removes last chip
- Search filters by `data-label` and subtitle text
- **Dropdown behavior**: Stays open after selecting item, only closes when clicking outside
- Dropdown uses `display: none` / `.visible` toggle (not `hidden` class)
- Chip style: `bg #EBF3FF`, text `#141414`, X button `#184EFF` → hover `#1241CC`
