# AI Workflow Focus — Brainstorm Skill

Skill for brainstorming AI/LLM systems: prompt chaining, RAG architecture, agentic frameworks, API cost optimization.

> **Before starting:** Read `.claude/skills/brainstorm/shared.md`. Classify complexity, announce the level, then execute only the steps allowed for that level.

---

## STEP 1: ANALYZE & SKILL ACTIVATION

Announce activation:

> **Domain:** AI Workflow
> **Skills activated:** Prompt Chaining, RAG Architecture, Agentic Frameworks, API Cost Optimization
> **Complexity:** Easy / Medium / Complex _(pick one based on shared.md classification)_
> **Steps to run:** _(e.g. 1–2, 1–3, or 1–5)_

Restate the user's idea in 1-2 sentences to confirm understanding. Do NOT propose solutions yet.

---

## STEP 2: STRATEGIC CLARIFICATION

Ask 3-5 targeted questions. Wait for answers before proceeding.

| Area | Question |
|------|----------|
| **Core Problem** | What task should AI automate/augment? What does "good output" look like? |
| **Input/Output** | What goes in, what comes out? Quality bar? |
| **Constraints** | Budget (API costs/month)? Latency requirements? Privacy concerns? |
| **Data** | What knowledge base exists? Structured or unstructured? How often updated? |
| **Autonomy** | How much human-in-the-loop vs fully autonomous? Error tolerance? |

| **Avoid** | What outcomes, approaches, or trade-offs should be explicitly avoided? |
| **Success** | What does success look like? How will you measure it? |
| **Complex Logic** | Is there a complex part of the logic? If yes, give me an example so I can reason about edge cases. |

Adapt questions to the specific idea — skip what's obvious, dig into what's ambiguous.

---

## STEP 3: ENGINEERING SANITY CHECK

Before proposing architecture, think through these internally. Surface findings as trade-offs or risks in the next step.

| Check | Think |
|-------|-------|
| **Code vs AI** | For each step in the pipeline — can this be done with deterministic code (regex, rules, sorting, lookup) instead of AI? Only use AI where the task genuinely requires language understanding or generation. |
| **Data Cleaning** | What does the raw input look like? What can be stripped, normalized, or aggregated before sending to the model? (Remove boilerplate, deduplicate, trim whitespace, collapse repeated sections.) Fewer tokens = lower cost + faster response. |
| **Failure Handling** | What are the realistic failure modes? (API timeout, malformed output, empty response, model refusal.) For each: what is the fallback — retry, default value, graceful degradation, or user alert? |
| **Output Validation** | How will the output be validated? Consider: JSON schema check, required-field assertion, type coercion guard, value range sanity check. What happens when validation fails — reject, retry with corrected prompt, or flag for human review? |
| **State-based Buffer** | Is there stateful context that accumulates across turns or pipeline steps? Define what goes into the buffer, when it flushes, max size, and what gets summarized vs dropped when the window fills. |
| **Accuracy Tracking** | How will accuracy be measured over time? Propose a minimal eval loop: define metrics (precision, recall, pass rate, user acceptance) → write eval script → curate sample Golden Test Set → version prompts and log eval results by date → set alert threshold for acceptable pass rate drop. Ask the user for their pass rate target and whether they can provide labeled examples. |
| **Human-in-the-Loop** | Which actions have irreversible or high-impact consequences? (Send email, update DB, charge user, publish content.) These must require human confirmation before execution — flag them explicitly. |

---

## STEP 4: BLIND SPOTS & COUNTER-ARGUMENTS

After receiving answers, challenge the idea:

### Product Blind Spots
- Over-reliance on AI where simple rules/regex suffice
- Hallucination risks — what happens when the model is wrong?
- User trust — how do users verify AI output?

### Technical Risks
- Token cost explosion (long contexts, unnecessary chains, redundant retrievals)
- Latency spikes (sequential API calls, large embeddings, cold starts)
- Prompt injection / jailbreak vulnerabilities
- Context window limits — what happens when data exceeds the window?

### The "Better Way"
Propose a simpler alternative:
- Single prompt vs multi-step chain
- Retrieval vs fine-tuning — which fits better?
- Smaller/cheaper model vs frontier model — where's the quality threshold?
- Rule-based pre/post-processing to reduce AI dependency

---

## STEP 5: SUMMARY & STRATEGIC ROADMAP

Deliver a structured recommendation:

### Architecture Overview
Pipeline diagram description: ingestion → processing → retrieval → generation → output → feedback loop

### MVP Scope

| Priority | Features |
|----------|----------|
| **Must-Have** | (core AI pipeline only) |
| **Nice-to-Have** | (defer to v2) |
| **Cut** | (explicitly out of scope) |

### Tech Stack Recommendation
- **Models:** Compare options (GPT-4o vs Claude Sonnet 4.6 vs local models) with trade-offs
- **Frameworks:** LangChain, CrewAI, Claude Agent SDK, or vanilla API calls — justify choice
- **Vector DBs:** Pinecone, Chroma, pgvector — if RAG is involved
- **Infra:** Hosting, caching, rate limiting strategy

### Cost Estimation
| Component | Est. Monthly Cost | Notes |
|-----------|-------------------|-------|
| Model API calls | $ | tokens/request x requests/day |
| Embedding/retrieval | $ | vector DB hosting + embedding calls |
| Infrastructure | $ | compute, storage, CDN |

### Actionable Next Steps
Numbered implementation guide — what to build first, second, third. Each step should be completable in 1-3 days.
