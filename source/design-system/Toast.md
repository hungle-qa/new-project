---
name: Toast
category: feedback
created: 2026-02-05T00:00:00.000Z
updated: 2026-02-05T11:00:00+07:00
status: draft
---

# Toast

## Preview
A minimal toast notification component for displaying action feedback messages. Features:
- Dark gray/charcoal background (`#2D3748`)
- White text content area
- X close button on the right
- Fixed position in top-right corner
- Auto-dismiss after 3 seconds OR manual close via X button
- Smooth slide-in/fade-out animations
- Used for action feedback: create, update, delete operations

**Font:** Open Sans (`font-family: 'Open Sans', sans-serif`)

**Google Fonts Import:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

## Usage
Use toast notifications to provide temporary feedback after user actions such as:
- Successfully saving data ("Workout has been saved")
- Deleting items ("Item deleted successfully")
- Updating records ("Profile updated")
- Error messages ("Failed to save changes")

## HTML
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Toast Notification Component</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
</head>
<body class="bg-gray-100 p-8 font-['Open_Sans']">

  <!-- Demo Buttons -->
  <div class="flex flex-col gap-4">
    <h1 class="text-2xl font-bold text-gray-800 mb-4">Toast Notification Demo</h1>

    <div class="flex gap-3">
      <button
        id="showToastBtn"
        class="px-4 py-2 bg-[#184EFF] text-white rounded-lg hover:bg-[#184EFFE6] transition-colors font-medium"
      >
        Show Toast
      </button>

      <button
        id="showErrorToastBtn"
        class="px-4 py-2 bg-[#EA314A] text-white rounded-lg hover:bg-[#D42A41] transition-colors font-medium"
      >
        Show Error Toast
      </button>
    </div>
  </div>

  <!-- Toast Container (fixed top-right) -->
  <div id="toastContainer" class="fixed top-4 right-4 z-50 flex flex-col gap-2"></div>

  <!-- Toast Template (hidden, cloned by JS) -->
  <template id="toastTemplate">
    <div class="toast-notification flex items-center gap-3 min-w-[320px] max-w-[400px] bg-[#2D3748] rounded-lg shadow-lg p-4 transform translate-x-0 opacity-100 transition-all duration-300 ease-in-out">
      <!-- Content -->
      <div class="flex-1 min-w-0">
        <p class="toast-message text-white text-sm font-medium leading-relaxed">
          Workout has been saved
        </p>
      </div>

      <!-- Close Button - close_white.svg -->
      <button type="button" class="toast-close flex-shrink-0 focus:outline-none">
        <svg class="w-3 h-3" width="11" height="11" viewBox="0 0 11 11" xmlns="http://www.w3.org/2000/svg"><path d="M5.183 5.867L1.425 9.625a.483.483 0 11-.683-.683L4.5 5.183.742 1.425a.483.483 0 01.683-.683L5.183 4.5 8.942.742a.483.483 0 01.683.683L5.867 5.183l3.758 3.759a.483.483 0 01-.683.683L5.183 5.867z" fill="#FFF" stroke="#FFF" stroke-width=".5" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    </div>
  </template>

