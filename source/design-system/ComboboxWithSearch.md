---
name: ComboboxWithSearch
category: forms
created: 2026-02-04
status: draft
---

# ComboboxWithSearch

## Preview
A searchable dropdown/combobox component for selecting clients or groups. Features a search input field and a list of selectable items with avatars. Supports both group items (with icon and subtitle) and individual client items (with initials and email).

## Usage
Use this component when users need to search and select from a list of clients or groups. Ideal for assignment workflows, filtering, or multi-step forms where selection is required.

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
    <li class="combobox-item" role="option" data-value="group-er">
      <div class="avatar avatar-blue">
        <svg class="avatar-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 14v-1.333A2.667 2.667 0 009.333 10H6.667a2.667 2.667 0 00-2.667 2.667V14M8 7.333A2.667 2.667 0 108 2a2.667 2.667 0 000 5.333zM13.333 14v-1.333a2.667 2.667 0 00-2-2.584M10.667 2.084a2.667 2.667 0 010 5.166" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="combobox-item-content">
        <div class="combobox-item-title">Group: er</div>
        <div class="combobox-item-subtitle">11 connected clients without a license</div>
      </div>
    </li>

    <!-- Group Item -->
    <li class="combobox-item" role="option" data-value="group-87">
      <div class="avatar avatar-blue">
        <svg class="avatar-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 14v-1.333A2.667 2.667 0 009.333 10H6.667a2.667 2.667 0 00-2.667 2.667V14M8 7.333A2.667 2.667 0 108 2a2.667 2.667 0 000 5.333zM13.333 14v-1.333a2.667 2.667 0 00-2-2.584M10.667 2.084a2.667 2.667 0 010 5.166" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="combobox-item-content">
        <div class="combobox-item-title">Group: 87</div>
        <div class="combobox-item-subtitle">11 connected clients without a license</div>
      </div>
    </li>

    <!-- Client Item - Selected State -->
    <li class="combobox-item combobox-item-selected" role="option" data-value="client-cz" aria-selected="true">
      <div class="avatar avatar-blue">
        <span class="avatar-text">CZ</span>
      </div>
      <div class="combobox-item-content">
        <div class="combobox-item-title">CZ</div>
        <div class="combobox-item-subtitle">cz@example.com</div>
      </div>
    </li>

    <!-- Client Item -->
    <li class="combobox-item" role="option" data-value="client-jl">
      <div class="avatar avatar-orange">
        <span class="avatar-text">JL</span>
      </div>
      <div class="combobox-item-content">
        <div class="combobox-item-title">JL</div>
        <div class="combobox-item-subtitle">jl@example.com</div>
      </div>
    </li>

    <!-- Client Item -->
    <li class="combobox-item" role="option" data-value="client-dd">
      <div class="avatar avatar-purple">
        <span class="avatar-text">DD</span>
      </div>
      <div class="combobox-item-content">
        <div class="combobox-item-title">DD</div>
        <div class="combobox-item-subtitle">dd@example.com</div>
      </div>
    </li>

    <!-- Client Item -->
    <li class="combobox-item" role="option" data-value="client-nc">
      <div class="avatar avatar-green">
        <span class="avatar-text">NC</span>
      </div>
      <div class="combobox-item-content">
        <div class="combobox-item-title">NC</div>
        <div class="combobox-item-subtitle">nc@example.com</div>
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

