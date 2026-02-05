---
name: Calendar
category: layout
created: 2026-02-03T00:00:00.000Z
updated: 2026-02-05T05:30:00.000Z
status: approved
---

# Calendar

## Preview
A weekly calendar grid component with WeekPicker-style navigation. Full-width responsive layout with 30px padding. Features:
- Gray background cells with rounded corners and gap between cells
- TODAY button to jump to current week
- Arrow navigation (prev/next) with hover effect
- View selector (1 Week, 2 Week, 4 Week)
- Today indicator with blue background
- Month name shown on first day of month

## Usage
Use this component for:
- Scheduling and planning interfaces
- Event calendars
- Meal planners, workout planners
- Booking systems

## HTML
```html
<!-- Calendar with full width and 30px padding -->
<div id="calendar" class="w-full p-[30px] bg-white font-['Open_Sans']" data-view="4">

  <!-- Navigation Bar with WeekPicker Integration -->
  <div class="flex items-center gap-3 mb-4 relative">
    <!-- TODAY Button -->
    <button id="todayBtn" class="px-4 py-1.5 text-xs font-medium text-[#141414] bg-white border border-gray-300 rounded-full hover:bg-[#F5F7F9] transition-colors">
      TODAY
    </button>

    <!-- Previous Arrow -->
    <button id="prevBtn" class="group p-1.5 transition-all" aria-label="Previous">
      <svg class="w-3.5 h-5" viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 11L1 6l5-5" stroke="#728096" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" class="group-hover:stroke-[#184EFF] transition-colors"/>
      </svg>
    </button>

    <!-- Calendar Icon -->
    <svg class="w-[18px] h-[18px] flex-shrink-0" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z" fill="#728096"/>
    </svg>

    <!-- Date Range Display (Clickable - opens WeekPicker dropdown) -->
    <button id="dateRange" type="button" class="text-sm font-medium text-[#141414] hover:text-[#184EFF] transition-colors">
      Feb 2 - Mar 1
    </button>

    <!-- Next Arrow -->
    <button id="nextBtn" class="group p-1.5 transition-all" aria-label="Next">
      <svg class="w-3.5 h-5" viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1l5 5-5 5" stroke="#728096" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" class="group-hover:stroke-[#184EFF] transition-colors"/>
      </svg>
    </button>

    <!-- WeekPicker Calendar Dropdown -->
    <div id="weekPickerDropdown" class="hidden absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-5 min-w-[320px] z-50">
      <!-- Month/Year Header with Navigation -->
      <div class="flex items-center justify-between mb-5">
        <button id="prevMonthBtn" type="button" class="group p-2 transition-all" aria-label="Previous month">
          <svg class="w-3.5 h-5" viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 11L1 6l5-5" stroke="#728096" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" class="group-hover:stroke-[#184EFF] transition-colors"/>
          </svg>
        </button>
        <button id="monthYearTitle" type="button" class="text-base font-semibold text-[#141414] hover:text-[#184EFF] transition-colors">
          February 2026
        </button>
        <button id="nextMonthBtn" type="button" class="group p-2 transition-all" aria-label="Next month">
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

      <!-- Week Selection Grid (gap-0 for seamless week highlighting) -->
      <div id="weekPickerGrid" class="grid grid-cols-7 gap-0">
        <!-- Days rendered by JavaScript -->
      </div>
    </div>

    <!-- MonthPicker Dropdown -->
    <div id="monthPickerDropdown" class="hidden absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl p-5 min-w-[320px] z-50">
      <!-- Year Header with Navigation -->
      <div class="flex items-center justify-center gap-4 mb-5">
        <button id="prevYearBtn" type="button" class="group p-2 transition-all" aria-label="Previous year">
          <svg class="w-3.5 h-5" viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 11L1 6l5-5" stroke="#728096" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" class="group-hover:stroke-[#184EFF] transition-colors"/>
          </svg>
        </button>
        <div id="yearTitle" class="text-xl font-semibold text-[#141414] min-w-[80px] text-center">2026</div>
        <button id="nextYearBtn" type="button" class="group p-2 transition-all" aria-label="Next year">
          <svg class="w-3.5 h-5" viewBox="0 0 7 12" xmlns="http://www.w3.org/2000/svg">
            <path d="M1 1l5 5-5 5" stroke="#728096" stroke-width="1.5" fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" class="group-hover:stroke-[#184EFF] transition-colors"/>
          </svg>
        </button>
      </div>

      <!-- Month Grid (4 columns × 3 rows) -->
      <div id="monthGrid" class="grid grid-cols-4 gap-2">
        <!-- Months rendered by JavaScript -->
      </div>
    </div>

    <!-- Week View Selector -->
    <div class="flex items-center ml-auto bg-gray-100 rounded-md p-0.5">
      <button onclick="setView(1)" data-weeks="1" class="view-btn px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-[#141414] rounded transition-all">
        1 Week
      </button>
      <button onclick="setView(2)" data-weeks="2" class="view-btn px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-[#141414] rounded transition-all">
        2 Week
      </button>
      <button onclick="setView(4)" data-weeks="4" class="view-btn px-3 py-1.5 text-sm font-medium text-[#141414] bg-white rounded shadow-sm transition-all">
        4 Week
      </button>
    </div>
  </div>

  <!-- Calendar Grid with gap between cells -->
  <div id="calendarGrid" class="grid grid-cols-7 gap-2">
    <!-- Day Headers -->
    <div class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">MON</div>
    <div class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">TUE</div>
    <div class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">WED</div>
    <div class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">THU</div>
    <div class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">FRI</div>
    <div class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">SAT</div>
    <div class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">SUN</div>

    <!-- Cells rendered by JavaScript -->
  </div>
</div>
```

