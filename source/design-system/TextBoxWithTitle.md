---
name: TextBoxWithTitle
category: forms
created: 2026-02-06T00:00:00.000Z
updated: 2026-02-06T00:00:00.000Z
status: approved
---

# TextBoxWithTitle

## Preview
A labeled text input with character counter. Features:
- Uppercase label on the left, character counter on the right
- Real-time character counting (e.g., 0/90)
- Counter turns red when reaching Max-5 characters
- Prevents input beyond max characters
- Right padding ensures text doesn't touch the border edge
- Required field validation: red border, pink background, error message below

**Modular Components:**
- Builds on **TextBox.md** styling

**Font:** Open Sans (`font-family: 'Open Sans', sans-serif`)

## Usage
Use for form fields that require character limits, such as task names, titles, or short descriptions. The counter gives users immediate feedback on remaining characters.

## HTML
```html
<div class="textbox-titled">
  <!-- Header: Label + Counter -->
  <div class="textbox-titled__header">
    <label class="textbox-titled__label" for="textboxTitled">TASK NAME</label>
    <span class="textbox-titled__counter" id="charCounter">0 / 90</span>
  </div>

  <!-- Input -->
  <input
    type="text"
    class="textbox-titled__input"
    id="textboxTitled"
    maxlength="90"
    required
    aria-label="Task name"
  />

  <!-- Error message (hidden by default, shown on .is-error) -->
  <span class="textbox-titled__error" id="textboxError">Please add a task name</span>
</div>
```

## CSS
```css
:root {
  --font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --color-text-primary: #141414;
  --color-text-gray: #7B7E91;
  --color-bg-white: #FFFFFF;
  --color-border-textbox-hover: #184EFF;
  --color-bg-red: #EA314A;
}

/* Container */
.textbox-titled {
  width: 100%;
  max-width: 560px;
  font-family: var(--font-family);
}

/* Header: Label + Counter */
.textbox-titled__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
}

.textbox-titled__label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--color-text-gray);
  letter-spacing: 0.3px;
}

.textbox-titled__counter {
  font-size: 12px;
  font-weight: 400;
  color: var(--color-text-gray);
  transition: color 0.15s ease;
}

/* Counter warning state: red when near/at max */
.textbox-titled__counter.is-warning {
  color: var(--color-bg-red);
}

/* Input */
.textbox-titled__input {
  width: 100%;
  padding: 10px 16px;
  padding-right: 26px;
  font-size: 13px;
  font-family: var(--font-family);
  color: var(--color-text-primary);
  background-color: var(--color-bg-white);
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  outline: none;
  transition: border-color 0.15s ease;
  box-sizing: border-box;
}

.textbox-titled__input::placeholder {
  color: #9CA3AF;
}

.textbox-titled__input:hover {
  border-color: var(--color-border-textbox-hover);
}

.textbox-titled__input:focus {
  border-color: var(--color-border-textbox-hover);
}

/* Error state */
.textbox-titled.is-error .textbox-titled__input {
  border-color: var(--color-bg-red);
  background-color: #FEF2F2;
}

.textbox-titled.is-error .textbox-titled__input:hover,
.textbox-titled.is-error .textbox-titled__input:focus {
  border-color: var(--color-bg-red);
}

.textbox-titled__error {
  display: none;
  font-size: 13px;
  color: var(--color-bg-red);
  margin-top: 6px;
}

.textbox-titled.is-error .textbox-titled__error {
  display: block;
}
```

## JavaScript
```javascript
// TextBoxWithTitle - Character counter with warning state
document.addEventListener('DOMContentLoaded', function() {
  const input = document.getElementById('textboxTitled');
  const counter = document.getElementById('charCounter');

  if (!input || !counter) {
    console.log('TextBoxWithTitle: Elements not found');
    return;
  }

  const maxLength = parseInt(input.getAttribute('maxlength')) || 90;
  const warningThreshold = maxLength - 5;

  function updateCounter() {
    const currentLength = input.value.length;
    counter.textContent = currentLength + ' / ' + maxLength;

    // Add warning class when within 5 chars of max
    if (currentLength >= warningThreshold) {
      counter.classList.add('is-warning');
    } else {
      counter.classList.remove('is-warning');
    }
  }

  input.addEventListener('input', function() {
    updateCounter();

    // Clear error on input if field has value
    if (input.value.length > 0) {
      input.closest('.textbox-titled').classList.remove('is-error');
    }
  });

  // Validate on blur: show error if required and empty
  input.addEventListener('blur', function() {
    if (input.hasAttribute('required') && input.value.trim().length === 0) {
      input.closest('.textbox-titled').classList.add('is-error');
    }
  });

  // Initialize counter
  updateCounter();

  console.log('TextBoxWithTitle: Initialized (max: ' + maxLength + ', warning at: ' + warningThreshold + ')');
});
```

## Component States

| State | Trigger | Visual Changes | CSS Classes |
|-------|---------|----------------|-------------|
| Default | - | Gray border, counter shows 0/90 | `.textbox-titled` |
| Hover | Mouse over input | Blue border #184EFF | `.textbox-titled__input:hover` |
| Focus | Click/tab into input | Blue border #184EFF | `.textbox-titled__input:focus` |
| Typing | User types | Counter updates in real-time | - |
| Warning | Length >= Max-5 | Counter text turns red #EA314A | `.is-warning` |
| Max reached | Length == Max | Counter red, input prevented | `maxlength` attr |
| Error | Blur when empty + required | Red border, pink bg #FEF2F2, error message | `.is-error` |

## Accessibility
- Uses `<label>` with `for` attribute linked to input `id`
- `aria-label` for screen readers
- `maxlength` attribute enforces limit natively
- Clear visual feedback via counter color change
- Keyboard accessible (Tab, typing)

## Notes
- Created on 2026-02-06
- Counter format: "current / max" (e.g., "0 / 90")
- Warning threshold: Max - 5 (configurable via `warningThreshold`)
- `maxlength` attribute handles input prevention natively (no JS needed)
- Right padding 26px (16px + 10px extra) prevents text from touching border edge
- Label is uppercase, 12px, gray — matches design system form label pattern
- Builds on TextBox.md styling conventions
- Updated 2026-02-06: Added required field error state (red border, pink bg, error message)
