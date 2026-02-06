---
name: Checkbox
category: forms
created: 2026-02-04T17:00:00.000Z
updated: 2026-02-05T08:30:00.000Z
status: approved
---

# Checkbox

A native checkbox component styled to match the design system. Uses `<input type="checkbox">` with CSS styling for reliable cross-browser functionality. Matches the checkbox pattern used in TableWithList header.

## Component States

| State | Background | Border | Checkmark | Description |
|-------|------------|--------|-----------|-------------|
| Unchecked | `#FFFFFF` | `#D1D5DB` | None | Default state |
| Hover | `#FFFFFF` | `#184EFF` | None | Mouse over unchecked |
| Checked | `#184EFF` | `#184EFF` | White ✓ (CSS) | Selected state |
| Indeterminate | `#184EFF` | `#184EFF` | White — (CSS) | Partial selection |
| Disabled | `#F3F4F6` | `#D1D5DB` | None | Non-interactive |
| Disabled Checked | `#184EFF` | `#184EFF` | White ✓ | Checked but disabled |

## HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Checkbox Component</title>

  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            'sans': ['Open Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
          }
        }
      }
    }
  </script>
  <style>
    /* Custom checkbox styling - matches TableWithList header checkbox */
    .custom-checkbox {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      width: 16px;
      height: 16px;
      border: 1px solid #D1D5DB;
      border-radius: 4px;
      background-color: #FFFFFF;
      cursor: pointer;
      position: relative;
      transition: all 0.15s ease;
    }

    .custom-checkbox:hover {
      border-color: #184EFF;
    }

    .custom-checkbox:checked {
      background-color: #184EFF;
      border-color: #184EFF;
    }

    .custom-checkbox:checked::after {
      content: '';
      position: absolute;
      left: 4px;
      top: 1px;
      width: 5px;
      height: 9px;
      border: solid #FFFFFF;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }

    .custom-checkbox:disabled {
      background-color: #F3F4F6;
      cursor: not-allowed;
      opacity: 0.5;
    }

    .custom-checkbox:disabled:checked {
      background-color: #184EFF;
    }

    .custom-checkbox:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(24, 78, 255, 0.2);
    }

    /* Indeterminate state */
    .custom-checkbox:indeterminate {
      background-color: #184EFF;
      border-color: #184EFF;
    }

    .custom-checkbox:indeterminate::after {
      content: '';
      position: absolute;
      left: 3px;
      top: 6px;
      width: 8px;
      height: 2px;
      background-color: #FFFFFF;
      transform: none;
      border: none;
    }
  </style>
</head>
<body class="bg-gray-100 p-8 font-['Open_Sans']">

  <h2 class="text-lg font-semibold mb-6 text-[#141414]">Checkbox Component</h2>

  <div class="space-y-6">

    <!-- All States -->
    <div class="flex flex-wrap gap-8 items-start">

      <!-- Unchecked -->
      <div class="flex flex-col items-center gap-2">
        <input type="checkbox" class="custom-checkbox" aria-label="Unchecked checkbox">
        <span class="text-xs text-[#7B7E91]">Unchecked</span>
      </div>

      <!-- Checked -->
      <div class="flex flex-col items-center gap-2">
        <input type="checkbox" class="custom-checkbox" checked aria-label="Checked checkbox">
        <span class="text-xs text-[#7B7E91]">Checked</span>
      </div>

      <!-- Hover State (simulated with border) -->
      <div class="flex flex-col items-center gap-2">
        <input type="checkbox" class="custom-checkbox" style="border-color: #184EFF;" aria-label="Hover state checkbox">
        <span class="text-xs text-[#7B7E91]">Hover</span>
      </div>

      <!-- Indeterminate -->
      <div class="flex flex-col items-center gap-2">
        <input type="checkbox" id="indeterminate-demo" class="custom-checkbox" aria-label="Indeterminate checkbox">
        <span class="text-xs text-[#7B7E91]">Indeterminate</span>
      </div>

      <!-- Disabled Unchecked -->
      <div class="flex flex-col items-center gap-2">
        <input type="checkbox" class="custom-checkbox" disabled aria-label="Disabled unchecked checkbox">
        <span class="text-xs text-[#7B7E91]">Disabled</span>
      </div>

      <!-- Disabled Checked -->
      <div class="flex flex-col items-center gap-2">
        <input type="checkbox" class="custom-checkbox" checked disabled aria-label="Disabled checked checkbox">
        <span class="text-xs text-[#7B7E91]">Disabled Checked</span>
      </div>

    </div>

    <!-- With Labels -->
    <div class="mt-8">
      <h3 class="text-[13px] font-medium mb-4 text-[#141414]">With Labels</h3>
      <div class="space-y-3">

        <!-- Unchecked with Label -->
        <label class="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" class="custom-checkbox">
          <span class="text-[13px] text-[#141414]">Accept terms and conditions</span>
        </label>

        <!-- Checked with Label -->
        <label class="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" class="custom-checkbox" checked>
          <span class="text-[13px] text-[#141414]">Subscribe to newsletter</span>
        </label>

        <!-- Disabled with Label -->
        <label class="flex items-center gap-3 cursor-not-allowed opacity-50">
          <input type="checkbox" class="custom-checkbox" disabled>
          <span class="text-[13px] text-[#141414]">Premium feature (upgrade required)</span>
        </label>

      </div>
    </div>

    <!-- Interactive Demo - Select All Pattern (like TableWithList) -->
    <div class="mt-8">
      <h3 class="text-[13px] font-medium mb-4 text-[#141414]">Interactive Demo - Select All Pattern</h3>
      <div class="bg-white rounded-lg border border-gray-200 p-4">

        <!-- Select All Header -->
        <div class="flex items-center gap-3 pb-3 border-b border-gray-200 mb-3">
          <input type="checkbox" id="select-all" class="custom-checkbox" aria-label="Select all">
          <span class="text-[13px] font-semibold text-[#141414]">Select All</span>
        </div>

        <!-- Options -->
        <div class="space-y-3">
          <label class="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" class="custom-checkbox item-checkbox">
            <span class="text-[13px] text-[#141414]">Option 1</span>
          </label>

          <label class="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" class="custom-checkbox item-checkbox">
            <span class="text-[13px] text-[#141414]">Option 2</span>
          </label>

          <label class="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" class="custom-checkbox item-checkbox">
            <span class="text-[13px] text-[#141414]">Option 3</span>
          </label>
        </div>

      </div>
    </div>

  </div>

  <!-- JavaScript -->
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      // Set indeterminate state for demo
      const indeterminateCheckbox = document.getElementById('indeterminate-demo');
      if (indeterminateCheckbox) {
        indeterminateCheckbox.indeterminate = true;
      }

      // Select All functionality (matches TableWithList pattern)
      const selectAll = document.getElementById('select-all');
      const itemCheckboxes = document.querySelectorAll('.item-checkbox');

      if (selectAll && itemCheckboxes.length > 0) {
        // Select All change handler
        selectAll.addEventListener('change', function() {
          itemCheckboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
          });
        });

        // Individual checkbox change handler
        itemCheckboxes.forEach(checkbox => {
          checkbox.addEventListener('change', function() {
            const checkedCount = document.querySelectorAll('.item-checkbox:checked').length;
            const totalCount = itemCheckboxes.length;

            selectAll.checked = checkedCount === totalCount;
            selectAll.indeterminate = checkedCount > 0 && checkedCount < totalCount;
          });
        });
      }
    });
  </script>

