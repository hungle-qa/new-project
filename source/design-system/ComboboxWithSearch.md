---
name: ComboboxWithSearch
category: forms
created: 2026-02-04T00:00:00.000Z
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

**Google Fonts Import:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

## Usage
Use for selecting multiple clients or groups, such as assigning licenses, adding team members, or any multi-select scenario with search.

## HTML
```html
<div class="combobox-container">
  <!-- Search Input -->
  <div class="combobox-search">
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
    <li class="combobox-item" role="option" data-value="group-marketing">
      <div class="avatar avatar-blue">
        <svg class="avatar-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 14v-1.333A2.667 2.667 0 009.333 10H6.667a2.667 2.667 0 00-2.667 2.667V14M8 7.333A2.667 2.667 0 108 2a2.667 2.667 0 000 5.333zM13.333 14v-1.333a2.667 2.667 0 00-2-2.584M10.667 2.084a2.667 2.667 0 010 5.166" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="combobox-item-content">
        <div class="combobox-item-title">Marketing Team</div>
        <div class="combobox-item-subtitle">12 members</div>
      </div>
    </li>

    <!-- Group Item -->
    <li class="combobox-item" role="option" data-value="group-sales">
      <div class="avatar avatar-blue">
        <svg class="avatar-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 14v-1.333A2.667 2.667 0 009.333 10H6.667a2.667 2.667 0 00-2.667 2.667V14M8 7.333A2.667 2.667 0 108 2a2.667 2.667 0 000 5.333zM13.333 14v-1.333a2.667 2.667 0 00-2-2.584M10.667 2.084a2.667 2.667 0 010 5.166" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="combobox-item-content">
        <div class="combobox-item-title">Sales Department</div>
        <div class="combobox-item-subtitle">23 members</div>
      </div>
    </li>

    <!-- Client Item - Selected State -->
    <li class="combobox-item combobox-item-selected" role="option" data-value="client-sm" aria-selected="true">
      <div class="avatar avatar-blue">
        <span class="avatar-text">SM</span>
      </div>
      <div class="combobox-item-content">
        <div class="combobox-item-title">Sarah Mitchell</div>
        <div class="combobox-item-subtitle">sarah.mitchell@company.com</div>
      </div>
    </li>

    <!-- Client Item -->
    <li class="combobox-item" role="option" data-value="client-jr">
      <div class="avatar avatar-orange">
        <span class="avatar-text">JR</span>
      </div>
      <div class="combobox-item-content">
        <div class="combobox-item-title">James Rodriguez</div>
        <div class="combobox-item-subtitle">james.rodriguez@company.com</div>
      </div>
    </li>

    <!-- Client Item -->
    <li class="combobox-item" role="option" data-value="client-ec">
      <div class="avatar avatar-purple">
        <span class="avatar-text">EC</span>
      </div>
      <div class="combobox-item-content">
        <div class="combobox-item-title">Emily Chen</div>
        <div class="combobox-item-subtitle">emily.chen@company.com</div>
      </div>
    </li>

    <!-- Client Item -->
    <li class="combobox-item" role="option" data-value="client-mo">
      <div class="avatar avatar-green">
        <span class="avatar-text">MO</span>
      </div>
      <div class="combobox-item-content">
        <div class="combobox-item-title">Michael O'Brien</div>
        <div class="combobox-item-subtitle">michael.obrien@company.com</div>
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
}

/* Include Avatar Styles */
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
  background-color: var(--color-bg-white);
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  overflow: hidden;
  width: 100%;
  max-width: 400px;
  font-family: var(--font-family);
}

/* Search Input */
.combobox-search {
  padding: 12px 16px;
  border-bottom: 1px solid #E5E7EB;
}

.combobox-input {
  width: 100%;
  border: none;
  outline: none;
  font-size: 14px;
  color: var(--color-text-primary);
  font-family: var(--font-family);
  background: transparent;
}

.combobox-input::placeholder {
  color: #9CA3AF;
}

/* Dropdown List */
.combobox-list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 280px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #e1e1ea transparent;
}

.combobox-list::-webkit-scrollbar,
#clientList::-webkit-scrollbar,
#inputContainer::-webkit-scrollbar {
  width: 6px;
}

.combobox-list::-webkit-scrollbar-track,
#clientList::-webkit-scrollbar-track,
#inputContainer::-webkit-scrollbar-track {
  background: transparent;
}

.combobox-list::-webkit-scrollbar-thumb,
#clientList::-webkit-scrollbar-thumb,
#inputContainer::-webkit-scrollbar-thumb {
  background-color: #e1e1ea;
  border-radius: 3px;
  cursor: pointer;
}

#clientList,
#inputContainer {
  scrollbar-width: thin;
  scrollbar-color: #e1e1ea transparent;
}

/* List Item */
.combobox-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.combobox-item:hover {
  background-color: var(--color-btn-cancel-hover);
}

.combobox-item-selected {
  background-color: #E0EAFF;
}

.combobox-item-selected:hover {
  background-color: #D1E0FF;
}

/* Item Content */
.combobox-item-content {
  flex: 1;
  min-width: 0;
}

.combobox-item-title {
  font-size: 14px;
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

/* Hidden state */
.combobox-item-hidden {
  display: none;
}
```

