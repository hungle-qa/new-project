# Agent Data Contracts

Standard schemas for data transfer between agents in the workflow chain.

## Workflow Chain

```
scout → planner → designer → implementer
         ↓           ↓           ↓
    [JSON file]  [MD file]  [JSON file]
```

## Output Directory

All structured agent outputs are stored in `.agent-output/`:
- Scout: `.agent-output/scout-{timestamp}.json`
- Designer: `.agent-output/designer-{timestamp}.json`
- Planner: `plans/{feature-slug}-plan.md`

---

## Scout Output Schema

**File:** `.agent-output/scout-{timestamp}.json`

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "task": "Add search to design system page",
  "scope": "frontend",
  "directories_searched": ["client/src/pages/", "client/src/components/"],
  "directories_skipped": ["server/", "source/"],
  "files": {
    "design_system": [
      {
        "path": "source/design-system/Button.md",
        "summary": "Primary button component with variants",
        "patterns": ["shadcn/ui", "Tailwind CSS"]
      }
    ],
    "product_ideas": [],
    "components": [
      {
        "path": "client/src/components/ComponentCard.tsx",
        "summary": "Card displaying component info",
        "exports": ["ComponentCard"],
        "imports": ["Card", "Button"]
      }
    ],
    "pages": [
      {
        "path": "client/src/pages/DesignSystemPage.tsx",
        "summary": "Main design system viewer page",
        "routes": ["/design-system"]
      }
    ],
    "api_routes": [
      {
        "path": "server/routes/design-system.ts",
        "summary": "CRUD endpoints for design system",
        "endpoints": [
          { "method": "GET", "path": "/api/design-system" },
          { "method": "GET", "path": "/api/design-system/:name" }
        ]
      }
    ],
    "services": [
      {
        "path": "server/services/DesignSystemService.ts",
        "summary": "File-based service for design system",
        "methods": ["getAll", "getByName", "create", "delete"]
      }
    ]
  },
  "patterns_found": {
    "storage_type": "file-based",
    "component_library": "shadcn/ui",
    "state_management": "useState/useEffect",
    "styling": "Tailwind CSS"
  },
  "dependencies": [
    {
      "file": "client/src/pages/DesignSystemPage.tsx",
      "depends_on": ["client/src/components/ComponentCard.tsx"]
    }
  ]
}
```

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `timestamp` | string | ISO 8601 timestamp |
| `task` | string | Original task description |
| `scope` | string | `demo-only`, `frontend`, `backend`, `full` |
| `directories_searched` | string[] | Directories that were searched |
| `directories_skipped` | string[] | Directories that were skipped |
| `files` | object | Categorized file findings |
| `patterns_found` | object | Detected code patterns |

---

## Planner Output Schema

**File:** `plans/{feature-slug}-plan.md`

```yaml
---
title: "Add Search to Design System"
status: pending
module: design-system
target: client/src/pages/DesignSystemPage.tsx
created: 2024-01-15
scout_output: .agent-output/scout-1705312200000.json
---
```

### Required Frontmatter Fields

| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Feature name |
| `status` | string | `pending`, `approved`, `completed` |
| `module` | string | `design-system`, `specs`, `product-ideas`, `ai-engine`, `demo-pages` |
| `target` | string | Primary file being modified |
| `created` | string | YYYY-MM-DD format |
| `scout_output` | string | Path to scout's JSON output |

---

## Designer Output Schema

**File:** `.agent-output/designer-{timestamp}.json`

```json
{
  "timestamp": "2024-01-15T10:45:00Z",
  "feature": "Add Search to Design System",
  "plan_file": "plans/add-search-plan.md",
  "layout": {
    "wireframe_ascii": "+----------------------------------+\n| Header            [Search Input] |\n+----------------------------------+\n| Card | Card | Card | Card        |\n+----------------------------------+",
    "structure": ["Header with search", "Grid of ComponentCards", "Filter dropdown"]
  },
  "components": [
    {
      "name": "Input",
      "source": "shadcn/ui",
      "usage": "Search input field",
      "props": [
        { "name": "placeholder", "type": "string", "required": false },
        { "name": "value", "type": "string", "required": true },
        { "name": "onChange", "type": "(value: string) => void", "required": true }
      ],
      "state": [
        { "name": "searchTerm", "type": "string", "initialValue": "" }
      ]
    }
  ],
  "design_tokens": {
    "spacing": {
      "container": "p-6",
      "grid_gap": "gap-4",
      "card_padding": "p-4"
    },
    "colors": {
      "background": "bg-gray-50",
      "card": "bg-white",
      "border": "border-gray-200"
    }
  },
  "accessibility": {
    "aria_labels": [
      { "element": "search input", "label": "Search components" }
    ],
    "keyboard_nav": ["Tab through cards", "Enter to select"]
  },
  "missing_components": []
}
```

### Required Fields

| Field | Type | Description |
|-------|------|-------------|
| `timestamp` | string | ISO 8601 timestamp |
| `feature` | string | Feature name from plan |
| `plan_file` | string | Path to planner's markdown file |
| `layout` | object | Wireframe and structure |
| `components` | array | Component specifications |
| `design_tokens` | object | Spacing, colors, typography |
| `accessibility` | object | A11y requirements |

---

## Implementer Input Requirements

Implementer receives paths to all previous outputs:

```
{
  "plan_file_path": "plans/add-search-plan.md",
  "scout_output_path": ".agent-output/scout-1705312200000.json",
  "designer_output_path": ".agent-output/designer-1705313100000.json"
}
```

### Reading Priority

1. **Plan file** (always required) - Implementation steps and target files
2. **Scout output** (always required) - Patterns to reuse
3. **Designer output** (if UI involved) - Component specs and layout

---

## Data Flow Protocol

### Step 1: Scout → Planner

```
Scout completes:
1. Write JSON to `.agent-output/scout-{Date.now()}.json`
2. Return: { scout_output_path: ".agent-output/scout-xxx.json" }

