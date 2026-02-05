---
name: Calendar
category: layout
created: 2026-02-03T00:00:00.000Z
updated: 2026-02-04T07:30:00.000Z
status: reviewed
---

# Calendar

## Preview
A weekly calendar grid component with navigation controls and view selector. Supports 1 Week, 2 Week, and 4 Week views with adjustable cell heights. Features today indicator, date navigation, and responsive grid layout.

## Usage
Use this component for:
- Scheduling and planning interfaces
- Event calendars
- Meal planners, workout planners
- Booking systems

## HTML
```html
<div class="calendar">
  <!-- Navigation -->
  <div class="calendar-nav">
    <button class="calendar-today-btn">TODAY</button>
    <button class="calendar-nav-btn" aria-label="Previous">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
      </svg>
    </button>
    <button class="calendar-date-picker" aria-label="Select date">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
      </svg>
    </button>
    <span class="calendar-date-range">Feb 2 - Feb 15</span>
    <button class="calendar-nav-btn" aria-label="Next">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
      </svg>
    </button>

    <!-- Week View Selector -->
    <div class="calendar-view-selector">
      <button class="calendar-view-btn">1 Week</button>
      <button class="calendar-view-btn calendar-view-btn--active">2 Week</button>
      <button class="calendar-view-btn">4 Week</button>
    </div>
  </div>

  <!-- Calendar Grid -->
  <div class="calendar-grid">
    <!-- Day Headers -->
    <div class="calendar-header">MON</div>
    <div class="calendar-header">TUE</div>
    <div class="calendar-header">WED</div>
    <div class="calendar-header">THU</div>
    <div class="calendar-header">FRI</div>
    <div class="calendar-header">SAT</div>
    <div class="calendar-header">SUN</div>

    <!-- Week 1 -->
    <div class="calendar-cell"><span class="calendar-date">02</span></div>
    <div class="calendar-cell"><span class="calendar-date calendar-date--today">03</span></div>
    <div class="calendar-cell"><span class="calendar-date">04</span></div>
    <div class="calendar-cell"><span class="calendar-date">05</span></div>
    <div class="calendar-cell"><span class="calendar-date">06</span></div>
    <div class="calendar-cell"><span class="calendar-date">07</span></div>
    <div class="calendar-cell"><span class="calendar-date">08</span></div>

    <!-- Week 2 -->
    <div class="calendar-cell"><span class="calendar-date">09</span></div>
    <div class="calendar-cell"><span class="calendar-date">10</span></div>
    <div class="calendar-cell"><span class="calendar-date">11</span></div>
    <div class="calendar-cell"><span class="calendar-date">12</span></div>
    <div class="calendar-cell"><span class="calendar-date">13</span></div>
    <div class="calendar-cell"><span class="calendar-date">14</span></div>
    <div class="calendar-cell"><span class="calendar-date">15</span></div>
  </div>
</div>
```

## CSS
```css
.calendar {
  background-color: #ffffff;
  font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.calendar-nav {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
}

.calendar-today-btn {
  padding: 6px 12px;
  font-size: 12px;
  font-weight: 500;
  color: #141414;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 16px;
  cursor: pointer;
}

.calendar-today-btn:hover {
  background-color: #F5F7F9;
}

.calendar-nav-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  border-radius: 4px;
}

.calendar-nav-btn:hover {
  background-color: #f3f4f6;
}

.calendar-date-picker {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
}

.calendar-date-range {
  font-size: 14px;
  font-weight: 500;
  color: #141414;
}

/* Week View Selector */
.calendar-view-selector {
  display: flex;
  align-items: center;
  margin-left: auto;
  background-color: #f3f4f6;
  border-radius: 6px;
  padding: 2px;
}

.calendar-view-btn {
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  background: none;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.calendar-view-btn:hover {
  color: #141414;
}

.calendar-view-btn--active {
  background-color: #ffffff;
  color: #141414;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

/* Calendar Grid */
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.calendar-header {
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  border-bottom: 1px solid #e5e7eb;
}

.calendar-cell {
  padding: 8px;
  background-color: #f8fafc;
  border-right: 1px solid #e5e7eb;
  border-bottom: 1px solid #e5e7eb;
}

.calendar-cell:nth-child(7n) {
  border-right: none;
}

/* Cell heights for different views */
.calendar--1week .calendar-cell {
  min-height: 300px;
}

.calendar--2week .calendar-cell {
  min-height: 150px;
}

.calendar--4week .calendar-cell {
  min-height: 80px;
}

.calendar-date {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  font-size: 13px;
  color: #141414;
}

.calendar-date--today {
  background-color: #184EFF;
  color: #ffffff;
  border-radius: 4px;
  font-weight: 500;
}
```

