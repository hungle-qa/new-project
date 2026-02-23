# Build-App Chain Audit Report

**Date:** 2026-02-23
**Auditor:** AGIA (Agent Intelligence Architect)
**Scope:** build-app workflow → implementer → skills (easy/medium/hard)

---

## Executive Summary

**Current State:** Triage logic embedded inside implementer agent. Workflow is passive. User sees classification AFTER agent starts.

**Desired State:** Workflow (main thread) classifies task → messages user → calls implementer with pre-selected skill rules embedded in prompt.

**Critical Issue:** Skills are referenced but NOT loadable by subagents. Only the main thread (orchestrator) can read files. Implementer must receive skill rules as embedded prompt content.

---

## Issues by File

### 1. `.claude/workflows/build-app-workflow.md`

#### Issues Found

| # | Issue | Severity | Impact |
|---|-------|----------|--------|
| 1.1 | No classification logic | HIGH | Workflow is passive, just delegates to implementer |
| 1.2 | No classification criteria table | HIGH | Cannot classify EASY/MEDIUM/HARD |
| 1.3 | No user messaging step | MEDIUM | User doesn't see classification decision |
| 1.4 | No skill content loading instruction | HIGH | Workflow doesn't tell orchestrator to read and embed skill file |
| 1.5 | No Task agent call syntax | MEDIUM | Unclear how to invoke implementer with skill context |

#### Proposed Changes

1. Add classification criteria table (file count, complexity, UI scope)
2. Add classification step BEFORE implementer call
3. Add user messaging format
4. Add skill file loading instruction: "Read `.claude/agents/skills/implementer/{level}.md` and embed in implementer prompt"
5. Add Task agent call template with skill rules parameter

---

### 2. `.claude/commands/start.md`

#### Issues Found

| # | Issue | Severity | Impact |
|---|-------|----------|--------|
| 2.1 | Duplicates workflow logic | MEDIUM | Redundant triage criteria |
| 2.2 | Too thick — should be thin router | LOW | Confusion over responsibilities |
| 2.3 | No clear delegation statement | LOW | Unclear that workflow owns classification |

#### Proposed Changes

1. Remove all triage logic
2. Simplify to: "Expand user request context → delegate to build-app-workflow.md"
3. Add clear statement: "Classification happens in workflow, NOT here"

---

### 3. `.claude/agents/implementer.md`

#### Issues Found

| # | Issue | Severity | Impact |
|---|-------|----------|--------|
| 3.1 | Step 0 self-classifies | CRITICAL | User doesn't see classification before execution |
| 3.2 | References skill files but can't read them | CRITICAL | Subagent has no Read tool for `.claude/agents/skills/` directory |
| 3.3 | Contains triage criteria (duplicates workflow) | MEDIUM | Single source of truth violated |
| 3.4 | No expectation of pre-loaded skill rules | HIGH | Assumes it will self-classify |

#### Proposed Changes

1. **Remove Step 0 entirely** — no self-classification
2. Change INPUT section to expect: `{task description} + {classification: EASY/MEDIUM/HARD} + {skill rules}`
3. Add assumption: "The orchestrator has already classified the task and loaded the appropriate skill rules into this prompt"
4. Remove all triage criteria tables
5. Change Step 1 to: "Execute according to the skill rules provided in this prompt"
6. Add VALIDATION: "If classification or skill rules missing, ERROR immediately"

---

### 4. `.claude/agents/skills/implementer/easy.md`

#### Issues Found

| # | Issue | Severity | Impact |
|---|-------|----------|--------|
| 4.1 | Not embeddable format | MEDIUM | File has metadata header, not pure skill rules |
| 4.2 | No "This is EASY skill" identifier | LOW | Implementer can't self-validate which skill it received |

#### Proposed Changes

1. Add header: `# EASY Skill Rules` at top
2. Ensure content is pure skill workflow (no frontmatter)
3. Add clear boundaries: "SCOPE: Small fixes, 1 file, 2 tool calls max"
4. Format for embedding: orchestrator will paste entire file into implementer prompt

---

### 5. `.claude/agents/skills/implementer/medium.md`

#### Issues Found

| # | Issue | Severity | Impact |
|---|-------|----------|--------|
| 5.1 | Not embeddable format | MEDIUM | Same as easy.md |
| 5.2 | No "This is MEDIUM skill" identifier | LOW | Same as easy.md |

#### Proposed Changes

1. Add header: `# MEDIUM Skill Rules` at top
2. Ensure content is pure skill workflow
3. Add clear boundaries: "SCOPE: Small features, 2-3 files, standard UI patterns"
4. Format for embedding