Planner receives:
1. Read scout JSON from provided path
2. Validate required fields exist
3. Use data to populate plan tables
```

### Step 2: Planner → Designer

```
Planner completes:
1. Write MD to `plans/{feature-slug}-plan.md`
2. Include `scout_output` in frontmatter
3. Return: { plan_file_path: "plans/xxx-plan.md" }

Designer receives:
1. Read plan MD from provided path
2. Extract feature requirements from plan
3. Read scout JSON from plan's `scout_output` field
4. Use existing components from scout findings
```

### Step 3: Designer → Implementer

```
Designer completes:
1. Write JSON to `.agent-output/designer-{Date.now()}.json`
2. Include `plan_file` in output
3. Return: { designer_output_path: ".agent-output/designer-xxx.json" }

Implementer receives:
1. Read designer JSON from provided path
2. Read plan MD from designer's `plan_file` field
3. Read scout JSON from plan's `scout_output` field
4. Has complete context for implementation
```

---

## Validation Rules

### Scout Output Validation

```
REQUIRED:
- timestamp: must be valid ISO 8601
- task: non-empty string
- scope: one of ["demo-only", "frontend", "backend", "full"]
- files: object with at least one non-empty array

OPTIONAL:
- patterns_found: can be empty object
- dependencies: can be empty array
```

### Plan File Validation

```
REQUIRED:
- YAML frontmatter with title, status, module, target, created
- scout_output field pointing to valid JSON file
- "Implementation Steps" section with table
- "Next Agents" section

OPTIONAL:
- "API Endpoints" section (backend tasks)
- "Unresolved Questions" section
```

### Designer Output Validation

```
REQUIRED:
- timestamp: valid ISO 8601
- feature: non-empty string
- plan_file: valid path to plan MD
- layout.wireframe_ascii: non-empty string
- components: array (can be empty if no new components)

OPTIONAL:
- design_tokens: can use defaults
- accessibility: can be empty
- missing_components: can be empty array
```

---

## Error Handling

### Missing Scout Output

```
Error: "Scout output file not found: {path}"
Action: Re-run scout agent or provide valid path
```

### Invalid JSON Schema

```
Error: "Scout output missing required field: {field}"
Action: Re-run scout with complete output
```

### Plan File Not Found

```
Error: "Plan file not found: {path}"
Action: Re-run planner or provide valid path
```

### Designer Skipped (Backend-only)

```
If task is backend-only:
- designer_output_path = null
- Implementer proceeds with plan + scout only
```
