---
name: MediaUpload
category: forms
created: 2026-02-06T00:00:00.000Z
status: approved
---

# MediaUpload

## Preview
A media upload component with 5 states: Default display (gray icon), Hover (blue border + blue icon), Edit mode (drag-and-drop area with dashed border, choose file, add video link), Uploading (progress bar), and Uploaded (thumbnail + file info). Supports image and video files only.

**Font:** Open Sans (`font-family: 'Open Sans', sans-serif`)

## Usage
Use for file attachment fields in forms where users need to upload images or videos. Common in content editors, profile settings, and media management interfaces.

## HTML
```html
<div class="media-upload" id="mediaUpload">
  <!-- STATE 1: Default Display -->
  <div class="media-upload__default" id="mediaDefault">
    <div class="media-upload__label">ATTACHMENT</div>
    <button class="media-upload__trigger" id="mediaTrigger" type="button">
      <!-- media_icon_medium.svg -->
      <svg class="media-upload__icon" width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23 6H2a2 2 0 00-2 2v22a2 2 0 002 2h21a2 2 0 002-2V8a2 2 0 00-2-2z" fill="currentColor" fill-opacity="0.15"/><path d="M32.11 6.321L10.642 1.513a2 2 0 00-2.39 1.514L3.05 26.262a2 2 0 001.514 2.389l21.468 4.808a2 2 0 002.389-1.514L33.624 8.71a2 2 0 00-1.514-2.39z" fill="currentColor" fill-opacity="0.15" stroke="currentColor" stroke-miterlimit="10" stroke-linecap="square"/><path d="M3.806 27.457l6.492-7.024 3.909 4.509 8.834-6.5 4.185 14.26-23.42-5.245zm10.815-13.974a2.5 2.5 0 101.093-4.88 2.5 2.5 0 00-1.093 4.88z" fill="currentColor" stroke="currentColor" stroke-miterlimit="10" stroke-linecap="square"/></svg>
      <span class="media-upload__trigger-text">Media</span>
    </button>
  </div>

  <!-- STATE 3: Edit Mode (drag & drop) -->
  <div class="media-upload__edit" id="mediaEdit">
    <!-- X button (overlapping top-right corner) -->
    <button class="media-upload__close" id="mediaEditClose" type="button" aria-label="Close">
      <!-- close_circle.svg -->
      <svg width="18" height="18" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M11 22c6.075 0 11-4.925 11-11S17.075 0 11 0 0 4.925 0 11s4.925 11 11 11z" fill="#6B7280"/><path d="M11.183 11.867l-3.758 3.758a.483.483 0 11-.683-.683l3.758-3.759-3.758-3.758a.483.483 0 01.683-.683l3.758 3.758 3.759-3.758a.483.483 0 01.683.683l-3.758 3.758 3.758 3.759a.483.483 0 01-.683.683l-3.759-3.758z" stroke="#FFF" stroke-width=".5" fill="#FFF" stroke-linecap="round" stroke-linejoin="round"/></g></svg>
    </button>
    <div class="media-upload__edit-header">
      <span class="media-upload__edit-title">UPLOAD MEDIA FILE</span>
    </div>
    <div class="media-upload__dropzone" id="mediaDropzone">
      <!-- media_upload.svg -->
      <svg class="media-upload__dropzone-icon" width="68" height="40" viewBox="0 0 68 40" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="43.14" y="4.906" width="22.148" height="27.936" rx="1.67" transform="rotate(15 43.14 4.906)" fill="#fff" stroke="#BDC3CB"/><g clip-path="url(#mu_clip0)" stroke="#BDC3CB" stroke-width=".94" stroke-miterlimit="10"><path d="M48.983 18.436l6.987 1.872" stroke-linecap="square"/><path d="M54.66 25.2l2.059-7.687-6.988-1.872-2.309 8.618"/><path d="M45.355 25.452a1.688 1.688 0 10.874-3.26 1.688 1.688 0 00-.874 3.26zm7.237.941a1.688 1.688 0 10.874-3.26 1.688 1.688 0 00-.874 3.26z" stroke-linecap="square"/></g><rect x="3.612" y="10.434" width="22.148" height="27.936" rx="1.67" transform="rotate(-15 3.612 10.434)" fill="#fff" stroke="#BDC3CB"/><g clip-path="url(#mu_clip1)" stroke="#BDC3CB" stroke-width=".94" stroke-miterlimit="10" stroke-linecap="square"><path d="M21.335 15.153l-9.317 2.497 2.496 9.316 9.317-2.496-2.496-9.317z"/><path d="M14.606 25.444l1.705-2.953 2.828 1.24 2.899-5.021m-4.829 1.543a.965.965 0 10-.5-1.863.965.965 0 00.5 1.863z"/></g><rect x="23.032" y="1.9" width="22.148" height="27.936" rx="1.67" fill="#fff" stroke="#BDC3CB"/><g clip-path="url(#mu_clip2)"><path d="M33.14 14.421l2.412 1.447-2.411 1.447V14.42z" fill="#BDC3CB"/><path d="M38.928 11.045h-9.645v9.645h9.645v-9.645z" stroke="#BDC3CB" stroke-width=".94" stroke-miterlimit="10" stroke-linecap="square"/><path d="M29.283 12.974h9.645m-4.823-1.929v1.93m-2.411-1.93v1.93m4.823-1.93v1.93m-7.234 5.786h9.645m-4.823 1.929v-1.929m-2.411 1.929v-1.929m4.823 1.929v-1.929" stroke="#BDC3CB" stroke-width=".94" stroke-miterlimit="10"/></g><defs><clipPath id="mu_clip0"><path fill="#fff" transform="rotate(15 -30.775 182.283)" d="M0 0h11.574v11.574H0z"/></clipPath><clipPath id="mu_clip1"><path fill="#fff" transform="rotate(-15 69.86 -32.673)" d="M0 0h11.574v11.574H0z"/></clipPath><clipPath id="mu_clip2"><path fill="#fff" transform="translate(28.319 10.08)" d="M0 0h11.574v11.574H0z"/></clipPath></defs></svg>
      <div class="media-upload__dropzone-text">
        Drag and drop your media here,
      </div>
      <div class="media-upload__dropzone-links">
        <button class="media-upload__link" id="mediaChooseFile" type="button">Choose a file</button>, or
        <button class="media-upload__link" id="mediaAddVideoLink" type="button">Add video link</button>
      </div>
    </div>
    <!-- Hidden file input -->
    <input type="file" id="mediaFileInput" accept="image/*,video/*" style="display: none;">
  </div>

  <!-- STATE 4: Uploading -->
  <div class="media-upload__uploading" id="mediaUploading">
    <div class="media-upload__file-preview">
      <div class="media-upload__thumbnail" id="uploadingThumb"></div>
      <div class="media-upload__file-info">
        <div class="media-upload__file-name" id="uploadingName">image12-2.png</div>
        <div class="media-upload__progress-bar">
          <div class="media-upload__progress-fill" id="uploadingProgress"></div>
        </div>
      </div>
      <button class="media-upload__cancel" id="mediaUploadCancel" type="button" aria-label="Cancel upload">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      </button>
    </div>
  </div>

  <!-- STATE 5: Uploaded -->
  <div class="media-upload__uploaded" id="mediaUploaded">
    <div class="media-upload__file-preview">
      <div class="media-upload__thumbnail" id="uploadedThumb"></div>
      <div class="media-upload__file-info">
        <div class="media-upload__file-name" id="uploadedName">Screenshot 2026-02-06.png</div>
        <div class="media-upload__file-size" id="uploadedSize">7 KB</div>
      </div>
      <button class="media-upload__remove" id="mediaRemove" type="button" aria-label="Remove file">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
      </button>
    </div>
  </div>
</div>
```