---

### 6. `.claude/agents/skills/implementer/hard.md`

#### Issues Found

| # | Issue | Severity | Impact |
|---|-------|----------|--------|
| 6.1 | Not embeddable format | MEDIUM | Same as easy.md |
| 6.2 | No "This is HARD skill" identifier | LOW | Same as easy.md |

#### Proposed Changes

1. Add header: `# HARD Skill Rules` at top
2. Ensure content is pure skill workflow
3. Add clear boundaries: "SCOPE: Complex features, 5+ files, new APIs, state management"
4. Format for embedding

---

## Proposed New Content

### File 1: `.claude/workflows/build-app-workflow.md`

```markdown
# Build App Workflow

**Purpose:** Classify task complexity → load appropriate skill → delegate to implementer agent

**Entry Point:** `/start` command

---

## Classification Criteria

| Level | File Count | Complexity | Examples | Skill File |
|-------|-----------|------------|----------|-----------|
| **EASY** | 1 file | Bug fix, typo, simple refactor | Fix typo, update label, remove unused import | `.claude/agents/skills/implementer/easy.md` |
| **MEDIUM** | 2-3 files | Small feature, standard UI pattern | Add search to component, new modal, CRUD form | `.claude/agents/skills/implementer/medium.md` |
| **HARD** | 5+ files | Complex feature, new API, state mgmt | New module, authentication, multi-step wizard | `.claude/agents/skills/implementer/hard.md` |

---

## Workflow Steps

### Step 1: Classify Task

Read user task description. Match against Classification Criteria table.

**Output:**
- Classification: EASY / MEDIUM / HARD
- Reasoning: 1 sentence why this classification fits

**Example:**
```
Task: "Add search bar to design system"
Classification: MEDIUM
Reasoning: Standard UI pattern, 2-3 files (component + story + styles)
```

### Step 2: Message User

Display classification decision to user in this exact format:

```
Classification: {LEVEL}
Scope: {File count estimate}
Rationale: {Reasoning from Step 1}
```

**Example:**
```
Classification: MEDIUM
Scope: 2-3 files
Rationale: Standard UI pattern, component + story + styles
```

### Step 3: Load Skill Rules

Read the skill file matching the classification:
- EASY → `.claude/agents/skills/implementer/easy.md`
- MEDIUM → `.claude/agents/skills/implementer/medium.md`
- HARD → `.claude/agents/skills/implementer/hard.md`

Store entire file content as variable `skill_rules`.

### Step 4: Call Implementer Agent

Invoke implementer using Task agent with this prompt structure:

```
Task: {original user request}

Classification: {LEVEL}

Skill Rules:
{skill_rules}

Execute according to the Skill Rules above.
```

**Important:** The implementer agent does NOT classify. It executes according to the skill rules provided in this prompt.

---

## Validation

Before calling implementer, verify:
1. Classification matches one of: EASY, MEDIUM, HARD
2. Skill file exists and is readable
3. User has been messaged with classification decision

If any validation fails, ERROR and stop workflow.

---

## Chain I/O Contract

**Input:** User task description (string)
**Output:** Completed implementation (files written) + implementation report
**Side Effect:** User sees classification message before implementer starts

---

## Example Full Flow

```
User: "/start Add search to design system"
  ↓
[Workflow Step 1] Classify → MEDIUM (2-3 files, standard pattern)
  ↓
[Workflow Step 2] Message user:
  "Classification: MEDIUM
   Scope: 2-3 files
   Rationale: Standard UI pattern"
  ↓
[Workflow Step 3] Read `.claude/agents/skills/implementer/medium.md` → skill_rules
  ↓
[Workflow Step 4] Call Task(implementer) with:
  "Task: Add search to design system
   Classification: MEDIUM
   Skill Rules:
   {entire medium.md content}
   Execute according to the Skill Rules above."
  ↓
[Implementer] Executes MEDIUM skill workflow
  ↓
[Workflow] Receives implementer report → displays to user
```

---

## Notes

- The orchestrator (main thread) owns classification
- The implementer agent is a pure executor
- Skills are embedded as text in the implementer prompt
- User always sees classification BEFORE implementer runs
```

---

### File 2: `.claude/commands/start.md`

