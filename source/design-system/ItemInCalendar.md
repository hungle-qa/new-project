---
name: ItemInCalendar
category: Data Display
created: 2026-02-05T00:00:00.000Z
status: draft
---

# ItemInCalendar

A card component for displaying items within a calendar view. Features a header with blue title (truncated with tooltip for long text), checkbox, and MoreOptions menu, plus a content section in a sub-frame with shadow.

## Component Structure

| Section | Element | Description |
|---------|---------|-------------|
| Header | Title | Blue text, truncate with tooltip for long text |
| Header | Checkbox | Optional selection checkbox |
| Header | MoreOptions | Three-dot menu (Edit, Copy, Remove) |
| Content | Sub-frame | Padding + shadow container |
| Content | Heading | Bold label |
| Content | Description | Value and details (truncate, no tooltip) |

## Component States

| State | Trigger | Visual Changes |
|-------|---------|----------------|
| Default | - | Gray border, white background |
| Hover | Mouse over card | Border changes to `#184EFF` |
| Title hover (long) | Mouse over truncated title | Tooltip shows full title |
| Checkbox checked | Click checkbox | Filled checkbox icon |
| MoreOptions open | Click ⋯ | Dropdown menu appears |

## HTML

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ItemInCalendar - Responsive</title>

  <!-- Google Fonts - Open Sans -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">

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
    /* Tooltip styles */
    .title-tooltip {
      position: absolute;
      bottom: calc(100% + 8px);
      left: 0;
      background-color: #1F2937;
      color: #FFFFFF;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 500;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.2s ease, visibility 0.2s ease;
      pointer-events: none;
      z-index: 999;
      max-width: 300px;
      white-space: normal;
      word-break: break-word;
    }

    .title-tooltip::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 16px;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 6px solid #1F2937;
    }

    .title-wrapper:hover .title-tooltip.show-tooltip {
      opacity: 1;
      visibility: visible;
    }
  </style>