## CSS
```css
:root {
  --font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --color-text-primary: #141414;
  --color-text-gray: #7B7E91;
  --color-btn-action: #184EFF;
  --color-bg-white: #FFFFFF;
}

.media-upload {
  font-family: var(--font-family);
  width: 100%;
  max-width: 500px;
}

/* ====== STATE 1: Default Display ====== */
.media-upload__label {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-gray);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
}

.media-upload__trigger {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 120px;
  height: 100px;
  background-color: var(--color-bg-white);
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  cursor: pointer;
  transition: border-color 0.15s ease, color 0.15s ease;
  color: #9CA3AF;
}

.media-upload__trigger:hover {
  border-color: var(--color-btn-action);
  color: var(--color-btn-action);
}

.media-upload__icon {
  width: 35px;
  height: 35px;
}

.media-upload__trigger-text {
  font-size: 13px;
  font-weight: 500;
}

/* ====== STATE 3: Edit Mode ====== */
.media-upload__edit {
  display: none;
  position: relative;
  background-color: var(--color-bg-white);
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 16px;
}

.media-upload__edit.visible {
  display: block;
}

.media-upload__edit-header {
  margin-bottom: 16px;
}

.media-upload__edit-title {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-gray);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.media-upload__close {
  position: absolute;
  top: -8px;
  right: -8px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  z-index: 1;
}

.media-upload__dropzone {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 32px 24px;
  border: 1px dashed #D1D5DB;
  border-radius: 8px;
  transition: border-color 0.15s ease;
  text-align: center;
}

.media-upload__dropzone:hover {
  border-color: var(--color-btn-action);
}

.media-upload__dropzone.dragover {
  border-color: var(--color-btn-action);
  background-color: #F0F1FF;
}

.media-upload__dropzone-icon {
  width: 68px;
  height: 40px;
  margin-bottom: 4px;
}

.media-upload__dropzone-text {
  font-size: 13px;
  color: var(--color-text-primary);
}

.media-upload__dropzone-links {
  font-size: 13px;
  color: var(--color-text-primary);
}

.media-upload__link {
  background: none;
  border: none;
  color: var(--color-btn-action);
  font-size: 13px;
  font-weight: 500;
  font-family: var(--font-family);
  cursor: pointer;
  padding: 0;
  text-decoration: none;
}

.media-upload__link:hover {
  text-decoration: underline;
}

/* ====== STATE 4: Uploading ====== */
.media-upload__uploading {
  display: none;
}

.media-upload__uploading.visible {
  display: block;
}

.media-upload__file-preview {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background-color: var(--color-bg-white);
  border: 1px solid #E5E7EB;
  border-radius: 8px;
}

.media-upload__thumbnail {
  width: 40px;
  height: 40px;
  border-radius: 4px;
  background-color: #F3F4F6;
  background-size: cover;
  background-position: center;
  flex-shrink: 0;
  overflow: hidden;
}

.media-upload__thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.media-upload__file-info {
  flex: 1;
  min-width: 0;
}

.media-upload__file-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 6px;
}

.media-upload__file-size {
  font-size: 12px;
  color: #9CA3AF;
}

.media-upload__progress-bar {
  width: 100%;
  height: 4px;
  background-color: #E5E7EB;
  border-radius: 2px;
  overflow: hidden;
}

.media-upload__progress-fill {
  height: 100%;
  background-color: var(--color-btn-action);
  border-radius: 2px;
  transition: width 0.3s ease;
  width: 0%;
}

.media-upload__cancel,
.media-upload__remove {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #9CA3AF;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  transition: color 0.15s ease;
}

.media-upload__cancel:hover,
.media-upload__remove:hover {
  color: var(--color-text-primary);
}

/* ====== STATE 5: Uploaded ====== */
.media-upload__uploaded {
  display: none;
}

.media-upload__uploaded.visible {
  display: block;
}

/* ====== Hidden states ====== */
.media-upload__default.hidden {
  display: none;
}
```