</body>
</html>
```

## CSS

```css
:root {
  --font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --color-text-primary: #141414;
  --color-border-default: #D1D5DB;
  --color-border-hover: #184EFF;
  --color-bg-checked: #184EFF;
  --color-bg-disabled: #F3F4F6;
}

/* Custom checkbox styling - matches TableWithList header checkbox */
.custom-checkbox {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border: 1px solid var(--color-border-default);
  border-radius: 4px;
  background-color: #FFFFFF;
  cursor: pointer;
  position: relative;
  transition: all 0.15s ease;
}

.custom-checkbox:hover {
  border-color: var(--color-border-hover);
}

.custom-checkbox:checked {
  background-color: var(--color-bg-checked);
  border-color: var(--color-bg-checked);
}

/* Checkmark using CSS pseudo-element */
.custom-checkbox:checked::after {
  content: '';
  position: absolute;
  left: 4px;
  top: 1px;
  width: 5px;
  height: 9px;
  border: solid #FFFFFF;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.custom-checkbox:disabled {
  background-color: var(--color-bg-disabled);
  cursor: not-allowed;
  opacity: 0.5;
}

.custom-checkbox:disabled:checked {
  background-color: var(--color-bg-checked);
}

.custom-checkbox:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(24, 78, 255, 0.2);
}

/* Indeterminate state - for select-all partial selection */
.custom-checkbox:indeterminate {
  background-color: var(--color-bg-checked);
  border-color: var(--color-bg-checked);
}

.custom-checkbox:indeterminate::after {
  content: '';
  position: absolute;
  left: 3px;
  top: 6px;
  width: 8px;
  height: 2px;
  background-color: #FFFFFF;
  transform: none;
  border: none;
}
```

## JavaScript

```javascript
// Native checkbox - no JS needed for basic toggle functionality
// JS only required for:
// 1. Setting indeterminate state
// 2. Select-all pattern with partial selection

document.addEventListener('DOMContentLoaded', function() {
  // Set indeterminate state programmatically (cannot be set via HTML)
  // checkbox.indeterminate = true;

  // Select All functionality (matches TableWithList pattern)
  const selectAll = document.getElementById('select-all');
  const itemCheckboxes = document.querySelectorAll('.item-checkbox');

  if (selectAll && itemCheckboxes.length > 0) {
    // Select All change handler
    selectAll.addEventListener('change', function() {
      itemCheckboxes.forEach(checkbox => {
        checkbox.checked = this.checked;
      });
    });

    // Individual checkbox change handler - update select-all state
    itemCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        const checkedCount = document.querySelectorAll('.item-checkbox:checked').length;
        const totalCount = itemCheckboxes.length;

        selectAll.checked = checkedCount === totalCount;
        selectAll.indeterminate = checkedCount > 0 && checkedCount < totalCount;
      });
    });
  }
});
```

## Accessibility

- Uses native `<input type="checkbox">` for full browser support
- Keyboard accessible (Space to toggle, Tab to navigate)
- Focus ring visible for keyboard navigation (blue outline)
- Disabled state with `disabled` attribute
- Label association via wrapping `<label>` element or `aria-label`
- Indeterminate state for partial selection (screen reader announced)
- Color contrast meets WCAG AA standards

## Notes

- Uses native `<input type="checkbox">` instead of custom button for reliability
- Checkmark rendered via CSS `::after` pseudo-element (no SVG/JS needed)
- Matches TableWithList header checkbox (16px × 16px)
- Indeterminate state only settable via JavaScript
- RULE.md compliant: `#184EFF` primary, `#D1D5DB` border, `#141414` text
