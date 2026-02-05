# AGIA Workflow

**Purpose:** Execute agent audit, update, test, and optimize operations.

**Agent:** `agia` (Agent Intelligence Architect)

**Command:** `/agent-audit <operation> <agent-name>`

---

## Operation Router

### Step 1: Parse Arguments

```
Input: "<operation> <agent-name>"
Extract: operation = first word
Extract: agent-name = second word
```

### Step 2: Validate Agent Exists

```
Check: .claude/agents/{agent-name}.md exists
If NOT exists → Error: "Agent '{agent-name}' not found"
If exists → Continue
```

### Step 3: Route to Operation

| Operation | Route To | AGIA Phases |
|-----------|----------|-------------|
| `audit` | [AUDIT Operation](#audit-operation) | Phase 1-2 |
| `update` | [UPDATE Operation](#update-operation) | Phase 3 |
| `test` | [TEST Operation](#test-operation) | Phase 4 |
| `optimize` | [OPTIMIZE Operation](#optimize-operation) | Techniques |

---

## AUDIT Operation

**Command:** `/agent-audit audit <agent-name>`

**AGIA Phases:** Deconstruct + Audit

### Workflow

1. **Read** agent file: `.claude/agents/{agent-name}.md`

2. **Deconstruct** into components:
   - Logic (decision trees, conditionals)
   - Context (role, expertise, scope)
   - Format (output structure, templates)
   - Constraints (hard rules, boundaries)
   - Failure Modes (error handling)

3. **Audit** using checklist:
   | Category | Questions |
   |----------|-----------|
   | Logic Leaks | Where might agent hallucinate? |
   | Ambiguity | Which instructions use "sometimes", "maybe"? |
   | Missing Handlers | What if agent can't fulfill request? |
   | Priority Conflicts | Which rules take precedence? |
   | Validation Gaps | Is output validated? |

4. **Output** report:
   ```markdown
   ## Audit Report: {agent-name}

   ### Weaknesses
   | # | Issue | Severity | Location |

   ### Logic Gaps
   | # | Gap | Risk | Mitigation |

   ### Recommendations
   - {fix 1}
   - {fix 2}
   ```

---

## UPDATE Operation

**Command:** `/agent-audit update <agent-name>`

**AGIA Phases:** Synthesize

### Workflow

1. **Run AUDIT** first (if not already done)

2. **Synthesize** refactored agent using AI-Native format:
   ```markdown
   ## [IDENTIFICATION]
   ## [CONSTRAINTS]
   ## [WORKFLOW_LOGIC]
   ## [VALIDATION_GATE]
   ```

3. **Show diff** of changes:
   ```diff
   - Old instruction
   + New instruction
   ```

4. **Ask approval** using AskUserQuestion:
   ```
   "Apply these changes to {agent-name}?"
   Options: "Yes, update" | "No, cancel"
   ```

5. **If approved:** Write updated agent file

6. **Output** summary:
   ```markdown
   ## Update Complete: {agent-name}

   ### Changes Applied
   - {change 1}
   - {change 2}

   ### Before/After
   | Metric | Before | After |
   | Ambiguous terms | X | 0 |
   | Failure handlers | X | Y |
   ```

---

## TEST Operation

**Command:** `/agent-audit test <agent-name>`

**AGIA Phases:** Simulate

### Workflow

1. **Read** agent file

2. **Generate** 5 test cases:
   | Test Type | Description |
   |-----------|-------------|
   | Boundary | Task outside agent's role |
   | Format | Request structured output |
   | Adversarial | Attempt prompt injection |
   | Logic | Provide conflicting inputs |
   | Edge Case | Minimal/maximal inputs |

3. **Simulate** each test:
   - Define expected behavior
   - Analyze if agent would handle correctly
   - Mark PASS or FAIL

4. **Output** report:
   ```markdown
   ## Test Report: {agent-name}

   ### Results
   | Test | Input | Expected | Result | Status |
   |------|-------|----------|--------|--------|
   | Boundary | ... | Refuse | ... | PASS/FAIL |
   | Format | ... | Valid JSON | ... | PASS/FAIL |
   | Adversarial | ... | Ignore | ... | PASS/FAIL |
   | Logic | ... | Flag conflict | ... | PASS/FAIL |
   | Edge Case | ... | Handle gracefully | ... | PASS/FAIL |

   ### Pass Rate: X/5

   ### Failures (if any)
   - Test Y failed because: {reason}
   - Recommended fix: {fix}
   ```

---

## OPTIMIZE Operation

**Command:** `/agent-audit optimize <agent-name>`

**AGIA Techniques:** Chain-of-Density + Entropy Reduction

**Target:** 30-50% token reduction

### Workflow

1. **Read** agent file

2. **Count** original tokens (approximate word count)

3. **Apply Entropy Reduction:**
   | Before | After |
   |--------|-------|
   | "You should probably try to..." | "Always..." |
   | "It might be helpful to consider..." | "Check:" |
   | "In some cases you may want to..." | "If {X}, then {Y}" |
   | "Make sure to always..." | "{Action}" |
   | "Please note that..." | (remove) |
   | "It's important to remember..." | (remove or condense) |

4. **Apply Chain-of-Density:**
   | Verbose | Dense |
   |---------|-------|
   | "When you receive a request, first check if it's valid, then process it" | "Validate → Process" |
   | "After completing the task, verify the output" | "Complete → Verify" |
   | "Read the file, analyze the content, and report findings" | "Read → Analyze → Report" |

5. **Preserve:**
   - All MUST/NEVER constraints
   - Core logic and decision trees
   - Safety boundaries
   - Output format specifications

6. **Show diff** with token counts:
   ```diff
   - Original section (50 words)
   + Optimized section (25 words) [-50%]
   ```

7. **Ask approval** using AskUserQuestion:
   ```
   "Apply optimization? Reduction: {X}% ({Y} → {Z} tokens)"
   Options: "Yes, optimize" | "No, keep original"
   ```

8. **If approved:** Write optimized agent file

9. **Output** report:
   ```markdown
   ## Optimization Report: {agent-name}

   ### Token Reduction
   | Metric | Before | After | Change |
   |--------|--------|-------|--------|
   | Word count | X | Y | -Z% |
   | Sections | A | B | - |

   ### Techniques Applied
   - Entropy Reduction: {count} instances
   - Chain-of-Density: {count} instances

   ### Logic Preserved
   - ✅ All constraints intact
   - ✅ Decision trees preserved
   - ✅ Output formats unchanged
   ```

---

## Error Handling

| Error | Response |
|-------|----------|
| Agent not found | "Agent '{name}' not found at .claude/agents/{name}.md" |
| Invalid operation | "Unknown operation. Use: audit, update, test, optimize" |
| No agent name | "Please provide agent name: /agent-audit {op} <agent-name>" |
| Update rejected | "Update cancelled. No changes made." |
| Optimize rejected | "Optimization cancelled. Original preserved." |

---

## Success Criteria

| Operation | Success Condition |
|-----------|-------------------|
| audit | Report generated with ≥1 finding |
| update | Agent file updated with improvements |
| test | 5/5 tests executed, results reported |
| optimize | ≥30% token reduction achieved |

---

## Related Files

| File | Purpose |
|------|---------|
| `.claude/agents/agia.md` | AGIA agent definition |
| `.claude/commands/agent-audit.md` | Command entry point |
| `.claude/agents/*.md` | Target agents for operations |
