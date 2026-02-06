---
name: Combobox
category: forms
status: approved
created: 2026-02-06T13:00:00.000Z
updated: 2026-02-06T13:30:00.000Z
---

# Combobox

## Preview
A dropdown select component with label, single selection, blue border on hover/focus, and scrollable list. Selected item shows blue text with check icon. Long text is truncated with ellipsis. Max 5 visible items; scrollbar appears when list exceeds 5.

## Usage
Use for single-value selection from a predefined list (e.g., owner, assignee, status). Not for search/filter — see ComboboxWithSearch for that.

## HTML
```html
<!-- Combobox Component -->
<div class="combobox-owner relative w-[280px] font-['Open_Sans']" data-combobox>
  <!-- Label -->
  <label class="block text-xs font-semibold text-[#7B7E91] uppercase tracking-wide mb-1">Owner</label>

  <!-- Trigger -->
  <button type="button" class="w-full flex items-center justify-between px-3 py-2.5 bg-white border border-gray-300 rounded-md text-[13px] text-[#141414] hover:border-[#184EFF] focus:border-[#184EFF] focus:outline-none transition-colors cursor-pointer" data-combobox-trigger>
    <span class="truncate" data-combobox-value>Workspace A AAA1 (You)</span>
    <!-- chevron-down -->
    <svg class="w-4 h-4 text-gray-400 shrink-0 ml-2 transition-transform" data-combobox-arrow viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd"/>
    </svg>
  </button>

  <!-- Dropdown List (max 5 visible, scrollbar if more) -->
  <ul class="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-[200px] overflow-y-auto custom-scrollbar hidden" data-combobox-list>
    <!-- Selected Item: blue text + check icon -->
    <li class="px-3 py-2 text-[13px] cursor-pointer flex items-center justify-between text-[#184EFF] bg-white hover:bg-[#F0F1FF]" data-combobox-item data-selected="true">
      <span class="truncate">Workspace A AAA1 (You)</span>
      <!-- check icon -->
      <svg class="w-4 h-4 shrink-0 ml-2 text-[#184EFF]" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd"/>
      </svg>
    </li>
    <!-- Unselected Items (7 total to demo scrollbar) -->
    <li class="px-3 py-2 text-[13px] text-[#222222] cursor-pointer truncate hover:bg-[#F0F1FF]" data-combobox-item>hung long name long name long trainer a1</li>
    <li class="px-3 py-2 text-[13px] text-[#222222] cursor-pointer truncate hover:bg-[#F0F1FF]" data-combobox-item>Trainer2 a1</li>
    <li class="px-3 py-2 text-[13px] text-[#222222] cursor-pointer truncate hover:bg-[#F0F1FF]" data-combobox-item>Admin a1</li>
    <li class="px-3 py-2 text-[13px] text-[#222222] cursor-pointer truncate hover:bg-[#F0F1FF]" data-combobox-item>Trainer3 a1</li>
    <li class="px-3 py-2 text-[13px] text-[#222222] cursor-pointer truncate hover:bg-[#F0F1FF]" data-combobox-item>Manager b2</li>
    <li class="px-3 py-2 text-[13px] text-[#222222] cursor-pointer truncate hover:bg-[#F0F1FF]" data-combobox-item>Supervisor long name example text here c3</li>
    <li class="px-3 py-2 text-[13px] text-[#222222] cursor-pointer truncate hover:bg-[#F0F1FF]" data-combobox-item>Viewer d4</li>
  </ul>
</div>
```

## CSS
```css
.combobox-owner {
  font-family: 'Open Sans', sans-serif;
}

/* Reuse Scrollbar component styles */
.combobox-owner .custom-scrollbar::-webkit-scrollbar { width: 6px; }
.combobox-owner .custom-scrollbar::-webkit-scrollbar-track { background: transparent; border-radius: 3px; }
.combobox-owner .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #e1e1ea; border-radius: 3px; }
.combobox-owner .custom-scrollbar { scrollbar-width: thin; scrollbar-color: #e1e1ea transparent; }
```

## Component States
| State | Trigger | Visual Changes | Tailwind Classes |
|-------|---------|----------------|------------------|
| Default | Initial render | Gray border, first item selected, dropdown hidden | `border-gray-300`, `hidden` on list |
| Hover | Mouse over trigger | Blue border | `hover:border-[#184EFF]` |
| Open (Edit) | Click trigger | Blue border, dropdown visible, chevron rotated 180deg | `border-[#184EFF]`, `rotate-180` on arrow |
| Item hover | Mouse over dropdown item | Light purple background | `hover:bg-[#F0F1FF]` |
| Item selected | Click item | Blue text + check icon at end | `text-[#184EFF]` + check SVG |
| Long text | Text overflows container | Truncated with ellipsis | `truncate` |
| Scrollable | More than 5 items | Custom thin scrollbar (6px, `#e1e1ea` thumb) | `max-h-[200px] overflow-y-auto custom-scrollbar` |

