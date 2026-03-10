# AI Workflow Focus — Brainstorm Skill

Skill for brainstorming AI/LLM systems: prompt chaining, RAG architecture, agentic frameworks, API cost optimization.

---

## STEP 1: ANALYZE & SKILL ACTIVATION

Announce activation:

> **Domain:** AI Workflow
> **Skills activated:** Prompt Chaining, RAG Architecture, Agentic Frameworks, API Cost Optimization

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

Adapt questions to the specific idea — skip what's obvious, dig into what's ambiguous.

---

## STEP 3: BLIND SPOTS & COUNTER-ARGUMENTS

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

## STEP 4: SUMMARY & STRATEGIC ROADMAP

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
