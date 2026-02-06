---
name: WeekPicker
category: forms
created: 2026-02-04T07:30:00.000Z
updated: 2026-02-05T10:45:00.000Z
status: approved
---

# WeekPicker

## Preview
A week picker component with date range display, navigation arrows, and calendar dropdown for week selection. Features interactive arrow navigation (previous/next week), clickable date range to open calendar, seamless week range highlighting in light blue (#F0F1FF) with no gaps between dates, and MonthPicker integration. Supports weeks spanning 2 months with continuous highlighting. Arrows and text turn blue (#184EFF) on hover.

## Usage
Use this component for:
- Week-based scheduling and planning
- Weekly report date selection
- Work schedule planners
- Week range filtering in analytics
- Booking systems with weekly intervals

## HTML
```html
<div class="week-picker">
  <!-- Week Input Display -->
  <div class="week-picker__display">
    <!-- Previous Week Arrow -->
    <button class="week-picker__arrow" type="button" aria-label="Previous week">
      <svg class="week-picker__arrow-icon" viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 11L1 6l5-5" stroke="#728096" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>

    <!-- Calendar Icon -->
    <svg class="week-picker__calendar-icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" fill="#728096"/>
    </svg>

    <!-- Date Range (Clickable) -->
    <button class="week-picker__date-range" type="button">
      Feb 2 - Feb 15
    </button>

    <!-- Next Week Arrow -->
    <button class="week-picker__arrow" type="button" aria-label="Next week">
      <svg class="week-picker__arrow-icon" viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1l5 5-5 5" stroke="#728096" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
  </div>

  <!-- Calendar Dropdown -->
  <div class="week-picker__dropdown">
    <!-- Month/Year Header -->
    <div class="week-picker__header">
      <button class="week-picker__nav" type="button" aria-label="Previous month">
        <svg class="week-picker__chevron" viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 11L1 6l5-5" stroke="#728096" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button class="week-picker__title" type="button">February 2026</button>
      <button class="week-picker__nav" type="button" aria-label="Next month">
        <svg class="week-picker__chevron" viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1l5 5-5 5" stroke="#728096" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>

    <!-- Day Headers -->
    <div class="week-picker__days-header">
      <div class="week-picker__day-label">MO</div>
      <div class="week-picker__day-label">TU</div>
      <div class="week-picker__day-label">WE</div>
      <div class="week-picker__day-label">TH</div>
      <div class="week-picker__day-label">FR</div>
      <div class="week-picker__day-label">SA</div>
      <div class="week-picker__day-label">SU</div>
    </div>

    <!-- Calendar Grid -->
    <div class="week-picker__grid">
      <!-- Days will be dynamically generated -->
    </div>
  </div>

  <!-- MonthPicker Dropdown -->
  <div class="week-picker__month-picker">
    <div class="week-picker__header">
      <button class="week-picker__nav" type="button" aria-label="Previous year">
        <svg class="week-picker__chevron" viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 11L1 6l5-5" stroke="#728096" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="week-picker__year-title">2026</div>
      <button class="week-picker__nav" type="button" aria-label="Next year">
        <svg class="week-picker__chevron" viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1l5 5-5 5" stroke="#728096" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
    </div>
    <div class="week-picker__month-grid">
      <button class="week-picker__month" data-month="0">Jan</button>
      <button class="week-picker__month week-picker__month--selected" data-month="1">Feb</button>
      <button class="week-picker__month" data-month="2">Mar</button>
      <button class="week-picker__month" data-month="3">Apr</button>
      <button class="week-picker__month" data-month="4">May</button>
      <button class="week-picker__month" data-month="5">Jun</button>
      <button class="week-picker__month" data-month="6">Jul</button>
      <button class="week-picker__month" data-month="7">Aug</button>
      <button class="week-picker__month" data-month="8">Sep</button>
      <button class="week-picker__month" data-month="9">Oct</button>
      <button class="week-picker__month" data-month="10">Nov</button>
      <button class="week-picker__month" data-month="11">Dec</button>
    </div>
  </div>
</div>
```

## CSS
```css
.week-picker {
  position: relative;
  display: inline-block;
  font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  margin-bottom: 380px; /* Space for dropdown to display below input */
}

/* Week Display */
.week-picker__display {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.week-picker__arrow {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.week-picker__arrow:hover svg path {
  stroke: #184EFF;
}

.week-picker__arrow-icon {
  width: 14px;
  height: 20px;
}

.week-picker__calendar-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.week-picker__date-range {
  font-size: 13px;
  font-weight: 500;
  color: #141414;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s ease;
  white-space: nowrap;
}

.week-picker__date-range:hover {
  color: #184EFF;
}

/* Calendar Dropdown */
.week-picker__dropdown,
.week-picker__month-picker {
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

.week-picker__dropdown.visible,
.week-picker__month-picker.visible {
  display: block;
}

.week-picker__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.week-picker__nav {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

/* Arrow buttons: NO background on hover, only icon color change */

.week-picker__nav svg path {
  stroke: #728096;
  transition: stroke 0.2s ease;
}

.week-picker__nav:hover svg path {
  stroke: #184EFF;
}

.week-picker__chevron {
  width: 14px;
  height: 20px;
}

.week-picker__title {
  font-size: 16px;
  font-weight: 600;
  color: #141414;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;
}

.week-picker__title:hover {
  color: #184EFF;
}

.week-picker__year-title {
  font-size: 20px;
  font-weight: 600;
  color: #141414;
  min-width: 80px;
  text-align: center;
}

.week-picker__days-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0;
  margin-bottom: 8px;
}

.week-picker__day-label {
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  padding: 8px 0;
}

/* Seamless week selection - no gaps */
.week-picker__grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0;
}

.week-picker__day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  font-size: 13px;
  font-weight: 500;
  color: #141414;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 40px;
  min-height: 40px;
  position: relative;
}

.week-picker__day:hover:not(.week-picker__day--selected) {
  background-color: #f3f4f6;
  border-radius: 6px;
}

.week-picker__day:focus {
  outline: none;
  box-shadow: 0 0 0 2px #184EFF;
  border-radius: 6px;
}

.week-picker__day--other-month {
  color: #9ca3af;
}

/* Seamless selected week highlighting */
.week-picker__day--selected {
  background-color: #F0F1FF;
  color: #141414;
}

.week-picker__day--selected:hover {
  background-color: #E0E2FF;
}

/* Rounded corners only on week start (Monday) and end (Sunday) */
.week-picker__day--selected.week-picker__day--start {
  border-top-left-radius: 6px;
  border-bottom-left-radius: 6px;
}

.week-picker__day--selected.week-picker__day--end {
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
}

.week-picker__day--selected:not(.week-picker__day--start):not(.week-picker__day--end) {
  border-radius: 0;
}

/* MonthPicker */
.week-picker__month-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
}

.week-picker__month {
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

.week-picker__month:hover:not(.week-picker__month--selected) {
  background-color: #f3f4f6;
}

.week-picker__month--selected {
  background-color: #F0F1FF;
}

.week-picker__month--selected:hover {
  background-color: #E0E2FF;
}
```

## JavaScript
```javascript
document.addEventListener('DOMContentLoaded', function() {
  // State
  let currentWeekStart = new Date(2026, 1, 2); // Feb 2, 2026 (Monday)
  let displayMonth = 1; // February (0-indexed)
  let displayYear = 2026;

  // DOM Elements (using CSS class selectors matching ## HTML)
  const picker = document.querySelector('.week-picker');
  const display = picker.querySelector('.week-picker__display');
  const arrows = display.querySelectorAll('.week-picker__arrow');
  const prevWeekBtn = arrows[0];
  const dateRangeBtn = display.querySelector('.week-picker__date-range');
  const nextWeekBtn = arrows[1];

  const calendarDropdown = picker.querySelector('.week-picker__dropdown');
  const monthPickerDropdown = picker.querySelector('.week-picker__month-picker');
  const calendarGrid = picker.querySelector('.week-picker__grid');

  // Calendar header elements
  const calendarHeader = calendarDropdown.querySelector('.week-picker__header');
  const calendarNavs = calendarHeader.querySelectorAll('.week-picker__nav');
  const prevMonthBtn = calendarNavs[0];
  const monthYearTitle = calendarHeader.querySelector('.week-picker__title');
  const nextMonthBtn = calendarNavs[1];

  // MonthPicker header elements
  const monthPickerHeader = monthPickerDropdown.querySelector('.week-picker__header');
  const monthPickerNavs = monthPickerHeader.querySelectorAll('.week-picker__nav');
  const prevYearBtn = monthPickerNavs[0];
  const yearTitle = monthPickerHeader.querySelector('.week-picker__year-title');
  const nextYearBtn = monthPickerNavs[1];

  // Helper: Get Monday of week
  function getMondayOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  // Helper: Format date range
  function formatWeekRange(startDate) {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);

    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const startMonth = monthNames[startDate.getMonth()];
    const endMonth = monthNames[endDate.getMonth()];
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();

    if (startDate.getMonth() === endDate.getMonth()) {
      return `${startMonth} ${startDay} - ${endDay}`;
    } else {
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
    }
  }

  // Update date range display
  function updateDateRange() {
    dateRangeBtn.textContent = formatWeekRange(currentWeekStart);
  }

  // Previous week
  prevWeekBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    currentWeekStart.setDate(currentWeekStart.getDate() - 7);
    updateDateRange();
    if (calendarDropdown.classList.contains('visible')) {
      renderCalendar();
    }
  });

  // Next week
  nextWeekBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    updateDateRange();
    if (calendarDropdown.classList.contains('visible')) {
      renderCalendar();
    }
  });

  // Toggle calendar dropdown
  dateRangeBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    const isVisible = calendarDropdown.classList.contains('visible');
    if (isVisible) {
      calendarDropdown.classList.remove('visible');
    } else {
      monthPickerDropdown.classList.remove('visible');
      calendarDropdown.classList.add('visible');
      displayMonth = currentWeekStart.getMonth();
      displayYear = currentWeekStart.getFullYear();
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
  const monthButtons = monthPickerDropdown.querySelectorAll('.week-picker__month');
  monthButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      // Remove selected state from all
      monthButtons.forEach(b => b.classList.remove('week-picker__month--selected'));

      // Add selected state
      this.classList.add('week-picker__month--selected');

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

    // Get selected week Monday and Sunday
    const selectedMonday = getMondayOfWeek(currentWeekStart);
    const selectedSunday = new Date(selectedMonday);
    selectedSunday.setDate(selectedSunday.getDate() + 6);

    // Previous month days
    for (let i = startDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const date = new Date(displayYear, displayMonth - 1, day);
      const isInSelectedWeek = date >= selectedMonday && date <= selectedSunday;
      const isWeekStart = date.getTime() === selectedMonday.getTime();
      const isWeekEnd = date.getTime() === selectedSunday.getTime();
      const btn = createDayButton(day, date, true, isInSelectedWeek, isWeekStart, isWeekEnd);
      calendarGrid.appendChild(btn);
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(displayYear, displayMonth, day);
      const isInSelectedWeek = date >= selectedMonday && date <= selectedSunday;
      const isWeekStart = date.getTime() === selectedMonday.getTime();
      const isWeekEnd = date.getTime() === selectedSunday.getTime();
      const btn = createDayButton(day, date, false, isInSelectedWeek, isWeekStart, isWeekEnd);
      calendarGrid.appendChild(btn);
    }

    // Next month days
    const totalCells = calendarGrid.children.length;
    const remainingCells = 42 - totalCells; // 6 rows × 7 days
    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(displayYear, displayMonth + 1, day);
      const isInSelectedWeek = date >= selectedMonday && date <= selectedSunday;
      const isWeekStart = date.getTime() === selectedMonday.getTime();
      const isWeekEnd = date.getTime() === selectedSunday.getTime();
      const btn = createDayButton(day, date, true, isInSelectedWeek, isWeekStart, isWeekEnd);
      calendarGrid.appendChild(btn);
    }
  }

  // Create day button with seamless selection support
  function createDayButton(day, date, isOtherMonth, isSelected, isWeekStart, isWeekEnd) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = day;
    btn.className = 'week-picker__day';

    if (isOtherMonth) {
      btn.classList.add('week-picker__day--other-month');
    }

    if (isSelected) {
      btn.classList.add('week-picker__day--selected');
      if (isWeekStart) btn.classList.add('week-picker__day--start');
      if (isWeekEnd) btn.classList.add('week-picker__day--end');
    }

    // Add click handler - select entire week
    btn.addEventListener('click', function() {
      const clickedDate = new Date(date);
      const weekMonday = getMondayOfWeek(clickedDate);
      currentWeekStart = weekMonday;

      // Update display month if clicked on other month
      if (isOtherMonth) {
        displayMonth = date.getMonth();
        displayYear = date.getFullYear();
      }

      updateDateRange();
      renderCalendar();
    });

    return btn;
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
    } else if (e.key === 'ArrowLeft' && calendarDropdown.classList.contains('visible')) {
      prevWeekBtn.click();
    } else if (e.key === 'ArrowRight' && calendarDropdown.classList.contains('visible')) {
      nextWeekBtn.click();
    }
  });

  // Initial render
  updateDateRange();
  renderCalendar();
});
```

## Component States
| State | Trigger | Visual Changes | Tailwind Classes |
|-------|---------|----------------|------------------|
| Default | - | Black text, gray arrows and icon | `text-[#141414]` arrows `stroke-[#728096]` |
| Date Range Hover | Mouse over date range | Blue text | `hover:text-[#184EFF]` |
| Arrow Hover | Mouse over arrows | Blue stroke | `group-hover:stroke-[#184EFF]` |
| Calendar Open | Click date range | Show calendar dropdown | `.week-picker__dropdown.visible` |
| Week Selected | Click any date in calendar | Entire week (Mon-Sun) highlighted | `bg-[#F0F1FF]` |
| Month/Year Hover | Mouse over title | Blue text | `hover:text-[#184EFF]` |
| MonthPicker Open | Click month/year title | Show MonthPicker | `.week-picker__month-picker.visible` |

## Accessibility
- Use `aria-label` on navigation buttons ("Previous week", "Next week", "Previous month", "Next month", "Previous year", "Next year")
- Support keyboard navigation (Arrow Left/Right for week navigation, Escape to close)
- Use semantic button elements for all interactive controls
- Ensure sufficient color contrast (WCAG AA compliant)
- Announce week range changes to screen readers
- Use `role="dialog"` on dropdown with `aria-label="Choose week"`

## Notes
- Generated on 2026-02-04 (GMT+7)
- Updated on 2026-02-05 (GMT+7) - Added seamless week highlighting
- Week range always Monday-Sunday (ISO 8601 standard)
- Follows RULE.md styling guidelines
- Date range text: black (#141414) default, blue (#184EFF) on hover
- Navigation arrows: gray (#728096) default, blue (#184EFF) on hover
- Selected week background uses #F0F1FF (--color-bg-combobox-hover from RULE.md)
- Calendar icon uses gray fill (#728096)
- MonthPicker integration for quick month selection
- Week selection: clicking any date selects entire week (Monday to Sunday)
- **Seamless highlighting**: No gaps between selected dates (gap: 0 in grid)
- **Cross-month seamless**: Week highlighting continues across 2 months (e.g., Jan 27 - Feb 2)
- Rounded corners only on Monday (left) and Sunday (right) for seamless appearance
- Arrow navigation changes week by 7 days
- Calendar dropdown positioned below input with shadow
- Clicking dates from other months: selects week and updates display month