## CSS
```css
.calendar {
  width: 100%;
  padding: 30px;
  background-color: #ffffff;
  font-family: 'Open Sans', sans-serif;
}

.calendar-cell {
  padding: 8px;
  background-color: #F5F7F9;
  border-radius: 8px;
  min-height: 120px;
}

/* Today indicator uses NumberBadge-sm style */
.calendar-date--today {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background-color: #184EFF;
  color: #ffffff;
  border-radius: 50%;
  font-weight: 600;
}
```

## Tailwind Classes Used
| Class | Purpose |
|-------|---------|
| `w-full` | Full width container |
| `p-[30px]` | 30px padding all around |
| `gap-2` | 8px gap between cells |
| `bg-[#F5F7F9]` | Gray cell background |
| `rounded-lg` | Rounded corners on cells |
| `w-8 h-8 bg-[#184EFF] rounded-full` | Today indicator (NumberBadge-sm style) |
| `group-hover:stroke-[#184EFF]` | Arrow hover effect |
| `hover:bg-[#F5F7F9]` | Button hover state |

## Props/Variants
| Variant | Attribute | Description |
|---------|-----------|-------------|
| 1 Week | `data-view="1"` | Single week view, cell height 280px |
| 2 Week | `data-view="2"` | Two week view, cell height 160px |
| 4 Week | `data-view="4"` | Four week view, cell height 120px |
| Today | `w-8 h-8 bg-[#184EFF] text-white rounded-full font-semibold` | Highlighted current date (NumberBadge-sm style) |

## Component States
| State | Trigger | Visual Changes | Tailwind Classes |
|-------|---------|----------------|------------------|
| Default | - | Gray arrows, black text | `stroke-[#728096]` |
| Arrow Hover | Mouse over prev/next | Blue stroke | `group-hover:stroke-[#184EFF]` |
| Date Range Hover | Mouse over date range | Blue text | `hover:text-[#184EFF]` |
| TODAY Hover | Mouse over button | Gray background | `hover:bg-[#F5F7F9]` |
| View Active | Selected view | White bg, shadow | `bg-white shadow-sm` |
| WeekPicker Open | Click date range | Show dropdown | `weekPickerDropdown.classList.remove('hidden')` |
| Week Selected | Click date in dropdown | Seamless highlight | `bg-[#F0F1FF]` |
| MonthPicker Open | Click month/year title | Show MonthPicker | `monthPickerDropdown.classList.remove('hidden')` |

