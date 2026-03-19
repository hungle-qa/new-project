# Brainstorm Shared Logic

Shared rules used by all brainstorm skill files. Read this before executing any steps.

---

## COMPLEXITY CLASSIFICATION

Analyze the user's prompt and classify as **easy**, **medium**, or **complex** before doing anything else.

### Signals

| Level | Signals |
|-------|---------|
| **Easy** | Single well-defined question. One component or concept. User wants a quick directional opinion. No integration or multi-system concerns. Keywords: "quick", "simple", "should I", "just", "basic", "which one". |
| **Medium** | 2–3 components involved. Some design ambiguity or trade-offs. Moderate integration. User wants to think through options but has a clear starting point. |
| **Complex** | Multi-system architecture. Production concerns (scaling, cost, reliability, security). AI pipeline with multiple stages. Unknown edge cases or many stakeholders. User explicitly asks for full analysis, roadmap, or deep dive. |

When in doubt, classify **one level lower** — it's better to be concise than to over-engineer the response.

### Step Gate

Execute **only** the steps allowed for the classified level:

| Level | Steps |
|-------|-------|
| **Easy** | Step 1, Step 2 |
| **Medium** | Step 1, Step 2, Step 3 |
| **Complex** | Step 1, Step 2, Step 3, Step 4, Step 5 |

### Announce the Level

At the start of Step 1, declare the complexity level:

> **Complexity:** Easy / Medium / Complex
> **Steps to run:** 1–2 / 1–3 / 1–5

If you are unsure between two levels, briefly state why and which one you chose.
