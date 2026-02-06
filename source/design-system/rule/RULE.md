# Design System Rules

This file defines the baseline styling rules for all components in the design system. All imported components MUST follow these rules.

---

## Typography

### Font Family
```css
font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

**Installation (if not available):**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Font Colors
| Token | Value | Usage |
|-------|-------|-------|
| `--color-text-primary` | `#141414` | Primary text, headings, body text |
| `--color-text-white` | `#FFFFFF` | Text on dark/colored backgrounds |

---

## Colors

### Backgrounds
| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg-white` | `#FFFFFF` | Component backgrounds, cards, modals |

### Buttons
| Token | Value | Usage |
|-------|-------|-------|
| `--color-btn-action` | `#184EFF` | Primary/action button background |
| `--color-btn-action-hover` | `#184EFFE6` | Hovering on the SAVE button with blue background |
| `--color-btn-cancel` | `linear-gradient(0deg, #FFFFFF, #FFFFFF), linear-gradient(0deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05))` | Cancel/secondary button background |
| `--color-btn-cancel-hover` | `#F5F7F9` | Cancel button hover state |


---

## Custom Rules

| Token | Value | Usage | Type |
|-------|-------|-------|------|
| `--color-bg-combobox-hover` | `#F0F1FF` | Hover on the item on the combobox, dropdown | color |
| `--color-border-textbox-hover` | `#184EFF` | border when hovering the textbox, search box, datebox... Always 1px. | color |
| `--color-text-blue` | `#184EFF` | Hovering the text is black | color |
| `--color-bg-buttonwhite-hover` | `#F0F1FF` | Hovering the button color is white | color |
| `--color-text-secondary` | `#222222` | Left sidebar: Main section, Sub section; text in the item (list, dropdownlist) | color |
| `--color-bg-red` | `#EA314A` | background for error or button destructive Action (toast, discard change button, delete button..) | color |
| `--color-btn-action-hover-red` | `#EA314AE6` | Primary button destructive action hover state | color |
| `--color-bg-gray` | `#F0F0F2` | Gray background | color |
| `--color-text-gray` | `#7B7E91` | Gray text | color |
| `--arrow-btn-hover` | `icon only` | Arrow buttons: hover changes icon to blue (#184EFF), NO background change | text |
| `--color-btn-add-hover` | `#1649ED` | Hovering on the CREATE/ADD button with blue background | color |
| `--text-hyperlink-hover` | `Underline` | The blue text is clickable (hyperlink, choose a file, add video link...) | text |
| `--dashline` | `always 1px, color #E5E7EB` | The dashline | text |
| `--fontsize-btn-action-text` | `text always 13px` | Primary/action button in a form | text |
| `--close-icon-size` | `18x18` | X (close) icon using `close_circle.svg`, always `width="18" height="18" viewBox="0 0 22 22"`. Circle fill: `#111` (dark bg) or `#6B7280` (gray bg). | icon |
| `--close-icon-position` | `absolute, top: -8px, right: -8px` | X icon overlaps top-right corner of container. Parent must have `position: relative`. | position |
| `--height-btn-action-popup` | `34px` | Action button (Save, Save & Close, etc.) in pop-up/modal/form always height 34px | size |
| `--height-btn-add` | `30px` | Create/Add button always height 30px | size |
| `--fontsize-btn-add` | `12px` | Create/Add button always font-size 12px | text |
| `--fontsize-content` | `13px` | All content text always 13px EXCEPT header, title, heading. Applies to: combobox, dropdown list, placeholder, single choice, multiple choice, datetime picker, toast message, tab text, text in any frame, description, body, label, link, list item. | text |
| `--icon-warning-size` | `25x25` | Warning icon (`warning_purple_icon.svg`) in modals always `width="25" height="25"` | icon |
| `--icon-discard-size` | `25x25` | Discard changes icon (`discard_changes_icon.svg`) in modals always `width="25" height="25"` | icon |

---

## CSS Variables

Include these variables in your component styles:

```css
:root {
  /* Typography */
  --font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --color-text-primary: #141414;
  --color-text-white: #FFFFFF;

  /* Backgrounds */
  --color-bg-white: #FFFFFF;

  /* Buttons */
  --color-btn-action: #184EFF;
  --color-btn-action-hover: #184EFFE6;
  --color-btn-cancel-hover: #F5F7F9;
  --color-bg-combobox-hover: #F0F1FF;
  --color-border-textbox-hover: #184EFF;
  --color-text-blue: #184EFF;
  --color-bg-buttonwhite-hover: #F0F1FF;
  --color-text-secondary: #222222;
  --color-bg-red: #EA314A;
  --color-btn-action-hover-red: #EA314AE6;
  --color-bg-gray: #F0F0F2;
  --color-text-gray: #7B7E91;
  --arrow-btn-hover: icon only;
  --color-btn-add-hover: #1649ED;
  --text-hyperlink-hover: Underline;
  --dashline: always 1px, color #E5E7EB;
  --fontsize-btn-action-text: text always 13px;
  --close-icon-size: 18x18;
  --height-btn-action-popup: 34px;
  --height-btn-add: 30px;
  --fontsize-btn-add: 12px;
  --fontsize-content: 13px;
  --icon-warning-size: 25x25;
  --icon-discard-size: 25x25;
}
```

---

## Button Styles

### Action Button (Primary)
```css
.btn-action {
  background-color: #184EFF;
  color: #FFFFFF;
  border: none;
  font-family: 'Open Sans', sans-serif;
}

.btn-action:hover {
  background-color: #184EFFE6;
}
```

**Tailwind:**
```html
<button class="bg-[#184EFF] text-white hover:bg-[#184EFFE6] font-['Open_Sans']">
  Action
</button>
```

### Cancel Button (Secondary)
```css
.btn-cancel {
  background: linear-gradient(0deg, #FFFFFF, #FFFFFF), linear-gradient(0deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.05));
  color: #141414;
  border: 1px solid #E5E7EB;
  font-family: 'Open Sans', sans-serif;
}

.btn-cancel:hover {
  background: #F5F7F9;
}
```

**Tailwind:**
```html
<button class="bg-white text-[#141414] border border-gray-200 hover:bg-[#F5F7F9] font-['Open_Sans']">
  Cancel
</button>
```

---

## Component Template

When creating new components, use this baseline:

```css
.component {
  background-color: #FFFFFF;
  font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #141414;
}
```

**Tailwind baseline:**
```html
<div class="bg-white text-[#141414] font-['Open_Sans']">
  <!-- Component content -->
</div>
```

---

## Quick Reference

| Property | Value |
|----------|-------|
| Background (component) | `#FFFFFF` |
| Font | `Open Sans` |
| Text color (dark) | `#141414` |
| Text color (light) | `#FFFFFF` |
| Action button bg | `#184EFF` |
| Action button hover | `#184EFFE6` |
| Cancel button bg | `#FFFFFF` with subtle gradient |
| Cancel button hover | `#F5F7F9` |

---

## Rules for Import

When importing components via `import-design` or `import-design-by-image`:

1. **MUST** use `Open Sans` font (include Google Fonts link if needed)
2. **MUST** use `#FFFFFF` for component backgrounds
3. **MUST** use `#141414` for primary text color
4. **MUST** use `#184EFF` for action/primary buttons
5. **MUST** use the gradient background for cancel/secondary buttons
6. **MUST** use `#F5F7F9` for cancel button hover state
7. **REPLACE** any blue (#3b82f6, etc.) with `#184EFF` for action buttons
8. **REPLACE** any gray button backgrounds with the cancel button gradient