## Tailwind CSS
```html
<div class="relative w-full max-w-md font-['Open_Sans']" id="comboboxContainer">
  <!-- Input Container with Tags (max 3 rows with scroll) -->
  <div id="inputContainer" class="flex flex-wrap items-center gap-1 max-h-[84px] overflow-y-auto px-3 py-2 border border-gray-300 rounded-md bg-white cursor-text transition-colors">
    <!-- Tags will be inserted here by JavaScript -->
    <div id="tagsContainer" class="flex flex-wrap gap-1"></div>
    <input
      type="text"
      id="clientSearch"
      class="flex-1 min-w-[100px] outline-none text-sm text-[#141414] bg-transparent placeholder:text-gray-400"
      placeholder="Add client..."
      aria-label="Search clients"
    >
  </div>

  <!-- Dropdown List -->
  <ul id="clientList" class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-[280px] overflow-y-auto hidden" role="listbox">
    <!-- Group Item -->
    <li class="flex items-center gap-3 p-3 cursor-pointer transition-colors" role="option" data-value="group-engineering" data-label="Engineering Team (35 members)">
      <div class="w-8 h-8 rounded-full bg-[#5C89FF] flex items-center justify-center flex-shrink-0">
        <svg class="text-white" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M12 14v-1.333A2.667 2.667 0 009.333 10H6.667a2.667 2.667 0 00-2.667 2.667V14M8 7.333A2.667 2.667 0 108 2a2.667 2.667 0 000 5.333z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <div class="text-sm font-medium text-[#141414]">Engineering Team (35 members)</div>
        <div class="text-xs text-gray-500">Software developers and engineers</div>
      </div>
    </li>

    <!-- Client Items -->
    <li class="flex items-center gap-3 p-3 cursor-pointer transition-colors" role="option" data-value="client-sm" data-label="Sarah Mitchell">
      <div class="w-8 h-8 rounded-full bg-[#C5E865] flex items-center justify-center flex-shrink-0">
        <span class="text-xs font-semibold text-white">SM</span>
      </div>
      <div class="flex-1 min-w-0">
        <div class="text-sm font-medium text-[#141414]">Sarah Mitchell</div>
        <div class="text-xs text-gray-500">sarah.mitchell@company.com</div>
      </div>
    </li>

    <li class="flex items-center gap-3 p-3 cursor-pointer transition-colors" role="option" data-value="client-jr" data-label="James Rodriguez">
      <div class="w-8 h-8 rounded-full bg-[#5C9EFF] flex items-center justify-center flex-shrink-0">
        <span class="text-xs font-semibold text-white">JR</span>
      </div>
      <div class="flex-1 min-w-0">
        <div class="text-sm font-medium text-[#141414]">James Rodriguez</div>
        <div class="text-xs text-gray-500">james.rodriguez@company.com</div>
      </div>
    </li>

    <li class="flex items-center gap-3 p-3 cursor-pointer transition-colors" role="option" data-value="client-ec" data-label="Emily Chen">
      <div class="w-8 h-8 rounded-full bg-[#E8A0A0] flex items-center justify-center flex-shrink-0">
        <span class="text-xs font-semibold text-white">EC</span>
      </div>
      <div class="flex-1 min-w-0">
        <div class="text-sm font-medium text-[#141414]">Emily Chen</div>
        <div class="text-xs text-gray-500">emily.chen@company.com</div>
      </div>
    </li>

    <li class="flex items-center gap-3 p-3 cursor-pointer transition-colors" role="option" data-value="client-mo" data-label="Michael O'Brien">
      <div class="w-8 h-8 rounded-full bg-[#FF9F43] flex items-center justify-center flex-shrink-0">
        <span class="text-xs font-semibold text-white">MO</span>
      </div>
      <div class="flex-1 min-w-0">
        <div class="text-sm font-medium text-[#141414]">Michael O'Brien</div>
        <div class="text-xs text-gray-500">michael.obrien@company.com</div>
      </div>
    </li>

    <li class="flex items-center gap-3 p-3 cursor-pointer transition-colors" role="option" data-value="client-jt" data-label="Jessica Taylor">
      <div class="w-8 h-8 rounded-full bg-[#22C55E] flex items-center justify-center flex-shrink-0">
        <span class="text-xs font-semibold text-white">JT</span>
      </div>
      <div class="flex-1 min-w-0">
        <div class="text-sm font-medium text-[#141414]">Jessica Taylor</div>
        <div class="text-xs text-gray-500">jessica.taylor@company.com</div>
      </div>
    </li>

    <li class="flex items-center gap-3 p-3 cursor-pointer transition-colors" role="option" data-value="client-dp" data-label="David Park">
      <div class="w-8 h-8 rounded-full bg-[#A855F7] flex items-center justify-center flex-shrink-0">
        <span class="text-xs font-semibold text-white">DP</span>
      </div>
      <div class="flex-1 min-w-0">
        <div class="text-sm font-medium text-[#141414]">David Park</div>
        <div class="text-xs text-gray-500">david.park@company.com</div>
      </div>
    </li>
  </ul>
</div>
```

