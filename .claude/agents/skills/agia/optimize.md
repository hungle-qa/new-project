# AGIA Skill: OPTIMIZE

> Loaded by master agent when operation = `optimize`

**Target:** 30-50% token reduction while preserving all logic.

---

## Step 1: Count Original Tokens

Approximate word count of agent file (sections breakdown).

---

## Step 2: Apply Entropy Reduction

Remove redundant tokens that don't contribute to decision-making:

| Before | After |
|--------|-------|
| "You should probably try to..." | "Always..." |
| "It might be helpful to consider..." | "Check:" |
| "In some cases you may want to..." | "If {X}, then {Y}" |
| "Make sure to always..." | "{Action}" |
| "Please note that..." | (remove) |
| "It's important to remember..." | (remove or condense) |
| "When you receive a request, first check..." | "Validate → Process" |
| "After completing the task, verify..." | "Complete → Verify" |

---

## Step 3: Apply Chain-of-Density

Pack more instruction into fewer tokens:

| Verbose | Dense |
|---------|-------|
| "When you receive a request, first check if it's valid, then process it" | "Validate → Process" |
| "After completing the task, verify the output" | "Complete → Verify" |
| "Read the file, analyze the content, and report findings" | "Read → Analyze → Report" |

---

## Step 4: Apply Hierarchical Priority

Rank instructions explicitly where not already done:

```markdown
P0 - CRITICAL: Safety constraints, data integrity
P1 - HIGH: Core functionality requirements
P2 - MEDIUM: Quality standards, best practices
P3 - LOW: Style preferences, optimizations
```

---

## Step 5: Preservation Rules

MUST preserve:
- All MUST/NEVER constraints
- Core logic and decision trees
- Safety boundaries
- Output format specifications
- I/O Summary and contracts
- Chain validation references

---

## Step 6: Show Diff with Token Counts

```diff
- Original section (50 words)
+ Optimized section (25 words) [-50%]
```

Show section-by-section reduction table.

---

## Step 7: Approval

Ask using AskUserQuestion:
```
"Apply optimization? Reduction: {X}% ({Y} → {Z} words)"
Options: "Yes, optimize" | "No, keep original"
```

- If **approved**: Write optimized agent file
- If **rejected**: Output "Optimization cancelled. Original preserved."

---

## Output Format

```markdown
## Optimization Report: {agent-name}

### Token Reduction
| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Word count | {X} | {Y} | -{Z}% |
| Sections | {A} | {B} | - |

### Techniques Applied
- Entropy Reduction: {count} instances
- Chain-of-Density: {count} instances
- Hierarchical Priority: {applied/skipped}

### Logic Preserved
- All constraints intact
- Decision trees preserved
- Output formats unchanged
- I/O contracts unchanged
```