## Tailwind CSS
```html
<div id="calendar" class="bg-white font-['Open_Sans']" data-view="2">
  <!-- Navigation -->
  <div class="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
    <button class="px-3 py-1.5 text-xs font-medium text-[#141414] bg-white border border-gray-300 rounded-full hover:bg-[#F5F7F9]">
      TODAY
    </button>
    <button class="flex items-center justify-center w-7 h-7 text-gray-500 hover:bg-gray-100 rounded" aria-label="Previous">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
      </svg>
    </button>
    <button class="flex items-center justify-center w-7 h-7 text-gray-500" aria-label="Select date">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/>
      </svg>
    </button>
    <span id="dateRange" class="text-sm font-medium text-[#141414]">Feb 2 - Feb 8</span>
    <button class="flex items-center justify-center w-7 h-7 text-gray-500 hover:bg-gray-100 rounded" aria-label="Next">
      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
      </svg>
    </button>

    <!-- Week View Selector -->
    <div class="flex items-center ml-auto bg-gray-100 rounded-md p-0.5">
      <button onclick="setView(1)" data-weeks="1" class="view-btn px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-[#141414] rounded transition-all">
        1 Week
      </button>
      <button onclick="setView(2)" data-weeks="2" class="view-btn px-3 py-1.5 text-sm font-medium text-[#141414] bg-white rounded shadow-sm transition-all">
        2 Week
      </button>
      <button onclick="setView(4)" data-weeks="4" class="view-btn px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-[#141414] rounded transition-all">
        4 Week
      </button>
    </div>
  </div>

  <!-- Calendar Grid -->
  <div id="calendarGrid" class="grid grid-cols-7">
    <!-- Day Headers -->
    <div class="px-4 py-3 text-xs font-medium text-gray-500 uppercase border-b border-gray-200">MON</div>
    <div class="px-4 py-3 text-xs font-medium text-gray-500 uppercase border-b border-gray-200">TUE</div>
    <div class="px-4 py-3 text-xs font-medium text-gray-500 uppercase border-b border-gray-200">WED</div>
    <div class="px-4 py-3 text-xs font-medium text-gray-500 uppercase border-b border-gray-200">THU</div>
    <div class="px-4 py-3 text-xs font-medium text-gray-500 uppercase border-b border-gray-200">FRI</div>
    <div class="px-4 py-3 text-xs font-medium text-gray-500 uppercase border-b border-gray-200">SAT</div>
    <div class="px-4 py-3 text-xs font-medium text-gray-500 uppercase border-b border-gray-200">SUN</div>

    <!-- Cells will be rendered by JavaScript -->
  </div>
</div>

<style>
  /* Responsive cell heights based on view */
  .calendar-cell {
    transition: height 0.3s ease;
  }
  .calendar-cell[data-view="1"] {
    height: calc((100vh - 120px) / 1);
    min-height: 200px;
  }
  .calendar-cell[data-view="2"] {
    height: calc((100vh - 120px) / 2);
    min-height: 120px;
  }
  .calendar-cell[data-view="4"] {
    height: calc((100vh - 120px) / 4);
    min-height: 80px;
  }
</style>

<script>
  const calendar = document.getElementById('calendar');
  const grid = document.getElementById('calendarGrid');
  const dateRange = document.getElementById('dateRange');
  const viewBtns = document.querySelectorAll('.view-btn');

  // Generate calendar cells
  function renderCalendar(weeks) {
    // Clear existing cells (keep headers)
    const headers = Array.from(grid.children).slice(0, 7);
    grid.innerHTML = '';
    headers.forEach(h => grid.appendChild(h));

    const totalDays = weeks * 7;
    const startDate = 2; // Feb 2
    const today = 3; // Feb 3 is today

    for (let i = 0; i < totalDays; i++) {
      const day = startDate + i;
      const isToday = day === today;
      const isLastCol = (i + 1) % 7 === 0;

      const cell = document.createElement('div');
      cell.className = `calendar-cell p-2 bg-slate-50 border-b border-gray-200 ${!isLastCol ? 'border-r' : ''}`;
      cell.setAttribute('data-view', weeks);

      const dateSpan = document.createElement('span');
      dateSpan.className = `inline-flex items-center justify-center w-6 h-6 text-sm ${isToday ? 'text-white bg-[#184EFF] rounded font-medium' : 'text-[#141414]'}`;
      dateSpan.textContent = String(day).padStart(2, '0');

      cell.appendChild(dateSpan);
      grid.appendChild(cell);
    }

    // Update date range text
    const endDate = startDate + totalDays - 1;
    dateRange.textContent = `Feb ${startDate} - Feb ${endDate}`;
  }

  // Set view (1, 2, or 4 weeks)
  function setView(weeks) {
    calendar.setAttribute('data-view', weeks);

    // Update button styles
    viewBtns.forEach(btn => {
      if (parseInt(btn.dataset.weeks) === weeks) {
        btn.className = 'view-btn px-3 py-1.5 text-sm font-medium text-[#141414] bg-white rounded shadow-sm transition-all';
      } else {
        btn.className = 'view-btn px-3 py-1.5 text-sm font-medium text-gray-500 hover:text-[#141414] rounded transition-all';
      }
    });

    renderCalendar(weeks);
  }

  // Initialize with 2-week view
  renderCalendar(2);
</script>
```

