# Context Digest Lite — Format Specification

## Purpose

Pre-parsed, token-efficient context file for `write-lite` runs. Eliminates redundant spec + rules parsing on repeated runs for the same feature.

**Token savings:** ~200-500 tokens (digest-lite) vs 1-5K tokens (raw spec + rules).

## File Location

```
source/testcase/{feature}/context-digest-lite.md
```

## Format

```markdown
---
digest-lite-version: 1
generated: 2026-02-16T14:00:00.000Z
feature: {feature-name}
sources:
  - spec/imported-spec.md
  - rules.md
---

## Parsed Spec

### US1: {title}

#### AC1: {description}
- Given: {given text}
- When: {when text}
- Then: {then text}

#### AC2: {description}
- Given: ...
- When: ...
- Then: ...

### US2: {title}
...

## Rules

### Priority Mapping
- Critical: Core functionality, data loss risk
- High: Main user flow, business-critical
- Medium: Secondary flow, moderate impact
- Low: Cosmetic, rare edge case

### Constraints
- Single-assertion rule
- Consistent terminology
```

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| Pre-parsed GWT structure | Agent skips parsing step entirely — goes straight to matrix generation |
| Only spec + rules | Template, knowledge, strategy are full-write only concerns |
| Frontmatter with version + sources | Enables freshness checks without reading source files |
| ~200-500 tokens target | 5-10x reduction vs raw file reading |

## Freshness Logic

Digest-lite is considered **STALE** when any source file has a newer mtime:
- `source/testcase/{feature}/spec/*.md`
- `source/testcase/{feature}/rules.md`
- `source/testcase/rule/test-rules.md` (global fallback)

When stale, `write-lite` falls back to reading raw files directly.

## Scope vs Full Digest

| Aspect | context-digest.md (full) | context-digest-lite.md |
|--------|--------------------------|------------------------|
| Spec | Condensed summary | Pre-parsed US/AC/GWT |
| Rules | Priority + constraints + scope | Priority + constraints |
| Template | Column styles + order | Not included |
| Knowledge | Terminology + glossary | Not included |
| Strategy | Guide summary | Not included |
| Structure | Tree + levels | Not included |
| Components | Mapped components | Not included |
| Token cost | ~500-2K | ~200-500 |