## Component States

| State | Trigger | Visual Changes | Tailwind Classes |
|-------|---------|----------------|------------------|
| Default | - | Gray border, placeholder | `border-gray-300` |
| Hover | Mouse over input | Blue border 1px | `border-[#184EFF]` |
| Focus | Click/Tab | Blue border, dropdown visible | `border-[#184EFF]` |
| Item hover | Mouse over item | Light purple bg (JS controlled) | `bg-[#F0F1FF]` |
| Tag added | Click item | Tag in input, item hidden, **dropdown stays open** | `bg-[#EBF3FF] rounded` |
| Tag removed | Click X | Tag removed, item visible | - |

## Behavior

| Action | Result |
|--------|--------|
| Hover input box | Border changes to 1px #184EFF |
| Click/focus input | Dropdown opens, border stays #184EFF |
| Type in input | Filters dropdown items |
| Click item | Adds tag to input, hides item from list, **dropdown stays open** |
| Click X on tag | Removes tag, shows item back in list |
| Click outside component | Closes dropdown |
| Backspace (empty) | Removes last tag |
| Max 3 rows | Tags container scrolls vertically |

## Avatar Colors

| Color | Hex | Tailwind |
|-------|-----|----------|
| Group Blue | `#5C89FF` | `bg-[#5C89FF]` |
| Orange | `#FF9F43` | `bg-[#FF9F43]` |
| Rose | `#E8A0A0` | `bg-[#E8A0A0]` |
| Light Blue | `#5C9EFF` | `bg-[#5C9EFF]` |
| Lime | `#C5E865` | `bg-[#C5E865]` |
| Purple | `#A855F7` | `bg-[#A855F7]` |