</body>
</html>
```

## CSS
```css
.toast-notification {
  font-family: 'Open Sans', sans-serif;
}
```

## Tailwind Classes Used
| Class | Purpose |
|-------|---------|
| `fixed top-4 right-4` | Fixed positioning in top-right corner |
| `z-50` | High z-index to appear above other content |
| `bg-[#2D3748]` | Dark gray/charcoal background |
| `rounded-lg` | Rounded corners |
| `shadow-lg` | Large shadow for elevation |
| `p-4` | Inner padding |
| `text-white` | White text for contrast |
| `text-sm` | Small text size (14px) |
| `font-medium` | Medium font weight |
| `transition-all duration-300` | Smooth animation |

## Props/Variants
| Variant | Tailwind Classes | Description |
|---------|------------------|-------------|
| default | `bg-[#2D3748]` | Dark gray background for general notifications |
| error | `bg-[#EA314A]` | Red background for error messages (per RULE.md) |

## Component States
| State | Trigger | Visual Changes | Tailwind Classes |
|-------|---------|----------------|------------------|
| Hidden | Initial | Not visible, translated right | `translate-x-full opacity-0` |
| Visible | Show toast | Slide in from right, fade in | `translate-x-0 opacity-100` |
| Dismissing | Auto or manual close | Slide out to right, fade out | `translate-x-full opacity-0` |

## JavaScript
```javascript
// Toast Notification System
document.addEventListener('DOMContentLoaded', function() {
  const toastContainer = document.getElementById('toastContainer');
  const toastTemplate = document.getElementById('toastTemplate');

  /**
   * Show a toast notification
   * @param {string} message - The message to display
   * @param {string} variant - Toast variant: 'default' or 'error'
   * @param {number} duration - Auto-dismiss duration in milliseconds (0 = no auto-dismiss)
   */
  function showToast(message, variant = 'default', duration = 3000) {
    if (!toastContainer || !toastTemplate) return;

    // Clone template
    const template = toastTemplate.content.cloneNode(true);
    const toast = template.querySelector('.toast-notification');
    const messageEl = template.querySelector('.toast-message');
    const closeBtn = template.querySelector('.toast-close');

    // Set message
    messageEl.textContent = message;

    // Apply variant styling
    if (variant === 'error') {
      toast.classList.remove('bg-[#2D3748]');
      toast.classList.add('bg-[#EA314A]');
    }

    // Start hidden (off-screen to the right)
    toast.classList.add('translate-x-full', 'opacity-0');

    // Append to container
    toastContainer.appendChild(toast);

    // Trigger animation (slide in)
    setTimeout(() => {
      toast.classList.remove('translate-x-full', 'opacity-0');
      toast.classList.add('translate-x-0', 'opacity-100');
    }, 10);

    // Close button handler
    function closeToast() {
      toast.classList.remove('translate-x-0', 'opacity-100');
      toast.classList.add('translate-x-full', 'opacity-0');

      setTimeout(() => {
        toast.remove();
      }, 300);
    }

    closeBtn.addEventListener('click', closeToast);

    // Auto-dismiss after duration
    if (duration > 0) {
      setTimeout(closeToast, duration);
    }

    console.log(`Toast shown: ${variant} - "${message}"`);
  }

  // Demo button handlers
  document.getElementById('showToastBtn')?.addEventListener('click', () => {
    showToast('Workout has been saved', 'default', 3000);
  });

  document.getElementById('showErrorToastBtn')?.addEventListener('click', () => {
    showToast('Failed to save changes', 'error', 4000);
  });

  // Make showToast globally available
  window.showToast = showToast;

  console.log('Toast notification system initialized');
});
```

## Usage Examples

### Basic Usage
```javascript
// Show default toast (auto-dismiss after 3 seconds)
showToast('Workout has been saved');

// Show with custom duration (5 seconds)
showToast('Item deleted successfully', 'default', 5000);

// Show without auto-dismiss (must close manually)
showToast('Important message', 'default', 0);
```

### Error Toast
```javascript
// Show error toast with red background
showToast('Failed to save changes', 'error');

// Error toast with custom duration
showToast('Connection failed', 'error', 5000);
```

## Specifications
| Property | Value |
|----------|-------|
| Background (default) | `#2D3748` (dark gray/charcoal) |
| Background (error) | `#EA314A` (per RULE.md --color-bg-red) |
| Text color | `#FFFFFF` (white) |
| Font size | 14px (text-sm) |
| Font weight | 500 (font-medium) |
| Padding | 16px (p-4) |
| Border radius | 8px (rounded-lg) |
| Min width | 320px |
| Max width | 400px |
| Position | Fixed top-right (top: 16px, right: 16px) |
| Auto-dismiss | 3 seconds (default) |
| Animation | 300ms ease-in-out |

## Accessibility
- Close button is keyboard focusable
- Clear visual contrast (white text on dark background)
- `type="button"` prevents form submission
- Smooth animations respect user preferences

## Notes
- Updated on 2026-02-05
- Uses Open Sans font family
- Fixed positioning in top-right corner
- Supports multiple toast stacking (vertical layout with gap)
- Auto-dismisses after 3 seconds by default (configurable)
- Manual close via X button using `close_white.svg` icon
- Smooth slide-in from right animation
- Smooth slide-out to right on dismiss
- Minimal design: no colored border, no icon indicator
- Two variants: default (dark gray) and error (red background)
- Button hover uses `#184EFFE6` per RULE.md
- Global `showToast()` function for easy integration
