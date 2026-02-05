# Import Design By Image Workflow

**Purpose:** Route to appropriate agent based on image count.

---

## Mode Detection (CRITICAL - DO FIRST)

**Before loading any agent context:**

```
┌─────────────────────────────────────────┐
│  MODE DETECTION (EARLY)                 │
├─────────────────────────────────────────┤
│  Count images / parse user text         │
│  ↓                                      │
│  SINGLE (1 image) → single agent        │
│  MULTI (2+ images) → multi agent        │
│  UNCLEAR → AskUserQuestion              │
└─────────────────────────────────────────┘
```

---

## Detection Table

| Signal | Mode | Route To |
|--------|------|----------|
| 1 image attached | SINGLE | `import-design-by-image-single.md` |
| 2+ images attached | MULTI | `import-design-by-image-multi.md` |
| "this image", "single" | SINGLE | `import-design-by-image-single.md` |
| "these images", "states" | MULTI | `import-design-by-image-multi.md` |
| "hover", "disabled", "active" | MULTI | `import-design-by-image-multi.md` |
| Unclear / no images | ASK | AskUserQuestion first |

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

### SINGLE Mode
```
import-design-by-image-single.md
→ analyze → generate → approve → create
```

### MULTI Mode
```
import-design-by-image-multi.md
→ count → catalog → compare → consolidate → approve → create
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