## JavaScript
```javascript
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('[data-combobox]').forEach(function(combobox) {
    var trigger = combobox.querySelector('[data-combobox-trigger]');
    var list = combobox.querySelector('[data-combobox-list]');
    var arrow = combobox.querySelector('[data-combobox-arrow]');
    var valueEl = combobox.querySelector('[data-combobox-value]');
    var items = combobox.querySelectorAll('[data-combobox-item]');

    // Toggle dropdown
    trigger.addEventListener('click', function() {
      var isOpen = !list.classList.contains('hidden');
      if (isOpen) {
        list.classList.add('hidden');
        arrow.classList.remove('rotate-180');
        trigger.classList.remove('border-[#184EFF]');
        trigger.classList.add('border-gray-300');
      } else {
        list.classList.remove('hidden');
        arrow.classList.add('rotate-180');
        trigger.classList.remove('border-gray-300');
        trigger.classList.add('border-[#184EFF]');
      }
    });

    // Select item
    items.forEach(function(item) {
      item.addEventListener('click', function() {
        // Remove selected from all
        items.forEach(function(i) {
          i.setAttribute('data-selected', 'false');
          i.classList.remove('text-[#184EFF]');
          i.classList.add('text-[#222222]');
          var check = i.querySelector('svg');
          if (check) check.remove();
          if (i.classList.contains('flex')) {
            i.classList.remove('flex', 'items-center', 'justify-between');
            var text = i.querySelector('.truncate') ? i.querySelector('.truncate').textContent : i.textContent;
            i.textContent = text;
            i.classList.add('truncate');
          }
        });

        // Set selected
        item.setAttribute('data-selected', 'true');
        item.classList.remove('text-[#222222]', 'truncate');
        item.classList.add('text-[#184EFF]', 'flex', 'items-center', 'justify-between');
        var span = document.createElement('span');
        span.className = 'truncate';
        span.textContent = item.textContent.trim();
        item.textContent = '';
        item.appendChild(span);

        // Add check icon
        var checkSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        checkSvg.setAttribute('class', 'w-4 h-4 shrink-0 ml-2 text-[#184EFF]');
        checkSvg.setAttribute('viewBox', '0 0 20 20');
        checkSvg.setAttribute('fill', 'currentColor');
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('fill-rule', 'evenodd');
        path.setAttribute('d', 'M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z');
        path.setAttribute('clip-rule', 'evenodd');
        checkSvg.appendChild(path);
        item.appendChild(checkSvg);

        // Update trigger text
        valueEl.textContent = span.textContent;

        // Close dropdown
        list.classList.add('hidden');
        arrow.classList.remove('rotate-180');
        trigger.classList.remove('border-[#184EFF]');
        trigger.classList.add('border-gray-300');
      });
    });

    // Close on outside click
    document.addEventListener('click', function(e) {
      if (!combobox.contains(e.target)) {
        list.classList.add('hidden');
        arrow.classList.remove('rotate-180');
        trigger.classList.remove('border-[#184EFF]');
        trigger.classList.add('border-gray-300');
      }
    });

    // Keyboard navigation
    trigger.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        trigger.click();
      } else if (e.key === 'Escape') {
        list.classList.add('hidden');
        arrow.classList.remove('rotate-180');
      }
    });
  });
});
```

## Accessibility
- Trigger is a `<button>` element (keyboard focusable)
- Keyboard support: Enter/Space to toggle, Escape to close
- `label` element associates with the combobox
- `data-selected` attribute tracks selection state
- Dropdown uses `<ul>/<li>` semantic list structure

## Notes
- Max 5 items visible at once; scrollbar via `max-h-[200px] overflow-y-auto custom-scrollbar`
- Scrollbar reuses **Scrollbar** component pattern: 6px width, `#e1e1ea` thumb, transparent track, rounded 3px
- First item is always pre-selected on initial render
- Long text truncated with `...` in both trigger and dropdown items
- Selected item shows blue text (`#184EFF`) + inline SVG check icon
- Hover item background: `#F0F1FF` (from RULE.md `--color-bg-combobox-hover`)
- Hover/focus border: `#184EFF` (from RULE.md `--color-border-textbox-hover`)
- Item text color: `#222222` (from RULE.md `--color-text-secondary`)
- No check icon SVG in `source/design-system/icons/` — uses inline SVG