## Props/Variants
| Variant | Attribute | Description |
|---------|-----------|-------------|
| 1 Week | `data-view="1"` | Single week view, responsive height |
| 2 Week | `data-view="2"` | Two week view, responsive height |
| 4 Week | `data-view="4"` | Four week view, responsive height |
| Today | `.bg-[#184EFF].text-white` | Highlighted current date |

## View Options
| View | Rows | Cell Height (Responsive) | Date Range |
|------|------|--------------------------|------------|
| 1 Week | 1 | `calc((100vh - 120px) / 1)` min 200px | 7 days |
| 2 Week | 2 | `calc((100vh - 120px) / 2)` min 120px | 14 days |
| 4 Week | 4 | `calc((100vh - 120px) / 4)` min 80px | 28 days |

## Interactive Behavior
- Click "1 Week", "2 Week", or "4 Week" buttons to switch views
- Calendar grid re-renders with correct number of weeks
- Cell heights automatically adjust to fill available viewport
- Date range text updates based on selected view
- Smooth transition animation when switching views

## Accessibility
- Navigation buttons include `aria-label` for screen readers
- Use `role="grid"` on calendar container
- Use `role="gridcell"` on date cells
- Today's date should have `aria-current="date"`
- Keyboard navigation support for date selection

## Related Components

### WeekPicker Integration
For week-based selection with date range display and navigation arrows, see the [WeekPicker](./WeekPicker.md) component. WeekPicker provides:
- Date range display with format "Feb 2 - Feb 15"
- Arrow navigation for previous/next week
- Calendar dropdown for week selection
- MonthPicker integration for quick month navigation
- Hover states: text and arrows turn blue (#184EFF)

**See also:** [WeekPicker.md](./WeekPicker.md) for week-based date selection.

### DatePicker Integration
For single date selection, see the [DatePicker](./DatePicker.md) component with calendar dropdown and MonthPicker integration.

**See also:** [DatePicker.md](./DatePicker.md) for single date selection.

## Notes
- Generated from image on 2026-02-03, updated 2026-02-04
- Week view selector uses pill-style toggle buttons
- Active view has white background with subtle shadow
- Grid uses CSS Grid with 7 equal columns
- **Interactive:** JavaScript handles view switching and grid rendering
- **Responsive cells:** Height uses `calc((100vh - 120px) / rows)` with minimum heights
- Cells animate smoothly when view changes
- For week range selection with navigation, use WeekPicker component
