---
name: NumberBadge
category: feedback
created: 2026-02-05T03:30:00.000Z
updated: 2026-02-05T03:30:00.000Z
status: approved
---

# NumberBadge

## Preview
A circular badge component displaying numbers with perfect circle shape. Used to indicate selected states, step numbers, or numerical indicators in UI. Supports default (unselected) and selected states with three size variants.

## Usage
Use NumberBadge when you need to:
- Display step numbers in multi-step forms or wizards
- Show numerical indicators or counters
- Indicate selected/active items in a numbered list
- Display date numbers in calendar components
- Show position or rank numbers

## HTML

### Selected State (All Sizes)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>NumberBadge - All Variants</title>

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
</head>
<body class="bg-gray-100 p-8 font-['Open_Sans']">

  <div class="space-y-8">

    <!-- Small Size (32px) -->
    <div>
      <h3 class="text-sm font-semibold mb-4 text-[#141414]">Small (32px)</h3>
      <div class="flex gap-4 items-center">
        <!-- Default/Unselected -->
        <div class="inline-flex items-center justify-center w-8 h-8 bg-white text-[#141414] text-sm font-medium rounded-full border border-gray-300">
          01
        </div>
        <!-- Selected -->
        <div class="inline-flex items-center justify-center w-8 h-8 bg-[#184EFF] text-white text-sm font-semibold rounded-full">
          05
        </div>
      </div>
    </div>

    <!-- Medium Size (48px) - DEFAULT -->
    <div>
      <h3 class="text-sm font-semibold mb-4 text-[#141414]">Medium (48px) - Default</h3>
      <div class="flex gap-4 items-center">
        <!-- Default/Unselected -->
        <div class="inline-flex items-center justify-center w-12 h-12 bg-white text-[#141414] text-base font-medium rounded-full border border-gray-300">
          01
        </div>
        <!-- Selected -->
        <div class="inline-flex items-center justify-center w-12 h-12 bg-[#184EFF] text-white text-base font-semibold rounded-full">
          05
        </div>
      </div>
    </div>

    <!-- Large Size (64px) -->
    <div>
      <h3 class="text-sm font-semibold mb-4 text-[#141414]">Large (64px)</h3>
      <div class="flex gap-4 items-center">
        <!-- Default/Unselected -->
        <div class="inline-flex items-center justify-center w-16 h-16 bg-white text-[#141414] text-lg font-medium rounded-full border border-gray-300">
          01
        </div>
        <!-- Selected -->
        <div class="inline-flex items-center justify-center w-16 h-16 bg-[#184EFF] text-white text-lg font-semibold rounded-full">
          05
        </div>
      </div>
    </div>

    <!-- Example: Step Indicator -->
    <div>
      <h3 class="text-sm font-semibold mb-4 text-[#141414]">Example: Step Indicator</h3>
      <div class="flex gap-3 items-center">
        <div class="inline-flex items-center justify-center w-12 h-12 bg-[#184EFF] text-white text-base font-semibold rounded-full">
          01
        </div>
        <div class="w-12 h-0.5 bg-gray-300"></div>
        <div class="inline-flex items-center justify-center w-12 h-12 bg-[#184EFF] text-white text-base font-semibold rounded-full">
          02
        </div>
        <div class="w-12 h-0.5 bg-gray-300"></div>
        <div class="inline-flex items-center justify-center w-12 h-12 bg-white text-[#141414] text-base font-medium rounded-full border border-gray-300">
          03
        </div>
      </div>
    </div>

  </div>

</body>
</html>
```

## CSS

```css
/* NumberBadge Base Styles */
.number-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  border-radius: 50%;
}

/* Size Variants */
.number-badge-sm {
  width: 32px;
  height: 32px;
  font-size: 14px;
}

.number-badge-md {
  width: 48px;
  height: 48px;
  font-size: 16px;
}

.number-badge-lg {
  width: 64px;
  height: 64px;
  font-size: 18px;
}

