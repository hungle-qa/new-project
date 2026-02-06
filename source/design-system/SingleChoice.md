---
name: SingleChoice
category: forms
status: approved
created: 2026-02-06T07:30:00.000Z
updated: 2026-02-06T07:30:00.000Z
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
      <span class="text-[13px] font-semibold text-[#141414]">Meal Plan</span>
    </label>
    <label class="flex items-center gap-2.5 cursor-pointer">
      <input type="radio" name="header-display" value="meal-guidance" class="w-4 h-4 accent-[#184EFF]" />
      <span class="text-[13px] text-[#7B7E91]">Meal Guidance</span>
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
