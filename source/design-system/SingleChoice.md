---
name: SingleChoice
category: forms
status: draft
created: 2026-02-06T14:30:00+07:00
updated: 2026-02-06T14:30:00+07:00
---

# SingleChoice

## Preview
A radio button group with uppercase gray label, optional info icon, and vertically stacked options. Selected option shows bold text with filled blue radio; unselected shows gray text with empty circle.

## Usage
Use for single-selection choices where user must pick exactly one option from a short list (2-5 items). Suitable for settings panels, form configuration sections, and preference selectors.

## HTML
```html
<div class="bg-white font-['Open_Sans']">
  <div class="flex items-center gap-1.5 mb-3">
    <span class="text-xs font-semibold tracking-wide uppercase text-[#7B7E91]">Choose Header Display</span>
    <svg class="w-3.5 h-3.5" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7.5" stroke="#7B7E91" stroke-opacity="0.4"/>
      <text x="8" y="11.5" text-anchor="middle" fill="#7B7E91" font-size="10" font-family="Open Sans" font-weight="600">i</text>
    </svg>
  </div>
  <div class="flex flex-col gap-2.5">
    <label class="flex items-center gap-2.5 cursor-pointer">
      <input type="radio" name="header-display" value="meal-plan" checked class="w-4 h-4 accent-[#184EFF]" />
      <span class="text-sm font-semibold text-[#141414]">Meal Plan</span>
    </label>
    <label class="flex items-center gap-2.5 cursor-pointer">
      <input type="radio" name="header-display" value="meal-guidance" class="w-4 h-4 accent-[#184EFF]" />
      <span class="text-sm text-[#7B7E91]">Meal Guidance</span>
    </label>
  </div>
</div>
```

## CSS
```css
.single-choice {
  font-family: 'Open Sans', sans-serif;
}
```

## Tailwind Classes Used
| Class | Purpose |
|-------|---------|
| `bg-white` | Component background (RULE.md) |
| `font-['Open_Sans']` | Font family (RULE.md) |
| `text-xs` | Header label font size |
| `font-semibold` | Header label and selected option weight |
| `tracking-wide` | Header label letter spacing |
| `uppercase` | Header label capitalization |
| `text-[#7B7E91]` | Gray text for label and unselected option (RULE.md) |
| `text-[#141414]` | Primary text for selected option (RULE.md) |
| `text-sm` | Option label font size |
| `accent-[#184EFF]` | Radio button fill color (RULE.md primary) |
| `w-4 h-4` | Radio button size |
| `gap-1.5` | Spacing between header label and info icon |
| `gap-2.5` | Spacing between radio options and between radio and label |
| `mb-3` | Margin below header section |
| `cursor-pointer` | Pointer cursor on label hover |
| `flex`, `items-center` | Horizontal alignment |
| `flex-col` | Vertical stacking of options |

## Props/Variants
| Variant | Tailwind Classes | Description |
|---------|------------------|-------------|
| Selected option | `font-semibold text-[#141414]` | Bold dark text for active choice |
| Unselected option | `text-[#7B7E91]` | Gray text for inactive choice |
| With info icon | SVG inline after label | Optional tooltip trigger |
| Without info icon | Remove SVG element | Simpler header |

## Component States
| State | Trigger | Visual Changes | Tailwind Classes |
|-------|---------|----------------|------------------|
| Default | Page load | One option selected (bold), others gray | `text-[#141414] font-semibold` / `text-[#7B7E91]` |

## JavaScript
```javascript
document.addEventListener('DOMContentLoaded', function() {
  const radios = document.querySelectorAll('input[name="header-display"]');
  radios.forEach(function(radio) {
    radio.addEventListener('change', function() {
      radios.forEach(function(r) {
        const label = r.closest('label').querySelector('span');
        if (r.checked) {
          label.classList.add('font-semibold', 'text-[#141414]');
          label.classList.remove('text-[#7B7E91]');
        } else {
          label.classList.remove('font-semibold', 'text-[#141414]');
          label.classList.add('text-[#7B7E91]');
        }
      });
    });
  });
});
```

## Accessibility
- Uses native `<input type="radio">` for keyboard and screen reader support
- `<label>` wraps each radio for full click area
- Radio group uses shared `name` attribute for proper grouping
- Info icon SVG contains text content readable by assistive tech

## Notes
- Generated from image on 2026-02-06
- Selected option uses `font-semibold` + `text-[#141414]`; unselected uses `text-[#7B7E91]`
- Info icon is inline SVG (no external dependency)
- Radio accent color `#184EFF` matches RULE.md primary action color
- **Date Handling:**
  - `created`: Set once when component is first imported (GMT+7 format)
  - `updated`: Initially same as `created`, changes on subsequent edits