.avatar-blue { background-color: #3B82F6; }
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
<div class="bg-white border border-gray-200 rounded-lg overflow-hidden w-full max-w-md font-['Open_Sans']">
  <!-- Search Input -->
  <div class="p-3 border-b border-gray-200">
    <input
      type="text"
      class="w-full border-none outline-none text-sm text-[#141414] bg-transparent placeholder:text-gray-400 font-['Open_Sans']"
      placeholder="Add client..."
      id="clientSearch"
      aria-label="Search clients"
    >
  </div>

  <!-- Dropdown List -->
  <ul class="max-h-[280px] overflow-y-auto" role="listbox" id="clientList">
    <!-- Group Item -->
    <li class="flex items-center gap-3 p-3 cursor-pointer hover:bg-[#F5F7F9] transition-colors" role="option" data-value="group-er">
      <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
        <svg class="text-white" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 14v-1.333A2.667 2.667 0 009.333 10H6.667a2.667 2.667 0 00-2.667 2.667V14M8 7.333A2.667 2.667 0 108 2a2.667 2.667 0 000 5.333zM13.333 14v-1.333a2.667 2.667 0 00-2-2.584M10.667 2.084a2.667 2.667 0 010 5.166" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <div class="text-sm font-medium text-[#141414] leading-tight mb-0.5">Group: er</div>
        <div class="text-xs text-gray-600 leading-tight">11 connected clients without a license</div>
      </div>
    </li>

    <!-- Group Item -->
    <li class="flex items-center gap-3 p-3 cursor-pointer hover:bg-[#F5F7F9] transition-colors" role="option" data-value="group-87">
      <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
        <svg class="text-white" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 14v-1.333A2.667 2.667 0 009.333 10H6.667a2.667 2.667 0 00-2.667 2.667V14M8 7.333A2.667 2.667 0 108 2a2.667 2.667 0 000 5.333zM13.333 14v-1.333a2.667 2.667 0 00-2-2.584M10.667 2.084a2.667 2.667 0 010 5.166" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <div class="text-sm font-medium text-[#141414] leading-tight mb-0.5">Group: 87</div>
        <div class="text-xs text-gray-600 leading-tight">11 connected clients without a license</div>
      </div>
    </li>

    <!-- Client Item - Selected State -->
    <li class="flex items-center gap-3 p-3 cursor-pointer bg-blue-100 hover:bg-blue-200 transition-colors" role="option" data-value="client-cz" aria-selected="true">
      <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
        <span class="text-xs font-semibold text-white leading-none uppercase">CZ</span>
      </div>
      <div class="flex-1 min-w-0">
        <div class="text-sm font-medium text-[#141414] leading-tight mb-0.5">CZ</div>
        <div class="text-xs text-gray-600 leading-tight">cz@example.com</div>
      </div>
    </li>

    <!-- Client Item -->
    <li class="flex items-center gap-3 p-3 cursor-pointer hover:bg-[#F5F7F9] transition-colors" role="option" data-value="client-jl">
      <div class="w-8 h-8 rounded-full bg-orange-400 flex items-center justify-center flex-shrink-0">
        <span class="text-xs font-semibold text-white leading-none uppercase">JL</span>
      </div>
      <div class="flex-1 min-w-0">
        <div class="text-sm font-medium text-[#141414] leading-tight mb-0.5">JL</div>
        <div class="text-xs text-gray-600 leading-tight">jl@example.com</div>
      </div>
    </li>

    <!-- Client Item -->
    <li class="flex items-center gap-3 p-3 cursor-pointer hover:bg-[#F5F7F9] transition-colors" role="option" data-value="client-dd">
      <div class="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0">
        <span class="text-xs font-semibold text-white leading-none uppercase">DD</span>
      </div>
      <div class="flex-1 min-w-0">
        <div class="text-sm font-medium text-[#141414] leading-tight mb-0.5">DD</div>
        <div class="text-xs text-gray-600 leading-tight">dd@example.com</div>
      </div>
    </li>

    <!-- Client Item -->
    <li class="flex items-center gap-3 p-3 cursor-pointer hover:bg-[#F5F7F9] transition-colors" role="option" data-value="client-nc">
      <div class="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
        <span class="text-xs font-semibold text-white leading-none uppercase">NC</span>
      </div>
      <div class="flex-1 min-w-0">
        <div class="text-sm font-medium text-[#141414] leading-tight mb-0.5">NC</div>
        <div class="text-xs text-gray-600 leading-tight">nc@example.com</div>
      </div>
    </li>
  </ul>
</div>
```

## JavaScript
```javascript
// Search and Filter Functionality
document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('clientSearch');
  const clientList = document.getElementById('clientList');
  const items = clientList.querySelectorAll('.combobox-item');

  // Search filter
  searchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();

    items.forEach(item => {
      const title = item.querySelector('.combobox-item-title').textContent.toLowerCase();
      const subtitle = item.querySelector('.combobox-item-subtitle')?.textContent.toLowerCase() || '';

      if (title.includes(searchTerm) || subtitle.includes(searchTerm)) {
        item.classList.remove('combobox-item-hidden');
      } else {
        item.classList.add('combobox-item-hidden');
      }
    });
  });

  // Selection functionality
  items.forEach(item => {
    item.addEventListener('click', function() {
      // Remove selected state from all items
      items.forEach(i => {
        i.classList.remove('combobox-item-selected');
        i.removeAttribute('aria-selected');
      });

      // Add selected state to clicked item
      this.classList.add('combobox-item-selected');
      this.setAttribute('aria-selected', 'true');

      // Optional: Emit custom event for parent components
      const selectedValue = this.getAttribute('data-value');
      const event = new CustomEvent('combobox-select', {
        detail: { value: selectedValue }
      });
      clientList.dispatchEvent(event);
    });
  });

  // Keyboard navigation
  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const firstVisible = clientList.querySelector('.combobox-item:not(.combobox-item-hidden)');
      if (firstVisible) firstVisible.focus();
    }
  });

  items.forEach((item, index) => {
    item.setAttribute('tabindex', '0');

    item.addEventListener('keydown', function(e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        const nextItem = items[index + 1];
        if (nextItem && !nextItem.classList.contains('combobox-item-hidden')) {
          nextItem.focus();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (index === 0) {
          searchInput.focus();
        } else {
          const prevItem = items[index - 1];
          if (prevItem && !prevItem.classList.contains('combobox-item-hidden')) {
            prevItem.focus();
          }
        }
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });
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
- Generated from image on 2026-02-04
- Search filters by both title and subtitle text
- Selected state uses light blue background (#E0EAFF)
- Hover state uses #F5F7F9 per RULE.md
- Maximum list height: 280px with scroll
- Uses Open Sans font family
- Includes custom event 'combobox-select' for integration
