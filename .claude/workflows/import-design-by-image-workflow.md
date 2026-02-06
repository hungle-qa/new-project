# Import Design By Image Workflow

**Purpose:** Route to appropriate agent based on image count and detect action type.

---

## Agent Data Flow

```
[User Request: Image(s) + "import/edit {ComponentName}"]
      ↓
  ┌──────────────────────────────────┐
  │  WORKFLOW: Mode + Action Detect  │
  └──────────────────────────────────┘
  📥 Image count + keywords + component name
  ⚙️ 1. Count images → MODE (single/multi)
     2. Check keywords → ACTION (create/edit)
     3. Check file exists → Confirm ACTION
  📤 { mode, action, component_name, file_exists }
      ↓
  ┌──────────────────────────────────┐
  │  WORKFLOW: Validate Shared Rules │
  └──────────────────────────────────┘
  📥 Rules file path
  ⚙️ Read .claude/workflows/import-design-by-image-rules.md
  📤 Rules loaded OR ERROR (stop)
      ↓
  ┌───────────────────────────────────────────────────────┐
  │              Route by Image Count                      │
  ├─────────────────────────┬─────────────────────────────┤
  │    1 IMAGE (SINGLE)     │    2+ IMAGES (MULTI)        │
  ├─────────────────────────┼─────────────────────────────┤
  │ import-design-by-image- │ import-design-by-image-     │
  │ single.md               │ multi.md                    │
  ├─────────────────────────┼─────────────────────────────┤
  │📥 Pre-detected context  │📥 Pre-detected context      │
  │⚙️ Analyze → Generate    │⚙️ Catalog → Compare states  │
  │   → Ask approval        │   → Consolidate → Ask       │
  │📤 source/design-system/ │📤 source/design-system/     │
  │   {ComponentName}.md    │   {ComponentName}.md        │
  └─────────────────────────┴─────────────────────────────┘
```

---

## Step 1: Mode + Action Detection (CRITICAL - DO FIRST)

**Before loading any agent context, detect BOTH:**

```
┌─────────────────────────────────────────┐
│  DETECTION (WORKFLOW LEVEL)             │
├─────────────────────────────────────────┤
│  1. Count images → MODE (single/multi)  │
│  2. Check keywords → ACTION (create/edit)│
│  3. Check file exists → confirm ACTION  │
│  4. Pass both to agent                  │
└─────────────────────────────────────────┘
```

### 1a. Mode Detection

| Signal | Mode |
|--------|------|
| 1 image attached | SINGLE |
| 2+ images attached | MULTI |
| "this image", "single" | SINGLE |
| "these images", "states", "hover", "disabled" | MULTI |
| Unclear / no images | ASK (AskUserQuestion) |

### 1b. Action Type Detection (NEW - saves tokens)

| Signal | Action |
|--------|--------|
| "edit", "update", "modify", "change" | EDIT |
| "import", "create", "new", "convert" | CREATE |
| Component name only (no keywords) | CHECK FILE |

### 1c. File Existence Check

```
If component name provided:
  Check: source/design-system/{ComponentName}.md

  If EXISTS + EDIT keywords → ACTION = EDIT
  If EXISTS + no keywords → ASK user: "Create new or edit?"
  If NOT EXISTS → ACTION = CREATE
```

---

## Step 2: Validate Shared Rules (NEW)

**BEFORE routing to agent, verify rules file exists:**

```
Read: .claude/workflows/import-design-by-image-rules.md

If read fails:
  ERROR: "Shared rules file not found. Cannot proceed."
  STOP workflow.

If read succeeds:
  Continue to Step 3.
```

---

## Step 3: Route to Agent with Context

**Pass pre-detected values to save tokens:**

```
Route to agent with:
{
  mode: "SINGLE" | "MULTI",
  action: "CREATE" | "EDIT",
  component_name: "{ComponentName}",
  file_exists: true | false,
  image_count: {number}
}
```

---

## Detection Table (Full)

| Signal | Mode | Action | Route To |
|--------|------|--------|----------|
| 1 image + "import" | SINGLE | CREATE | `import-design-by-image-single.md` |
| 1 image + "edit" | SINGLE | EDIT | `import-design-by-image-single.md` |
| 2+ images + "import" | MULTI | CREATE | `import-design-by-image-multi.md` |
| 2+ images + "update" | MULTI | EDIT | `import-design-by-image-multi.md` |
| "hover", "disabled", "states" | MULTI | - | `import-design-by-image-multi.md` |
| Unclear / no images | ASK | - | AskUserQuestion first |

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

### UNCLEAR Indicators
- No images visible
- Ambiguous text (could be either)
- User only provides text, no images

---

## Clarification Question (if UNCLEAR)

Use AskUserQuestion:

```
"I'll help you convert UI images to HTML/Tailwind. How many images will you provide?"

Options:
- "Single image (one state)"
- "Multiple images (different states like hover, disabled, etc.)"
```

**Then route to appropriate agent.**

---

## Agent Chains

### SINGLE Mode + CREATE
```
Workflow detects: mode=SINGLE, action=CREATE
→ import-design-by-image-single.md
→ (skip action detection) → analyze → generate → approve → create
```

### SINGLE Mode + EDIT
```
Workflow detects: mode=SINGLE, action=EDIT
→ import-design-by-image-single.md
→ (skip action detection) → read existing → analyze → compare → approve → update
```

### MULTI Mode + CREATE
```
Workflow detects: mode=MULTI, action=CREATE
→ import-design-by-image-multi.md
→ (skip action detection) → catalog → compare states → consolidate → approve → create
```

### MULTI Mode + EDIT
```
Workflow detects: mode=MULTI, action=EDIT
→ import-design-by-image-multi.md
→ (skip action detection) → read existing → catalog → compare → approve → update
```

---

## Scope

**Target:** `source/design-system/{ComponentName}.md`

**DO:**
- Convert images to HTML + Tailwind
- Create component documentation
- Use design system icons

**DO NOT:**
- Modify RULE.md or icons
- Create files outside design-system
- Generate backend code

---

## Shared Rules Reference

Both agents MUST read: `.claude/workflows/import-design-by-image-rules.md`

Contains:
- Icon detection workflow
- RULE.md compliance
- Output documentation format
- HTML/CSS format rules
- Color/category mappings
- Date field requirements

---

## Token Savings

| Scenario | Savings |
|----------|---------|
| Single image | ~51% |
| Multi image | ~35% |
| Average (70% single) | ~46% |