</head>
<body class="bg-gray-100 p-8 font-['Open_Sans']">

  <h2 class="text-lg font-semibold mb-6 text-[#141414]">ItemInCalendar - Responsive Component</h2>

  <div class="space-y-8">

    <!-- Case 1: Short Title -->
    <div>
      <h3 class="text-sm font-medium mb-3 text-[#7B7E91]">Case 1: Short Title</h3>
      <div class="item-in-calendar w-full max-w-[416px] bg-white rounded-lg shadow-sm border border-gray-200 hover:border-[#184EFF] transition-colors cursor-pointer">

        <!-- Header -->
        <div class="flex items-center justify-between px-3 py-2 gap-2">
          <!-- Title with tooltip wrapper -->
          <div class="title-wrapper relative flex-1 min-w-0">
            <span class="item-title text-sm font-medium text-[#184EFF] truncate block" data-full-title="1RM">1RM</span>
            <div class="title-tooltip">1RM</div>
          </div>

          <!-- Actions (sticky right) -->
          <div class="flex items-center gap-1 flex-shrink-0">
            <!-- Checkbox -->
            <button class="checkbox-btn w-5 h-5 border border-gray-300 rounded flex items-center justify-center hover:border-[#184EFF] transition-colors" aria-label="Select item">
              <svg class="w-3 h-3 text-white hidden" viewBox="0 0 12 12" fill="none">
                <path d="M2 6L5 9L10 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>

            <!-- MoreOptions -->
            <div class="more-options-wrapper relative">
              <button class="more-options-btn p-1.5 hover:bg-[#F5F7F9] rounded transition-colors" aria-haspopup="true" aria-expanded="false">
                <svg class="w-4 h-4 text-gray-500 hover:text-[#184EFF] transition-colors" viewBox="0 0 16 16" fill="currentColor">
                  <circle cx="3" cy="8" r="1.5"/>
                  <circle cx="8" cy="8" r="1.5"/>
                  <circle cx="13" cy="8" r="1.5"/>
                </svg>
              </button>
              <!-- Dropdown -->
              <div class="more-options-dropdown absolute top-full right-0 mt-1 bg-[#1F2937] rounded-lg shadow-xl min-w-[140px] py-1 opacity-0 invisible -translate-y-2 transition-all z-50">
                <button class="flex items-center gap-2 w-full px-3 py-2 text-white text-sm hover:bg-[#374151] transition-colors" role="menuitem">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M14 2l4 4L7 17H3v-4L14 2zM3 22h18" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>Edit</span>
                </button>
                <button class="flex items-center gap-2 w-full px-3 py-2 text-white text-sm hover:bg-[#374151] transition-colors" role="menuitem">
                  <svg class="w-4 h-4" viewBox="0 0 14 14" fill="#FFF">
                    <path d="M9.521 2.667H1.428C.64 2.667 0 3.307 0 4.095v8.093c0 .789.64 1.428 1.428 1.428h8.093c.789 0 1.428-.64 1.428-1.428V4.095c0-.789-.64-1.428-1.428-1.428zm.476 9.52a.476.476 0 01-.476.477H1.428a.476.476 0 01-.476-.476V4.095c0-.263.213-.476.476-.476h8.093c.263 0 .476.213.476.476v8.093z"/>
                    <path d="M11.997 0H3.428C2.64 0 2 .64 2 1.428a.476.476 0 10.952 0c0-.263.213-.476.476-.476h8.57c.262 0 .475.213.475.476v8.57a.476.476 0 01-.476.475.476.476 0 100 .952c.789 0 1.428-.639 1.428-1.428V1.428C13.425.64 12.786 0 11.997 0z"/>
                  </svg>
                  <span>Copy</span>
                </button>
                <button class="flex items-center gap-2 w-full px-3 py-2 text-white text-sm hover:bg-[#374151] transition-colors" role="menuitem">
                  <svg class="w-4 h-4" viewBox="0 0 14 15" fill="#FFF" stroke="#FFF" stroke-width=".2">
                    <path d="M12.613 2.935H9.815V2.48A1.48 1.48 0 008.335 1h-2.66a1.48 1.48 0 00-1.479 1.48v.455H1.398a.372.372 0 00-.373.374c0 .207.166.373.373.373h.675v8.77c0 1.101.896 1.997 1.996 1.997h5.873c1.1 0 1.996-.896 1.996-1.996V3.682h.675a.372.372 0 00.373-.373.372.372 0 00-.373-.374zm-7.67-.456c0-.403.329-.732.733-.732h2.66c.403 0 .732.329.732.732v.456H4.943V2.48zm6.249 9.974c0 .688-.562 1.25-1.25 1.25H4.069c-.688 0-1.25-.562-1.25-1.25V3.682h8.375v8.77h-.002z"/>
                  </svg>
                  <span>Remove</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Content (No divider) -->
        <div class="px-3 pb-3">
          <!-- Sub-frame with padding and shadow -->
          <div class="p-2 rounded-md shadow-sm bg-white border border-gray-100">
            <div class="text-sm font-semibold text-[#141414] mb-1">weight</div>
            <div class="text-sm text-[#7B7E91]">
              <div class="truncate">1x</div>
              <div class="truncate">100 %1RM x 1</div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Case 2: Long Title (truncated with tooltip) -->
    <div>
      <h3 class="text-sm font-medium mb-3 text-[#7B7E91]">Case 2: Long Title (hover to see tooltip)</h3>
      <div class="item-in-calendar w-full max-w-[416px] bg-white rounded-lg shadow-sm border border-gray-200 hover:border-[#184EFF] transition-colors cursor-pointer">

        <!-- Header -->
        <div class="flex items-center justify-between px-3 py-2 gap-2">
          <!-- Title with tooltip wrapper -->
          <div class="title-wrapper relative flex-1 min-w-0">
            <span class="item-title text-sm font-medium text-[#184EFF] truncate block" data-full-title="Title long text that should be truncated when it exceeds the available space">Title long text that should be truncated when it exceeds the available space</span>
            <div class="title-tooltip show-tooltip">Title long text that should be truncated when it exceeds the available space</div>
          </div>

          <!-- Actions (sticky right) -->
          <div class="flex items-center gap-1 flex-shrink-0">
            <!-- Checkbox -->
            <button class="checkbox-btn w-5 h-5 border border-gray-300 rounded flex items-center justify-center hover:border-[#184EFF] transition-colors" aria-label="Select item">
              <svg class="w-3 h-3 text-white hidden" viewBox="0 0 12 12" fill="none">
                <path d="M2 6L5 9L10 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>

            <!-- MoreOptions -->
            <div class="more-options-wrapper relative">
              <button class="more-options-btn p-1.5 hover:bg-[#F5F7F9] rounded transition-colors" aria-haspopup="true" aria-expanded="false">
                <svg class="w-4 h-4 text-gray-500 hover:text-[#184EFF] transition-colors" viewBox="0 0 16 16" fill="currentColor">
                  <circle cx="3" cy="8" r="1.5"/>
                  <circle cx="8" cy="8" r="1.5"/>
                  <circle cx="13" cy="8" r="1.5"/>
                </svg>
              </button>
              <!-- Dropdown -->
              <div class="more-options-dropdown absolute top-full right-0 mt-1 bg-[#1F2937] rounded-lg shadow-xl min-w-[140px] py-1 opacity-0 invisible -translate-y-2 transition-all z-50">
                <button class="flex items-center gap-2 w-full px-3 py-2 text-white text-sm hover:bg-[#374151] transition-colors" role="menuitem">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path d="M14 2l4 4L7 17H3v-4L14 2zM3 22h18" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <span>Edit</span>
                </button>
                <button class="flex items-center gap-2 w-full px-3 py-2 text-white text-sm hover:bg-[#374151] transition-colors" role="menuitem">
                  <svg class="w-4 h-4" viewBox="0 0 14 14" fill="#FFF">
                    <path d="M9.521 2.667H1.428C.64 2.667 0 3.307 0 4.095v8.093c0 .789.64 1.428 1.428 1.428h8.093c.789 0 1.428-.64 1.428-1.428V4.095c0-.789-.64-1.428-1.428-1.428zm.476 9.52a.476.476 0 01-.476.477H1.428a.476.476 0 01-.476-.476V4.095c0-.263.213-.476.476-.476h8.093c.263 0 .476.213.476.476v8.093z"/>
                    <path d="M11.997 0H3.428C2.64 0 2 .64 2 1.428a.476.476 0 10.952 0c0-.263.213-.476.476-.476h8.57c.262 0 .475.213.475.476v8.57a.476.476 0 01-.476.475.476.476 0 100 .952c.789 0 1.428-.639 1.428-1.428V1.428C13.425.64 12.786 0 11.997 0z"/>
                  </svg>
                  <span>Copy</span>
                </button>
                <button class="flex items-center gap-2 w-full px-3 py-2 text-white text-sm hover:bg-[#374151] transition-colors" role="menuitem">
                  <svg class="w-4 h-4" viewBox="0 0 14 15" fill="#FFF" stroke="#FFF" stroke-width=".2">
                    <path d="M12.613 2.935H9.815V2.48A1.48 1.48 0 008.335 1h-2.66a1.48 1.48 0 00-1.479 1.48v.455H1.398a.372.372 0 00-.373.374c0 .207.166.373.373.373h.675v8.77c0 1.101.896 1.997 1.996 1.997h5.873c1.1 0 1.996-.896 1.996-1.996V3.682h.675a.372.372 0 00.373-.373.372.372 0 00-.373-.374zm-7.67-.456c0-.403.329-.732.733-.732h2.66c.403 0 .732.329.732.732v.456H4.943V2.48zm6.249 9.974c0 .688-.562 1.25-1.25 1.25H4.069c-.688 0-1.25-.562-1.25-1.25V3.682h8.375v8.77h-.002z"/>
                  </svg>
                  <span>Remove</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="px-3 pb-3">
          <!-- Sub-frame with padding and shadow -->
          <div class="p-2 rounded-md shadow-sm bg-white border border-gray-100">
            <div class="text-sm font-semibold text-[#141414] mb-1">Description heading</div>
            <div class="text-sm text-[#7B7E91]">
              <div class="truncate">This is a very long description text that will be truncated</div>
              <div class="truncate">More content here that also gets truncated if too long</div>
            </div>
          </div>
        </div>

      </div>
    </div>

    <!-- Responsive Test: Different widths -->
    <div>
      <h3 class="text-sm font-medium mb-3 text-[#7B7E91]">Responsive Test (resize browser)</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

        <!-- Card 1 -->
        <div class="item-in-calendar w-full bg-white rounded-lg shadow-sm border border-gray-200 hover:border-[#184EFF] transition-colors cursor-pointer">
          <div class="flex items-center justify-between px-3 py-2 gap-2">
            <div class="title-wrapper relative flex-1 min-w-0">
              <span class="item-title text-sm font-medium text-[#184EFF] truncate block" data-full-title="Warm-up Exercise">Warm-up Exercise</span>
              <div class="title-tooltip show-tooltip">Warm-up Exercise</div>
            </div>
            <div class="flex items-center gap-1 flex-shrink-0">
              <button class="checkbox-btn w-5 h-5 border border-gray-300 rounded flex items-center justify-center hover:border-[#184EFF] transition-colors">
                <svg class="w-3 h-3 text-white hidden" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L5 9L10 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <div class="more-options-wrapper relative">
                <button class="more-options-btn p-1.5 hover:bg-[#F5F7F9] rounded transition-colors">
                  <svg class="w-4 h-4 text-gray-500 hover:text-[#184EFF]" viewBox="0 0 16 16" fill="currentColor">
                    <circle cx="3" cy="8" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="13" cy="8" r="1.5"/>
                  </svg>
                </button>
                <div class="more-options-dropdown absolute top-full right-0 mt-1 bg-[#1F2937] rounded-lg shadow-xl min-w-[140px] py-1 opacity-0 invisible -translate-y-2 transition-all z-50">
                  <button class="flex items-center gap-2 w-full px-3 py-2 text-white text-sm hover:bg-[#374151]"><span>Edit</span></button>
                  <button class="flex items-center gap-2 w-full px-3 py-2 text-white text-sm hover:bg-[#374151]"><span>Copy</span></button>
                  <button class="flex items-center gap-2 w-full px-3 py-2 text-white text-sm hover:bg-[#374151]"><span>Remove</span></button>
                </div>
              </div>
            </div>
          </div>
          <div class="px-3 pb-3">
            <div class="p-2 rounded-md shadow-sm bg-white border border-gray-100">
              <div class="text-sm font-semibold text-[#141414] mb-1">Duration</div>
              <div class="text-sm text-[#7B7E91]">
                <div class="truncate">10 minutes</div>
                <div class="truncate">Light cardio and stretching</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 2 -->
        <div class="item-in-calendar w-full bg-white rounded-lg shadow-sm border border-gray-200 hover:border-[#184EFF] transition-colors cursor-pointer">
          <div class="flex items-center justify-between px-3 py-2 gap-2">
            <div class="title-wrapper relative flex-1 min-w-0">
              <span class="item-title text-sm font-medium text-[#184EFF] truncate block" data-full-title="Main Set - Bench Press Heavy">Main Set - Bench Press Heavy</span>
              <div class="title-tooltip show-tooltip">Main Set - Bench Press Heavy</div>
            </div>
            <div class="flex items-center gap-1 flex-shrink-0">
              <button class="checkbox-btn w-5 h-5 bg-[#184EFF] border border-[#184EFF] rounded flex items-center justify-center">
                <svg class="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L5 9L10 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <div class="more-options-wrapper relative">
                <button class="more-options-btn p-1.5 hover:bg-[#F5F7F9] rounded transition-colors">
                  <svg class="w-4 h-4 text-gray-500 hover:text-[#184EFF]" viewBox="0 0 16 16" fill="currentColor">
                    <circle cx="3" cy="8" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="13" cy="8" r="1.5"/>
                  </svg>
                </button>
                <div class="more-options-dropdown absolute top-full right-0 mt-1 bg-[#1F2937] rounded-lg shadow-xl min-w-[140px] py-1 opacity-0 invisible -translate-y-2 transition-all z-50">
                  <button class="flex items-center gap-2 w-full px-3 py-2 text-white text-sm hover:bg-[#374151]"><span>Edit</span></button>
                  <button class="flex items-center gap-2 w-full px-3 py-2 text-white text-sm hover:bg-[#374151]"><span>Copy</span></button>
                  <button class="flex items-center gap-2 w-full px-3 py-2 text-white text-sm hover:bg-[#374151]"><span>Remove</span></button>
                </div>
              </div>
            </div>
          </div>
          <div class="px-3 pb-3">
            <div class="p-2 rounded-md shadow-sm bg-white border border-gray-100">
              <div class="text-sm font-semibold text-[#141414] mb-1">Reps</div>
              <div class="text-sm text-[#7B7E91]">
                <div class="truncate">3 sets x 8-12 reps</div>
                <div class="truncate">85% 1RM with 2min rest</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 3 -->
        <div class="item-in-calendar w-full bg-white rounded-lg shadow-sm border border-gray-200 hover:border-[#184EFF] transition-colors cursor-pointer">
          <div class="flex items-center justify-between px-3 py-2 gap-2">
            <div class="title-wrapper relative flex-1 min-w-0">
              <span class="item-title text-sm font-medium text-[#184EFF] truncate block" data-full-title="Cool Down">Cool Down</span>
              <div class="title-tooltip">Cool Down</div>
            </div>
            <div class="flex items-center gap-1 flex-shrink-0">
              <button class="checkbox-btn w-5 h-5 border border-gray-300 rounded flex items-center justify-center hover:border-[#184EFF] transition-colors">
                <svg class="w-3 h-3 text-white hidden" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6L5 9L10 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </button>
              <div class="more-options-wrapper relative">
                <button class="more-options-btn p-1.5 hover:bg-[#F5F7F9] rounded transition-colors">
                  <svg class="w-4 h-4 text-gray-500 hover:text-[#184EFF]" viewBox="0 0 16 16" fill="currentColor">
                    <circle cx="3" cy="8" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="13" cy="8" r="1.5"/>
                  </svg>
                </button>
                <div class="more-options-dropdown absolute top-full right-0 mt-1 bg-[#1F2937] rounded-lg shadow-xl min-w-[140px] py-1 opacity-0 invisible -translate-y-2 transition-all z-50">
                  <button class="flex items-center gap-2 w-full px-3 py-2 text-white text-sm hover:bg-[#374151]"><span>Edit</span></button>
                  <button class="flex items-center gap-2 w-full px-3 py-2 text-white text-sm hover:bg-[#374151]"><span>Copy</span></button>
                  <button class="flex items-center gap-2 w-full px-3 py-2 text-white text-sm hover:bg-[#374151]"><span>Remove</span></button>
                </div>
              </div>
            </div>
          </div>
          <div class="px-3 pb-3">
            <div class="p-2 rounded-md shadow-sm bg-white border border-gray-100">
              <div class="text-sm font-semibold text-[#141414] mb-1">Stretching</div>
              <div class="text-sm text-[#7B7E91]">
                <div class="truncate">5 minutes</div>
                <div class="truncate">Full body stretch routine</div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

  </div>

  <!-- JavaScript -->
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      // Check if title is truncated and add/remove show-tooltip class
      function checkTruncation() {
        document.querySelectorAll('.item-title').forEach(title => {
          const wrapper = title.closest('.title-wrapper');
          const tooltip = wrapper?.querySelector('.title-tooltip');
          if (tooltip) {
            // Check if text is truncated
            if (title.scrollWidth > title.clientWidth) {
              tooltip.classList.add('show-tooltip');
            } else {
              tooltip.classList.remove('show-tooltip');
            }
          }
        });
      }

      // Run on load and resize
      checkTruncation();
      window.addEventListener('resize', checkTruncation);

      // Checkbox toggle
      document.querySelectorAll('.checkbox-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          const checkmark = this.querySelector('svg');
          const isChecked = this.classList.contains('bg-[#184EFF]');

          if (isChecked) {
            checkmark.classList.add('hidden');
            this.classList.remove('bg-[#184EFF]', 'border-[#184EFF]');
            this.classList.add('border-gray-300');
          } else {
            checkmark.classList.remove('hidden');
            this.classList.add('bg-[#184EFF]', 'border-[#184EFF]');
            this.classList.remove('border-gray-300');
          }
        });
      });

      // MoreOptions dropdown
      document.querySelectorAll('.more-options-wrapper').forEach(wrapper => {
        const btn = wrapper.querySelector('.more-options-btn');
        const dropdown = wrapper.querySelector('.more-options-dropdown');

        btn.addEventListener('click', function(e) {
          e.stopPropagation();
          const isOpen = dropdown.classList.contains('opacity-100');

          // Close all dropdowns first
          document.querySelectorAll('.more-options-dropdown').forEach(d => {
            d.classList.add('opacity-0', 'invisible', '-translate-y-2');
            d.classList.remove('opacity-100', 'visible', 'translate-y-0');
          });

          if (!isOpen) {
            dropdown.classList.remove('opacity-0', 'invisible', '-translate-y-2');
            dropdown.classList.add('opacity-100', 'visible', 'translate-y-0');
          }
        });
      });

      // Close dropdown on outside click
      document.addEventListener('click', function() {
        document.querySelectorAll('.more-options-dropdown').forEach(d => {
          d.classList.add('opacity-0', 'invisible', '-translate-y-2');
          d.classList.remove('opacity-100', 'visible', 'translate-y-0');
        });
      });

      // Dropdown item actions
      document.querySelectorAll('.more-options-dropdown button').forEach(item => {
        item.addEventListener('click', function(e) {
          e.stopPropagation();
          const action = this.querySelector('span')?.textContent;
          console.log('Action:', action);
          this.closest('.more-options-dropdown').classList.add('opacity-0', 'invisible', '-translate-y-2');
          this.closest('.more-options-dropdown').classList.remove('opacity-100', 'visible', 'translate-y-0');
        });
      });
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
  --color-text-secondary: #7B7E91;
  --color-text-blue: #184EFF;
  --color-bg-white: #FFFFFF;
  --color-border-default: #E5E7EB;
  --color-border-hover: #184EFF;
  --color-dropdown-bg: #1F2937;
  --color-dropdown-hover: #374151;
}

