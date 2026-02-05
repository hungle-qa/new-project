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

## Features
- **Week Navigation**: Click `<` and `>` arrows to navigate previous/next week
- **Date Range Display**: Shows "Feb 2 - Feb 15" format (Monday-Sunday)
- **Calendar Dropdown**: Click date range to open calendar for week selection
- **Seamless Week Selection**: Click any date in calendar → selects entire week (Mon-Sun) with seamless light blue highlight (no gaps)
- **Cross-Month Support**: Week highlighting continues seamlessly across 2 months (e.g., Jan 27 - Feb 2)
- **MonthPicker Integration**: Click month/year title to open MonthPicker for quick month navigation
- **Hover States**: Date range text and arrows turn blue (#184EFF) on hover
- **Keyboard Support**: Arrow keys for navigation, Enter to select, Escape to close

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
  font-size: 14px;
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
  font-size: 14px;
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
  font-size: 14px;
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

## Tailwind CSS
```html
<div class="relative inline-block font-['Open_Sans']">
  <!-- Week Input Display -->
  <div class="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md">
    <!-- Previous Week Arrow -->
    <button id="prevWeek" type="button" class="group p-1 hover:opacity-100 transition-all" aria-label="Previous week">
      <svg class="w-3.5 h-5" viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 11L1 6l5-5" stroke="#728096" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" class="group-hover:stroke-[#184EFF] transition-colors"/>
      </svg>
    </button>

    <!-- Calendar Icon -->
    <svg class="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" fill="#728096"/>
    </svg>

    <!-- Date Range (Clickable) -->
    <button id="weekDateRange" type="button" class="text-sm font-medium text-[#141414] hover:text-[#184EFF] transition-colors whitespace-nowrap">
      Feb 2 - Feb 15
    </button>

    <!-- Next Week Arrow -->
    <button id="nextWeek" type="button" class="group p-1 hover:opacity-100 transition-all" aria-label="Next week">
      <svg class="w-3.5 h-5" viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1l5 5-5 5" stroke="#728096" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" class="group-hover:stroke-[#184EFF] transition-colors"/>
      </svg>
    </button>
  </div>

  <!-- Calendar Dropdown -->
  <div id="weekCalendarDropdown" class="hidden absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-xl shadow-xl p-5 min-w-[320px] z-50">
    <!-- Month/Year Header with Navigation -->
    <div class="flex items-center justify-between mb-5">
      <!-- Previous Month Button -->
      <button id="prevMonthWeek" type="button" class="group p-2 transition-all" aria-label="Previous month">
        <svg class="w-3.5 h-5" viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 11L1 6l5-5" stroke="#728096" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" class="group-hover:stroke-[#184EFF] transition-colors"/>
        </svg>
      </button>

      <!-- Month/Year Title (Clickable to open MonthPicker) -->
      <button id="monthYearTitleWeek" type="button" class="text-base font-semibold text-[#141414] hover:text-[#184EFF] transition-colors">
        February 2026
      </button>

      <!-- Next Month Button -->
      <button id="nextMonthWeek" type="button" class="group p-2 transition-all" aria-label="Next month">
        <svg class="w-3.5 h-5" viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1l5 5-5 5" stroke="#728096" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" class="group-hover:stroke-[#184EFF] transition-colors"/>
        </svg>
      </button>
    </div>

    <!-- Day Headers -->
    <div class="grid grid-cols-7 gap-0 mb-2">
      <div class="text-center text-xs font-semibold text-gray-500 uppercase py-2">MO</div>
      <div class="text-center text-xs font-semibold text-gray-500 uppercase py-2">TU</div>
      <div class="text-center text-xs font-semibold text-gray-500 uppercase py-2">WE</div>
      <div class="text-center text-xs font-semibold text-gray-500 uppercase py-2">TH</div>
      <div class="text-center text-xs font-semibold text-gray-500 uppercase py-2">FR</div>
      <div class="text-center text-xs font-semibold text-gray-500 uppercase py-2">SA</div>
      <div class="text-center text-xs font-semibold text-gray-500 uppercase py-2">SU</div>
    </div>

    <!-- Calendar Grid (gap-0 for seamless week highlighting) -->
    <div id="weekCalendarGrid" class="grid grid-cols-7 gap-0">
      <!-- Days will be dynamically generated by JavaScript -->
    </div>
  </div>

  <!-- MonthPicker Dropdown -->
  <div id="weekMonthPickerDropdown" class="hidden absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-xl shadow-xl p-5 min-w-[320px] z-50">
    <!-- Year Header with Navigation -->
    <div class="flex items-center justify-center gap-4 mb-5">
      <!-- Previous Year Button -->
      <button id="prevYearWeek" type="button" class="group p-2 transition-all" aria-label="Previous year">
        <svg class="w-3.5 h-5" viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 11L1 6l5-5" stroke="#728096" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" class="group-hover:stroke-[#184EFF] transition-colors"/>
        </svg>
      </button>

      <!-- Year Title -->
      <div id="yearTitleWeek" class="text-xl font-semibold text-[#141414] min-w-[80px] text-center">
        2026
      </div>

      <!-- Next Year Button -->
      <button id="nextYearWeek" type="button" class="group p-2 transition-all" aria-label="Next year">
        <svg class="w-3.5 h-5" viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 1l5 5-5 5" stroke="#728096" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" class="group-hover:stroke-[#184EFF] transition-colors"/>
        </svg>
      </button>
    </div>

    <!-- Month Grid (4 columns × 3 rows) -->
    <div class="grid grid-cols-4 gap-2">
      <button class="week-month-btn px-4 py-2.5 text-sm font-medium text-[#141414] rounded-lg hover:bg-gray-100 transition-colors" data-month="0">Jan</button>
      <button class="week-month-btn px-4 py-2.5 text-sm font-medium text-[#141414] bg-[#F0F1FF] rounded-lg hover:bg-[#E0E2FF] transition-colors" data-month="1">Feb</button>
      <button class="week-month-btn px-4 py-2.5 text-sm font-medium text-[#141414] rounded-lg hover:bg-gray-100 transition-colors" data-month="2">Mar</button>
      <button class="week-month-btn px-4 py-2.5 text-sm font-medium text-[#141414] rounded-lg hover:bg-gray-100 transition-colors" data-month="3">Apr</button>

      <button class="week-month-btn px-4 py-2.5 text-sm font-medium text-[#141414] rounded-lg hover:bg-gray-100 transition-colors" data-month="4">May</button>
      <button class="week-month-btn px-4 py-2.5 text-sm font-medium text-[#141414] rounded-lg hover:bg-gray-100 transition-colors" data-month="5">Jun</button>
      <button class="week-month-btn px-4 py-2.5 text-sm font-medium text-[#141414] rounded-lg hover:bg-gray-100 transition-colors" data-month="6">Jul</button>
      <button class="week-month-btn px-4 py-2.5 text-sm font-medium text-[#141414] rounded-lg hover:bg-gray-100 transition-colors" data-month="7">Aug</button>

      <button class="week-month-btn px-4 py-2.5 text-sm font-medium text-[#141414] rounded-lg hover:bg-gray-100 transition-colors" data-month="8">Sep</button>
      <button class="week-month-btn px-4 py-2.5 text-sm font-medium text-[#141414] rounded-lg hover:bg-gray-100 transition-colors" data-month="9">Oct</button>
      <button class="week-month-btn px-4 py-2.5 text-sm font-medium text-[#141414] rounded-lg hover:bg-gray-100 transition-colors" data-month="10">Nov</button>
      <button class="week-month-btn px-4 py-2.5 text-sm font-medium text-[#141414] rounded-lg hover:bg-gray-100 transition-colors" data-month="11">Dec</button>
    </div>
  </div>
</div>
```

## JavaScript
```javascript
document.addEventListener('DOMContentLoaded', function() {
  // State
  let currentWeekStart = new Date(2026, 1, 2); // Feb 2, 2026 (Monday)
  let displayMonth = 1; // February (0-indexed)
  let displayYear = 2026;

  // DOM Elements
  const weekDateRange = document.getElementById('weekDateRange');
  const prevWeek = document.getElementById('prevWeek');
  const nextWeek = document.getElementById('nextWeek');
  const weekCalendarDropdown = document.getElementById('weekCalendarDropdown');
  const weekMonthPickerDropdown = document.getElementById('weekMonthPickerDropdown');
  const monthYearTitleWeek = document.getElementById('monthYearTitleWeek');
  const yearTitleWeek = document.getElementById('yearTitleWeek');
  const weekCalendarGrid = document.getElementById('weekCalendarGrid');

  const prevMonthWeek = document.getElementById('prevMonthWeek');
  const nextMonthWeek = document.getElementById('nextMonthWeek');
  const prevYearWeek = document.getElementById('prevYearWeek');
  const nextYearWeek = document.getElementById('nextYearWeek');

  // Helper: Get Monday of week
  function getMondayOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(d.setDate(diff));
  }

  // Helper: Format date range
  function formatWeekRange(startDate) {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6); // Sunday

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
    weekDateRange.textContent = formatWeekRange(currentWeekStart);
  }

  // Previous week
  prevWeek.addEventListener('click', function() {
    currentWeekStart.setDate(currentWeekStart.getDate() - 7);
    updateDateRange();
    if (!weekCalendarDropdown.classList.contains('hidden')) {
      renderCalendar();
    }
  });

  // Next week
  nextWeek.addEventListener('click', function() {
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    updateDateRange();
    if (!weekCalendarDropdown.classList.contains('hidden')) {
      renderCalendar();
    }
  });

  // Toggle calendar dropdown
  weekDateRange.addEventListener('click', function() {
    const isHidden = weekCalendarDropdown.classList.contains('hidden');
    weekCalendarDropdown.classList.toggle('hidden', !isHidden);
    weekMonthPickerDropdown.classList.add('hidden');
    if (isHidden) {
      displayMonth = currentWeekStart.getMonth();
      displayYear = currentWeekStart.getFullYear();
      renderCalendar();
    }
  });

  // Toggle month picker
  monthYearTitleWeek.addEventListener('click', function(e) {
    e.stopPropagation();
    weekCalendarDropdown.classList.add('hidden');
    weekMonthPickerDropdown.classList.remove('hidden');
    yearTitleWeek.textContent = displayYear;
  });

  // Month navigation - Previous
  prevMonthWeek.addEventListener('click', function() {
    displayMonth--;
    if (displayMonth < 0) {
      displayMonth = 11;
      displayYear--;
    }
    renderCalendar();
  });

  // Month navigation - Next
  nextMonthWeek.addEventListener('click', function() {
    displayMonth++;
    if (displayMonth > 11) {
      displayMonth = 0;
      displayYear++;
    }
    renderCalendar();
  });

  // Year navigation - Previous
  prevYearWeek.addEventListener('click', function() {
    displayYear--;
    yearTitleWeek.textContent = displayYear;
  });

  // Year navigation - Next
  nextYearWeek.addEventListener('click', function() {
    displayYear++;
    yearTitleWeek.textContent = displayYear;
  });

  // Month selection in MonthPicker
  const monthButtons = document.querySelectorAll('.week-month-btn');
  monthButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      // Remove selected state from all
      monthButtons.forEach(b => {
        b.classList.remove('bg-[#F0F1FF]', 'hover:bg-[#E0E2FF]');
        b.classList.add('hover:bg-gray-100');
      });

      // Add selected state
      this.classList.add('bg-[#F0F1FF]', 'hover:bg-[#E0E2FF]');
      this.classList.remove('hover:bg-gray-100');

      // Update display month
      displayMonth = parseInt(this.dataset.month);

      // Close month picker and show calendar
      weekMonthPickerDropdown.classList.add('hidden');
      weekCalendarDropdown.classList.remove('hidden');
      renderCalendar();
    });
  });

  // Render calendar
  function renderCalendar() {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];

    monthYearTitleWeek.textContent = `${monthNames[displayMonth]} ${displayYear}`;

    // Calculate first day and days in month
    const firstDay = new Date(displayYear, displayMonth, 1).getDay();
    const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(displayYear, displayMonth, 0).getDate();

    // Adjust for Monday start (0 = Monday, 6 = Sunday)
    const startDay = firstDay === 0 ? 6 : firstDay - 1;

    // Clear grid
    weekCalendarGrid.innerHTML = '';

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
      weekCalendarGrid.appendChild(btn);
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(displayYear, displayMonth, day);
      const isInSelectedWeek = date >= selectedMonday && date <= selectedSunday;
      const isWeekStart = date.getTime() === selectedMonday.getTime();
      const isWeekEnd = date.getTime() === selectedSunday.getTime();
      const btn = createDayButton(day, date, false, isInSelectedWeek, isWeekStart, isWeekEnd);
      weekCalendarGrid.appendChild(btn);
    }

    // Next month days
    const totalCells = weekCalendarGrid.children.length;
    const remainingCells = 42 - totalCells; // 6 rows × 7 days
    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(displayYear, displayMonth + 1, day);
      const isInSelectedWeek = date >= selectedMonday && date <= selectedSunday;
      const isWeekStart = date.getTime() === selectedMonday.getTime();
      const isWeekEnd = date.getTime() === selectedSunday.getTime();
      const btn = createDayButton(day, date, true, isInSelectedWeek, isWeekStart, isWeekEnd);
      weekCalendarGrid.appendChild(btn);
    }
  }

  // Create day button with seamless selection support
  function createDayButton(day, date, isOtherMonth, isSelected = false, isWeekStart = false, isWeekEnd = false) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = day;

    let classes = 'aspect-square flex items-center justify-center text-sm font-medium transition-all min-w-[40px] min-h-[40px] relative';

    if (isSelected) {
      classes += ' week-picker__day--selected bg-[#F0F1FF] text-[#141414] hover:bg-[#E0E2FF]';
      if (isWeekStart) {
        classes += ' week-picker__day--start rounded-l-md';
      }
      if (isWeekEnd) {
        classes += ' week-picker__day--end rounded-r-md';
      }
      if (!isWeekStart && !isWeekEnd) {
        classes += ' rounded-none';
      }
    } else {
      if (isOtherMonth) {
        classes += ' text-gray-400 hover:bg-gray-100 hover:rounded-md';
      } else {
        classes += ' text-[#141414] hover:bg-gray-100 hover:rounded-md';
      }
    }

    btn.className = classes;

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
    const picker = weekDateRange.closest('.relative') || weekDateRange.parentElement;
    if (!picker.contains(e.target)) {
      weekCalendarDropdown.classList.add('hidden');
      weekMonthPickerDropdown.classList.add('hidden');
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      weekCalendarDropdown.classList.add('hidden');
      weekMonthPickerDropdown.classList.add('hidden');
    } else if (e.key === 'ArrowLeft' && !weekCalendarDropdown.classList.contains('hidden')) {
      prevWeek.click();
    } else if (e.key === 'ArrowRight' && !weekCalendarDropdown.classList.contains('hidden')) {
      nextWeek.click();
    }
  });

  // Initial render
  updateDateRange();
  renderCalendar();
});
```

## Props/Variants
| Variant | Tailwind Classes | Description |
|---------|------------------|-------------|
| Date Range Display | `flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-md` | Input container with arrows and calendar icon |
| Date Range Text | `text-sm font-medium text-[#141414] hover:text-[#184EFF]` | Black text, blue on hover |
| Navigation Arrow | `w-3.5 h-5 stroke-[#728096] group-hover:stroke-[#184EFF]` | Gray arrows, blue on hover |
| Calendar Icon | `w-[18px] h-[18px]` | Calendar icon with gray fill |
| Calendar Dropdown | `bg-white border border-gray-200 rounded-xl shadow-xl p-5 min-w-[320px]` | Calendar container |
| Day (Default) | `text-[#141414] hover:bg-gray-100` | Default day button |
| Day (Other Month) | `text-gray-400 hover:bg-gray-100` | Gray text for previous/next month dates |
| Day (Selected Week) | `bg-[#F0F1FF] text-[#141414] hover:bg-[#E0E2FF]` | Light blue background for selected week |
| Month Button | `px-4 py-2.5 text-sm font-medium text-[#141414] rounded-lg hover:bg-gray-100` | Month button in MonthPicker |
| Month (Selected) | `bg-[#F0F1FF] hover:bg-[#E0E2FF]` | Selected month in MonthPicker |

## Component States
| State | Trigger | Visual Changes | Tailwind Classes |
|-------|---------|----------------|------------------|
| Default | - | Black text, gray arrows and icon | `text-[#141414]` arrows `stroke-[#728096]` |
| Date Range Hover | Mouse over date range | Blue text | `hover:text-[#184EFF]` |
| Arrow Hover | Mouse over arrows | Blue stroke | `group-hover:stroke-[#184EFF]` |
| Calendar Open | Click date range | Show calendar dropdown | `weekCalendarDropdown.classList.remove('hidden')` |
| Week Selected | Click any date in calendar | Entire week (Mon-Sun) highlighted | `bg-[#F0F1FF]` |
| Month/Year Hover | Mouse over title | Blue text | `hover:text-[#184EFF]` |
| MonthPicker Open | Click month/year title | Show MonthPicker | `weekMonthPickerDropdown.classList.remove('hidden')` |

## Tailwind Classes Used
| Class | Purpose |
|-------|---------|
| `bg-white` | Component background (from RULE.md) |
| `text-[#141414]` | Primary text color (from RULE.md) |
| `text-[#184EFF]` | Blue hover color (from RULE.md) |
| `stroke-[#728096]` | Gray arrow stroke (default) |
| `stroke-[#184EFF]` | Blue arrow stroke (hover) |
| `bg-[#F0F1FF]` | Selected week/month background (from RULE.md) |
| `bg-[#E0E2FF]` | Selected week/month hover |
| `border-gray-200` | Light border |
| `rounded-md` | Input border radius |
| `rounded-xl` | Dropdown border radius |
| `shadow-xl` | Dropdown shadow |
| `hover:bg-gray-100` | Hover state for unselected items |
| `transition-colors` | Smooth color transitions |

## Integration with MonthPicker

WeekPicker integrates with the [MonthPicker](./MonthPicker.md) component. When the user clicks the month/year title in the calendar dropdown, MonthPicker opens for quick month selection.

**MonthPicker behavior:**
- Click month/year title → opens MonthPicker
- Selected month: background #F0F1FF
- Hover month: background gray (#F3F4F6)
- After selecting month → calendar updates and closes MonthPicker

**See also:** [MonthPicker.md](./MonthPicker.md) for standalone MonthPicker documentation.

## Accessibility
- Use `aria-label` on navigation buttons ("Previous week", "Next week", "Previous month", "Next month", "Previous year", "Next year")
- Support keyboard navigation (Arrow Left/Right for week navigation, Escape to close)
- Use semantic button elements for all interactive controls
- Ensure sufficient color contrast (WCAG AA compliant)
- Announce week range changes to screen readers
- Use `role="dialog"` on dropdown with `aria-label="Choose week"`

## Design Specs
| Element | Dimensions | Colors | Font |
|---------|-----------|--------|------|
| Display Container | Auto width | `#FFFFFF` background, `#E5E7EB` border | Open Sans |
| Date Range Text | 14px | `#141414` default, `#184EFF` hover | 14px medium |
| Calendar Icon | 18px × 18px | `#728096` fill | - |
| Arrow Icon | 14px × 20px | `#728096` stroke, `#184EFF` hover | - |
| Selected Week | Seamless (no gaps) | `#F0F1FF` background | - |
| Calendar Dropdown | 320px min-width | `#FFFFFF` background | Open Sans |
| Day Button | 40px × 40px | - | 14px medium |
| Week Grid Gap | 0px | Seamless highlighting | - |

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
