---
name: SaveConfirmationModal
category: feedback
created: 'Tue Feb 03 2026 07:00:00 GMT+0700 (Indochina Time)'
status: approved
---

# SaveConfirmationModal

## Preview
A confirmation modal dialog that prompts users to save changes before exiting. Features a warning icon, descriptive text, and two action buttons for save or exit without saving.

## Usage
Use this component for feedback interactions.

## HTML
```html
<!-- Icons used: close_circle, warning_purple_icon from design-system/icons/ -->
<div class="modal-overlay">
  <div class="modal">
    <button class="modal-close" aria-label="Close">
      <!-- Icon: close_circle -->
      <svg class="w-5 h-5" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M11 22c6.075 0 11-4.925 11-11S17.075 0 11 0 0 4.925 0 11s4.925 11 11 11z" fill="#111"/><path d="M11.183 11.867l-3.758 3.758a.483.483 0 11-.683-.683l3.758-3.759-3.758-3.758a.483.483 0 01.683-.683l3.758 3.758 3.759-3.758a.483.483 0 01.683.683l-3.758 3.758 3.758 3.759a.483.483 0 01-.683.683l-3.759-3.758z" stroke="#FFF" stroke-width=".5" fill="#FFF" stroke-linecap="round" stroke-linejoin="round"/></g></svg>
    </button>
    <div class="modal-icon">
      <!-- Icon: warning_purple_icon -->
      <svg class="w-10 h-10" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12.5" cy="12.5" r="12.5" fill="#184eff"/><path d="M13.541 14.27L13.972 6h-2.928l.432 8.27h2.065zM12.5 19a1.625 1.625 0 100-3.25 1.625 1.625 0 000 3.25z" fill="#fff"/></svg>
    </div>
    <h2 class="modal-title">Save before exiting?</h2>
    <p class="modal-description">You have made changes that have not been saved yet. Would you like to save changes before leaving?</p>
    <div class="modal-actions">
      <button class="btn-secondary">Exit without saving</button>
      <button class="btn-primary">Save</button>
    </div>
  </div>
</div>
```

## CSS
```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.modal {
  position: relative;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 24px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  color: #9ca3af;
  cursor: pointer;
  padding: 4px;
}

.modal-close:hover {
  color: #6b7280;
}

.modal-icon {
  /* Uses design system icon: warning_purple_icon */
  width: 40px;
  height: 40px;
  margin-bottom: 16px;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #141414;
  margin: 0 0 8px 0;
}

.modal-description {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
  margin: 0 0 24px 0;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-secondary {
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #141414;
  background-color: #ffffff;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  cursor: pointer;
}

.btn-secondary:hover {
  background-color: #F5F7F9;
}

.btn-primary {
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  background-color: #184EFF;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #1241CC;
}
```

## Tailwind CSS
```html
<!-- Icons used: close_circle, warning_purple_icon from design-system/icons/ -->
<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-['Open_Sans']">
  <div class="relative bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
    <button class="absolute top-3 right-3" aria-label="Close">
      <!-- Icon: close_circle -->
      <svg class="w-5 h-5" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M11 22c6.075 0 11-4.925 11-11S17.075 0 11 0 0 4.925 0 11s4.925 11 11 11z" fill="#111"/><path d="M11.183 11.867l-3.758 3.758a.483.483 0 11-.683-.683l3.758-3.759-3.758-3.758a.483.483 0 01.683-.683l3.758 3.758 3.759-3.758a.483.483 0 01.683.683l-3.758 3.758 3.758 3.759a.483.483 0 01-.683.683l-3.759-3.758z" stroke="#FFF" stroke-width=".5" fill="#FFF" stroke-linecap="round" stroke-linejoin="round"/></g></svg>
    </button>
    <div class="flex gap-2 items-center">
      <!-- Icon: warning_purple_icon -->
      <svg class="w-10 h-10 mb-4" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12.5" cy="12.5" r="12.5" fill="#184eff"/><path d="M13.541 14.27L13.972 6h-2.928l.432 8.27h2.065zM12.5 19a1.625 1.625 0 100-3.25 1.625 1.625 0 000 3.25z" fill="#fff"/></svg>
      <h2 class="text-lg font-semibold text-[#141414] mb-2">Save before exiting?</h2>
    </div>
    <p class="text-sm text-gray-500 leading-relaxed mb-6">You have made changes that have not been saved yet. Would you like to save changes before leaving?</p>
    <div class="flex gap-3 justify-end">
      <button class="px-4 py-2.5 text-sm font-medium text-[#141414] bg-white border border-gray-300 rounded-md hover:bg-[#F5F7F9]">Exit without saving</button>
      <button class="px-6 py-2.5 text-sm font-medium text-white bg-[#184EFF] rounded-md hover:bg-[#184EFFE6]">Save</button>
    </div>
  </div>
</div>
```

## Props/Variants
| Variant | Class | Description |
|---------|-------|-------------|
| default | `.modal-overlay` | Default style |

## Accessibility
- Ensure proper aria-labels
- Include focus states
- Test with keyboard navigation

## Notes
- Imported via web UI on Tue Feb 03 2026 07:00:00 GMT+0700 (Indochina Time)
- Uses design system icons: `close_circle`, `warning_purple_icon`
