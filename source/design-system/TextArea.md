---
name: TextArea
category: forms
status: approved
created: 2026-02-06T07:45:00.000Z
updated: 2026-02-06T07:45:00.000Z
---

# TextArea

## Preview
An auto-expanding textarea with 3 display modes: default (placeholder), edit (blue-bordered textarea), and preview (truncated with "See more" link). Starts as a plain div, switches to textarea on click, collapses to preview on blur.

## Usage
Use for multi-line text input where content length varies. Suitable for description fields, notes, comments, and any free-text entry that may span multiple lines.

## HTML
```html
<div id="textarea-wrapper" class="bg-white font-['Open_Sans'] w-full">
  <!-- Display mode (DEFAULT): plain div, shown on load -->
  <div id="textarea-display" class="relative w-full border-b border-gray-200 cursor-pointer">
    <div class="w-full px-3 py-2 text-sm leading-5 text-gray-400">Add Description</div>
    <span class="absolute top-3 right-3 w-2 h-2 rounded-full bg-teal-500"></span>
  </div>
  <!-- Edit mode: textarea, hidden by default -->
  <div id="textarea-edit" class="hidden relative w-full">
    <textarea
      id="auto-textarea"
      placeholder="Add Description"
      rows="1"
      class="w-full px-3 py-2 text-sm leading-5 text-[#141414] placeholder-gray-400 bg-white border border-[#184EFF] rounded outline-none resize-none overflow-hidden box-border"
    ></textarea>
    <span class="absolute top-3 right-3 w-2 h-2 rounded-full bg-teal-500"></span>
  </div>
  <!-- Preview mode: truncated content + see more -->
  <div id="textarea-preview" class="hidden w-full border-b border-gray-200">
    <div id="preview-text" class="w-full px-3 pt-2 text-sm leading-5 text-[#141414] cursor-pointer whitespace-pre-line"></div>
    <button id="see-more-btn" class="hidden px-3 pb-2 text-sm font-semibold text-[#184EFF] hover:underline cursor-pointer">See more</button>
  </div>
</div>

<script>
document.addEventListener('DOMContentLoaded', function() {
  var displayMode = document.getElementById('textarea-display');
  var editMode = document.getElementById('textarea-edit');
  var previewMode = document.getElementById('textarea-preview');
  var textarea = document.getElementById('auto-textarea');
  var previewText = document.getElementById('preview-text');
  var seeMoreBtn = document.getElementById('see-more-btn');
  var lineHeight = 20;
  var maxEditHeight = lineHeight * 5;

  function hideAll() {
    displayMode.classList.add('hidden');
    editMode.classList.add('hidden');
    previewMode.classList.add('hidden');
  }

  function autoResize() {
    textarea.style.height = 'auto';
    textarea.style.overflowY = 'hidden';
    if (textarea.scrollHeight > maxEditHeight) {
      textarea.style.height = maxEditHeight + 'px';
      textarea.style.overflowY = 'auto';
    } else {
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }

  function showEdit() {
    hideAll();
    editMode.classList.remove('hidden');
    textarea.focus();
    autoResize();
  }

  function showDisplay() {
    hideAll();
    displayMode.classList.remove('hidden');
  }

  function showPreview() {
    var value = textarea.value.trim();
    if (!value) { showDisplay(); return; }
    var lines = value.split('\n');
    if (lines.length >= 3) {
      var truncated = lines.slice(0, 2).join('\n') + '\n' + lines[2].substring(0, 20) + '...';
      previewText.innerText = truncated;
      seeMoreBtn.classList.remove('hidden');
    } else {
      previewText.innerText = value;
      seeMoreBtn.classList.add('hidden');
    }
    hideAll();
    previewMode.classList.remove('hidden');
  }

  // Pointer cursor on scrollbar hover
  textarea.addEventListener('mousemove', function(e) {
    var rect = this.getBoundingClientRect();
    var onScrollbar = this.scrollHeight > this.clientHeight && e.clientX >= rect.right - 8;
    this.style.cursor = onScrollbar ? 'pointer' : '';
  });
  textarea.addEventListener('mouseleave', function() {
    this.style.cursor = '';
  });

  displayMode.addEventListener('click', showEdit);
  previewText.addEventListener('click', showEdit);
  seeMoreBtn.addEventListener('click', showEdit);
  textarea.addEventListener('input', autoResize);
  textarea.addEventListener('blur', function() {
    setTimeout(showPreview, 150);
  });
});
</script>
```

## CSS
```css
.text-area {
  font-family: 'Open Sans', sans-serif;
}

/* Custom Scrollbar for textarea */
#auto-textarea {
  scrollbar-width: thin;
  scrollbar-color: #e1e1ea transparent;
}

#auto-textarea::-webkit-scrollbar {
  width: 6px;
}

#auto-textarea::-webkit-scrollbar-track {
  background: transparent;
}

#auto-textarea::-webkit-scrollbar-thumb {
  background-color: #e1e1ea;
  border-radius: 3px;
  cursor: pointer;
}
```

