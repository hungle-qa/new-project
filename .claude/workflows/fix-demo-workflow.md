# Fix Demo Workflow

**Purpose:** Fix bugs or improve existing demo projects in `source/demo/{project-name}/`.

**Guardrails and scope rules are defined in the command file** (`.claude/commands/fix-demo.md`).

---

## Agent Data Flow

### SIMPLE Tier
```
[User Request] → implementer → Done
```

### MEDIUM Tier
```
[User Request] → quick-scout → implementer → Done
```

### COMPLEX Tier
```
[User Request]
      ↓
    scout ──→ planner ──→ designer ──→ implementer → Done
```

---

## Tier Agent Chains

| Tier | Agent Chain | When |
|------|-------------|------|
| SIMPLE | `implementer` | Single file, text/styling change |
| MEDIUM | `quick-scout` → `implementer` | 2-3 files, clear scope |
| COMPLEX | `scout` → `planner` → `designer` → `implementer` | Multi-page, unclear scope, restructure |

**Tier detection rules are in the command file.**

---

## Orchestration

### Step 0: Get Demo Name and Issue

**If name provided:** Confirm project name
**If no name:** List available demos from `source/demo/*/`, ask user to choose
**If demo directory does not exist:** List available demos and ask user to confirm or choose

**If issue provided:** Confirm issue description
**If no issue:** Ask user what to fix or improve

### Step 1a: Quick Scout (MEDIUM Tier Only)

Call `.claude/agents/quick-scout.md` with:
- **scope**: `source/demo/{project-name}/`, `source/design-system/`
- **task**: Issue description

**Output**: Found files + inline plan → hand off to implementer

### Step 1b: Scout (COMPLEX Tier Only)

Call `.claude/agents/scout.md` with:
- **workflow**: "fix-demo"
- **scope**: `source/demo/{project-name}/`, `source/design-system/`
- **skip**: `client/src/`, `server/`, other demo projects
- **task**: Issue description

**Output**: Current demo files, relevant code sections

### Step 2: Planner (COMPLEX Only)

Call `.claude/agents/planner.md` with:
- **scout_findings**: Output from scout
- **task**: Issue description
- **workflow**: "fix-demo"

**Output**: Fix plan with file changes

### Step 3: Designer (COMPLEX Only, if UI fix)

**Skip if**: Issue is not UI-related (content only, logic fix)

Call `.claude/agents/designer.md` with:
- **plan**: Output from planner
- **workflow**: "fix-demo"

**Output**: UI change recommendations

### Step 4: Implementer (All Tiers)

Call `.claude/agents/implementer.md` with:
- **plan**: Output from planner/quick-scout (or direct issue for SIMPLE)
- **designer_suggestions**: Output from designer (if any)
- **workflow**: "fix-demo"
- **output_path**: `source/demo/{project-name}/`

**Output**: Updated HTML/CSS files

---

## File Structure

```
source/demo/{project-name}/
├── README.md           # Project overview
├── components/         # Demo-specific components
│   └── {name}.html
├── pages/              # Demo page layouts
│   ├── home.html
│   ├── dashboard.html
│   └── settings.html
└── assets/             # Images, icons
    └── {name}.{ext}
```

## Rules

1. **Confirm demo**: Always verify which demo to fix
2. **Understand issue**: Get clear issue description before starting
3. **DEMO FILES ONLY**: Only modify files in `source/demo/{project-name}/`
4. **READ ONLY sources**: Design system, product ideas, spec templates are READ ONLY
5. **Ask if confused**: If task mentions files outside demo folder, ASK user
6. **Preserve structure**: Don't reorganize unless necessary
7. **Skip designer**: If not UI-related, go directly to implementer
8. **One fix at a time**: Handle multiple issues sequentially
9. **Approved only**: Only use design system components with `status: approved`
