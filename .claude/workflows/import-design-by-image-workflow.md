# Import Design By Image Workflow

**Purpose:** Route to the unified import-design agent based on image count and detect action type.

---

## Agent Data Flow

```
[User Request: Image(s)/ComponentName + "import/edit/update {ComponentName}"]
      |
  +----------------------------------+
  |  WORKFLOW: Mode + Action Detect  |
  +----------------------------------+
  IN:  Image count + keywords + component name
  DO:  1. Check for images -> Has images?
       2. Count images (if yes) -> MODE (single/multi)
       3. Check keywords -> ACTION (create/edit/update)
       4. Check file exists -> Confirm ACTION
  OUT: { mode, action, component_name, file_exists }
      |
  +----------------------------------+
  |  ROUTE TO: import-design.md      |
  |  (Unified Master Agent)          |
  +----------------------------------+
  IN:  Pre-detected context
  DO:  Loads matching skill file:
       - VALIDATE: skills/import-design/validate.md
       - SINGLE:   skills/import-design/single.md
       - MULTI:    skills/import-design/multi.md
       - UPDATE:   skills/import-design/update.md
  OUT: source/design-system/{ComponentName}.md
```

---

## Step 1: Mode + Action Detection (CRITICAL - DO FIRST)

**Before loading agent context, detect MODE and ACTION:**

### 1a. Mode Detection

| Signal | Mode |
|--------|------|
| HTML/CSS code pasted, no images | VALIDATE |
| 1 image attached | SINGLE |
| 2+ images attached | MULTI |
| "this image", "single" | SINGLE |
| "these images", "states", "hover", "disabled" | MULTI |
| No images + component name exists | UPDATE |
| No images + component name missing | ASK (AskUserQuestion) |

### 1b. Action Type Detection

| Signal | Action | Mode Hint |
|--------|--------|-----------|
| "update" + no images | UPDATE | UPDATE |
| "edit", "modify", "change" + no images | UPDATE | UPDATE |
| "edit", "update", "modify" + images | EDIT | SINGLE/MULTI |
| "import", "create", "new", "convert" | CREATE | SINGLE/MULTI |
| Component name only (no keywords) + no images | UPDATE | UPDATE |
| Component name only (no keywords) + images | CHECK FILE | SINGLE/MULTI |

### 1c. File Existence Check

```
If component name provided:
  Check: source/design-system/{ComponentName}.md

  If NO IMAGES:
    If EXISTS -> MODE = UPDATE, ACTION = UPDATE
    If NOT EXISTS -> ERROR: "Component not found. Use CREATE with images."

  If HAS IMAGES:
    If EXISTS + EDIT keywords -> ACTION = EDIT
    If EXISTS + no keywords -> ASK user: "Create new or edit?"
    If NOT EXISTS -> ACTION = CREATE
```

---

## Step 2: Route to Agent with Context

**All modes route to the same agent: `import-design.md`**

Pass pre-detected values:
```
{
  mode: "VALIDATE" | "SINGLE" | "MULTI" | "UPDATE",
  action: "CREATE" | "EDIT" | "UPDATE",
  component_name: "{ComponentName}",
  file_exists: true | false,
  image_count: {number} | 0
}
```

The master agent loads the matching skill file internally.

---

## Detection Table (Full)

| Signal | Mode | Action | Agent |
|--------|------|--------|-------|
| HTML/CSS pasted, no images | VALIDATE | CREATE | `import-design.md` |
| 1 image + "import" | SINGLE | CREATE | `import-design.md` |
| 1 image + "edit" | SINGLE | EDIT | `import-design.md` |
| 2+ images + "import" | MULTI | CREATE | `import-design.md` |
| 2+ images + "update" | MULTI | EDIT | `import-design.md` |
| "hover", "disabled", "states" | MULTI | - | `import-design.md` |
| No images + "update {Name}" | UPDATE | UPDATE | `import-design.md` |
| No images + component name + exists | UPDATE | UPDATE | `import-design.md` |
| No images + component missing | ERROR | - | Report error to user |
| Unclear / no context | ASK | - | AskUserQuestion first |

---

## Detection Criteria Detail

### SINGLE Mode Indicators
- Exactly 1 image in conversation
- User says "this image", "this component"
- User says "single", "one"
- No state keywords mentioned

### MULTI Mode Indicators
- 2 or more images in conversation
- User says "these images", "multiple"
- User mentions states: "hover", "focus", "disabled", "active", "pressed"
- User says "variants", "states", "different states"

### UPDATE Mode Indicators
- No images in conversation
- User says "update {ComponentName}"
- User provides component name + change request
- Component file exists in design system
- Keywords: "update", "change", "modify", "fix", "adjust"

### VALIDATE Mode Indicators
- User pastes HTML/CSS code
- No images attached
- User says "check", "validate", "import this code"

### UNCLEAR Indicators
- No images visible AND no component name AND no code
- Ambiguous text
- User only provides vague text

---

## Clarification Question (if UNCLEAR)

Use AskUserQuestion:

```
"I can help you with component management. What would you like to do?"

Options:
- "Import from single image (one state)"
- "Import from multiple images (different states)"
- "Update existing component (no image needed)"
- "Validate pasted HTML/CSS code"
```

Then route to `import-design.md` with detected mode.

---

## Agent Chain

All modes use the same standalone agent:
```
import-design.md (loads skill internally based on mode)
```

---

## Scope

**Target:** `source/design-system/{ComponentName}.md`

**DO:**
- Convert images to HTML + Tailwind
- Validate pasted HTML/CSS code
- Update existing components
- Create component documentation
- Use design system icons

**DO NOT:**
- Modify RULE.md or icons
- Create files outside design-system
- Generate backend code

---

## Shared Rules Reference

Rules are embedded in the master agent (`import-design.md`). The shared rules file `.claude/workflows/import-design-by-image-rules.md` is preserved for reference.