## Tailwind Classes Used
| Class | Purpose |
|-------|---------|
| `bg-white` | Component background (RULE.md) |
| `font-['Open_Sans']` | Font family (RULE.md) |
| `text-sm` | Text size for content and placeholder |
| `leading-5` | Line height (20px) for consistent auto-resize |
| `text-[#141414]` | Primary text color (RULE.md) |
| `text-gray-400` | Placeholder text color |
| `border-b border-gray-200` | Bottom border for display/preview modes |
| `border border-[#184EFF]` | Full blue border for edit mode (RULE.md) |
| `rounded` | Border radius on edit mode |
| `resize-none` | Disable manual resize handle |
| `overflow-hidden` | Hide overflow (JS manages scroll) |
| `box-border` | Include border in width calculation |
| `whitespace-pre-line` | Preserve line breaks in preview |
| `cursor-pointer` | Pointer cursor on clickable areas |
| `bg-teal-500` | Required indicator dot |
| `text-[#184EFF]` | "See more" link color (RULE.md primary) |
| `font-semibold` | "See more" link weight |

## Props/Variants
| Variant | Tailwind Classes | Description |
|---------|------------------|-------------|
| Display (default) | `border-b border-gray-200 text-gray-400` | Placeholder text with bottom border |
| Edit (focused) | `border border-[#184EFF] rounded` | Full blue border textarea |
| Preview (blurred) | `border-b border-gray-200 text-[#141414]` | Truncated content with bottom border |
| With "See more" | `text-[#184EFF] font-semibold` | Blue link shown when >= 3 lines |

## Component States
| State | Trigger | Visual Changes | Tailwind Classes |
|-------|---------|----------------|------------------|
| Display | Page load / blur with no content | Placeholder "Add Description", bottom gray border, teal dot | `text-gray-400 border-b border-gray-200` |
| Focus (empty) | Click on display | Blue border textarea with placeholder, teal dot | `border border-[#184EFF] rounded` |
| Focus (filled) | Typing content | Text appears, auto-expands up to 5 lines then scrolls | `text-[#141414] overflow-auto` |
| Preview (<3 lines) | Blur with 1-2 lines content | Full content shown, bottom border, no "See more" | `text-[#141414] border-b border-gray-200` |
| Preview (>=3 lines) | Blur with 3+ lines content | First 3 lines (3rd truncated), "See more" link | `text-[#141414]` + `text-[#184EFF]` link |

## JavaScript
```javascript
document.addEventListener('DOMContentLoaded', function() {
  var displayMode = document.getElementById('textarea-display');
  var editMode = document.getElementById('textarea-edit');
  var previewMode = document.getElementById('textarea-preview');
  var textarea = document.getElementById('auto-textarea');
  var previewText = document.getElementById('preview-text');
  var seeMoreBtn = document.getElementById('see-more-btn');
  var lineHeight = 20;
  var maxEditHeight = lineHeight * 5;

  function hideAll() {
    displayMode.classList.add('hidden');
    editMode.classList.add('hidden');
    previewMode.classList.add('hidden');
  }

  function autoResize() {
    textarea.style.height = 'auto';
    textarea.style.overflowY = 'hidden';
    if (textarea.scrollHeight > maxEditHeight) {
      textarea.style.height = maxEditHeight + 'px';
      textarea.style.overflowY = 'auto';
    } else {
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }

  function showEdit() {
    hideAll();
    editMode.classList.remove('hidden');
    textarea.focus();
    autoResize();
  }

  function showDisplay() {
    hideAll();
    displayMode.classList.remove('hidden');
  }

  function showPreview() {
    var value = textarea.value.trim();
    if (!value) { showDisplay(); return; }
    var lines = value.split('\n');
    if (lines.length >= 3) {
      var truncated = lines.slice(0, 2).join('\n') + '\n' + lines[2].substring(0, 20) + '...';
      previewText.innerText = truncated;
      seeMoreBtn.classList.remove('hidden');
    } else {
      previewText.innerText = value;
      seeMoreBtn.classList.add('hidden');
    }
    hideAll();
    previewMode.classList.remove('hidden');
  }

  // Pointer cursor on scrollbar hover
  textarea.addEventListener('mousemove', function(e) {
    var rect = this.getBoundingClientRect();
    var onScrollbar = this.scrollHeight > this.clientHeight && e.clientX >= rect.right - 8;
    this.style.cursor = onScrollbar ? 'pointer' : '';
  });
  textarea.addEventListener('mouseleave', function() {
    this.style.cursor = '';
  });

  // State transitions:
  // Display --click--> Edit
  // Edit --blur(empty)--> Display
  // Edit --blur(has content)--> Preview
  // Preview --click--> Edit
  displayMode.addEventListener('click', showEdit);
  previewText.addEventListener('click', showEdit);
  seeMoreBtn.addEventListener('click', showEdit);
  textarea.addEventListener('input', autoResize);
  textarea.addEventListener('blur', function() {
    setTimeout(showPreview, 150);
  });
});
```

## Accessibility
- Uses native `<textarea>` for keyboard and screen reader support
- Placeholder text visible in both display div and textarea
- Click targets are full-width for easy interaction
- "See more" is a `<button>` element for keyboard accessibility
- Focus is automatically set when switching to edit mode

## Notes
- Generated from 4 state images on 2026-02-06
- 3 display modes: display (default) -> edit (click) -> preview (blur)
- Auto-expands from 1 to 5 lines, scrolls beyond 5
- Preview truncates at 3 lines with "..." on 3rd line
- "See more" only shown when content >= 3 lines
- Teal dot indicates required field (visible in display and edit modes)
- Line height `leading-5` (20px) used for consistent auto-resize calculation
- `maxEditHeight = lineHeight * 5` caps textarea at 5 visible lines