```markdown
# /start Command

**Purpose:** Entry point for build-app workflow

**Usage:**
```
/start {task description}
```

**Examples:**
```
/start Add search bar to design system
/start Fix typo in button label
/start Build new authentication module
```

---

## Command Flow

1. **Expand Context:** If user request is vague, ask clarifying questions
2. **Delegate to Workflow:** Pass expanded task description to `.claude/workflows/build-app-workflow.md`

**Important:** Classification happens in the workflow, NOT here. This command is a thin router.

---

## Validation

Before delegation, verify:
- Task description is clear enough (if not, ask user for clarification)
- User has confirmed they want to proceed

---

## Notes

- Do NOT classify task complexity here
- Do NOT call implementer directly
- Always delegate to build-app-workflow.md
```

---

### File 3: `.claude/agents/implementer.md`

```markdown
---
agentName: implementer
version: 2.0.0
description: Pure execution agent for classified build tasks. Receives pre-classified task + embedded skill rules from orchestrator.
tools:
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - Bash
workingDirectory: /Users/hungle-qa/hungle-note/source/QA-kit/client
contextFiles:
  - ./.claude/workflows/development-rules.md
  - ./README.md
  - ./docs/code-standards.md
  - ./docs/system-architecture.md
---

# Implementer Agent

**Role:** Pure executor for pre-classified build tasks. You do NOT classify tasks. You execute according to the skill rules provided in your prompt.

---

## INPUT CONTRACT

Your prompt will contain:

1. **Task:** User's request description
2. **Classification:** EASY / MEDIUM / HARD (already decided by orchestrator)
3. **Skill Rules:** Full skill workflow embedded as text

**Example Input:**
```
Task: Add search bar to design system
Classification: MEDIUM
Skill Rules:
{entire content of medium.md}
Execute according to the Skill Rules above.
```

**MANDATORY:** If any of these three elements are missing, ERROR immediately:
```
ERROR: Missing {Task/Classification/Skill Rules} in prompt. Cannot proceed.
The orchestrator must provide all three elements.
```

---

## EXECUTION

### Step 1: Validate Input

Check prompt contains:
- Task description
- Classification (EASY/MEDIUM/HARD)
- Skill Rules section

If any missing → ERROR and stop.

### Step 2: Execute Skill Rules

Follow the skill rules exactly as provided. The skill rules will tell you:
- How many files to modify
- Whether to write a plan
- How many tool calls allowed
- Whether verification is needed

**Important:** Do NOT improvise. Do NOT add steps not in the skill rules. Do NOT skip steps in the skill rules.

### Step 3: Report

At the end, provide:
```
### Implementation Report
**Classification:** {EASY/MEDIUM/HARD}
**Files Modified:** {count}
**Files List:**
- {absolute paths}

**Summary:** {1-2 sentences what was done}

**Verification:** {Pass/Fail/Not Required}
```

---

## CONSTRAINTS

### NEVER Do

- NEVER classify tasks yourself (classification is provided)
- NEVER read skill files yourself (skills are embedded in your prompt)
- NEVER deviate from the skill rules provided
- NEVER assume missing input (ERROR instead)

### ALWAYS Do

- ALWAYS validate input contract first
- ALWAYS follow skill rules exactly
- ALWAYS provide implementation report
- ALWAYS use absolute file paths in reports

---

## ASSUMPTIONS

1. The orchestrator has already read the project context (README, development-rules, etc.)
2. The orchestrator has already classified the task
3. The orchestrator has already loaded the appropriate skill file
4. Your prompt contains all the information you need to execute

---

## NOTES

- You are a pure executor, not a decision-maker
- The orchestrator owns classification and skill loading
- Your job is to execute the skill workflow faithfully
- If the skill rules are unclear, ERROR and stop (don't guess)
```

---

### File 4: `.claude/agents/skills/implementer/easy.md`

```markdown
# EASY Skill Rules

**Classification:** EASY
**Scope:** Bug fixes, typos, simple refactors, 1 file max
**Tool Call Limit:** 2 max (1 read + 1 write/edit)
**Flash Mode:** Enabled (fast execution)

---

## Skill Workflow

### Step 1: Read Target File

Use Read tool to load the file that needs modification.

**Constraint:** If task requires modifying more than 1 file, ERROR:
```
ERROR: Task requires {N} files. EASY skill limited to 1 file.
Reclassify as MEDIUM or HARD.
```

### Step 2: Apply Fix

Use Write or Edit tool to apply the change.

**Constraints:**
- No plan needed (change is obvious)
- No verification needed (change is trivial)
- If change is unclear, ERROR and ask user for clarification

### Step 3: Report

Provide implementation report:
```
### Implementation Report (EASY)
**Files Modified:** 1
- {absolute path}