/* Default State (Unselected) */
.number-badge-default {
  background-color: #FFFFFF;
  color: #141414;
  font-weight: 500;
  border: 1px solid #D1D5DB;
}

/* Selected State */
.number-badge-selected {
  background-color: #184EFF;
  color: #FFFFFF;
  font-weight: 600;
  border: none;
}

/* Hover State (Optional) */
.number-badge-default:hover {
  border-color: #184EFF;
  cursor: pointer;
}

.number-badge-selected:hover {
  background-color: #184EFFE6;
  cursor: pointer;
}

/* Complete Class Examples */
.number-badge-sm-default {
  width: 32px;
  height: 32px;
  font-size: 14px;
  background-color: #FFFFFF;
  color: #141414;
  font-weight: 500;
  border: 1px solid #D1D5DB;
}

.number-badge-sm-selected {
  width: 32px;
  height: 32px;
  font-size: 14px;
  background-color: #184EFF;
  color: #FFFFFF;
  font-weight: 600;
}

.number-badge-md-default {
  width: 48px;
  height: 48px;
  font-size: 16px;
  background-color: #FFFFFF;
  color: #141414;
  font-weight: 500;
  border: 1px solid #D1D5DB;
}

.number-badge-md-selected {
  width: 48px;
  height: 48px;
  font-size: 16px;
  background-color: #184EFF;
  color: #FFFFFF;
  font-weight: 600;
}

.number-badge-lg-default {
  width: 64px;
  height: 64px;
  font-size: 18px;
  background-color: #FFFFFF;
  color: #141414;
  font-weight: 500;
  border: 1px solid #D1D5DB;
}

