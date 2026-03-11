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

After receiving answers, present blind spots **one at a time**. For each blind spot, show it and get the user's decision before moving to the next.

### How to identify blind spots

Analyze the idea against the categories below. For each real risk found, prepare it as a blind spot. Skip categories that don't apply.

**Categories to scan:**

| Category | Look for |
|----------|----------|
| **Product** | Feature creep, UX friction/drop-off points, market fit doubts |
| **Technical** | Scalability bottlenecks (N+1, unbounded lists, missing indexes), security gaps (auth, injection), data modeling issues |
| **Simpler Alternative** | Fewer screens, off-the-shelf components, managed services over custom |

### Execution: one-by-one loop

For each blind spot, present it like this:

```
**Blind spot [N]:** **[Category] Short title** — 1-sentence explanation
```

Then immediately use **AskUserQuestion** to ask:

> Address this in the final plan, or skip? (address / skip)

**STOP — wait for user decision before showing the next blind spot.**

Repeat until all blind spots have been presented. Track which ones the user chose to address.

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
