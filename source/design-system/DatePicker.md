---
name: DatePicker
category: forms
created: 2026-02-03T00:00:00.000Z
updated: 2026-02-04T00:00:00.000Z
status: approved
---

# DatePicker

## Preview
A date picker component with a white input textbox (blue border) and a dropdown calendar for date selection. Features interactive date selection that updates the input and closes the calendar, gray arrow navigation (blue on hover) for months, clickable month/year title to open MonthPicker, day headers starting Monday, and visual distinction between current, other month, and selected dates. Other month dates are clickable and automatically update the display month.

## Usage
Use this component for:
- Date selection in forms
- Booking and scheduling interfaces
- Event creation dialogs
- Filter date ranges

## HTML
```html
<div class="date-picker">
  <!-- Date Input Field -->
  <button class="date-picker__input" type="button">
    Feb 4, 2026
  </button>

  <!-- Calendar Dropdown -->
  <div class="date-picker__dropdown">
    <!-- Month/Year Header -->
    <div class="date-picker__header">
      <button class="date-picker__nav" type="button" aria-label="Previous month">
        <svg class="date-picker__chevron" viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 11L1 6l5-5" stroke="#728096" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button class="date-picker__title" type="button">February 2026</button>
      <button class="date-picker__nav" type="button" aria-label="Next month">
        <svg class="date-picker__chevron" viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1l5 5-5 5" stroke="#728096" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <!-- Day Headers -->
    <div class="date-picker__days-header">
      <div class="date-picker__day-label">MO</div>
      <div class="date-picker__day-label">TU</div>
      <div class="date-picker__day-label">WE</div>
      <div class="date-picker__day-label">TH</div>
      <div class="date-picker__day-label">FR</div>
      <div class="date-picker__day-label">SA</div>
      <div class="date-picker__day-label">SU</div>
    </div>

    <!-- Calendar Grid -->
    <div class="date-picker__grid">
      <!-- Days will be dynamically generated -->
    </div>
  </div>

  <!-- MonthPicker Dropdown -->
  <div class="date-picker__month-picker">
    <div class="date-picker__header">
      <button class="date-picker__nav" type="button" aria-label="Previous year">
        <svg class="date-picker__chevron" viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 11L1 6l5-5" stroke="#728096" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="date-picker__year-title">2026</div>
      <button class="date-picker__nav" type="button" aria-label="Next year">
        <svg class="date-picker__chevron" viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1l5 5-5 5" stroke="#728096" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
    <div class="date-picker__month-grid">
      <button class="date-picker__month" data-month="0">Jan</button>
      <button class="date-picker__month date-picker__month--selected" data-month="1">Feb</button>
      <button class="date-picker__month" data-month="2">Mar</button>
      <button class="date-picker__month" data-month="3">Apr</button>
      <button class="date-picker__month" data-month="4">May</button>
      <button class="date-picker__month" data-month="5">Jun</button>
      <button class="date-picker__month" data-month="6">Jul</button>
      <button class="date-picker__month" data-month="7">Aug</button>
      <button class="date-picker__month" data-month="8">Sep</button>
      <button class="date-picker__month" data-month="9">Oct</button>
      <button class="date-picker__month" data-month="10">Nov</button>
      <button class="date-picker__month" data-month="11">Dec</button>
    </div>
  </div>
</div>
```

## CSS
```css
.date-picker {
  position: relative;
  display: inline-block;
  font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin-bottom: 380px; /* Space for dropdown to display below input */
}

.date-picker__input {
  background-color: #ffffff;
  color: #141414;
  border: 1px solid #184EFF;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.date-picker__input:hover {
  border-color: #184EFF;
}

.date-picker__input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(24, 78, 255, 0.3);
}

.date-picker__dropdown,
.date-picker__month-picker {
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  min-width: 320px;
  z-index: 50;
  display: none;
}

.date-picker__dropdown.visible,
.date-picker__month-picker.visible {
  display: block;
}

.date-picker__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.date-picker__nav {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

/* Arrow buttons: NO background on hover, only icon color change */

.date-picker__nav svg path {
  stroke: #728096;
  transition: stroke 0.2s ease;
}

.date-picker__nav:hover svg path {
  stroke: #184EFF;
}

.date-picker__chevron {
  width: 14px;
  height: 20px;
}

.date-picker__title {
  font-size: 16px;
  font-weight: 600;
  color: #141414;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;
}

.date-picker__title:hover {
  color: #184EFF;
}

.date-picker__year-title {
  font-size: 20px;
  font-weight: 600;
  color: #141414;
  min-width: 80px;
  text-align: center;
}

.date-picker__days-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 8px;
}

.date-picker__day-label {
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  padding: 8px 0;
}

.date-picker__grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.date-picker__day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: 50%;
  font-size: 13px;
  font-weight: 500;
  color: #141414;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 36px;
  min-height: 36px;
}

.date-picker__day:hover:not(.date-picker__day--selected) {
  background-color: #f3f4f6;
}

.date-picker__day:focus {
  outline: none;
  box-shadow: 0 0 0 2px #184EFF;
}

.date-picker__day--other-month {
  color: #9ca3af;
}

.date-picker__day--selected {
  background-color: #184EFF;
  color: #ffffff;
}

.date-picker__day--selected:hover {
  background-color: #1241CC;
}

.date-picker__month-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.date-picker__month {
  padding: 10px 16px;
  background: none;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #141414;
  cursor: pointer;
  transition: all 0.2s ease;
}

.date-picker__month:hover:not(.date-picker__month--selected) {
  background-color: #f3f4f6;
}

.date-picker__month--selected {
  background-color: #F0F1FF;
}

.date-picker__month--selected:hover {
  background-color: #E0E2FF;
}
```

