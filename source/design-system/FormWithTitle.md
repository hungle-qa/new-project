---
name: FormWithTitle
category: forms
status: draft
created: 2026-02-06T18:00:00+07:00
updated: 2026-02-06T18:30:00+07:00
---

# FormWithTitle

## HTML
```html
<div class="form-panel" id="formPanel">
  <!-- X button (overlapping top-right corner) -->
  <button class="form-panel__close" id="formClose" type="button" aria-label="Close">
    <!-- close_circle.svg -->
    <svg width="18" height="18" viewBox="0 0 22 22" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><path d="M11 22c6.075 0 11-4.925 11-11S17.075 0 11 0 0 4.925 0 11s4.925 11 11 11z" fill="#111"/><path d="M11.183 11.867l-3.758 3.758a.483.483 0 11-.683-.683l3.758-3.759-3.758-3.758a.483.483 0 01.683-.683l3.758 3.758 3.759-3.758a.483.483 0 01.683.683l-3.758 3.758 3.758 3.759a.483.483 0 01-.683.683l-3.759-3.758z" stroke="#FFF" stroke-width=".5" fill="#FFF" stroke-linecap="round" stroke-linejoin="round"/></g></svg>
  </button>

  <!-- Header -->
  <div class="form-panel__header">
    <!-- manage.svg -->
    <svg class="form-panel__icon" width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg"><path d="M11.85 4.649a.48.48 0 00-.062-.11 1.091 1.091 0 00-.903-.42h-.062a.562.562 0 01-.48-.295.016.016 0 01-.017-.016c-.063-.11-.12-.202-.184-.312a.58.58 0 01-.029-.59.072.072 0 00.03-.048 1.2 1.2 0 00.091-1.026.28.28 0 00-.061-.11 7.727 7.727 0 00-.644-.545 1.3 1.3 0 00-.108-.047 1.13 1.13 0 00-.981.265.085.085 0 00-.045.03.503.503 0 01-.337.12.569.569 0 01-.216-.047 2.475 2.475 0 00-.352-.12.565.565 0 01-.367-.435.301.301 0 00-.017-.062 1.103 1.103 0 00-.583-.84.216.216 0 00-.107-.029 6.954 6.954 0 00-.827 0 .312.312 0 00-.108.03c-.32.176-.537.493-.583.855a.054.054 0 00-.017.047.547.547 0 01-.368.435c-.105.03-.229.077-.351.12a1.13 1.13 0 01-.216.03.549.549 0 01-.338-.12c-.014-.016-.03-.016-.044-.032a1.122 1.122 0 00-.982-.265.157.157 0 00-.108.047 4.28 4.28 0 00-.644.543.43.43 0 00-.062.11 1.158 1.158 0 00.122 1.074c.096.181.09.4-.017.576a.016.016 0 00-.017.017c-.066.1-.124.204-.175.312a.016.016 0 00-.017.017.53.53 0 01-.48.295H1.12a1.119 1.119 0 00-.903.421.28.28 0 00-.062.11A6.025 6.025 0 000 5.507a.324.324 0 00.017.12c.114.33.373.59.704.705a.53.53 0 01.413.453V6.8c.011.121.032.242.06.36v.017a.6.6 0 01-.184.544.085.085 0 00-.045.03 1.152 1.152 0 00-.428.888.4.4 0 00.03.12c.135.275.289.54.46.794.014.045.049.08.093.094.294.165.648.188.96.061a.07.07 0 00.062-.017.562.562 0 01.382.005.706.706 0 01.184.106l.276.24.017.017c.154.128.23.328.2.527a.11.11 0 00-.017.06c-.07.333.01.68.216.949.03.033.066.06.108.077.28.138.573.247.876.325a.2.2 0 00.138 0c.329-.067.61-.279.766-.576a.32.32 0 00.03-.047.505.505 0 01.492-.278h.384a.55.55 0 01.492.278.32.32 0 01.03.047c.155.298.437.51.766.576h.061c.017 0 .044 0 .025-.032.297-.093.59-.202.874-.328a.283.283 0 00.108-.077c.164-.195.253-.443.25-.698 0-.074-.007-.147-.02-.219a.194.194 0 00-.018-.093.555.555 0 01.217-.513.017.017 0 11.024-.024c.098-.072.19-.152.276-.24h.016a.539.539 0 01.553-.107.36.36 0 01.06.017 1.266 1.266 0 00.416.078c.193.002.384-.047.553-.14l.094-.094c.18-.248.334-.515.46-.795a.277.277 0 00.03-.12 1.179 1.179 0 00-.429-.888.84.84 0 01-.044-.047.528.528 0 01-.185-.48V7.18c.028-.118.049-.239.061-.36v-.013c.059-.355.322-.444.353-.444a.07.07 0 00.066-.022c.329-.112.587-.37.7-.698a.324.324 0 00.017-.12 5.408 5.408 0 00-.15-.873zM6.002 8.536a2.464 2.464 0 112.444-2.472 2.449 2.449 0 01-2.444 2.472z" fill="#99A1B1" fill-rule="nonzero"/></svg>
    <h2 class="form-panel__title">General</h2>
  </div>

  <!-- Middle (content area) -->
  <div class="form-panel__body">
    <div class="form-panel__placeholder">[Input component here]</div>
  </div>

  <!-- Footer -->
  <div class="form-panel__footer">
    <button class="form-panel__btn-cancel" id="formSave" type="button">Save</button>
    <button class="form-panel__btn-action" id="formSaveClose" type="button">Save & Close</button>
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
  --color-btn-action-hover: #184EFFE6;
  --color-btn-cancel-hover: #F5F7F9;
  --color-bg-white: #FFFFFF;
}

.form-panel {
  font-family: var(--font-family);
  background-color: var(--color-bg-white);
  border-radius: 8px;
  border: 1px solid #E5E7EB;
  width: 100%;
  max-width: 560px;
  display: flex;
  flex-direction: column;
  min-height: 400px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  position: relative;
}

/* ====== Header ====== */
.form-panel__header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
}

.form-panel__icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.form-panel__title {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
}

.form-panel__close {
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

/* ====== Body (no top border — seamless with header) ====== */
.form-panel__body {
  flex: 1;
  padding: 16px 24px;
}

.form-panel__placeholder {
  font-size: 13px;
  color: #9CA3AF;
  font-style: italic;
  text-align: center;
  padding: 40px 0;
}

/* ====== Footer (line + shadow above) ====== */
.form-panel__footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 10px 24px;
  border-top: 1px solid #E5E7EB;
  box-shadow: 0 -4px 12px rgba(0, 0, 0, 0.06);
}

/* Save button (secondary/cancel style) */
.form-panel__btn-cancel {
  font-family: var(--font-family);
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text-primary);
  background: var(--color-bg-white);
  border: 1px solid #E5E7EB;
  border-radius: 6px;
  padding: 0 24px;
  height: 34px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.form-panel__btn-cancel:hover {
  background-color: var(--color-btn-cancel-hover);
}

/* Save & Close button (primary/action style) */
.form-panel__btn-action {
  font-family: var(--font-family);
  font-size: 13px;
  font-weight: 600;
  color: #FFFFFF;
  background-color: var(--color-btn-action);
  border: none;
  border-radius: 6px;
  padding: 0 24px;
  height: 34px;
  cursor: pointer;
  transition: background-color 0.15s ease;
}

.form-panel__btn-action:hover {
  background-color: var(--color-btn-action-hover);
}
```
