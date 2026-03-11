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

After receiving answers, list ALL blind spots as a **numbered checklist**. Then ask the user which to address and which to skip.

### How to present

Analyze the idea against the categories below. For each real risk found, add it as a numbered item with a short explanation (1 sentence). Skip categories that don't apply.

**Categories to scan:**

| Category | Look for |
|----------|----------|
| **Product** | Over-reliance on AI where rules/regex suffice, hallucination risks, user trust/verification, missing human-in-the-loop at critical checkpoints |
| **Technical** | Token cost explosion, latency spikes, prompt injection/jailbreak, context window limits, infinite loops in agentic workflows |
| **Simpler Alternative** | Single prompt vs chain, retrieval vs fine-tuning, smaller/cheaper model, rule-based pre/post-processing, context digest/compression |

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
Pipeline diagram description: ingestion → processing → retrieval → generation → output → feedback loop

### MVP Scope

| Priority | Features |
|----------|----------|
| **Must-Have** | (core AI pipeline only) |
| **Nice-to-Have** | (defer to v2) |
| **Cut** | (explicitly out of scope) |

### Tech Stack Recommendation
- **Models:** Default to Claude model family (Opus 4.6, Sonnet 4.6, Haiku 4.5) — recommend tier based on task complexity and cost
- **Frameworks:** LangChain, CrewAI, Claude Agent SDK, or vanilla API calls — justify choice
- **Vector DBs:** Pinecone, Chroma, pgvector — if RAG is involved
- **Infra:** Hosting, caching, rate limiting strategy
- **Context Caching:** Use prompt caching (e.g., Claude's cache_control) for repeated system prompts and static context — reduces latency and cost on high-frequency calls

### Cost Estimation
| Component | Est. Monthly Cost | Notes |
|-----------|-------------------|-------|
| Model API calls | $ | tokens/request x requests/day |
| Embedding/retrieval | $ | vector DB hosting + embedding calls |
| Infrastructure | $ | compute, storage, CDN |

### Evaluation Strategy
| Metric | What to Measure | Method |
|--------|----------------|--------|
| **Speed** | End-to-end latency per request, time-to-first-token | Benchmark with realistic payloads; set p95 latency targets |
| **Accuracy** | Correctness of AI output vs ground truth | Golden dataset + automated scoring (exact match, semantic similarity, LLM-as-judge) |
| **Cost-per-query** | Tokens consumed per successful output | Log token usage; compare across model tiers |

Run eval before and after each pipeline change. Automate with CI where possible.

### Actionable Next Steps
Numbered implementation guide — what to build first, second, third. Each step should be completable in 1-3 days.
