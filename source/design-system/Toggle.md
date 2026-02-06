---
name: Toggle
category: Forms
created: 2026-02-05T00:00:00.000Z
status: approved
---

# Toggle

A toggle switch component for binary on/off states. Used for settings, preferences, and feature flags.

## Component States

| State | Track Color | Circle Position | Description |
|-------|-------------|-----------------|-------------|
| OFF | `#D1D5DB` (gray-300) | Left | Default inactive state |
| ON | `#184EFF` (primary blue) | Right | Active/enabled state |

## HTML

### OFF State
```html
<button type="button" role="switch" aria-checked="false" class="toggle toggle-off">
  <span class="toggle-circle"></span>
</button>
```

### ON State
```html
<button type="button" role="switch" aria-checked="true" class="toggle toggle-on">
  <span class="toggle-circle"></span>
</button>
```

### With Label
```html
<label class="toggle-label">
  <span class="toggle-label-text">Enable notifications</span>
  <button type="button" role="switch" aria-checked="false" class="toggle toggle-off">
    <span class="toggle-circle"></span>
  </button>
</label>
```

## CSS

```css
.toggle {
  position: relative;
  width: 44px;
  height: 24px;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;
}

.toggle:focus {
  outline: 2px solid #184EFF;
  outline-offset: 2px;
}

.toggle-off {
  background-color: #D1D5DB;
}

.toggle-on {
  background-color: #184EFF;
}

.toggle-circle {
  position: absolute;
  top: 2px;
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 9999px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
}

.toggle-off .toggle-circle {
  left: 2px;
}

.toggle-on .toggle-circle {
  left: 22px;
}

/* Disabled state */
.toggle:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Label styling */
.toggle-label {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.toggle-label-text {
  font-size: 13px;
  color: #374151;
}
```

## JavaScript

```javascript
// Toggle functionality
function initToggle(toggleButton) {
  toggleButton.addEventListener('click', () => {
    const isOn = toggleButton.getAttribute('aria-checked') === 'true';
    const newState = !isOn;

    // Update aria-checked
    toggleButton.setAttribute('aria-checked', newState.toString());

    // Update visual state (Tailwind)
    if (newState) {
      toggleButton.classList.remove('bg-gray-300');
      toggleButton.classList.add('bg-[#184EFF]');
      toggleButton.querySelector('span').classList.add('translate-x-5');
    } else {
      toggleButton.classList.remove('bg-[#184EFF]');
      toggleButton.classList.add('bg-gray-300');
      toggleButton.querySelector('span').classList.remove('translate-x-5');
    }

    // Dispatch change event
    toggleButton.dispatchEvent(new CustomEvent('toggle-change', {
      detail: { checked: newState }
    }));
  });
}

// Initialize all toggles
document.querySelectorAll('[role="switch"]').forEach(initToggle);
```

## Accessibility

- Uses `role="switch"` for screen readers
- `aria-checked` indicates current state
- Keyboard accessible (Space/Enter to toggle)
- Focus ring visible for keyboard navigation
- Disabled state with `opacity-50` and `cursor-not-allowed`

