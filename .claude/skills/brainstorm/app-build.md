# App Build Focus — Brainstorm Skill

Skill for brainstorming app/product development: UI/UX, architecture, database schema, frontend/backend design.

---

## STEP 1: ANALYZE & SKILL ACTIVATION

Announce activation:

> **Domain:** App Build
> **Skills activated:** UI/UX Strategy, Application Logic, Backend/Frontend Architecture, Database Schema Design

Restate the user's idea in 1-2 sentences to confirm understanding. Do NOT propose solutions yet.

---

## STEP 2: STRATEGIC CLARIFICATION

Ask 3-5 targeted questions. Wait for answers before proceeding.

| Area | Question |
|------|----------|
| **Core Problem** | What pain point does this solve? Who feels it most? |
| **User Persona** | Who is the end-user? What's their ideal journey? |
| **Constraints** | Tech stack preferences? Time-to-market pressure? |
| **Scale** | Expected user volume? Data size? Growth trajectory? |
| **Integration** | Existing systems to connect with? Auth providers? Third-party APIs? |

Adapt questions to the specific idea — skip what's obvious, dig into what's ambiguous.

---

## STEP 3: BLIND SPOTS & COUNTER-ARGUMENTS

After receiving answers, list ALL blind spots as a **numbered checklist**. Then ask the user which to address and which to skip.

### How to present

Analyze the idea against the categories below. For each real risk found, add it as a numbered item with a short explanation (1 sentence). Skip categories that don't apply.

**Categories to scan:**

| Category | Look for |
|----------|----------|
| **Product** | Feature creep, UX friction/drop-off points, market fit doubts |
| **Technical** | Scalability bottlenecks (N+1, unbounded lists, missing indexes), security gaps (auth, injection), data modeling issues |
| **Simpler Alternative** | Fewer screens, off-the-shelf components, managed services over custom |

### Output format

Present the list like this:

```
Here are the blind spots I see:

1. **[Category] Short title** — 1-sentence explanation
2. **[Category] Short title** — 1-sentence explanation
3. ...
```

Then use **AskUserQuestion** to ask:

> Which blind spots should I address in the final plan? (list numbers, or "all", or "skip all")

**STOP — wait for user response before proceeding to Step 4.**

---

## STEP 4: SUMMARY & STRATEGIC ROADMAP

Deliver a structured recommendation:

### Architecture Overview
High-level system diagram description: frontend → backend → storage → external APIs

### MVP Scope

| Priority | Features |
|----------|----------|
| **Must-Have** | (core features only) |
| **Nice-to-Have** | (defer to v2) |
| **Cut** | (explicitly out of scope) |

### Tech Stack Recommendation
Recommend specific frameworks, libraries, hosting — with brief justification for each choice.

### Database/Storage Design
Key entities, relationships, and access patterns. Keep it practical — no over-normalization.

### Actionable Next Steps
Numbered implementation guide — what to build first, second, third. Each step should be completable in 1-3 days.
