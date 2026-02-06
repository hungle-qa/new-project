---
title: "Interactive Canvas Table Builder Demo"
status: pending
module: demo-pages
target: source/demo/interactive-table-builder/
created: 2026-02-05
---

# Implementation Plan: Interactive Canvas Table Builder Demo

## Reference Code (from available components)

| File | Patterns to Reuse |
|------|-------------------|
| TableWithList.md | Table structure, cell styling, hover states |
| LeftSidebar.md | Fixed sidebar layout (240px), menu structure |
| Header.md | Page layout, button placement, title styling |
| ButtonWhite.md | Action buttons (Add Row, Add Column, Merge, etc.) |
| SearchBasic.md | Search input for component library |
| UserInput.md | Number inputs for rows/columns |
| ComboboxWithSearch.md | Component selector dropdown |
| Tooltip.md | Help tooltips for controls |

## Demo Scope (MVP)

**Goal:** Showcase concept, not full production implementation

**Pages:** 2 pages maximum
1. **Builder Page** - Main table builder interface
2. **Preview Page** - Show exported result (optional, can be modal)

## Implementation Steps

| Step | Layer | Action | File |
|------|-------|--------|------|
| 1 | Structure | Create demo folder structure | source/demo/interactive-table-builder/ |
| 2 | Page | Create builder page HTML | pages/builder.html |
| 3 | Component | Add toolbar with controls | components/toolbar.html |
| 4 | Component | Add sidebar with component library | components/component-library.html |
| 5 | Component | Create editable grid canvas | components/grid-canvas.html |
| 6 | Component | Add cell properties panel | components/properties-panel.html |
| 7 | Script | Implement grid initialization | assets/js/grid-init.js |
| 8 | Script | Implement cell selection | assets/js/cell-selection.js |
| 9 | Script | Implement merge/unmerge logic | assets/js/merge-cells.js |
| 10 | Script | Implement component insertion | assets/js/insert-component.js |
| 11 | Style | Create unified stylesheet | assets/css/builder.css |
| 12 | Doc | Create README | README.md |

## Page Structure: Builder Page

```
┌─────────────────────────────────────────────────────┐
│ HEADER (Header.md pattern)                         │
│ [☰] Interactive Table Builder                      │
│     [+ Add Row] [+ Add Column] [Export JSON]       │
├──────────────┬──────────────────────────────────────┤
│ SIDEBAR      │ CANVAS AREA                          │
│ (240px)      │                                      │
│              │  Grid Configuration                  │
│ Components   │  Rows: [5▾] Cols: [5▾]  [Apply]    │
│              │                                      │
│ [Search...]  │  ┌────────────────────────────┐    │
│              │  │   EDITABLE TABLE GRID       │    │
│ ☑ Buttons    │  │   (rowspan/colspan demo)   │    │
│ ☑ Inputs     │  │                             │    │
│ ☐ Selects    │  │   Click cell to select      │    │
│ ☐ Tables     │  │   Multi-select: Shift+click│    │
│              │  │                             │    │
│ Selected:    │  └────────────────────────────┘    │
│ Cell (2,3)   │                                      │
│              │  CELL CONTROLS (when cell selected) │
│ [Merge]      │  [Merge Selected] [Unmerge]         │
│ [Unmerge]    │  Border: [Color picker] [Width]     │
│              │                                      │
└──────────────┴──────────────────────────────────────┘
```

## Component Placement

### 1. Header (Top)
**Uses:** Header.md pattern
- Title: "Interactive Table Builder"
- Action buttons: Add Row, Add Column, Export JSON
- Use ButtonWhite.md for all buttons

### 2. Left Sidebar (240px fixed)
**Uses:** LeftSidebar.md pattern + ComboboxWithSearch.md
- **Section 1: Component Library** (scrollable)
  - SearchBasic.md for filtering components
  - List of available design system components (checkboxes)
  - Categories: Buttons, Inputs, Selects, Tables
- **Section 2: Selection Info**
  - Shows currently selected cell(s)
  - Merge/Unmerge buttons (ButtonWhite.md)

### 3. Canvas Area (Main)
**Custom Implementation Required**
- **Grid Config Panel** (top)
  - Rows input (UserInput.md): number input
  - Columns input (UserInput.md): number input
  - Apply button (ButtonWhite.md)
- **Editable Grid** (center)
  - HTML table with editable cells
  - Cell selection (click = single, shift+click = range)
  - Visual indicators for merged cells
  - Border styling preview
- **Cell Controls** (bottom, shows when cell(s) selected)
  - Merge button (ButtonWhite.md)
  - Unmerge button (ButtonWhite.md)
  - Border color input (custom HTML5 color picker)
  - Border width dropdown (1-5px)

## Custom Elements Needed

### 1. Editable Grid Table (No existing component)
**Custom HTML:**
```html
<table class="builder-grid">
  <tbody id="gridBody">
    <!-- Generated dynamically via JS -->
    <tr>
      <td class="grid-cell" data-row="0" data-col="0">
        <div class="cell-content"></div>
      </td>
      <!-- ... -->
    </tr>
  </tbody>
</table>
```

