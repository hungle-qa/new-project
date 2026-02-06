---
description: Convert UI component images to HTML with Tailwind CSS
argument-hint: [attach image(s)]
---

**Purpose:** Convert UI component images into HTML with Tailwind CSS, validate pasted code, or update existing components.

**Target:** `source/design-system/{ComponentName}.md`

---

## Mode Detection (REQUIRED - DO FIRST)

**BEFORE loading agent, detect mode:**

### 1. Image/Code Check

| Signal | Mode |
|--------|------|
| HTML/CSS code pasted, no images | VALIDATE |
| 1 image | SINGLE |
| 2+ images | MULTI |
| No images + component name + exists | UPDATE |
| Unclear / no images / no code | ASK |

### 2. Action Type (for SINGLE/MULTI)

| Signal | Action |
|--------|--------|
| "edit", "update", "modify", "change" + component name | EDIT |
| "import", "create", "new", "convert" | CREATE |
| Component exists in `source/design-system/` | Check + ASK if ambiguous |

**Pass mode and action to agent.**

---

## If UNCLEAR

Use AskUserQuestion:
```
"I'll help with design system components. What would you like to do?"

Options:
- "Single image (one state)"
- "Multiple images (different states like hover, disabled, etc.)"
- "Update existing component (no image needed)"
- "Validate pasted HTML/CSS code"
```

Then route to agent.

---

## Workflow Reference

Follow: `.claude/workflows/import-design-by-image-workflow.md`

---

## Agent Routing

**All modes route to: `import-design`**

The master agent loads the matching skill internally:
```
-> import-design
   -> VALIDATE: analyze code -> validate -> report -> approve -> create
   -> SINGLE:   analyze image -> generate -> approve -> create/update
   -> MULTI:    catalog images -> compare states -> consolidate -> approve -> create/update
   -> UPDATE:   read existing -> apply changes -> show diff -> approve -> update
```

---

## EDIT Mode Flow

When `ACTION=EDIT`:

1. **Read existing** component: `source/design-system/{ComponentName}.md`
2. **Generate** new HTML/CSS from image(s) or apply requested changes
3. **Show BEFORE vs AFTER** comparison
4. **Approval Gate** with options: "Approve update" / "Need changes" / "Cancel"
5. **Only if approved:** Update file

---

Task: $ARGUMENTS
