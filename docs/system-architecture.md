# System Architecture

## Agent System

Six agents live in `.claude/agents/`. Each agent uses skill-based routing — a master agent file routes to skill files in `.claude/agents/skills/{agent-name}/`.

| Agent | File | Purpose |
|-------|------|---------|
| implementer | `implementer.md` | Full-stack React + Express code generation. Self-classifies tasks as EASY / MEDIUM / HARD |
| testcase-writer | `testcase-writer.md` | QA testcase generation from feature specs |
| doc-writer | `doc-writer.md` | Project documentation (review, create, update) |
| import-design | `import-design.md` | Converts UI images to HTML + Tailwind components |
| agia | `agia.md` | Meta-agent — audits and refactors other agents |
| brainstorm | `brainstorm.md` | Product strategy and devil's advocate analysis |

**Skill files per agent:**

- `testcase-writer` → `write`, `write-lite`, `write-lite-v2`, `update`, `update-lite`, `lite-shared.md`
- `import-design` → `validate`, `single`, `multi`, `update`, `shared.md`
- `doc-writer` → `review`, `create`, `update`
- `agia` → `audit`, `update`, `test`, `optimize`, `create-skill`, `system-audit`
- `implementer`, `brainstorm` → no skill files (single-step execution)

**Shared rules pattern:**

- `testcase-writer/lite-shared.md` — JSON schema and CSV conversion rules reused across lite skills
- `import-design/shared.md` — 16 sections covering RULE.md compliance, icon detection, validation, format rules

---

## Workflow Chains

Slash commands in `.claude/commands/*.md` map user input to agent invocation.

| Command | Agent | Input | Output |
|---------|-------|-------|--------|
| `/start` | implementer | Task description | React + Express code changes |
| `/testcase` | testcase-writer | Feature spec | CSV testcase file |
| `/doc` | doc-writer | Doc type | Markdown file in `docs/` |
| `/import-design-by-image` | import-design | Screenshot or HTML | Component `.md` in `source/design-system/` |
| `/agent-audit` | agia | Agent file path | Audit report + optional fixes |
| `/brainstorm` | brainstorm | Idea or problem | Structured analysis |

**Execution model:**

1. User runs slash command
2. Claude loads the matching agent `.md` file
3. Agent reads skill file for the requested operation
4. Agent reads source files (codebase, specs, existing docs)
5. Agent produces output — code, CSV, markdown, or report
6. Approval gate (where required) before writing files

---

## Data Flow

```
User (browser)
    ↕ HTTP
React client (localhost:3000)
    ↕ REST API
Express server (localhost:3001)
    ↕ File I/O
File system (source/, docs/)
```

- No database — all persistence is file-based
- React calls Express REST endpoints for all reads and writes
- Express routes delegate to service classes that read/write markdown, JSON, and CSV files
- AI generation goes through `AIService`, which proxies to an external LLM API

**Content types in storage:**

| Content | Format | Location |
|---------|--------|----------|
| Design system components | Markdown with HTML/CSS code blocks | `source/design-system/{Name}.md` |
| Design rules | Markdown | `source/design-system/rule/RULE.md` |
| SVG icons | SVG files | `source/design-system/icons/` |
| Feature specs / knowledge | Managed by FeatureKnowledgeService | `source/` |
| Testcase output | CSV (via JSON intermediate) | Generated on request |

---

## File Storage

No database. All data lives on the file system.

```
source/
├── design-system/         # Component docs (.md with HTML/CSS)
│   ├── rule/RULE.md       # Design compliance rules
│   └── icons/             # SVG icons
client/src/
├── pages/                 # 5 pages: Home, DesignSystem, FeatureKnowledge,
│                          #          TestcaseManager, UserGuide
├── components/            # Feature-organized subfolders:
│   ├── design-system/
│   ├── feature-knowledge/
│   └── testcase/
├── hooks/
└── utils/

server/src/
├── routes/                # ai, design-system, feature-knowledge,
│                          # testcase, testcase-global
├── services/              # AIService, DesignSystem*, FeatureKnowledge*,
│                          # Testcase*, PdfParsers
└── types/

docs/                      # Project documentation (this folder)
.claude/
├── agents/                # Agent master files + skill subfolders
├── commands/              # Slash command definitions
└── workflows/             # Development rules
```

**Service class pattern:**

- Each domain has a dedicated service class (e.g., `DesignSystemService`, `TestcaseService`)
- Service classes handle all file I/O — routes do not touch the file system directly
- Reads return parsed objects; writes serialize back to markdown or JSON

---

## Integration Points

| Integration | How it works |
|-------------|-------------|
| LLM / AI | `AIService` proxies requests to an external LLM API for testcase generation and design import |
| PDF import | `pdf-parse` library parses uploaded PDFs into text for FeatureKnowledgeService |
| File system | All CRUD via service classes — no direct file access from routes or React |
| Agent system | Claude Code agents invoked via slash commands; agents read/write to `source/` and `docs/` |
| Dev servers | React on `localhost:3000`, Express on `localhost:3001`; React proxies API calls to 3001 |

**Testcase generation pipeline (JSON-first approach):**

1. LLM outputs a JSON array of testcase objects
2. Node.js converts JSON to CSV (avoids column-alignment bugs from LLM-generated CSV)
3. `_temp.json` intermediate file is cleaned up after conversion
4. Final CSV is saved and surfaced in the TestcaseManager page
