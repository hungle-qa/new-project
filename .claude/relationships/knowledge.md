# Feature Knowledge Flow Relationships

## Server Pipeline

```
Route                        Service                        Storage
────────────────────────────────────────────────────────────────────
feature-knowledge.ts ──────→ FeatureKnowledgeService ────→ source/feature-knowledge/{k}/config.md
                                                           source/feature-knowledge/{k}/*.md
                                                           source/feature-knowledge/{k}/*.pdf
```

---

## Client Components

```
FeatureKnowledgePage.tsx
├── KnowledgeSidebar.tsx
├── CreateKnowledgeModal.tsx
├── DeleteKnowledgeModal.tsx
├── PreviewTab.tsx
├── ContentTab.tsx
└── ImportTab.tsx
    ├── UploadZone.tsx
    ├── UploadSection.tsx
    ├── UploadStatus.tsx
    ├── ImportedFilesList.tsx
    └── PromptEditor.tsx
```

---

## Cross-domain Dependencies

Knowledge is consumed by the testcase flow:
- `TestcaseDigestService.ts` reads `source/feature-knowledge/{k}/config.md` for digest
- `KnowledgeSelectTab.tsx` (testcase) links knowledge items to features
- `TestcaseDigestHelpers.extractTerminology()` processes knowledge sections

---

## Cross-check Table

| If you update... | x2 check these files |
|---|---|
| `feature-knowledge.ts` (route) | `FeatureKnowledgeService.ts` |
| `FeatureKnowledgeService.ts` | `feature-knowledge.ts`, knowledge storage format |
| Knowledge storage format | `TestcaseDigestService.ts` (reads knowledge for digest) |
| `KnowledgeSelectTab.tsx` | `FeatureTabContent.tsx`, `TestcaseTypes.ts` (LinkedKnowledgeEntry) |
| Any import sub-component | `ImportTab.tsx` |