**Custom CSS:**
- Grid cells: clickable, hoverable
- Selected state: blue border (#184EFF)
- Merged cells: light gray background
- Cell size: min 80px x 60px

### 2. Color Picker (No existing component)
**Use Native HTML5:**
```html
<input type="color" id="borderColor" value="#000000">
```
Style with ButtonWhite.md appearance

### 3. Cell Selection Logic (No existing component)
**Custom JavaScript:**
- Click handler: select cell, toggle multi-select
- Shift+click: select range
- Visual feedback: add .selected class

### 4. Merge/Unmerge Logic (No existing component)
**Custom JavaScript:**
- Validate: only adjacent cells can merge
- Update DOM: add rowspan/colspan attributes
- Store state: track merged cell positions
- Unmerge: restore original cell boundaries

## Data Structure

**Grid State (JavaScript object):**
```javascript
{
  rows: 5,
  cols: 5,
  cells: [
    {
      row: 0,
      col: 0,
      rowSpan: 1,
      colSpan: 1,
      content: "",
      borderColor: "#000000",
      borderWidth: 1,
      component: null // or { type: "Button", props: {...} }
    },
    // ...
  ]
}
```

## Export Format

**JSON Output:**
```json
{
  "tableId": "uuid",
  "rows": 5,
  "columns": 5,
  "cells": [
    {
      "cellId": "uuid",
      "rowIndex": 0,
      "columnIndex": 0,
      "rowSpan": 2,
      "colSpan": 2,
      "content": "{componentType: 'Button'}",
      "borderColor": "#184EFF",
      "borderThickness": 1
    }
  ]
}
```

**HTML Output:** (optional)
```html
<table>
  <tr>
    <td rowspan="2" colspan="2">Content</td>
  </tr>
</table>
```

## File Structure

```
source/demo/interactive-table-builder/
├── README.md                          # Demo overview
├── pages/
│   └── builder.html                   # Main builder page
├── components/
│   ├── toolbar.html                   # Top action buttons (optional)
│   ├── sidebar.html                   # Component library (optional)
│   └── grid-canvas.html               # Main grid (optional)
├── assets/
│   ├── css/
│   │   └── builder.css               # Custom styles
│   └── js/
│       ├── grid-init.js              # Initialize grid
│       ├── cell-selection.js         # Selection logic
│       ├── merge-cells.js            # Merge/unmerge
│       └── insert-component.js       # Component insertion
└── spec/
    └── interactive-table-builder.md  # Generated spec (by write-spec agent)
```

## Dependencies

- **Existing Components:**
  - [x] TableWithList.md (pattern reference)
  - [x] LeftSidebar.md (sidebar layout)
  - [x] Header.md (page structure)
  - [x] ButtonWhite.md (action buttons)
  - [x] SearchBasic.md (search input)
  - [x] UserInput.md (number inputs)
  - [x] ComboboxWithSearch.md (component selector)
  - [x] Tooltip.md (help tooltips)

- **Custom Implementations:**
  - [ ] Editable grid table
  - [ ] Cell selection system
  - [ ] Merge/unmerge logic
  - [ ] Color picker integration
  - [ ] JSON export function

- **Source Files:**
  - [x] Product Idea: source/product-idea/interactive-canvas-table-builder.md
  - [x] Design System Components: source/design-system/*.md

## Features Included (MVP)

✅ **Must Have:**
1. Create grid with specified rows/columns (via input fields)
2. Click to select cell (single selection)
3. Multi-select cells (shift+click for range)
4. Merge adjacent cells (updates rowspan/colspan)
5. Unmerge cells (restores boundaries)
6. Visual indicators for merged cells
7. Export table structure as JSON
8. Border styling (color, width)

❌ **Excluded from MVP:**
1. Drag-and-drop component insertion (too complex for demo)
2. Actual component rendering inside cells (show placeholder text only)
3. Resize rows/columns via drag handles
4. Undo/redo functionality
5. Real-time collaboration
6. Data visualization integration
7. Advanced styling (background color, fonts)
8. Cell content editing (focus on structure only)

## Next Agents

| Agent | Task |
|-------|------|
| designer | Review layout, suggest improvements for grid UI, validate component placement |
| implementer | Build HTML pages, write JavaScript logic, create CSS styles |
| write-spec | Generate spec from completed demo |

## Unresolved Questions

1. **Component insertion method:** Should we show component HTML in cell, or just display component name as text placeholder?
   - **Recommendation:** Use text placeholder (e.g., "[Button]") for simplicity in demo

2. **Grid size limits:** What's max rows/columns for demo?
   - **Recommendation:** Max 10x10 to keep performance reasonable

3. **Cell content:** Allow text entry in cells, or structure-only?
   - **Recommendation:** Structure-only for MVP (no text editing)

4. **Export preview:** Show exported JSON in modal or separate page?
   - **Recommendation:** Show in modal overlay with copy button

5. **Mobile responsiveness:** Support mobile view or desktop-only?
   - **Recommendation:** Desktop-only for MVP demo
