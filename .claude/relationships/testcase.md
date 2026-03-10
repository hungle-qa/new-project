# Testcase Flow Relationships

## Command → Agent → Skill

```
/testcase → testcase-writer.md → write.md ──────→ digest-system.md
                                 write-lite.md ──→ lite-shared.md
                                 write-lite-v2.md → lite-shared.md
                                 update.md ──────→ digest-system.md
                                 update-lite.md ─→ lite-shared.md
                                 learn.md
```

### File Paths

| Role | Path |
|------|------|
| Command | `.claude/commands/testcase.md` |
| Agent | `.claude/agents/testcase-writer.md` |
| Skills | `.claude/agents/skills/testcase-writer/{write,write-lite,write-lite-v2,update,update-lite,learn}.md` |
| Shared (digest) | `.claude/agents/skills/testcase-writer/digest-system.md` |
| Shared (lite) | `.claude/agents/skills/testcase-writer/lite-shared.md` |

---

## Server Pipeline

```
Route                      Service                         Storage
────────────────────────────────────────────────────────────────────
testcase.ts ────────────→ TestcaseFeatureService ────────→ source/testcase/feature/{f}/config.md
                          │                                source/testcase/feature/{f}/spec/*.md
                          ├ TestcaseConfigService ───────→ source/testcase/feature/{f}/rules.md
                          │                                source/testcase/feature/{f}/template.json
                          │                                source/testcase/rule/*.md (global)
                          │                                source/testcase/template/*.json (global)
                          └ TestcaseDigestService ───────→ source/testcase/feature/{f}/context-digest.md
                            ├ TestcaseDigestHelpers.ts
                            ├ TestcaseDigestScaffold.ts
                            └ TestcaseTypes.ts

testcase-global.ts ─────→ TestcaseConfigService ─────────→ source/testcase/rule/*.md
                          │                                source/testcase/template/*.json
                          │                                source/testcase/strategy/*.md
                          ├ TestcaseLearnService ────────→ source/testcase/feature/{f}/_learn-session.json
                          └ TestcaseFeatureService
```

### API Endpoints Referenced in Skills

| Endpoint | Skill | Service Method |
|----------|-------|----------------|
| `GET /api/testcase/{f}/digest-status` | write.md | `TestcaseDigestService.checkDigestFreshness()` |
| `POST /api/testcase/{f}/context-digest` | write.md | `TestcaseDigestService.generateContextDigest()` |

---

## Digest Pipeline

```
write.md / update.md
  ├─ checkDigestFreshness() checks mtime of:
  │   config.md, rules.md, template.json, spec/*.md,
  │   global test-rules.md, global template.json,
  │   strategy/{name}.md, feature-knowledge/{k}/config.md,
  │   design-system/{comp}.md
  │
  └─ generateContextDigest() calls:
      ├ condenseSpec()           → returns full spec
      ├ buildTestScope()         → extracts testable US/AC list
      ├ condenseRules()          → returns full rules
      ├ buildTemplateSection()   → returns full column rules per column
      └ extractTerminology()     → returns full knowledge (dedup only)
```

---

## Client Components

```
TestcaseManagerPage.tsx
├── FeatureSidebar.tsx
├── FeatureDetailPanel.tsx
│   ├── FeatureDetailHeader.tsx
│   └── FeatureTabContent.tsx
│       ├── StrategyTab.tsx
│       ├── RulesTab.tsx
│       ├── CornerCasesTab.tsx
│       ├── TemplateTab.tsx → ColumnEditorTable, ColumnRulesModal, StructureTemplatePreview
│       ├── KnowledgeSelectTab.tsx
│       ├── ImportSpecTab.tsx → UploadForm, UploadStatus, SpecPreview, PromptEditor
│       └── ReviewExportTab.tsx → CsvPreviewModal
├── GlobalTabsPanel.tsx
│   ├── RulesTab (global)
│   ├── TemplateTab (global)
│   └── LearnTab.tsx
└── CreateFeatureModal.tsx

Types: client/src/pages/testcase-manager/types.ts ←→ server/src/services/TestcaseTypes.ts
```

---

## Cross-check Table

| If you update... | x2 check these files |
|---|---|
| `testcase-writer.md` | `commands/testcase.md`, all 6 skill files |
| `write.md` | `digest-system.md`, `testcase-writer.md` |
| `write-lite.md` or `write-lite-v2.md` or `update-lite.md` | `lite-shared.md`, `testcase-writer.md` |
| `lite-shared.md` | `write-lite.md`, `write-lite-v2.md`, `update-lite.md` |
| `digest-system.md` | `write.md`, `update.md`, `TestcaseDigestService.ts` |
| `TestcaseDigestService.ts` | `digest-system.md`, `TestcaseDigestHelpers.ts`, `TestcaseTypes.ts` |
| `TestcaseDigestHelpers.ts` | `TestcaseDigestService.ts`, `digest-system.md` |
| `TestcaseTypes.ts` | `TestcaseFeatureService.ts`, `TestcaseConfigService.ts`, `client types.ts` |
| `testcase.ts` (route) | Skill files with `curl` endpoints, service files |
| `testcase-global.ts` (route) | `LearnTab.tsx`, `GlobalTabsPanel.tsx` |
| `types.ts` (client) | `TestcaseTypes.ts` (server), all components importing types |
| Any `*Tab.tsx` component | `FeatureTabContent.tsx`, `GlobalTabsPanel.tsx` |
| `TestcaseConfigService.ts` | `testcase.ts`, `testcase-global.ts`, `TestcaseDigestService.ts` |
