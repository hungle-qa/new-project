---
description: Start build-app workflow for main app development
argument-hint: [feature description]
---

**Purpose:** Entry point for building/enhancing the QA-kit application.

**Target:** TypeScript code in `client/src/` and `server/src/`

**NEVER:** Update `.md` files directly. This command is for building the app only.

---

## Workflow

**Reference:** `.claude/agents/implementer.md`

Read agent file first, then follow skill routing to the matching skill file. All clarification checks, classification, and routing is handled by the agent.

---

Task: $ARGUMENTS