## JavaScript
```javascript
document.addEventListener('DOMContentLoaded', function() {
  // State
  let currentWeekStart = new Date(2026, 1, 2); // Feb 2, 2026 (Monday)
  let currentView = 4; // 4 weeks default
  let displayMonth = 1; // February (0-indexed)
  let displayYear = 2026;
  const today = new Date(); // Current date

  // DOM Elements
  const calendar = document.getElementById('calendar');
  const grid = document.getElementById('calendarGrid');
  const dateRange = document.getElementById('dateRange');
  const viewBtns = document.querySelectorAll('.view-btn');
  const todayBtn = document.getElementById('todayBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  // WeekPicker elements
  const weekPickerDropdown = document.getElementById('weekPickerDropdown');
  const weekPickerGrid = document.getElementById('weekPickerGrid');
  const monthYearTitle = document.getElementById('monthYearTitle');
  const prevMonthBtn = document.getElementById('prevMonthBtn');
  const nextMonthBtn = document.getElementById('nextMonthBtn');

  // MonthPicker elements
  const monthPickerDropdown = document.getElementById('monthPickerDropdown');
  const monthGrid = document.getElementById('monthGrid');
  const yearTitle = document.getElementById('yearTitle');
  const prevYearBtn = document.getElementById('prevYearBtn');
  const nextYearBtn = document.getElementById('nextYearBtn');

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthsFull = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  // Helper: Get Monday of week
  function getMondayOfWeek(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  // Helper: Format date
  function formatDate(date) {
    return `${months[date.getMonth()]} ${date.getDate()}`;
  }

  // Helper: Same day check
  function isSameDay(d1, d2) {
    return d1.getDate() === d2.getDate() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getFullYear() === d2.getFullYear();
  }

  // Update date range display
  function updateDateRange() {
    const totalDays = currentView * 7;
    const endDate = new Date(currentWeekStart);
    endDate.setDate(endDate.getDate() + totalDays - 1);
    dateRange.textContent = `${formatDate(currentWeekStart)} - ${formatDate(endDate)}`;
  }

  // Render main calendar grid
  function renderCalendar() {
    const headers = Array.from(grid.children).slice(0, 7);
    grid.innerHTML = '';
    headers.forEach(h => grid.appendChild(h));

    const totalDays = currentView * 7;
    const cellHeights = { 1: '280px', 2: '160px', 4: '120px' };

    for (let i = 0; i < totalDays; i++) {
      const cellDate = new Date(currentWeekStart);
      cellDate.setDate(cellDate.getDate() + i);

      const isToday = isSameDay(cellDate, today);
      const day = cellDate.getDate();
      const showMonth = day === 1 || i === 0;

      const cell = document.createElement('div');
      cell.className = 'p-2 bg-[#F5F7F9] rounded-lg';
      cell.style.minHeight = cellHeights[currentView];

      const dateLabel = document.createElement('div');
      dateLabel.className = 'flex items-start';

      const dateSpan = document.createElement('span');
      if (isToday) {
        dateSpan.className = 'inline-flex items-center justify-center w-8 h-8 text-sm font-semibold text-white bg-[#184EFF] rounded-full';
      } else {
        dateSpan.className = 'inline-flex items-center justify-center text-sm font-medium text-[#141414]';
      }

      if (showMonth) {
        dateSpan.textContent = `${String(day).padStart(2, '0')} ${months[cellDate.getMonth()]}`;
      } else {
        dateSpan.textContent = String(day).padStart(2, '0');
      }

      dateLabel.appendChild(dateSpan);
      cell.appendChild(dateLabel);
      grid.appendChild(cell);
    }

    updateDateRange();
  }

  // Render WeekPicker dropdown calendar
  function renderWeekPicker() {
    monthYearTitle.textContent = `${monthsFull[displayMonth]} ${displayYear}`;

    const firstDay = new Date(displayYear, displayMonth, 1).getDay();
    const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(displayYear, displayMonth, 0).getDate();
    const startDay = firstDay === 0 ? 6 : firstDay - 1;

    weekPickerGrid.innerHTML = '';

    const selectedMonday = getMondayOfWeek(currentWeekStart);
    const selectedSunday = new Date(selectedMonday);
    selectedSunday.setDate(selectedSunday.getDate() + 6);

    // Previous month days
    for (let i = startDay - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      const date = new Date(displayYear, displayMonth - 1, day);
      weekPickerGrid.appendChild(createWeekPickerDay(day, date, true, selectedMonday, selectedSunday));
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(displayYear, displayMonth, day);
      weekPickerGrid.appendChild(createWeekPickerDay(day, date, false, selectedMonday, selectedSunday));
    }

    // Next month days
    const totalCells = weekPickerGrid.children.length;
    const remainingCells = 42 - totalCells;
    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(displayYear, displayMonth + 1, day);
      weekPickerGrid.appendChild(createWeekPickerDay(day, date, true, selectedMonday, selectedSunday));
    }
  }

  // Create day button for WeekPicker
  function createWeekPickerDay(day, date, isOtherMonth, selectedMonday, selectedSunday) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = day;

    const isInSelectedWeek = date >= selectedMonday && date <= selectedSunday;
    const isWeekStart = date.getTime() === selectedMonday.getTime();
    const isWeekEnd = date.getTime() === selectedSunday.getTime();

    let classes = 'aspect-square flex items-center justify-center text-sm font-medium transition-all min-w-[40px] min-h-[40px]';

    if (isInSelectedWeek) {
      classes += ' bg-[#F0F1FF] text-[#141414] hover:bg-[#E0E2FF]';
      if (isWeekStart) classes += ' rounded-l-md';
      if (isWeekEnd) classes += ' rounded-r-md';
      if (!isWeekStart && !isWeekEnd) classes += ' rounded-none';
    } else {
      classes += isOtherMonth ? ' text-gray-400 hover:bg-gray-100 hover:rounded-md' : ' text-[#141414] hover:bg-gray-100 hover:rounded-md';
    }

    btn.className = classes;

    btn.addEventListener('click', function() {
      currentWeekStart = getMondayOfWeek(date);
      if (isOtherMonth) {
        displayMonth = date.getMonth();
        displayYear = date.getFullYear();
      }
      renderCalendar();
      renderWeekPicker();
      weekPickerDropdown.classList.add('hidden');
    });

    return btn;
  }

  // Render MonthPicker grid
  function renderMonthPicker() {
    yearTitle.textContent = displayYear;
    monthGrid.innerHTML = '';

    months.forEach((month, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.textContent = month;
      btn.dataset.month = index;

      const isSelected = index === displayMonth;
      let classes = 'px-4 py-2.5 text-sm font-medium text-[#141414] rounded-lg transition-colors';
      classes += isSelected ? ' bg-[#F0F1FF] hover:bg-[#E0E2FF]' : ' hover:bg-gray-100';

      btn.className = classes;

      btn.addEventListener('click', function() {
        displayMonth = index;
        monthPickerDropdown.classList.add('hidden');
        weekPickerDropdown.classList.remove('hidden');
        renderWeekPicker();
      });

      monthGrid.appendChild(btn);
    });
  }

  // Set view (1, 2, or 4 weeks)
  function setView(weeks) {
    currentView = weeks;
    calendar.setAttribute('data-view', weeks);

    viewBtns.forEach(btn => {
      if (parseInt(btn.dataset.weeks) === weeks) {
        btn.className = 'view-btn px-3 py-1.5 text-sm font-medium text-[#141414] bg-white rounded shadow-sm transition-all';
      } else {
        btn.className = 'view-btn px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-[#141414] rounded transition-all';
      }
    });

    renderCalendar();
  }

  window.setView = setView;

  // TODAY button
  todayBtn.addEventListener('click', function() {
    currentWeekStart = getMondayOfWeek(today);
    renderCalendar();
  });

  // Previous/Next navigation
  prevBtn.addEventListener('click', function() {
    currentWeekStart.setDate(currentWeekStart.getDate() - (currentView * 7));
    renderCalendar();
  });

  nextBtn.addEventListener('click', function() {
    currentWeekStart.setDate(currentWeekStart.getDate() + (currentView * 7));
    renderCalendar();
  });

  // Toggle WeekPicker dropdown
  dateRange.addEventListener('click', function() {
    const isHidden = weekPickerDropdown.classList.contains('hidden');
    weekPickerDropdown.classList.toggle('hidden', !isHidden);
    monthPickerDropdown.classList.add('hidden');
    if (isHidden) {
      displayMonth = currentWeekStart.getMonth();
      displayYear = currentWeekStart.getFullYear();
      renderWeekPicker();
    }
  });

  // Toggle MonthPicker
  monthYearTitle.addEventListener('click', function(e) {
    e.stopPropagation();
    weekPickerDropdown.classList.add('hidden');
    monthPickerDropdown.classList.remove('hidden');
    renderMonthPicker();
  });

  // Month navigation
  prevMonthBtn.addEventListener('click', function() {
    displayMonth--;
    if (displayMonth < 0) { displayMonth = 11; displayYear--; }
    renderWeekPicker();
  });

  nextMonthBtn.addEventListener('click', function() {
    displayMonth++;
    if (displayMonth > 11) { displayMonth = 0; displayYear++; }
    renderWeekPicker();
  });

  // Year navigation
  prevYearBtn.addEventListener('click', function() { displayYear--; renderMonthPicker(); });
  nextYearBtn.addEventListener('click', function() { displayYear++; renderMonthPicker(); });

  // Close dropdowns on outside click
  document.addEventListener('click', function(e) {
    if (!e.target.closest('#weekPickerDropdown') && !e.target.closest('#monthPickerDropdown') && e.target !== dateRange) {
      weekPickerDropdown.classList.add('hidden');
      monthPickerDropdown.classList.add('hidden');
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      weekPickerDropdown.classList.add('hidden');
      monthPickerDropdown.classList.add('hidden');
    }
  });

  // Initialize
  currentWeekStart = getMondayOfWeek(today);
  renderCalendar();
});
```

