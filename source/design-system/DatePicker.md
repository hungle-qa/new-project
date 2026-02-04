---
name: DatePicker
category: forms
created: 2026-02-03T00:00:00.000Z
status: draft
---

# DatePicker

## Preview
A date picker component with a blue pill-shaped input button and a dropdown calendar for date selection. Features month/year navigation, day headers starting Monday, and visual distinction between current, other month, and selected dates.

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
    Feb 3, 2026
  </button>

  <!-- Calendar Dropdown -->
  <div class="date-picker__dropdown">
    <!-- Month/Year Header -->
    <div class="date-picker__header">
      <button class="date-picker__nav" type="button" aria-label="Previous month">
        <svg class="date-picker__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <div class="date-picker__title">February 2026</div>
      <button class="date-picker__nav" type="button" aria-label="Next month">
        <svg class="date-picker__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"></polyline>
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
      <!-- Row 1: Previous month overflow -->
      <button class="date-picker__day date-picker__day--other-month" type="button">26</button>
      <button class="date-picker__day date-picker__day--other-month" type="button">27</button>
      <button class="date-picker__day date-picker__day--other-month" type="button">28</button>
      <button class="date-picker__day date-picker__day--other-month" type="button">29</button>
      <button class="date-picker__day date-picker__day--other-month" type="button">30</button>
      <button class="date-picker__day date-picker__day--other-month" type="button">31</button>
      <button class="date-picker__day" type="button">1</button>

      <!-- Row 2 -->
      <button class="date-picker__day" type="button">2</button>
      <button class="date-picker__day date-picker__day--selected" type="button" aria-current="date">3</button>
      <button class="date-picker__day" type="button">4</button>
      <button class="date-picker__day" type="button">5</button>
      <button class="date-picker__day" type="button">6</button>
      <button class="date-picker__day" type="button">7</button>
      <button class="date-picker__day" type="button">8</button>

      <!-- Row 3 -->
      <button class="date-picker__day" type="button">9</button>
      <button class="date-picker__day" type="button">10</button>
      <button class="date-picker__day" type="button">11</button>
      <button class="date-picker__day" type="button">12</button>
      <button class="date-picker__day" type="button">13</button>
      <button class="date-picker__day" type="button">14</button>
      <button class="date-picker__day" type="button">15</button>

      <!-- Row 4 -->
      <button class="date-picker__day" type="button">16</button>
      <button class="date-picker__day" type="button">17</button>
      <button class="date-picker__day" type="button">18</button>
      <button class="date-picker__day" type="button">19</button>
      <button class="date-picker__day" type="button">20</button>
      <button class="date-picker__day" type="button">21</button>
      <button class="date-picker__day" type="button">22</button>

      <!-- Row 5 -->
      <button class="date-picker__day" type="button">23</button>
      <button class="date-picker__day" type="button">24</button>
      <button class="date-picker__day" type="button">25</button>
      <button class="date-picker__day" type="button">26</button>
      <button class="date-picker__day" type="button">27</button>
      <button class="date-picker__day" type="button">28</button>
      <button class="date-picker__day date-picker__day--other-month" type="button">1</button>

      <!-- Row 6: Next month overflow -->
      <button class="date-picker__day date-picker__day--other-month" type="button">2</button>
      <button class="date-picker__day date-picker__day--other-month" type="button">3</button>
      <button class="date-picker__day date-picker__day--other-month" type="button">4</button>
      <button class="date-picker__day date-picker__day--other-month" type="button">5</button>
      <button class="date-picker__day date-picker__day--other-month" type="button">6</button>
      <button class="date-picker__day date-picker__day--other-month" type="button">7</button>
      <button class="date-picker__day date-picker__day--other-month" type="button">8</button>
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
}

.date-picker__input {
  background-color: #184EFF;
  color: #ffffff;
  border: 2px solid #184EFF;
  border-radius: 9999px;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.date-picker__input:hover {
  background-color: #1241CC;
  border-color: #1241CC;
}

.date-picker__input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(24, 78, 255, 0.3);
}

.date-picker__dropdown {
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
  color: #6b7280;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.date-picker__nav:hover {
  color: #141414;
  background-color: #f3f4f6;
}

