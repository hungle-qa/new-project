# App Build Focus — Brainstorm Skill

Skill for brainstorming app/product development: UI/UX, architecture, database schema, frontend/backend design.

> **Before starting:** Read `.claude/skills/brainstorm/shared.md`. Classify complexity, announce the level, then execute only the steps allowed for that level.

---

## STEP 1: ANALYZE & SKILL ACTIVATION

Announce activation:

> **Domain:** App Build
> **Skills activated:** UI/UX Strategy, Application Logic, Backend/Frontend Architecture, Database Schema Design
> **Complexity:** Easy / Medium / Complex _(pick one based on shared.md classification)_
> **Steps to run:** _(e.g. 1–2, 1–3, or 1–5)_

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

| **Avoid** | What outcomes, approaches, or trade-offs should be explicitly avoided? |
| **Success** | What does success look like? How will you measure it? |
| **Complex Logic** | Is there a complex part of the logic? If yes, give me an example so I can reason about edge cases. |

Adapt questions to the specific idea — skip what's obvious, dig into what's ambiguous.

---

## STEP 3: ENGINEERING SANITY CHECK

Before proposing architecture, think through these internally. Surface findings as risks or design decisions in the next step.

| Check | Think |
|-------|-------|
| **Failure Handling** | What are the realistic failure modes per layer? (Network error, invalid input, third-party API down, concurrent writes.) For each: retry, fallback, or surface to user? |
| **Output Validation** | Where does untrusted data enter the system? Define validation boundaries — required fields, type checks, value range guards, and what happens on violation (reject vs sanitize). |
| **Human-in-the-Loop** | Which actions are irreversible or high-stakes? (Delete, charge, publish, send message.) These need explicit user confirmation — flag them in the UX and API design. |

---

## STEP 4: BLIND SPOTS & COUNTER-ARGUMENTS

After receiving answers, challenge the idea:

### Product Blind Spots
- Feature creep risks — what can be cut?
- UX friction points — where will users drop off?
- Market fit — does this solve a real problem or a perceived one?

### Technical Risks
- Scalability bottlenecks (N+1 queries, unbounded lists, missing indexes)
- Security vulnerabilities (auth gaps, data exposure, injection surfaces)
- Data modeling issues (premature normalization, missing audit trails)

### The "Better Way"
Propose a simpler MVP alternative:
- Fewer screens, simpler data model
- Off-the-shelf components over custom builds
- Managed services over self-hosted infrastructure

---

## STEP 5: SUMMARY & STRATEGIC ROADMAP

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
