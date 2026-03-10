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