.date-picker__chevron {
  width: 20px;
  height: 20px;
}

.date-picker__title {
  font-size: 16px;
  font-weight: 600;
  color: #141414;
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
  font-size: 14px;
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

.date-picker__day--today:not(.date-picker__day--selected) {
  font-weight: 700;
  color: #184EFF;
}
```

## Tailwind CSS
```html
<div class="relative inline-block font-['Open_Sans']">
  <!-- Date Input Field -->
  <button
    type="button"
    class="bg-[#184EFF] text-white border-2 border-[#184EFF] rounded-full px-6 py-2.5 text-sm font-medium hover:bg-[#1241CC] hover:border-[#1241CC] focus:outline-none focus:ring-4 focus:ring-[#184EFF]/30 transition-all"
  >
    Feb 3, 2026
  </button>

  <!-- Calendar Dropdown -->
  <div class="absolute top-full mt-2 left-0 bg-white border border-gray-200 rounded-xl shadow-xl p-5 min-w-[320px] z-50">
    <!-- Month/Year Header -->
    <div class="flex items-center justify-between mb-5">
      <button type="button" class="p-2 text-gray-500 hover:text-[#141414] hover:bg-gray-100 rounded-md transition-all" aria-label="Previous month">
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
      <div class="text-base font-semibold text-[#141414]">February 2026</div>
      <button type="button" class="p-2 text-gray-500 hover:text-[#141414] hover:bg-gray-100 rounded-md transition-all" aria-label="Next month">
        <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>
    </div>

    <!-- Day Headers -->
    <div class="grid grid-cols-7 gap-1 mb-2">
      <div class="text-center text-xs font-semibold text-gray-500 uppercase py-2">MO</div>
      <div class="text-center text-xs font-semibold text-gray-500 uppercase py-2">TU</div>
      <div class="text-center text-xs font-semibold text-gray-500 uppercase py-2">WE</div>
      <div class="text-center text-xs font-semibold text-gray-500 uppercase py-2">TH</div>
      <div class="text-center text-xs font-semibold text-gray-500 uppercase py-2">FR</div>
      <div class="text-center text-xs font-semibold text-gray-500 uppercase py-2">SA</div>
      <div class="text-center text-xs font-semibold text-gray-500 uppercase py-2">SU</div>
    </div>

    <!-- Calendar Grid -->
    <div class="grid grid-cols-7 gap-1">
      <!-- Row 1: Previous month -->
      <button type="button" class="aspect-square flex items-center justify-center rounded-full text-sm font-medium text-gray-400 hover:bg-gray-100 transition-all min-w-[36px] min-h-[36px]">26</button>
      <button type="button" class="aspect-square flex items-center justify-center rounded-full text-sm font-medium text-gray-400 hover:bg-gray-100 transition-all min-w-[36px] min-h-[36px]">27</button>
      <button type="button" class="aspect-square flex items-center justify-center rounded-full text-sm font-medium text-gray-400 hover:bg-gray-100 transition-all min-w-[36px] min-h-[36px]">28</button>
      <button type="button" class="aspect-square flex items-center justify-center rounded-full text-sm font-medium text-gray-400 hover:bg-gray-100 transition-all min-w-[36px] min-h-[36px]">29</button>
      <button type="button" class="aspect-square flex items-center justify-center rounded-full text-sm font-medium text-gray-400 hover:bg-gray-100 transition-all min-w-[36px] min-h-[36px]">30</button>
      <button type="button" class="aspect-square flex items-center justify-center rounded-full text-sm font-medium text-gray-400 hover:bg-gray-100 transition-all min-w-[36px] min-h-[36px]">31</button>
      <button type="button" class="aspect-square flex items-center justify-center rounded-full text-sm font-medium text-[#141414] hover:bg-gray-100 transition-all min-w-[36px] min-h-[36px]">1</button>

      <!-- Row 2 -->
      <button type="button" class="aspect-square flex items-center justify-center rounded-full text-sm font-medium text-[#141414] hover:bg-gray-100 transition-all min-w-[36px] min-h-[36px]">2</button>
      <button type="button" class="aspect-square flex items-center justify-center rounded-full text-sm font-medium bg-[#184EFF] text-white hover:bg-[#1241CC] focus:outline-none focus:ring-2 focus:ring-[#184EFF] focus:ring-offset-2 min-w-[36px] min-h-[36px]" aria-current="date">3</button>
      <button type="button" class="aspect-square flex items-center justify-center rounded-full text-sm font-medium text-[#141414] hover:bg-gray-100 transition-all min-w-[36px] min-h-[36px]">4</button>
      <button type="button" class="aspect-square flex items-center justify-center rounded-full text-sm font-medium text-[#141414] hover:bg-gray-100 transition-all min-w-[36px] min-h-[36px]">5</button>
      <button type="button" class="aspect-square flex items-center justify-center rounded-full text-sm font-medium text-[#141414] hover:bg-gray-100 transition-all min-w-[36px] min-h-[36px]">6</button>
      <button type="button" class="aspect-square flex items-center justify-center rounded-full text-sm font-medium text-[#141414] hover:bg-gray-100 transition-all min-w-[36px] min-h-[36px]">7</button>
      <button type="button" class="aspect-square flex items-center justify-center rounded-full text-sm font-medium text-[#141414] hover:bg-gray-100 transition-all min-w-[36px] min-h-[36px]">8</button>

      <!-- Row 3 -->
      <button type="button" class="aspect-square flex items-center justify-center rounded-full text-sm font-medium text-[#141414] hover:bg-gray-100 transition-all min-w-[36px] min-h-[36px]">9</button>
      <button type="button" class="aspect-square flex items-center justify-center rounded-full text-sm font-medium text-gray-400 hover:bg-gray-100 transition-all min-w-[36px] min-h-[36px]">10</button>
      <button type="button" class="aspect-square flex items-center justify-center rounded-full text-sm font-medium text-[#141414] hover:bg-gray-100 transition-all min-w-[36px] min-h-[36px]">11</button>
      <button type="button" class="aspect-square flex items-center justify-center rounded-full text-sm font-medium text-[#141414] hover:bg-gray-100 transition-all min-w-[36px] min-h-[36px]">12</button>
      <button type="button" class="aspect-square flex items-center justify-center rounded-full text-sm font-medium text-[#141414] hover:bg-gray-100 transition-all min-w-[36px] min-h-[36px]">13</button>
      <button type="button" class="aspect-square flex items-center justify-center rounded-full text-sm font-medium text-[#141414] hover:bg-gray-100 transition-all min-w-[36px] min-h-[36px]">14</button>
      <button type="button" class="aspect-square flex items-center justify-center rounded-full text-sm font-medium text-[#141414] hover:bg-gray-100 transition-all min-w-[36px] min-h-[36px]">15</button>

      <!-- Row 4 -->
      <button type="button" class="aspect-square flex items-center justify-center rounded-full text-sm font-medium text-[#141414] hover:bg-gray-100 transition-all min-w-[36px] min-h-[36px]">16</button>
      <button type="button" class="aspect-square flex items-center justify-center rounded-full text-sm font-medium text-gray-400 hover:bg-gray-100 transition-all min-w-[36px] min-h-[36px]">17</button>
      <button type="button" class="aspect-square flex items-center justify-center rounded-full text-sm font-medium text-[#141414] hover:bg-gray-100 transition-all min-w-[36px] min-h-[36px]">18</button>
      <button type="button" class="aspect-square flex items-center justify-center rounded-full text-sm font-medium text-[#141414] hover:bg-gray-100 transition-all min-w-[36px] min-h-[36px]">19</button>
      <button type="button" class="aspect-square flex items-center justify-center rounded-full text-sm font-medium text-[#141414] hover:bg-gray-100 transition-all min-w-[36px] min-h-[36px]">20</button>
      <button type="button" class="aspect-square flex items-center justify-center rounded-full text-sm font-medium text-[#141414] hover:bg-gray-100 transition-all min-w-[36px] min-h-[36px]">21</button>
      <button type="button" class="aspect-square flex items-center justify-center rounded-full text-sm font-medium text-[#141414] hover:bg-gray-100 transition-all min-w-[36px] min-h-[36px]">22</button>

      <!-- Row 5 -->
      <button type="button" class="aspect-square flex items-center justify-center rounded-full text-sm font-medium text-[#141414] hover:bg-gray-100 transition-all min-w-[36px] min-h-[36px]">23</button>
      <button type="button" class="aspect-square flex items-center justify-center rounded-full text-sm font-medium text-gray-400 hover:bg-gray-100 transition-all min-w-[36px] min-h-[36px]">24</button>
      <button type="button" class="aspect-square flex items-center justify-center rounded-full text-sm font-medium text-[#141414] hover:bg-gray-100 transition-all min-w-[36px] min-h-[36px]">25</button>
      <button type="button" class="aspect-square flex items-center justify-center rounded-full text-sm font-medium text-[#141414] hover:bg-gray-100 transition-all min-w-[36px] min-h-[36px]">26</button>
      <button type="button" class="aspect-square flex items-center justify-center rounded-full text-sm font-medium text-[#141414] hover:bg-gray-100 transition-all min-w-[36px] min-h-[36px]">27</button>
      <button type="button" class="aspect-square flex items-center justify-center rounded-full text-sm font-medium text-[#141414] hover:bg-gray-100 transition-all min-w-[36px] min-h-[36px]">28</button>
      <button type="button" class="aspect-square flex items-center justify-center rounded-full text-sm font-medium text-gray-400 hover:bg-gray-100 transition-all min-w-[36px] min-h-[36px]">1</button>

      <!-- Row 6: Next month -->
      <button type="button" class="aspect-square flex items-center justify-center rounded-full text-sm font-medium text-gray-400 hover:bg-gray-100 transition-all min-w-[36px] min-h-[36px]">2</button>
      <button type="button" class="aspect-square flex items-center justify-center rounded-full text-sm font-medium text-gray-400 hover:bg-gray-100 transition-all min-w-[36px] min-h-[36px]">3</button>
      <button type="button" class="aspect-square flex items-center justify-center rounded-full text-sm font-medium text-gray-400 hover:bg-gray-100 transition-all min-w-[36px] min-h-[36px]">4</button>
      <button type="button" class="aspect-square flex items-center justify-center rounded-full text-sm font-medium text-gray-400 hover:bg-gray-100 transition-all min-w-[36px] min-h-[36px]">5</button>
      <button type="button" class="aspect-square flex items-center justify-center rounded-full text-sm font-medium text-gray-400 hover:bg-gray-100 transition-all min-w-[36px] min-h-[36px]">6</button>
      <button type="button" class="aspect-square flex items-center justify-center rounded-full text-sm font-medium text-gray-400 hover:bg-gray-100 transition-all min-w-[36px] min-h-[36px]">7</button>
      <button type="button" class="aspect-square flex items-center justify-center rounded-full text-sm font-medium text-gray-400 hover:bg-gray-100 transition-all min-w-[36px] min-h-[36px]">8</button>
    </div>
  </div>
</div>
```

## Props/Variants
| Variant | Class | Description |
|---------|-------|-------------|
| Input | `.date-picker__input` | Blue pill button showing selected date |
| Dropdown | `.date-picker__dropdown` | Calendar container with shadow |
| Day | `.date-picker__day` | Default day button (current month) |
| Other Month | `.date-picker__day--other-month` | Gray text for prev/next month dates |
| Selected | `.date-picker__day--selected` | Blue circle for selected date |
| Today | `.date-picker__day--today` | Bold blue text for today's date |

## Accessibility
- Use `role="dialog"` on dropdown with `aria-label="Choose date"`
- Add `aria-label` to navigation buttons ("Previous month", "Next month")
- Use `aria-current="date"` on selected date
- Support keyboard navigation (arrow keys for date selection)
- Trap focus within dropdown when open
- Close on Escape key

## Notes
- Generated from image on 2026-02-03
- Week starts on Monday (MO, TU, WE, TH, FR, SA, SU)
- Input uses blue pill shape (#184EFF per RULE.md)
- Selected date uses circular blue highlight (#184EFF)
- Previous/next month dates shown in light gray (#9ca3af)
- Calendar dropdown positioned below input with shadow
- Updated to follow RULE.md styling guidelines
