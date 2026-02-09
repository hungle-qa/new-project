# Skill: IMPORT-SPEC

**Purpose:** Import PDF spec for a feature, extract requirements, map design-system components.

**Trigger:** `import-spec` keyword + feature-name

---

## Prerequisites

- Feature-name provided (REQUIRED)

---

## Steps

### Step 1: Validate Feature Name

1. Confirm feature-name is provided
2. If not -> Error: "Please provide feature name: `/testcase import-spec {feature-name}`"

### Step 2: Create Feature Folder

Create folder structure:
```
source/testcase/{feature-name}/
  spec/
  result/
  config.md
```

### Step 3: Import PDF Spec

1. Ask user for PDF file path using AskUserQuestion:
   - "Provide the path to the feature spec PDF file"
2. Read PDF using Read tool (PDF capability)
3. Extract from PDF:
   - **Requirements**: Functional and non-functional
   - **Acceptance criteria**: Per requirement
   - **User stories**: If present
   - **Business rules**: Conditions and constraints
   - **UI elements**: Forms, buttons, tables, inputs referenced

### Step 4: Map Design-System Components

1. Ask user which design-system components map to this feature using AskUserQuestion
2. Read available components from `source/design-system/` for reference
3. Save component mappings to `source/testcase/{feature-name}/config.md` with format:

```markdown
# {feature-name} Component Config

## Mapped Components
- {ComponentName}: {usage description}
- {ComponentName}: {usage description}

## Notes
{any additional context}
```

### Step 5: Save Extracted Spec

1. Format extracted content as markdown
2. Save to `source/testcase/{feature-name}/spec/{feature-name}-spec.md` with structure:

```markdown
# {feature-name} Spec

## Source
- File: {original PDF path}
- Imported: {date}

## Requirements
{extracted requirements}

## Acceptance Criteria
{extracted criteria}

## User Stories
{extracted stories}

## Business Rules
{extracted rules}

## UI Elements
{extracted UI elements}
```

### Step 6: Show Extraction for Approval

1. Display extracted content summary:
   - Requirements count
   - Acceptance criteria count
   - Business rules count
   - Mapped components
2. Use AskUserQuestion: "Does the extracted spec look correct?"
3. If rejected -> Ask what to modify -> Re-extract/edit -> Re-confirm

---

## Validation

| Check | Condition |
|-------|-----------|
| Feature-name provided | Non-empty string |
| PDF readable | Read tool can parse the file |
| Spec saved | `source/testcase/{feature}/spec/{feature}-spec.md` exists |
| Config saved | `source/testcase/{feature}/config.md` exists |
| User approved | AskUserQuestion confirmation received |

---

## Error Handling

| Error | Response |
|-------|----------|
| No feature-name | "Please provide feature name: `/testcase import-spec {feature-name}`" |
| PDF not found | "PDF file not found at {path}. Please provide a valid path." |
| PDF parse failure | "Could not parse PDF. Ensure file is a valid PDF document." |
| Feature folder exists | Ask user: "Feature folder already exists. Overwrite spec?" |