## JavaScript
```javascript
// ComboboxWithSearch - Multi-Select with Tags
document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('comboboxContainer');
  const inputContainer = document.getElementById('inputContainer');
  const tagsContainer = document.getElementById('tagsContainer');
  const searchInput = document.getElementById('clientSearch');
  const dropdown = document.getElementById('clientList');
  const items = dropdown ? dropdown.querySelectorAll('li[role="option"]') : [];

  if (!container || !searchInput || !dropdown || items.length === 0) {
    console.log('ComboboxWithSearch: Elements not found');
    return;
  }

  const selectedItems = new Set();

  // --- 1. INPUT HOVER/FOCUS: Border 1px #184EFF ---
  inputContainer.addEventListener('mouseenter', function() {
    if (!this.classList.contains('border-[#184EFF]')) {
      this.classList.remove('border-gray-300');
      this.classList.add('border-[#184EFF]');
    }
  });

  inputContainer.addEventListener('mouseleave', function() {
    if (document.activeElement !== searchInput) {
      this.classList.remove('border-[#184EFF]');
      this.classList.add('border-gray-300');
    }
  });

  // Focus: show dropdown, keep border
  searchInput.addEventListener('focus', function() {
    inputContainer.classList.remove('border-gray-300');
    inputContainer.classList.add('border-[#184EFF]');
    dropdown.classList.remove('hidden');
  });

  // Click outside to close dropdown
  document.addEventListener('click', function(e) {
    if (!container.contains(e.target)) {
      dropdown.classList.add('hidden');
      if (!inputContainer.matches(':hover')) {
        inputContainer.classList.remove('border-[#184EFF]');
        inputContainer.classList.add('border-gray-300');
      }
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
      const subtitle = item.querySelector('.text-gray-500')?.textContent?.toLowerCase() || '';

      const matches = label.includes(term) || subtitle.includes(term);
      item.style.display = matches ? '' : 'none';
    });
  });

  // --- 3. CREATE TAG ---
  function createTag(value, label) {
    const tag = document.createElement('span');
    tag.className = 'inline-flex items-center gap-1 px-2 py-0.5 bg-[#EBF3FF] rounded text-sm text-[#141414] whitespace-nowrap';
    tag.dataset.value = value;
    tag.innerHTML = `
      ${label}
      <button type="button" class="ml-1 text-[#184EFF] hover:text-[#1241CC] focus:outline-none">
        <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none">
          <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
    `;

    // Remove tag on click
    tag.querySelector('button').addEventListener('click', function(e) {
      e.stopPropagation();
      removeTag(value);
    });

    return tag;
  }

  // --- 4. ADD SELECTION ---
  function addSelection(value, label) {
    if (selectedItems.has(value)) return;

    selectedItems.add(value);

    // Add tag
    const tag = createTag(value, label);
    tagsContainer.appendChild(tag);

    // Hide item from dropdown
    const item = dropdown.querySelector(`li[data-value="${value}"]`);
    if (item) item.style.display = 'none';

    // Clear search and keep dropdown open
    searchInput.value = '';
    searchInput.focus();
    dropdown.classList.remove('hidden');

    console.log('Selected:', value);
  }

  // --- 5. REMOVE TAG ---
  function removeTag(value) {
    selectedItems.delete(value);

    // Remove tag element
    const tag = tagsContainer.querySelector(`span[data-value="${value}"]`);
    if (tag) tag.remove();

    // Show item back in dropdown
    const item = dropdown.querySelector(`li[data-value="${value}"]`);
    if (item) item.style.display = '';

    console.log('Removed:', value);
  }

  // --- 6. ITEM CLICK = SELECT ---
  items.forEach(item => {
    item.addEventListener('click', function() {
      const value = this.dataset.value;
      const label = this.dataset.label;
      addSelection(value, label);
    });

    // Hover effect (no default CSS hover)
    item.addEventListener('mouseenter', function() {
      this.classList.add('bg-[#F0F1FF]');
    });

    item.addEventListener('mouseleave', function() {
      this.classList.remove('bg-[#F0F1FF]');
    });
  });

  // --- 7. KEYBOARD NAVIGATION ---
  searchInput.addEventListener('keydown', function(e) {
    const visibleItems = [...items].filter(i => i.style.display !== 'none');

    if (e.key === 'ArrowDown' && visibleItems.length > 0) {
      e.preventDefault();
      visibleItems[0].focus();
    } else if (e.key === 'Backspace' && this.value === '' && selectedItems.size > 0) {
      // Remove last tag on backspace
      const lastValue = [...selectedItems].pop();
      if (lastValue) removeTag(lastValue);
    } else if (e.key === 'Escape') {
      dropdown.classList.add('hidden');
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
        dropdown.classList.add('hidden');
        searchInput.focus();
      }
    });

    item.addEventListener('focus', function() {
      this.classList.add('bg-[#F0F1FF]');
    });

    item.addEventListener('blur', function() {
      this.classList.remove('bg-[#F0F1FF]');
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

## Props/Variants
| Variant | Class | Description |
|---------|-------|-------------|
| default | `.combobox-item` | Default list item with hover state |
| selected | `.combobox-item-selected` | Selected item with blue background |
| hidden | `.combobox-item-hidden` | Hidden item (filtered out) |

## Accessibility
- Input has `aria-label="Search clients"`
- List uses `role="listbox"`
- Items use `role="option"`
- Selected items have `aria-selected="true"`
- Full keyboard navigation support (Arrow keys, Enter, Space)
- Focusable items with `tabindex="0"`

## Notes
- Updated on 2026-02-04
- Multi-select with removable tags
- Hover on input box = border 1px #184EFF (no default CSS hover)
- Selected items hidden from dropdown, shown as tags
- Removed tags restore items to dropdown
- Tags container: max 3 rows (84px) with scroll
- Backspace on empty input removes last tag
- Search filters by label and subtitle
- Hover state on items: #F0F1FF (JS controlled)
- Uses Open Sans font family
- **Chip styling matches Chip.md**: `bg-[#EBF3FF]` with `text-[#184EFF]` X button
- **Dropdown behavior**: Stays open after selecting item, only closes when clicking outside component
