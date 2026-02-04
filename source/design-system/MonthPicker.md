---
name: MonthPicker
category: forms
created: 2026-02-04T00:00:00.000Z
status: approved
---

# MonthPicker

## Preview
A month picker component with year navigation and a 4×3 grid layout showing all 12 months. Features blue arrow navigation for years, selected month highlight in light blue (#F0F1FF), and hover states. Designed to work with DatePicker for quick month selection.

## Usage
Use this component for:
- Quick month selection in DatePicker
- Month navigation in calendar interfaces
- Filtering by month in reports
- Month selection in date range pickers

## HTML
```html
<div class="relative inline-block font-['Open_Sans']">
  <!-- MonthPicker Dropdown -->
  <div class="bg-white border border-gray-200 rounded-xl shadow-xl p-5 min-w-[320px]">
    <!-- Year Header with Navigation -->
    <div class="flex items-center justify-center gap-4 mb-5">
      <!-- Previous Year Button -->
      <button id="prevYear" type="button" class="p-2 hover:bg-gray-100 rounded-md transition-all" aria-label="Previous year">
        <svg class="w-3.5 h-5" viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 11L1 6l5-5" stroke="#184EFF" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>

      <!-- Year Title -->
      <div id="yearTitle" class="text-xl font-semibold text-[#141414] min-w-[80px] text-center">
        2026
      </div>

      <!-- Next Year Button -->
      <button id="nextYear" type="button" class="p-2 hover:bg-gray-100 rounded-md transition-all" aria-label="Next year">
        <svg class="w-3.5 h-5" viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1l5 5-5 5" stroke="#184EFF" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <!-- Month Grid (4 columns × 3 rows) -->
    <div class="grid grid-cols-4 gap-2">
      <button class="month-btn px-4 py-2.5 text-sm font-medium text-[#141414] rounded-lg hover:bg-gray-100 transition-colors" data-month="0">Jan</button>
      <button class="month-btn px-4 py-2.5 text-sm font-medium text-[#141414] bg-[#F0F1FF] rounded-lg hover:bg-[#E0E2FF] transition-colors" data-month="1">Feb</button>
      <button class="month-btn px-4 py-2.5 text-sm font-medium text-[#141414] rounded-lg hover:bg-gray-100 transition-colors" data-month="2">Mar</button>
      <button class="month-btn px-4 py-2.5 text-sm font-medium text-[#141414] rounded-lg hover:bg-gray-100 transition-colors" data-month="3">Apr</button>

      <button class="month-btn px-4 py-2.5 text-sm font-medium text-[#141414] rounded-lg hover:bg-gray-100 transition-colors" data-month="4">May</button>
      <button class="month-btn px-4 py-2.5 text-sm font-medium text-[#141414] rounded-lg hover:bg-gray-100 transition-colors" data-month="5">Jun</button>
      <button class="month-btn px-4 py-2.5 text-sm font-medium text-[#141414] rounded-lg hover:bg-gray-100 transition-colors" data-month="6">Jul</button>
      <button class="month-btn px-4 py-2.5 text-sm font-medium text-[#141414] rounded-lg hover:bg-gray-100 transition-colors" data-month="7">Aug</button>

      <button class="month-btn px-4 py-2.5 text-sm font-medium text-[#141414] rounded-lg hover:bg-gray-100 transition-colors" data-month="8">Sep</button>
      <button class="month-btn px-4 py-2.5 text-sm font-medium text-[#141414] rounded-lg hover:bg-gray-100 transition-colors" data-month="9">Oct</button>
      <button class="month-btn px-4 py-2.5 text-sm font-medium text-[#141414] rounded-lg hover:bg-gray-100 transition-colors" data-month="10">Nov</button>
      <button class="month-btn px-4 py-2.5 text-sm font-medium text-[#141414] rounded-lg hover:bg-gray-100 transition-colors" data-month="11">Dec</button>
    </div>
  </div>
</div>
```

## CSS
```css
.month-picker {
  position: relative;
  display: inline-block;
  font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.month-picker__container {
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  min-width: 320px;
}

.month-picker__header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  margin-bottom: 20px;
}

.month-picker__nav {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.month-picker__nav:hover {
  background-color: #f3f4f6;
}

.month-picker__year {
  font-size: 20px;
  font-weight: 600;
  color: #141414;
  min-width: 80px;
  text-align: center;
}

.month-picker__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.month-picker__month {
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #141414;
  background: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.month-picker__month:hover {
  background-color: #f3f4f6;
}

.month-picker__month--selected {
  background-color: #F0F1FF;
}

.month-picker__month--selected:hover {
  background-color: #E0E2FF;
}
```

## Tailwind Classes Used
| Class | Purpose |
|-------|---------|
| `bg-white` | Component background (from RULE.md) |
| `border-gray-200` | Light border |
| `rounded-xl` | Large rounded corners |
| `shadow-xl` | Dropdown shadow |
| `p-5` | Container padding |
| `min-w-[320px]` | Minimum width |
| `grid-cols-4` | 4-column grid layout |
| `gap-2` | Grid gap spacing |
| `px-4 py-2.5` | Month button padding |
| `text-sm` | Small text size |
| `font-medium` | Medium font weight |
| `text-[#141414]` | Primary text color (from RULE.md) |
| `bg-[#F0F1FF]` | Selected month background (from RULE.md) |
| `hover:bg-gray-100` | Hover state background |
| `hover:bg-[#E0E2FF]` | Selected month hover state |
| `rounded-lg` | Month button border radius |
| `transition-colors` | Smooth color transitions |
| `text-xl` | Year text size |
| `font-semibold` | Year text weight |

## Props/Variants
| Variant | Tailwind Classes | Description |
|---------|------------------|-------------|
| Default Month | `px-4 py-2.5 text-sm font-medium text-[#141414] rounded-lg hover:bg-gray-100` | Unselected month button |
| Selected Month | `px-4 py-2.5 text-sm font-medium text-[#141414] bg-[#F0F1FF] rounded-lg hover:bg-[#E0E2FF]` | Currently selected month with light blue background |
| Year Navigation | `p-2 hover:bg-gray-100 rounded-md` | Arrow buttons for year navigation |

## Component States
| State | Trigger | Visual Changes | Tailwind Classes |
|-------|---------|----------------|------------------|
| Default | - | White background, dark text | `bg-white text-[#141414]` |
| Hover (unselected) | Mouse over month | Gray background | `hover:bg-gray-100` |
| Hover (selected) | Mouse over selected month | Slightly darker blue | `hover:bg-[#E0E2FF]` |
| Selected | Click month | Light blue background | `bg-[#F0F1FF]` |
| Arrow Hover | Mouse over arrow | Gray background | `hover:bg-gray-100` |

## JavaScript
```javascript
document.addEventListener('DOMContentLoaded', function() {
  // State
  let currentYear = 2026;
  let selectedMonth = 1; // February (0-indexed)

  // DOM Elements
  const yearTitle = document.getElementById('yearTitle');
  const prevYear = document.getElementById('prevYear');
  const nextYear = document.getElementById('nextYear');
  const monthButtons = document.querySelectorAll('.month-btn');

  // Initialize
  yearTitle.textContent = currentYear;

  // Year navigation - Previous
  prevYear.addEventListener('click', function() {
    currentYear--;
    yearTitle.textContent = currentYear;

    // Emit custom event for parent components
    document.dispatchEvent(new CustomEvent('monthpicker:year-changed', {
      detail: { year: currentYear }
    }));
  });

  // Year navigation - Next
  nextYear.addEventListener('click', function() {
    currentYear++;
    yearTitle.textContent = currentYear;

    // Emit custom event for parent components
    document.dispatchEvent(new CustomEvent('monthpicker:year-changed', {
      detail: { year: currentYear }
    }));
  });

  // Month selection
  monthButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      // Remove selected state from all months
      monthButtons.forEach(b => {
        b.classList.remove('bg-[#F0F1FF]', 'hover:bg-[#E0E2FF]');
        b.classList.add('hover:bg-gray-100');
      });

      // Add selected state to clicked month
      this.classList.add('bg-[#F0F1FF]', 'hover:bg-[#E0E2FF]');
      this.classList.remove('hover:bg-gray-100');

      // Update selected month
      selectedMonth = parseInt(this.dataset.month);

      // Emit custom event for parent components (e.g., DatePicker)
      document.dispatchEvent(new CustomEvent('monthpicker:month-selected', {
        detail: {
          month: selectedMonth,
          year: currentYear,
          monthName: this.textContent
        }
      }));
    });
  });

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') {
      prevYear.click();
    } else if (e.key === 'ArrowRight') {
      nextYear.click();
    } else if (e.key === 'Escape') {
      // Emit close event
      document.dispatchEvent(new CustomEvent('monthpicker:close'));
    }
  });

  // Public API for external control
  window.MonthPicker = {
    setYear: function(year) {
      currentYear = year;
      yearTitle.textContent = currentYear;
    },
    setSelectedMonth: function(month) {
      monthButtons.forEach(btn => {
        const btnMonth = parseInt(btn.dataset.month);
        if (btnMonth === month) {
          btn.classList.add('bg-[#F0F1FF]', 'hover:bg-[#E0E2FF]');
          btn.classList.remove('hover:bg-gray-100');
        } else {
          btn.classList.remove('bg-[#F0F1FF]', 'hover:bg-[#E0E2FF]');
          btn.classList.add('hover:bg-gray-100');
        }
      });
      selectedMonth = month;
    },
    getSelectedMonth: function() {
      return { month: selectedMonth, year: currentYear };
    }
  };
});
```

## Integration with DatePicker

MonthPicker is designed to integrate seamlessly with DatePicker. Listen for custom events:

```javascript
// Listen for month selection
document.addEventListener('monthpicker:month-selected', function(e) {
  const { month, year, monthName } = e.detail;
  console.log(`Selected: ${monthName} ${year}`);
  // Update DatePicker calendar view
});

// Listen for year changes
document.addEventListener('monthpicker:year-changed', function(e) {
  const { year } = e.detail;
  console.log(`Year changed to: ${year}`);
});

// Listen for close event
document.addEventListener('monthpicker:close', function() {
  // Hide MonthPicker, show DatePicker calendar
});
```

## Accessibility
- Use `aria-label` on navigation buttons ("Previous year", "Next year")
- Month buttons have `data-month` attribute for semantic meaning
- Support keyboard navigation (Arrow Left/Right for year, Escape to close)
- Ensure sufficient color contrast for text
- Use semantic button elements
- Emit custom events for screen reader announcements

## Design Specs
| Element | Dimensions | Colors | Font |
|---------|-----------|--------|------|
| Container | 320px min-width | `#FFFFFF` background | Open Sans |
| Month Button | 70px × 40px | `#141414` text | 14px medium |
| Selected Month | - | `#F0F1FF` background | 14px medium |
| Hover (unselected) | - | `#F3F4F6` background | - |
| Hover (selected) | - | `#E0E2FF` background | - |
| Year Text | - | `#141414` text | 20px semibold |
| Navigation Arrow | 7px × 12px | `#184EFF` stroke | - |
| Grid | 4 columns × 3 rows | 8px gap | - |

## Notes
- Generated on 2026-02-04
- Uses blue arrows from design system (`left_arrow_blue.svg`, `right_arrow_blue.svg`)
- Follows RULE.md styling guidelines
- Selected month background uses `#F0F1FF` (--color-bg-combobox-hover from RULE.md)
- Emits custom events for integration with parent components
- 4×3 grid layout for all 12 months
- Year navigation with blue arrow icons matching design system