**Change:** {1 sentence description}
```

---

## Examples

**Valid EASY tasks:**
- Fix typo in button label
- Remove unused import
- Update hardcoded string
- Add missing semicolon

**Invalid EASY tasks (reclassify):**
- Add new component (MEDIUM - needs multiple files)
- Refactor 3 files (MEDIUM - multiple files)
- Add new API endpoint (HARD - backend + frontend + tests)

---

## Tool Budget

- Read: 1 call
- Write/Edit: 1 call
- Grep/Glob: 0 calls (should not need search for EASY)
- Bash: 0 calls (no scripts/tests for EASY)

Total: 2 tool calls max

---

## Notes

- Fastest skill, no planning overhead
- User expects near-instant completion
- If task is ambiguous, it's NOT EASY
```

---

### File 5: `.claude/agents/skills/implementer/medium.md`

```markdown
# MEDIUM Skill Rules

**Classification:** MEDIUM
**Scope:** Small features, 2-3 files, standard UI patterns
**Tool Call Limit:** 10 max
**Planning:** Minimal (3-line plan)

---

## Skill Workflow

### Step 1: Scan Codebase

Use Grep/Glob to find:
- Similar components (for pattern matching)
- Related files (imports, tests, styles)

**Constraint:** If task requires modifying 5+ files, ERROR:
```
ERROR: Task requires {N} files. MEDIUM skill limited to 2-3 files.
Reclassify as HARD.
```

### Step 2: Write 3-Line Plan

Format:
```
1. {Action for file 1}
2. {Action for file 2}
3. {Action for file 3 (if needed)}
```

**Example:**
```
1. Create SearchBar.tsx component with input + icon
2. Add SearchBar to DesignSystem.stories.tsx
3. Export SearchBar from index.ts
```

**No approval needed** — proceed directly to Step 3.

### Step 3: Implement

Execute the plan. Use Read/Write/Edit tools.

**Constraints:**
- Follow existing code patterns (copy-paste from similar components)
- Minimal wireframe OK (ASCII art if UI layout is non-obvious)
- No over-engineering

### Step 4: Verify

Run quick check:
- TypeScript compiles (`npm run type-check` OR verify imports resolve)
- Files exist at expected paths

**If verification fails:** Fix and re-verify (max 2 attempts).

### Step 5: Report

```
### Implementation Report (MEDIUM)
**Files Modified:** {count}
- {absolute path 1}
- {absolute path 2}
- {absolute path 3}

**Plan Executed:**
1. {action 1}
2. {action 2}
3. {action 3}

**Verification:** {Pass/Fail}

**Summary:** {1-2 sentences}
```

---

## Examples

**Valid MEDIUM tasks:**
- Add search bar to design system (component + story + export)
- Create new modal component (component + types + styles)
- Add CRUD form for entity (form + validation + submit)

**Invalid MEDIUM tasks:**
- Fix typo (EASY - 1 file)
- Build authentication module (HARD - 5+ files, backend + frontend)

---

## Tool Budget

- Read: 3-5 calls
- Write/Edit: 2-3 calls
- Grep/Glob: 2-3 calls (find similar components)
- Bash: 1 call (verification)

Total: 10 calls max

---

## Notes

- Balance speed and thoroughness
- Leverage existing patterns (don't reinvent)
- User expects completion within 5 minutes
```

---

### File 6: `.claude/agents/skills/implementer/hard.md`

```markdown
# HARD Skill Rules

**Classification:** HARD
**Scope:** Complex features, 5+ files, new APIs, state management, multi-step workflows
**Tool Call Limit:** Unlimited (within reason)
**Planning:** Full plan + wireframe + verification

---

## Skill Workflow

### Step 1: Deep Scan

Use Grep/Glob/Read to understand:
- Existing architecture (how similar features are implemented)
- Related modules (frontend + backend + types)
- Test patterns (how other features are tested)

**Time Budget:** Spend 20% of total time on scanning.

### Step 2: Write Full Plan

Format:
```
## Implementation Plan

### Backend Changes
1. {action}
2. {action}
...

### Frontend Changes
1. {action}
2. {action}
...

### Tests
1. {action}
2. {action}
...

### Verification Steps
1. {step}
2. {step}
...
```

**Wireframe:** If UI is involved, provide ASCII or text description:
```
+------------------+
| Header           |
+------------------+
| [Search Input]   |
| Results List     |
|  - Item 1        |
|  - Item 2        |
+------------------+
```

**Approval Gate:** Display plan + wireframe. Wait for user approval before proceeding.

### Step 3: Implement in Phases

Break implementation into phases:
1. **Backend (if needed):** API endpoints, services, types
2. **Frontend:** Components, state, API integration
3. **Tests:** Unit tests, integration tests (if required)

**After each phase:** Run verification (TypeScript, linting, tests).

### Step 4: Full Verification

Run complete verification suite:
```bash
npm run type-check
npm run lint
npm run test (if tests exist)
```

**If any fail:** Fix and re-verify.

### Step 5: Report

```
### Implementation Report (HARD)
**Files Modified:** {count}

