---
name: ComboboxWithSearch
category: forms
created: 2026-02-04
status: draft
---

# ComboboxWithSearch

## Preview
A multi-select searchable combobox for selecting clients or groups. Features:
- Search input with placeholder
- Dropdown list with avatars (groups use icon, clients use initials)
- Multi-select with removable tag/chip display
- Focus state with blue border ring

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

## Multi-Select with Tags (Tailwind)
```html
<!-- Input with selected tags -->
<div class="relative font-['Open_Sans'] w-full max-w-md">
  <!-- Input Container with Tags -->
  <div class="flex flex-wrap items-center gap-1 min-h-[42px] px-3 py-2 border border-[#184EFF] ring-1 ring-[#184EFF] rounded-md bg-white cursor-text">
    <!-- Group Tag -->
    <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded text-sm text-[#141414]">
      Group 99 clients (45 members)
      <button class="ml-1 text-gray-400 hover:text-gray-600">
        <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="8" fill="currentColor" fill-opacity="0.3"/>
          <path d="M5 11l3-3 3 3M5 5l3 3 3-3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
      </button>
    </span>
    <!-- Client Tag -->
    <span class="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 rounded text-sm text-[#141414]">
      Dec1_failed1 Le
      <button class="ml-1 text-gray-400 hover:text-gray-600">
        <svg class="w-4 h-4" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="8" fill="currentColor" fill-opacity="0.3"/>
          <path d="M5 11l3-3 3 3M5 5l3 3 3-3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
        </svg>
      </button>
    </span>
    <!-- More tags... -->
    <input
      type="text"
      class="flex-1 min-w-[60px] outline-none text-sm text-[#141414] bg-transparent"
    />
  </div>

  <!-- Dropdown List -->
  <div class="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
    <!-- Group Item -->
    <div class="flex items-center gap-3 px-4 py-3 hover:bg-[#F0F1FF] cursor-pointer">
      <div class="w-10 h-10 rounded-full bg-[#5C89FF] flex items-center justify-center">
        <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
        </svg>
      </div>
      <div class="flex-1">
        <div class="text-sm font-semibold text-[#141414]">Group: G 23</div>
        <div class="text-xs text-gray-500">10 connected clients without a license</div>
      </div>
    </div>

    <!-- Client Item (Hover) -->
    <div class="flex items-center gap-3 px-4 py-3 hover:bg-[#F0F1FF] cursor-pointer">
      <div class="w-10 h-10 rounded-full bg-[#FF9F43] flex items-center justify-center text-white font-semibold text-sm">CZ</div>
      <div class="flex-1">
        <div class="text-sm font-semibold text-[#141414]">Check Zipcode</div>
        <div class="text-xs text-gray-500">chungngo+cl999@everfit.io</div>
      </div>
    </div>

    <!-- Client Item (Selected) -->
    <div class="flex items-center gap-3 px-4 py-3 bg-[#5C89FF] cursor-pointer">
      <div class="w-10 h-10 rounded-full bg-[#E8A0A0] flex items-center justify-center text-white font-semibold text-sm">JL</div>
      <div class="flex-1">
        <div class="text-sm font-semibold text-white">Jan5cancel1 Le</div>
        <div class="text-xs text-white/80">hungle+jan5cancel1@everfit.io</div>
      </div>
    </div>
  </div>
</div>
```

## Component States

| State | Trigger | Visual Changes | Tailwind Classes |
|-------|---------|----------------|------------------|
| Default | - | Gray border, placeholder | `border-gray-300` |
| Focus | Click/Tab | Blue border with ring | `border-[#184EFF] ring-1 ring-[#184EFF]` |
| Dropdown open | Focus | Shadow, list visible | `shadow-lg` |
| Item hover | Mouse over | Light purple bg | `hover:bg-[#F0F1FF]` |
| Item selected | Click | Blue bg, white text | `bg-[#5C89FF] text-white` |
| Tag | After selection | Gray chip with X | `bg-gray-100 rounded` |

## Avatar Colors

| Color | Hex | Tailwind |
|-------|-----|----------|
| Group Blue | `#5C89FF` | `bg-[#5C89FF]` |
| Orange | `#FF9F43` | `bg-[#FF9F43]` |
| Rose | `#E8A0A0` | `bg-[#E8A0A0]` |
| Light Blue | `#5C9EFF` | `bg-[#5C9EFF]` |
| Lime | `#C5E865` | `bg-[#C5E865]` |

