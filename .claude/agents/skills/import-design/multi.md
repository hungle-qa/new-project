# Skill: MULTI

**Mode:** Convert 2+ UI component images (different states) to consolidated HTML + Tailwind CSS
**Actions:** CREATE (new component) or EDIT (update existing)

---

## IMAGE FIDELITY RULE (P0 - CRITICAL)

**The original images are the SOURCE OF TRUTH. Adhere strictly to them.**

| Principle | Rule |
|-----------|------|
| **Exact Match** | Generated code MUST visually match each image pixel-perfectly |
| **No Assumptions** | Do NOT add states not provided in images |
| **No Improvements** | Do NOT "improve" or "enhance" the design beyond what's shown |
| **Colors** | Extract exact colors from each image state |
| **Spacing** | Match padding, margins, gaps exactly as shown |
| **Typography** | Match font sizes, weights, line heights from images |
| **State-Specific** | Each state must match its corresponding image exactly |

**When in doubt, ASK the user rather than guess.**

---

## Step 0: Use Pre-Detected Context

Workflow may pass pre-detected values:
```
{ mode: "MULTI", action: "CREATE"|"EDIT", component_name, file_exists, image_count }
```

**If action not provided (fallback):**
- Check keywords: "edit", "update", "modify" -> EDIT
- Check file exists at `source/design-system/{ComponentName}.md`
- File exists + edit keywords -> EDIT
- File exists + no keywords -> ASK user
- File doesn't exist -> CREATE

### Step 0a: EDIT Mode - Read Existing

```
Read: source/design-system/{ComponentName}.md
Extract: Current HTML, CSS, Component States
Store as: BEFORE_HTML, BEFORE_CSS, BEFORE_STATES
```

---

## Step 1: Count & Catalog Images

**CRITICAL: Document each image received.**

```markdown
## Images Received: {count}

| Image # | Detected State | Key Visual Differences |
|---------|----------------|------------------------|
| 1       | Default        | Blue bg, white text    |
| 2       | Hover          | Darker blue bg         |
| 3       | Disabled       | Gray bg, 50% opacity   |
```

---

## Step 2: Ask Clarifying Questions (if unclear)

**If ANY image state is unclear, ASK:**

```
"I've received {count} images. Here's my analysis:

Image 1: Appears to be DEFAULT state (blue background)
Image 2: Appears to be HOVER state (darker blue)
Image 3: UNCLEAR - Is this disabled or loading state?

Please confirm or correct my understanding."
```

Use AskUserQuestion with specific options for unclear states.

---

## Step 3: Compare Images (State Differences)

| Aspect | Default | Hover | Focus | Disabled |
|--------|---------|-------|-------|----------|
| Background | `bg-[#184EFF]` | `bg-[#1241CC]` | - | `bg-gray-300` |
| Text | `text-white` | - | - | `text-gray-500` |
| Opacity | - | - | - | `opacity-50` |
| Border | - | - | `ring-2` | - |
| Shadow | - | `shadow-lg` | - | - |

---

## Step 4: Consolidate into Single Component

**Generate ONE component with ALL states using Tailwind modifiers:**

```html
<button class="
  bg-[#184EFF] text-white           /* default */
  hover:bg-[#1241CC]                /* hover (image 2) */
  focus:ring-2 focus:ring-blue-300  /* focus (image 3) */
  disabled:bg-gray-300 disabled:opacity-50  /* disabled (image 4) */
">
  Button
</button>
```

---

## Step 5: Show Mock-up with States Table (MANDATORY)

**For CREATE mode:**
```markdown
## Mock-up Preview

\`\`\`html
{complete HTML with ALL state modifiers}
\`\`\`

## Component States (from {count} images)

| State | Image # | Trigger | Visual Changes | Tailwind Classes |
|-------|---------|---------|----------------|------------------|
| Default | 1 | - | Blue bg, white text | `bg-[#184EFF] text-white` |
| Hover | 2 | Mouse over | Darker blue | `hover:bg-[#1241CC]` |
```

**For EDIT mode - Show BEFORE vs AFTER with states tables.**

---

## States Table Validation

After Phase 2, verify Component States section has exactly {image_count} rows (one per image).

---

## State Mapping Reference

| State | Tailwind Prefix | Trigger |
|-------|-----------------|---------|
| Default | (none) | Initial |
| Hover | `hover:` | Mouse over |
| Focus | `focus:` | Tab/click |
| Focus-visible | `focus-visible:` | Keyboard focus |
| Active | `active:` | Click hold |
| Disabled | `disabled:` | `disabled` attr |
| Group-hover | `group-hover:` | Parent hover |

---

## Phase 1 & Phase 2

Follow master agent's two-phase workflow:
- **Phase 1:** Create/update HTML + CSS sections only -> user tests
- **Phase 2:** After approval -> complete full documentation (16 sections) with Component States table
