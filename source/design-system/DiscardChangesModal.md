---
name: DiscardChangesModal
category: uncategorized
created: Tue Feb 03 2026 07:00:00 GMT+0700 (Indochina Time)
status: draft
---

# DiscardChangesModal

## Preview
A confirmation modal dialog with a warning icon, used to confirm destructive actions like discarding unsaved changes. Features a red warning icon, descriptive text, and two action buttons.

## Usage
Use this component for uncategorized interactions.

## HTML
```html
<!-- Icons used: close_circle, discard_changes_icon from design-system/icons/ -->
<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-['Open_Sans']">
  <div class="relative bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
    <button class="absolute top-3 right-3" aria-label="Close">
      <!-- Icon: close_circle -->
      <svg class="w-5 h-5" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M11 22c6.075 0 11-4.925 11-11S17.075 0 11 0 0 4.925 0 11s4.925 11 11 11z" fill="#111"/><path d="M11.183 11.867l-3.758 3.758a.483.483 0 11-.683-.683l3.758-3.759-3.758-3.758a.483.483 0 01.683-.683l3.758 3.758 3.759-3.758a.483.483 0 01.683.683l-3.758 3.758 3.758 3.759a.483.483 0 01-.683.683l-3.759-3.758z" stroke="#FFF" stroke-width=".5" fill="#FFF" stroke-linecap="round" stroke-linejoin="round"/></g></svg>
    </button>
    <div class="flex gap-2 items-center">
      <!-- Icon: discard_changes_icon -->
      <svg class="w-10 h-10 mb-4" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12.5" cy="12.5" r="12.5" fill="#EA314A"/><path d="M13.541 14.2691L13.9722 6H11.0439L11.4762 14.2691H13.541Z" fill="white"/><path d="M12.5 19C13.3975 19 14.125 18.2725 14.125 17.375C14.125 16.4775 13.3975 15.75 12.5 15.75C11.6025 15.75 10.875 16.4775 10.875 17.375C10.875 18.2725 11.6025 19 12.5 19Z" fill="white"/></svg>
      <h2 class="text-lg font-semibold text-[#141414] mb-3">Discard Changes</h2>
    </div>
    <p class="text-sm text-gray-500 leading-relaxed mb-6">Are you sure you want to go? Changes have not been saved yet.</p>
    <div class="gap-3 flex justify-end">
      <button class="px-6 py-2.5 text-sm font-medium text-[#141414] bg-white border border-gray-300 rounded-md hover:bg-[#F5F7F9]">Cancel</button>
      <button class="px-6 py-2.5 text-sm font-medium text-white bg-[#184EFF] rounded-md hover:bg-[#1241CC]">Discard Changes</button>
    </div>
  </div>
</div>
```

## Tailwind CSS
```html
<!-- Icons used: close_circle, discard_changes_icon from design-system/icons/ -->
<div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 font-['Open_Sans']">
  <div class="relative bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
    <button class="absolute top-3 right-3" aria-label="Close">
      <!-- Icon: close_circle -->
      <svg class="w-5 h-5" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M11 22c6.075 0 11-4.925 11-11S17.075 0 11 0 0 4.925 0 11s4.925 11 11 11z" fill="#111"/><path d="M11.183 11.867l-3.758 3.758a.483.483 0 11-.683-.683l3.758-3.759-3.758-3.758a.483.483 0 01.683-.683l3.758 3.758 3.759-3.758a.483.483 0 01.683.683l-3.758 3.758 3.758 3.759a.483.483 0 01-.683.683l-3.759-3.758z" stroke="#FFF" stroke-width=".5" fill="#FFF" stroke-linecap="round" stroke-linejoin="round"/></g></svg>
    </button>
    <div class="flex gap-2 items-center">
      <!-- Icon: discard_changes_icon -->
      <svg class="w-10 h-10 mb-4" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12.5" cy="12.5" r="12.5" fill="#EA314A"/><path d="M13.541 14.2691L13.9722 6H11.0439L11.4762 14.2691H13.541Z" fill="white"/><path d="M12.5 19C13.3975 19 14.125 18.2725 14.125 17.375C14.125 16.4775 13.3975 15.75 12.5 15.75C11.6025 15.75 10.875 16.4775 10.875 17.375C10.875 18.2725 11.6025 19 12.5 19Z" fill="white"/></svg>
      <h2 class="text-lg font-semibold text-[#141414] mb-3 h-fit">Discard Changes</h2>
    </div>
    <p class="text-sm text-gray-500 leading-relaxed mb-6">Are you sure you want to go? Changes have not been saved yet.</p>
    <div class="gap-3 flex justify-end">
      <button class="px-6 py-2.5 text-sm font-medium text-[#141414] bg-white border border-gray-300 rounded-md hover:bg-[#F5F7F9]">Cancel</button>
      <button class="px-6 py-2.5 text-sm font-medium text-white bg-[#184EFF] rounded-md hover:bg-[#1241CC]">Discard Changes</button>
    </div>
  </div>
</div>
```

## Props/Variants
| Variant | Class | Description |
|---------|-------|-------------|
| default | `.fixed` | Default style |

## Accessibility
- Ensure proper aria-labels
- Include focus states
- Test with keyboard navigation

## Notes
- Imported via web UI on Tue Feb 03 2026 07:00:00 GMT+0700 (Indochina Time)
- Uses design system icons: `close_circle`, `discard_changes_icon`