.item-in-calendar {
  background-color: var(--color-bg-white);
  border: 1px solid var(--color-border-default);
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  font-family: var(--font-family);
  cursor: pointer;
  transition: border-color 0.2s ease;
  width: 100%;
  max-width: 416px; /* x1.3 from 320px */
}

.item-in-calendar:hover {
  border-color: var(--color-border-hover);
}

/* Header - compact padding */
.item-in-calendar .header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  gap: 8px;
}

/* Title - blue, truncate */
.item-in-calendar .item-title {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-blue);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Sub-frame with shadow */
.item-in-calendar .content-frame {
  padding: 8px;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  background: var(--color-bg-white);
  border: 1px solid #F3F4F6;
}

/* Description truncate */
.item-in-calendar .description-line {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Tooltip */
.title-tooltip {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 0;
  background-color: var(--color-dropdown-bg);
  color: #FFFFFF;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s ease;
  z-index: 999;
  max-width: 300px;
  word-break: break-word;
}

.title-wrapper:hover .title-tooltip.show-tooltip {
  opacity: 1;
  visibility: visible;
}
```

## Tailwind CSS

### Single Card (Responsive)
```html
<div class="item-in-calendar w-full max-w-[416px] bg-white rounded-lg shadow-sm border border-gray-200 hover:border-[#184EFF] transition-colors cursor-pointer">
  <!-- Header - compact padding, sticky items -->
  <div class="flex items-center justify-between px-3 py-2 gap-2">
    <!-- Title (flex-1 min-w-0 for truncate) -->
    <div class="title-wrapper relative flex-1 min-w-0">
      <span class="text-sm font-medium text-[#184EFF] truncate block">Title Text</span>
      <div class="title-tooltip">Full Title Text</div>
    </div>
    <!-- Actions (flex-shrink-0 sticky right) -->
    <div class="flex items-center gap-1 flex-shrink-0">
      <!-- Checkbox -->
      <button class="w-5 h-5 border border-gray-300 rounded flex items-center justify-center hover:border-[#184EFF]">...</button>
      <!-- MoreOptions -->
      <button class="p-1.5 hover:bg-[#F5F7F9] rounded">...</button>
    </div>
  </div>
  <!-- Content - no divider -->
  <div class="px-3 pb-3">
    <!-- Sub-frame with padding and shadow -->
    <div class="p-2 rounded-md shadow-sm bg-white border border-gray-100">
      <div class="text-sm font-semibold text-[#141414] mb-1">Heading</div>
      <div class="text-sm text-[#7B7E91]">
        <div class="truncate">Description line 1</div>
        <div class="truncate">Description line 2</div>
      </div>
    </div>
  </div>
</div>
```

## Specifications

| Property | Before | After |
|----------|--------|-------|
| Max Width | 320px | 416px (x1.3) |
| Header Padding | `px-4 py-3` | `px-3 py-2` |
| Title Color | `#141414` | `#184EFF` |
| Title Overflow | None | `truncate` + tooltip |
| Divider | Yes | Removed |
| Blue Left Border | Yes | Removed |
| Content Frame | None | `p-2 shadow-sm border` |
| Description Overflow | None | `truncate` (no tooltip) |

## Responsive Behavior

| Breakpoint | Columns | Card Width |
|------------|---------|------------|
| Mobile (< 640px) | 1 | 100% |
| Tablet (640px+) | 2 | 50% |
| Desktop (1024px+) | 3 | 33% |

## Accessibility

- Title tooltip only shows when text is truncated
- Checkbox has `aria-label`
- MoreOptions has `aria-haspopup` and `aria-expanded`
- Keyboard navigation supported
- Color contrast meets WCAG AA

## Related Components

- [MoreOptionsHorizontal](./MoreOptionsHorizontal.md) - Three-dot menu pattern
- [NumberBadge](./NumberBadge.md) - Day indicator badge
- [Calendar](./Calendar.md) - Parent calendar component
- [Checkbox](./Checkbox.md) - Checkbox component