## Component States

| State | Trigger | Visual Changes | CSS |
|-------|---------|----------------|-----|
| Default | Initial | Gray icon + "Media" text, gray border | `.media-upload__trigger` |
| Hover | Mouse over trigger | Blue border, blue icon | `.media-upload__trigger:hover` |
| Edit | Click trigger | Dashed border dropzone, "Choose a file" link, X close | `.media-upload__edit.visible` |
| Edit Dropzone Hover | Mouse over dropzone | Blue dashed border | `.media-upload__dropzone:hover` |
| Dragover | Drag file over | Blue dashed border + light blue bg | `.media-upload__dropzone.dragover` |
| Uploading | File selected | Progress bar animating, file name, X cancel | `.media-upload__uploading.visible` |
| Uploaded | Upload complete | Thumbnail, file name, file size, X remove | `.media-upload__uploaded.visible` |

## JavaScript
```javascript
document.addEventListener('DOMContentLoaded', function() {
  const container = document.getElementById('mediaUpload');
  const defaultView = document.getElementById('mediaDefault');
  const trigger = document.getElementById('mediaTrigger');
  const editView = document.getElementById('mediaEdit');
  const editClose = document.getElementById('mediaEditClose');
  const dropzone = document.getElementById('mediaDropzone');
  const chooseFileBtn = document.getElementById('mediaChooseFile');
  const fileInput = document.getElementById('mediaFileInput');
  const uploadingView = document.getElementById('mediaUploading');
  const uploadingThumb = document.getElementById('uploadingThumb');
  const uploadingName = document.getElementById('uploadingName');
  const uploadingProgress = document.getElementById('uploadingProgress');
  const uploadCancel = document.getElementById('mediaUploadCancel');
  const uploadedView = document.getElementById('mediaUploaded');
  const uploadedThumb = document.getElementById('uploadedThumb');
  const uploadedName = document.getElementById('uploadedName');
  const uploadedSize = document.getElementById('uploadedSize');
  const removeBtn = document.getElementById('mediaRemove');

  if (!container) return;

  let uploadTimer = null;
  let currentFile = null;

  // Show a specific state, hide all others
  function showState(state) {
    defaultView.classList.toggle('hidden', state !== 'default');
    editView.classList.toggle('visible', state === 'edit');
    uploadingView.classList.toggle('visible', state === 'uploading');
    uploadedView.classList.toggle('visible', state === 'uploaded');

    if (state !== 'default') {
      defaultView.classList.add('hidden');
    } else {
      defaultView.classList.remove('hidden');
    }
  }

  // STATE 1 → STATE 3: Click trigger → Edit mode
  trigger.addEventListener('click', function() {
    showState('edit');
  });

  // STATE 3 → STATE 1: Click X → Default
  editClose.addEventListener('click', function() {
    showState('default');
  });

  // STATE 3: Choose a file button → open file picker
  chooseFileBtn.addEventListener('click', function() {
    fileInput.click();
  });

  // STATE 3: File selected → STATE 4: Uploading
  fileInput.addEventListener('change', function() {
    if (this.files && this.files[0]) {
      currentFile = this.files[0];
      startUpload(currentFile);
    }
  });

  // STATE 3: Drag and drop handlers
  dropzone.addEventListener('dragover', function(e) {
    e.preventDefault();
    this.classList.add('dragover');
  });

  dropzone.addEventListener('dragleave', function() {
    this.classList.remove('dragover');
  });

  dropzone.addEventListener('drop', function(e) {
    e.preventDefault();
    this.classList.remove('dragover');

    const file = e.dataTransfer.files[0];
    if (file && (file.type.startsWith('image/') || file.type.startsWith('video/'))) {
      currentFile = file;
      startUpload(currentFile);
    }
  });

  // Start upload simulation
  function startUpload(file) {
    showState('uploading');
    uploadingName.textContent = file.name;
    uploadingProgress.style.width = '0%';

    // Show thumbnail preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = function(e) {
        uploadingThumb.style.backgroundImage = 'url(' + e.target.result + ')';
      };
      reader.readAsDataURL(file);
    } else {
      uploadingThumb.style.backgroundImage = '';
    }

    // Simulate upload progress
    let progress = 0;
    uploadTimer = setInterval(function() {
      progress += Math.random() * 20 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(uploadTimer);
        uploadTimer = null;
        completeUpload(file);
      }
      uploadingProgress.style.width = progress + '%';
    }, 300);
  }

  // STATE 4 → STATE 5: Upload complete
  function completeUpload(file) {
    showState('uploaded');
    uploadedName.textContent = file.name;
    uploadedSize.textContent = formatFileSize(file.size);

    // Show thumbnail for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = function(e) {
        uploadedThumb.innerHTML = '';
        var img = document.createElement('img');
        img.src = e.target.result;
        uploadedThumb.appendChild(img);
      };
      reader.readAsDataURL(file);
    } else {
      uploadedThumb.innerHTML = '';
      uploadedThumb.style.backgroundImage = '';
    }
  }

  // STATE 4 → STATE 3: Cancel upload → Edit mode
  uploadCancel.addEventListener('click', function() {
    if (uploadTimer) {
      clearInterval(uploadTimer);
      uploadTimer = null;
    }
    fileInput.value = '';
    currentFile = null;
    showState('edit');
  });

  // STATE 5 → STATE 3: Remove file → Edit mode
  removeBtn.addEventListener('click', function() {
    fileInput.value = '';
    currentFile = null;
    uploadedThumb.innerHTML = '';
    showState('edit');
  });

  // Helper: Format file size
  function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return Math.round(bytes / 1024) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  // Initialize: show default state
  showState('default');
  console.log('MediaUpload: Initialized');
});
```

## Accessibility
- Trigger button is keyboard focusable
- Close/cancel/remove buttons have `aria-label`
- File input accepts only `image/*,video/*`
- Drag and drop has visual feedback (dragover state)
- All interactive elements are `<button>` with `type="button"`

## Notes
- 5 states: Default → Hover → Edit → Uploading → Uploaded
- Default: gray media icon, gray border; hover: blue border + blue icon
- Edit: dashed border dropzone, "Choose a file" (blue link with underline on hover), X to close back to Default
- Uploading: simulated progress bar (blue #184EFF), X to cancel back to Edit
- Uploaded: thumbnail + file name + file size, X to remove back to Edit
- File input accepts `image/*,video/*` only
- Drag and drop supported with visual feedback
- Follows RULE.md: blue links with underline on hover (--text-hyperlink-hover)
- All state transitions managed by `showState()` function
- Icons from `source/design-system/icons/`: `media_icon_medium.svg` (trigger), `media_upload.svg` (dropzone), `close_circle.svg` (close button)
- Cancel/remove X icons are minimal inline SVGs (2 crossed lines — no matching icon in icons/)