**Backend:**
- {file 1}
- {file 2}
...

**Frontend:**
- {file 1}
- {file 2}
...

**Tests:**
- {file 1}
- {file 2}
...

**Plan Adherence:** {All steps completed / Deviations noted}

**Verification Results:**
- TypeScript: {Pass/Fail}
- Linting: {Pass/Fail}
- Tests: {Pass/Fail/Not Run}

**Summary:** {2-3 sentences describing what was built}

**Known Issues:** {List any issues or follow-ups needed}
```

---

## Examples

**Valid HARD tasks:**
- Build authentication module (backend + frontend + state + tests)
- Add multi-step wizard (5+ components + routing + validation)
- Implement PDF table parsing (new service + parser + tests + UI integration)

**Invalid HARD tasks:**
- Fix typo (EASY)
- Add search bar (MEDIUM)

---

## Tool Budget

- Read: 10+ calls (deep understanding required)
- Write/Edit: 5-10 calls (multiple files)
- Grep/Glob: 5+ calls (scan architecture)
- Bash: 3+ calls (verification after each phase)

Total: 20-30 calls typical

---

## Notes

- Quality over speed
- Full verification required
- User expects this to take 15-30 minutes
- Approval gate protects against misaligned plans
```

---

## Summary of Changes

| File | Current Issue | Proposed Change |
|------|---------------|----------------|
| `build-app-workflow.md` | No classification logic | Add classification criteria table, classification step, user messaging, skill loading, Task agent call |
| `start.md` | Too thick, duplicates workflow | Thin router, remove triage, delegate to workflow |
| `implementer.md` | Self-classifies, references unreadable skills | Remove Step 0, expect pre-classified input + embedded skill rules, pure executor |
| `easy.md` | Not embeddable | Add "EASY Skill Rules" header, format as pure workflow |
| `medium.md` | Not embeddable | Add "MEDIUM Skill Rules" header, format as pure workflow |
| `hard.md` | Not embeddable | Add "HARD Skill Rules" header, format as pure workflow |

---

## Chain I/O Contract

**New Flow:**

```
User → /start → build-app-workflow.md → Task(implementer + skill rules embedded)
```

**I/O:**

| From | To | Format | Required Fields |
|------|----|--------|----------------|
| User | start.md | String | Task description |
| start.md | build-app-workflow.md | String | Expanded task description |
| build-app-workflow.md | User | Message | Classification, Scope, Rationale |
| build-app-workflow.md | implementer | Prompt | Task + Classification + Skill Rules (embedded) |
| implementer | build-app-workflow.md | Report | Files modified, verification status, summary |
| build-app-workflow.md | User | Report | Final implementation report |

---

## Implementation Checklist

To implement these changes:

1. [ ] Update `build-app-workflow.md` with classification logic
2. [ ] Update `start.md` to be thin router
3. [ ] Update `implementer.md` to remove Step 0, expect embedded skills
4. [ ] Update `easy.md` to embeddable format
5. [ ] Update `medium.md` to embeddable format
6. [ ] Update `hard.md` to embeddable format
7. [ ] Test EASY task end-to-end
8. [ ] Test MEDIUM task end-to-end
9. [ ] Test HARD task end-to-end
10. [ ] Verify user sees classification message before implementer runs

---

## Risk Assessment

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Orchestrator fails to load skill file | Low | Validation in Step 3 of workflow |
| Implementer receives wrong classification | Low | INPUT CONTRACT validation in implementer |
| Skills not embeddable (too large) | Low | Skills are 50-150 lines, well within prompt limits |
| User confused by classification message | Medium | Use clear format with rationale |
| Skill rules unclear to implementer | Low | Skills are explicit, step-by-step |

---

## Success Criteria

| Metric | Target |
|--------|--------|
| User sees classification BEFORE implementer runs | 100% |
| Implementer follows skill rules exactly | 100% |
| No self-classification in implementer | 0 occurrences |
| Workflow owns classification | 100% |
| Skills successfully embedded in prompts | 100% |

---

## Next Steps

1. Review this audit report
2. Approve proposed changes
3. Update files in order (workflow → command → agent → skills)
4. Test end-to-end with EASY/MEDIUM/HARD tasks
5. Iterate if issues found

---

**End of Audit Report**