## Accessibility
- Navigation buttons include `aria-label` for screen readers
- TODAY button provides quick access to current week
- Keyboard navigation support (Arrow keys)
- Today's date has `aria-current="date"`
- High contrast colors for visibility

## Related Components

### WeekPicker Integration
Calendar uses WeekPicker-style navigation with:
- Arrow navigation for previous/next periods
- Date range display showing current view range
- Arrows turn blue (#184EFF) on hover

**See also:** [WeekPicker.md](./WeekPicker.md) for standalone week selection.

### DatePicker Integration
For single date selection, see the [DatePicker](./DatePicker.md) component.

**See also:** [DatePicker.md](./DatePicker.md) for single date selection.

### NumberBadge Integration
The today indicator uses **NumberBadge-sm** styling (32px, rounded-full, font-semibold). This ensures consistency across the design system.

**See also:** [NumberBadge.md](./NumberBadge.md) for circular number indicators.

## Notes
- Updated on 2026-02-05 with new design
- Updated on 2026-02-05: Full WeekPicker dropdown integration added
- Full width responsive layout with 30px padding
- Gap between cells (gap-2) instead of borders
- Gray cell background (#F5F7F9) with rounded corners
- **WeekPicker Integration:**
  - Click date range → opens calendar dropdown for week selection
  - Seamless week highlighting (gap-0, rounded corners on Mon/Sun only)
  - Click any date → selects entire week (Mon-Sun)
  - Click month/year title → opens MonthPicker
- **MonthPicker Integration:**
  - Year navigation with arrows
  - Click month → returns to calendar with selected month
  - Selected month: #F0F1FF background
- TODAY button jumps to week containing current date
- Prev/Next arrows move by view size (1/2/4 weeks)
- Month name shown on first day of month or first cell
- Today indicator: uses NumberBadge-sm style (32px, #184EFF, rounded-full, font-semibold)
- Cell heights adjust based on view: 280px (1 week), 160px (2 weeks), 120px (4 weeks)
