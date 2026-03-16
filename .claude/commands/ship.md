---
description: Commit + push all changes, merge to main, switch back to current branch
argument-hint: [optional commit message]
---

**Purpose:** Ship current branch — commit & push all changes, merge into main, return to original branch.

---

## Execution

Run the following steps in order:

### Step 1 — Capture current branch
```
CURRENT_BRANCH=$(git branch --show-current)
```

### Step 2 — Stage & commit all changes
- Run `git status` to check for changes.
- If no changes → skip commit, proceed to Step 3.
- If changes exist:
  - `git add -A`
  - Generate a concise commit message from the diff (if `$ARGUMENTS` is provided, use it as the message).
  - Commit following the Git Safety Protocol (use HEREDOC format, include Co-Authored-By trailer).

### Step 3 — Push & merge

**If `$CURRENT_BRANCH` is `main`:**
- `git push origin main`
- Skip Steps 4 and 5.

**If `$CURRENT_BRANCH` is not `main`:**
```
git push origin $CURRENT_BRANCH
git checkout main
git pull origin main
git merge $CURRENT_BRANCH --no-ff
git push origin main
git checkout $CURRENT_BRANCH
```

### Step 4 — Report
Output a short summary:
```
Shipped: {CURRENT_BRANCH} → main
Commit: {commit message or "no new commits"}
Status: back on {CURRENT_BRANCH}
```

---

## Safety Rules

- NEVER force-push to main.
- If merge has conflicts → stop, report conflicts to user, do NOT auto-resolve.
- If push is rejected → stop and report, do NOT force.

---

Task: $ARGUMENTS