## JavaScript
```javascript
document.addEventListener('DOMContentLoaded', function() {
  // State
  let currentDate = new Date(2026, 1, 4); // Feb 4, 2026
  let displayMonth = 1; // February (0-indexed)
  let displayYear = 2026;

  // DOM Elements (using CSS class selectors matching ## HTML)
  const picker = document.querySelector('.date-picker');
  const dateInput = picker.querySelector('.date-picker__input');
  const calendarDropdown = picker.querySelector('.date-picker__dropdown');
  const monthPickerDropdown = picker.querySelector('.date-picker__month-picker');
  const calendarGrid = picker.querySelector('.date-picker__grid');

  // Calendar header elements
  const calendarHeader = calendarDropdown.querySelector('.date-picker__header');
  const calendarNavs = calendarHeader.querySelectorAll('.date-picker__nav');
  const prevMonthBtn = calendarNavs[0];
  const monthYearTitle = calendarHeader.querySelector('.date-picker__title');
  const nextMonthBtn = calendarNavs[1];

  // MonthPicker header elements
  const monthPickerHeader = monthPickerDropdown.querySelector('.date-picker__header');
  const monthPickerNavs = monthPickerHeader.querySelectorAll('.date-picker__nav');
  const prevYearBtn = monthPickerNavs[0];
  const yearTitle = monthPickerHeader.querySelector('.date-picker__year-title');
  const nextYearBtn = monthPickerNavs[1];

  // Toggle calendar dropdown
  dateInput.addEventListener('click', function(e) {
    e.stopPropagation();
    const isVisible = calendarDropdown.classList.contains('visible');
    if (isVisible) {
      calendarDropdown.classList.remove('visible');
    } else {
      monthPickerDropdown.classList.remove('visible');
      calendarDropdown.classList.add('visible');
      renderCalendar();
    }
  });

  // Toggle month picker
  monthYearTitle.addEventListener('click', function(e) {
    e.stopPropagation();
    calendarDropdown.classList.remove('visible');
    monthPickerDropdown.classList.add('visible');
    yearTitle.textContent = displayYear;
  });

  // Month navigation - Previous
  prevMonthBtn.addEventListener('click', function() {
    displayMonth--;
    if (displayMonth < 0) {
      displayMonth = 11;
      displayYear--;
    }
    renderCalendar();
  });

  // Month navigation - Next
  nextMonthBtn.addEventListener('click', function() {
    displayMonth++;
    if (displayMonth > 11) {
      displayMonth = 0;
      displayYear++;
    }
    renderCalendar();
  });

  // Year navigation - Previous
  prevYearBtn.addEventListener('click', function() {
    displayYear--;
    yearTitle.textContent = displayYear;
  });

  // Year navigation - Next
  nextYearBtn.addEventListener('click', function() {
    displayYear++;
    yearTitle.textContent = displayYear;
  });

  // Month selection in MonthPicker
  const monthButtons = monthPickerDropdown.querySelectorAll('.date-picker__month');
  monthButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      // Remove selected state from all
      monthButtons.forEach(b => b.classList.remove('date-picker__month--selected'));

      // Add selected state
      this.classList.add('date-picker__month--selected');

      // Update display month
      displayMonth = parseInt(this.dataset.month);

      // Close month picker and show calendar
      monthPickerDropdown.classList.remove('visible');
      calendarDropdown.classList.add('visible');
      renderCalendar();
    });
  });

  // Render calendar
  function renderCalendar() {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];

    monthYearTitle.textContent = `${monthNames[displayMonth]} ${displayYear}`;

    // Calculate first day and days in month
    const firstDay = new Date(displayYear, displayMonth, 1).getDay();
    const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(displayYear, displayMonth, 0).getDate();

    // Adjust for Monday start (0 = Monday, 6 = Sunday)
    const startDay = firstDay === 0 ? 6 : firstDay - 1;

    // Clear grid
    calendarGrid.innerHTML = '';

    // Previous month days
    for (let i = startDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const btn = createDayButton(day, true, false, -1);
      calendarGrid.appendChild(btn);
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const isSelected = (day === currentDate.getDate() &&
                         displayMonth === currentDate.getMonth() &&
                         displayYear === currentDate.getFullYear());
      const btn = createDayButton(day, false, isSelected, 0);
      calendarGrid.appendChild(btn);
    }

    // Next month days
    const totalCells = calendarGrid.children.length;
    const remainingCells = 42 - totalCells; // 6 rows × 7 days
    for (let day = 1; day <= remainingCells; day++) {
      const btn = createDayButton(day, true, false, 1);
      calendarGrid.appendChild(btn);
    }
  }

  // Create day button
  function createDayButton(day, isOtherMonth, isSelected = false, monthOffset = 0) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = day;
    btn.className = 'date-picker__day';

    if (isSelected) {
      btn.classList.add('date-picker__day--selected');
      btn.setAttribute('aria-current', 'date');
    } else if (isOtherMonth) {
      btn.classList.add('date-picker__day--other-month');
    }

    // Add click handler for ALL dates (including other month dates)
    btn.addEventListener('click', function() {
      let targetMonth = displayMonth + monthOffset;
      let targetYear = displayYear;

      if (targetMonth < 0) {
        targetMonth = 11;
        targetYear--;
      } else if (targetMonth > 11) {
        targetMonth = 0;
        targetYear++;
      }

      currentDate = new Date(targetYear, targetMonth, day);
      displayMonth = targetMonth;
      displayYear = targetYear;
      updateDateInput();
      calendarDropdown.classList.remove('visible');
    });

    return btn;
  }

  // Update date input
  function updateDateInput() {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formatted = `${monthNames[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;
    dateInput.textContent = formatted;
  }

  // Close on outside click
  document.addEventListener('click', function(e) {
    if (!picker.contains(e.target)) {
      calendarDropdown.classList.remove('visible');
      monthPickerDropdown.classList.remove('visible');
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      calendarDropdown.classList.remove('visible');
      monthPickerDropdown.classList.remove('visible');
    }
  });

  // Initial render
  renderCalendar();
});
```

## Component States
| State | Trigger | Visual Changes | Tailwind Classes |
|-------|---------|----------------|------------------|
| Default | - | White input with blue border | `bg-white border-[#184EFF]` |
| Calendar Open | Click input | Show calendar dropdown | `.date-picker__dropdown.visible` |
| MonthPicker Open | Click month/year title | Show month picker | `.date-picker__month-picker.visible` |
| Date Selected | Click date | Blue background, white text | `bg-[#184EFF] text-white` |
| Date Hover | Mouse over date | Gray background | `hover:bg-gray-100` |
| Month/Year Hover | Mouse over title | Blue text | `hover:text-[#184EFF]` |
| Arrow Hover | Mouse over arrow | Blue stroke only (no bg) | `group-hover:stroke-[#184EFF]` |

## Accessibility
- Use `role="dialog"` on dropdown with `aria-label="Choose date"`
- Add `aria-label` to navigation buttons ("Previous month", "Next month", "Previous year", "Next year")
- Use `aria-current="date"` on selected date
- Support keyboard navigation (arrow keys for date selection, Escape to close)
- Trap focus within dropdown when open
- Close on Escape key
- MonthPicker title is clickable and has hover state for discoverability

## Notes
- Generated from image on 2026-02-03, updated 2026-02-04
- Week starts on Monday (MO, TU, WE, TH, FR, SA, SU)
- Input uses white background with 1px blue border (#184EFF per RULE.md)
- Selected date uses circular blue highlight (#184EFF)
- Previous/next month dates shown in light gray (#9ca3af) and are clickable
- Clicking dates from other months: updates selected date, changes display month, closes calendar
- Calendar dropdown positioned below input with shadow
- Arrow icons: gray (#728096) by default, blue (#184EFF) on hover
- MonthPicker integration for quick month selection
- Date selection updates input and closes calendar automatically
- Month navigation with arrow buttons
- Year navigation in MonthPicker
- Selected month in MonthPicker uses #F0F1FF background (from RULE.md)
- Updated to follow RULE.md styling guidelines
