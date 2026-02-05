# Import Design By Image - Shared Rules

**Purpose:** Common rules shared by single and multi-image agents.

---

## RULE.md Compliance (P0 - CRITICAL)

**BEFORE generating any code, ALWAYS read:**
```
source/design-system/rule/RULE.md
```
Apply ALL styles from RULE.md to generated components.

---

## Icon Detection Workflow (MANDATORY)

**Step 1: Glob for Real-Time Icon List**
```
Glob pattern: source/design-system/icons/*.svg
```

**Step 2: Match Keywords in Filenames**

| Pattern | Keywords |
|---------|----------|
| `*edit*` | edit, pencil, modify |
| `*clone*`, `*duplicate*` | clone, duplicate |
| `*delete*`, `*trash*` | delete, remove, trash |
| `*share*` | share |
| `*save*` | save |
| `*copy*` | copy, clipboard |
| `*print*`, `*pdf*` | print, pdf, export |
| `*search*` | search, find |
| `*calendar*` | calendar, date |
| `*close*`, `*cancel*` | close, cancel, x |
| `*plus*`, `*add*` | add, plus, new |
| `*arrow*` | arrow, navigation |
| `*filter*` | filter, sort |
| `*warning*` | warning, alert |

**Step 3: Read SVG Content**
Read matched `.svg` file for embedding.

**Step 4: Embed with Comment**
```html
<!-- {filename}.svg -->
<svg class="w-4 h-4" ...>{svg content}</svg>
```

**Step 5 (Optional): Check JSON for Tags**
Read `source/design-system/icons/{icon-name}.json` for tag matching.

**Icon Naming Convention:**
- `*-white.svg` = White (dark backgrounds)
- `*_grey.svg` = Gray
- `*_blue.svg` = Blue (primary)

---

## Date Field Requirements

**Format:** `YYYY-MM-DDTHH:mm:ss+07:00` (GMT+7)

**New Component:** Set both `created` and `updated` to same timestamp.

**Existing Component:** Keep `created` unchanged, update only `updated`.

---

## Output Documentation Format (16 Sections)

**Output:** `source/design-system/{ComponentName}.md`

```markdown
---
name: {ComponentName}
category: {buttons|cards|forms|layout|navigation|feedback}
created: {YYYY-MM-DDTHH:mm:ss+07:00}
updated: {YYYY-MM-DDTHH:mm:ss+07:00}
status: draft
---

# {ComponentName}

## Preview
{description}

## Usage
{when/where to use}

## HTML
\`\`\`html
{HTML with Tailwind}
\`\`\`

## CSS
\`\`\`css
.{component-name} {
  font-family: 'Open Sans', sans-serif;
}
\`\`\`

## Tailwind Classes Used
| Class | Purpose |
|-------|---------|

## Props/Variants
| Variant | Tailwind Classes | Description |
|---------|------------------|-------------|

## Component States
| State | Trigger | Visual Changes | Tailwind Classes |
|-------|---------|----------------|------------------|

## JavaScript
\`\`\`javascript
document.addEventListener('DOMContentLoaded', function() {
  // Interactive code
});
\`\`\`

## Accessibility
- {considerations}

## Notes
- Generated from image on {date}
```

---

## Strict Format Rules (CRITICAL)

**The preview system uses regex. Breaking these rules causes errors!**

### Rule 1: `## HTML` immediately followed by code block
```markdown
## HTML
\`\`\`html
{code}
\`\`\`
```
**WRONG:**
```markdown
## HTML
### Some Subtitle    ← NO!
\`\`\`html
```

### Rule 2: `## CSS` immediately followed by code block
Same rule as HTML.

### Rule 3: No sub-headers between section and code block

---

## HTML/CSS Format Rules

**REQUIRED:**
- Tailwind utility classes only
- No custom CSS or `<style>` tags
- No inline `style=""` attributes
- Include `## CSS` section for preview system (BEM structure)

**CSS Section Purpose:**
```css
/* Structural context - NOT visual styling */
.{component-name} {
  font-family: 'Open Sans', sans-serif; /* RULE.md */
}
```

---

## Color to Tailwind Mapping

| Visual | Tailwind |
|--------|----------|
| Light gray border | `border-gray-200` |
| Medium gray border | `border-gray-400` |
| Placeholder text | `text-gray-400` |
| Light background | `bg-gray-50` |
| Light gray bg | `bg-gray-100` |
| Success green | `bg-green-500` |
| Error red | `bg-red-500` |
| Warning yellow | `bg-yellow-500` |

**Primary colors:** Refer to `source/design-system/rule/RULE.md`

---

## Category Mapping

| Visual Clues | Category |
|--------------|----------|
| Clickable, colored bg, text label | buttons |
| Container, shadow, border | cards |
| Text input, dropdown, checkbox | forms |
| Container, wrapper, grid | layout |
| Menu, links, tabs, breadcrumb | navigation |
| Alert, toast, modal, badge | feedback |

---

## JavaScript Requirements

**Components requiring JS:**
- Dropdowns/Combobox
- Modals
- Tabs
- Accordions
- Search inputs
- Multi-select
- Tooltips

**JS Pattern:**
```javascript
document.addEventListener('DOMContentLoaded', function() {
  // 1. Get DOM references
  // 2. Search/filter (if input)
  // 3. Click handlers
  // 4. Keyboard navigation (Arrow, Enter, Escape)
  // 5. Toggle dropdown
});
```

---

## Failure Handlers

### Image Analysis Failures
| Situation | Action |
|-----------|--------|
| Image blurry | Ask for clearer image |
| Cannot identify type | Ask user |
| Colors unclear | Ask user to confirm |
| Multiple interpretations | Use AskUserQuestion |

### Icon Detection Failures
| Situation | Action |
|-----------|--------|
| No match | Note "Icon needed: {description}" |
| Glob empty | Inform user |
| SVG unreadable | Skip, document in Notes |

---

## Scope Boundaries

### DO
- Convert UI images to HTML + Tailwind
- Create docs in `source/design-system/`
- Use icons from `source/design-system/icons/`

### DO NOT
- Create files outside `source/design-system/`
- Modify RULE.md or icons
- Generate backend code
- Install npm packages
- Create new icon SVG files
