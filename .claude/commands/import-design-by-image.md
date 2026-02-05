---
description: Convert UI component images to HTML with Tailwind CSS
argument-hint: [attach image(s)]
---

**Purpose:** Convert UI component images into HTML with Tailwind CSS and create design system documentation.

**Target:** `source/design-system/{ComponentName}.md`

---

## Mode Detection (REQUIRED - DO FIRST)

**BEFORE loading any agent, detect TWO things:**

### 1. Action Type (CREATE vs EDIT)

| Signal | Action | Behavior |
|--------|--------|----------|
| "edit", "update", "modify", "change" + component name | **EDIT** | Read existing → Compare → Approve |
| "import", "create", "new", "convert" | **CREATE** | Generate → Approve → Create |
| Component name exists in `source/design-system/` | **EDIT** | Treat as edit if component exists |

### 2. Image Count (SINGLE vs MULTI)

| Signal | Mode | Agent |
|--------|------|-------|
| 1 image | SINGLE | `import-design-by-image-single` |
| 2+ images | MULTI | `import-design-by-image-multi` |
| "this image", "single" | SINGLE | `import-design-by-image-single` |
| "these images", "states", "hover", "disabled" | MULTI | `import-design-by-image-multi` |
| Unclear / no images | ASK | AskUserQuestion first |

**Pass action type to agent:** Include `ACTION=EDIT` or `ACTION=CREATE` in prompt.

---

## If UNCLEAR

Use AskUserQuestion:
```
"I'll help convert UI images to HTML/Tailwind. How many images will you provide?"

Options:
- "Single image (one state)"
- "Multiple images (different states like hover, disabled, etc.)"
```

Then route to appropriate agent.

---

## Workflow Reference

Follow: `.claude/workflows/import-design-by-image-workflow.md`

---

## Agent Routing

**SINGLE Mode (1 image):**
```
→ import-design-by-image-single
→ CREATE: analyze → generate → approve → create
→ EDIT:   read existing → generate → show BEFORE/AFTER → approve → update
```

**MULTI Mode (2+ images):**
```
→ import-design-by-image-multi
→ CREATE: count → catalog → compare → consolidate → approve → create
→ EDIT:   read existing → compare → show BEFORE/AFTER → approve → update
```

---

## EDIT Mode Flow (Both Agents)

When `ACTION=EDIT`:

1. **Read existing** component: `source/design-system/{ComponentName}.md`
2. **Generate** new HTML/CSS from image(s)
3. **Show BEFORE vs AFTER** comparison
4. **Approval Gate** with options: "Approve update" / "Need changes" / "Cancel"
5. **Only if approved:** Update file

---

Task: $ARGUMENTS