.number-badge-lg-selected {
  width: 64px;
  height: 64px;
  font-size: 18px;
  background-color: #184EFF;
  color: #FFFFFF;
  font-weight: 600;
}
```

## Tailwind Classes Used

| Class | Purpose |
|-------|---------|
| `inline-flex` | Creates inline flex container |
| `items-center` | Vertical centering |
| `justify-center` | Horizontal centering |
| `rounded-full` | Perfect circle (border-radius: 50%) |
| `w-8 h-8` | Small size (32px × 32px) |
| `w-12 h-12` | Medium size (48px × 48px) |
| `w-16 h-16` | Large size (64px × 64px) |
| `bg-white` | Default background |
| `bg-[#184EFF]` | Selected background (design system blue) |
| `text-[#141414]` | Default text color (dark) |
| `text-white` | Selected text color |
| `text-sm` | Small font size (14px) |
| `text-base` | Medium font size (16px) |
| `text-lg` | Large font size (18px) |
| `font-medium` | Font weight 500 (default state) |
| `font-semibold` | Font weight 600 (selected state) |
| `border` | Border for default state |
| `border-gray-300` | Gray border color |

## Props/Variants

### Size Variants

| Variant | Dimensions | Font Size | Tailwind Classes |
|---------|-----------|-----------|------------------|
| Small | 32px × 32px | 14px | `w-8 h-8 text-sm` |
| Medium (Default) | 48px × 48px | 16px | `w-12 h-12 text-base` |
| Large | 64px × 64px | 18px | `w-16 h-16 text-lg` |

### State Variants

| State | Background | Text Color | Border | Font Weight | Tailwind Classes |
|-------|-----------|-----------|--------|-------------|------------------|
| Default | `#FFFFFF` | `#141414` | 1px `#D1D5DB` | 500 | `bg-white text-[#141414] border border-gray-300 font-medium` |
| Selected | `#184EFF` | `#FFFFFF` | None | 600 | `bg-[#184EFF] text-white font-semibold` |

## Component States

| State | Trigger | Visual Changes | Tailwind Classes |
|-------|---------|----------------|------------------|
| Default | - | White background, dark text, gray border | `bg-white text-[#141414] border border-gray-300` |
| Selected | User selection/focus | Blue background, white text, no border | `bg-[#184EFF] text-white` |
| Hover (Optional) | Mouse over default | Border changes to blue | `hover:border-[#184EFF]` |
| Hover (Optional) | Mouse over selected | Slightly transparent blue | `hover:bg-[#184EFFE6]` |

## Usage Examples

### Single Badge
```html
<!-- Small Selected -->
<div class="inline-flex items-center justify-center w-8 h-8 bg-[#184EFF] text-white text-sm font-semibold rounded-full">
  05
</div>

<!-- Medium Default -->
<div class="inline-flex items-center justify-center w-12 h-12 bg-white text-[#141414] text-base font-medium rounded-full border border-gray-300">
  01
</div>

<!-- Large Selected -->
<div class="inline-flex items-center justify-center w-16 h-16 bg-[#184EFF] text-white text-lg font-semibold rounded-full">
  12
</div>
```

### Step Indicator (Multiple Badges)
```html
<div class="flex gap-3 items-center">
  <!-- Step 1 - Completed -->
  <div class="inline-flex items-center justify-center w-12 h-12 bg-[#184EFF] text-white text-base font-semibold rounded-full">
    01
  </div>
  <div class="w-12 h-0.5 bg-[#184EFF]"></div>

  <!-- Step 2 - Current -->
  <div class="inline-flex items-center justify-center w-12 h-12 bg-[#184EFF] text-white text-base font-semibold rounded-full">
    02
  </div>
  <div class="w-12 h-0.5 bg-gray-300"></div>

  <!-- Step 3 - Upcoming -->
  <div class="inline-flex items-center justify-center w-12 h-12 bg-white text-[#141414] text-base font-medium rounded-full border border-gray-300">
    03
  </div>
</div>
```

### Calendar Date Badge
```html
<!-- Day number in calendar -->
<div class="inline-flex items-center justify-center w-12 h-12 bg-[#184EFF] text-white text-base font-semibold rounded-full">
  15
</div>
```

## Accessibility

- **Semantic HTML**: Use appropriate container elements (div, span, button based on context)
- **Color Contrast**: Selected state (#184EFF bg + #FFFFFF text) meets WCAG AA standards
- **Text Size**: Minimum 14px for small variant ensures readability
- **Interactive Elements**: If used as button, add `role="button"` and keyboard support
- **Screen Readers**: Add `aria-label` for context (e.g., "Step 5 selected")

### Accessible Interactive Example
```html
<button
  type="button"
  class="inline-flex items-center justify-center w-12 h-12 bg-[#184EFF] text-white text-base font-semibold rounded-full"
  aria-label="Step 5, currently selected"
  aria-current="step">
  05
</button>
```

## Design System Compliance

This component follows all rules from `source/design-system/rule/RULE.md`:

| Rule | Implementation |
|------|----------------|
| Font Family | Open Sans (included via Google Fonts) |
| Primary Text | `#141414` for default state |
| Text on Colored BG | `#FFFFFF` for selected state |
| Action Button Color | `#184EFF` for selected background |
| Background Color | `#FFFFFF` for default state |
| Font Weight | 500 (default), 600 (selected) |

## Notes

- Generated from image on 2026-02-05
- Component is visual-only by default (no JavaScript required)
- Perfect circle shape achieved with `rounded-full` (border-radius: 50%)
- Equal width and height ensure perfect circle at all sizes
- Selected state uses design system primary blue (#184EFF)
- Font sizes scale proportionally with badge size
- Can be converted to interactive button with JavaScript if needed
- Border only applies to default/unselected state
- Hover states are optional and can be added with `hover:` modifiers

## Related Components

- **[Calendar](./Calendar.md)**: Uses NumberBadge-sm style for today indicator
- **Chip**: For text labels with removable functionality
- **Badge**: For status indicators and counts
- **Button**: For interactive clickable elements

## Version History

- **v1.0.0** (2026-02-05): Initial component creation with three size variants and two states