## JavaScript
```javascript
// ComboboxWithSearch - Full Interactive Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Get elements - works with Tailwind HTML structure
  const searchInput = document.querySelector('input[placeholder="Add client..."]') || document.querySelector('input');
  const listContainer = document.querySelector('ul[role="listbox"]') || document.querySelector('ul');
  const items = listContainer ? listContainer.querySelectorAll('li[role="option"]') : [];

  if (!searchInput || !listContainer || items.length === 0) {
    console.log('ComboboxWithSearch: Elements not found');
    return;
  }

  // --- 1. SEARCH/FILTER FUNCTIONALITY ---
  searchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase().trim();

    items.forEach(item => {
      const titleEl = item.querySelector('.font-medium, .font-semibold');
      const subtitleEl = item.querySelector('.text-gray-600, .text-gray-500, .text-xs:last-child');

      const title = titleEl?.textContent?.toLowerCase() || '';
      const subtitle = subtitleEl?.textContent?.toLowerCase() || '';

      const matches = title.includes(searchTerm) || subtitle.includes(searchTerm);
      item.style.display = matches ? '' : 'none';
    });
  });

  // --- 2. ITEM SELECTION (Click) ---
  items.forEach(item => {
    item.style.cursor = 'pointer';

    item.addEventListener('click', function() {
      // Remove selected state from all items
      items.forEach(i => {
        i.classList.remove('bg-[#5C89FF]', 'bg-blue-100');
        i.removeAttribute('aria-selected');

        // Reset text colors
        const title = i.querySelector('.font-medium, .font-semibold');
        const subtitle = i.querySelector('.text-xs:last-child');
        if (title) title.classList.remove('text-white');
        if (subtitle) {
          subtitle.classList.remove('text-white', 'text-white/80');
          subtitle.classList.add('text-gray-600');
        }
      });

      // Add selected state to clicked item
      this.classList.add('bg-[#5C89FF]');
      this.setAttribute('aria-selected', 'true');

      // Update text colors for selected
      const title = this.querySelector('.font-medium, .font-semibold');
      const subtitle = this.querySelector('.text-xs:last-child');
      if (title) title.classList.add('text-white');
      if (subtitle) {
        subtitle.classList.remove('text-gray-600');
        subtitle.classList.add('text-white/80');
      }

      // Log selection (for demo)
      console.log('Selected:', this.getAttribute('data-value'));
    });

    // --- 3. HOVER EFFECT ---
    item.addEventListener('mouseenter', function() {
      if (!this.classList.contains('bg-[#5C89FF]')) {
        this.classList.add('bg-[#F0F1FF]');
      }
    });

    item.addEventListener('mouseleave', function() {
      this.classList.remove('bg-[#F0F1FF]');
    });
  });

  // --- 4. KEYBOARD NAVIGATION ---
  searchInput.addEventListener('keydown', function(e) {
    const visibleItems = [...items].filter(i => i.style.display !== 'none');

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (visibleItems.length > 0) {
        visibleItems[0].focus();
      }
    }
  });

  items.forEach((item, index) => {
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
          const prev = visibleItems[currentIndex - 1];
          if (prev) prev.focus();
        }
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      } else if (e.key === 'Escape') {
        searchInput.focus();
        searchInput.value = '';
        // Show all items
        items.forEach(i => i.style.display = '');
      }
    });

    // Focus styling
    item.addEventListener('focus', function() {
      if (!this.classList.contains('bg-[#5C89FF]')) {
        this.classList.add('bg-[#F0F1FF]');
      }
    });

    item.addEventListener('blur', function() {
      this.classList.remove('bg-[#F0F1FF]');
    });
  });

  // --- 5. INPUT FOCUS STYLING ---
  const inputContainer = searchInput.closest('.p-3, .px-3');
  if (inputContainer) {
    searchInput.addEventListener('focus', function() {
      inputContainer.classList.add('ring-2', 'ring-[#184EFF]', 'border-[#184EFF]');
    });

    searchInput.addEventListener('blur', function() {
      inputContainer.classList.remove('ring-2', 'ring-[#184EFF]', 'border-[#184EFF]');
    });
  }

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
- Updated from 6 images on 2026-02-04
- Supports multi-select with tag/chip display
- Search filters by both title and subtitle text
- Selected item uses blue background (#5C89FF)
- Hover state uses #F0F1FF (combobox-hover from RULE.md)
- Focus border uses #184EFF (action color from RULE.md)
- Maximum list height: 280px with scroll
- Uses Open Sans font family
- Tags have close button for removal
