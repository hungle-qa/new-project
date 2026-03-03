import { Code, Monitor, Bot, LayoutDashboard, Zap, Clock, Terminal } from 'lucide-react'

export type TabType = 'edit-app' | 'use-webapp' | 'train-agent' | 'commands'
export type WebAppSubTab = 'overview' | 'lite' | 'full'

export interface GuideSection {
  overview: string
  workflow: { steps: string[]; description?: string }
  input: string[]
  process: string[]
  output: string[]
  examples: string[]
  note: string[]
}

export interface RichSection {
  title: string
  bullets?: string[]
  flow?: string[]
  code?: string
  protip?: string
  upcoming?: boolean
}

export interface WebAppRichContent {
  sections: RichSection[]
}

export const tabs: { id: TabType; label: string; icon: typeof Code }[] = [
  { id: 'edit-app', label: 'Build App', icon: Code },
  { id: 'use-webapp', label: 'Use Web App', icon: Monitor },
  { id: 'train-agent', label: 'Train Agent', icon: Bot },
  { id: 'commands', label: 'Commands', icon: Terminal },
]

export const webAppSubTabs: { id: WebAppSubTab; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'lite', label: 'Lite', icon: Zap },
  { id: 'full', label: 'Full', icon: Clock },
]

export const webAppSubTabContent: Record<WebAppSubTab, WebAppRichContent> = {
  overview: {
    sections: [
      {
        title: '🎯 Why Consistency Matters',
        bullets: [
          'Inconsistent testcases lead to missed coverage, duplicated effort, and chaotic reviews.',
          'QA-kit gives your team a shared structure — same columns, same priority scale, same step style.',
          'The result: reviews get faster, coverage gaps become visible, and nothing falls through the cracks.',
          'The AI handles the repetitive formatting — you focus on what actually needs testing.',
        ],
      },
      {
        title: '⚡ What QA-kit Does',
        bullets: [
          'Generates testcases from your feature specs using AI — in seconds, not hours.',
          'Enforces your team\'s rules: priority mapping, tag assignment, step format, session dedup.',
          'Lets you iterate: review output → add notes → improve rules → regenerate.',
          'Exports clean CSVs ready for any test management tool.',
        ],
      },
      {
        title: '🔄 How Does It Work?',
        flow: ['Configure Feature', 'Import Spec', 'Run Command', 'Review CSV', 'Improve Rules', 'Re-run'],
        bullets: [
          'Configure Feature — set hierarchy levels, scope, and testing strategy in the Testcase Manager.',
          'Import Spec — upload a PDF or paste the spec; AI structures it automatically.',
          'Run Command — use /testcase write-lite {feature} or /testcase write {feature} in CLI.',
          'Review CSV — open the result in Review & Export, check for gaps or incorrect steps.',
          'Improve Rules — add a note, copy it as a command, and let the agent update the rules.',
          'Re-run — regenerate with improved rules for a cleaner output.',
        ],
      },
      {
        title: '🧩 Two Generation Modes',
        bullets: [
          'Lite — fast, spec-driven generation. No digest or component mapping needed. Great for quick coverage.',
          'Full — deeper generation using a digest pipeline + design system component mapping. Better for complex features with many UI states.',
          'Not sure which to use? Start with Lite — it covers 80% of cases with minimal setup.',
        ],
        protip: 'New to a feature? Always run Lite first to get a baseline, then upgrade to Full if you need deeper component-level coverage.',
      },
    ],
  },
  lite: {
    sections: [
      {
        title: '🎯 Purpose',
        bullets: [
          'Generate testcases quickly from a feature spec — no digest or component mapping needed.',
          'Best for: iterative QA, newly specced features, quick coverage checks.',
          'Lite respects your team\'s rules (priority, tags, step format) and applies them automatically.',
        ],
      },
      {
        title: '🔄 User Flow',
        flow: ['Import Spec', 'Run write-lite', 'Review CSV', 'Copy Note', 'Improve Rules', 'Re-run'],
      },
      {
        title: '📥 How to Import Spec',
        bullets: [
          'Open the Testcase Manager and select (or create) your feature.',
          'Click the Import Spec tab.',
          'Upload a PDF or paste the spec text directly.',
          'AI extracts and structures the spec — user stories, acceptance criteria, and edge cases.',
          'Review the imported spec in the preview panel and edit if anything looks off.',
          'The structured spec is now ready for testcase generation.',
        ],
        protip: 'The cleaner and more structured your spec, the better the output. If the spec has numbered ACs (AC1, AC2…), the AI maps them directly to testcase rows.',
      },
      {
        title: '⌨️ How to Write Testcases via Command',
        bullets: [
          'Open your terminal.',
          'Run: /testcase write-lite {feature-name}',
          'The agent reads your imported spec + team rules and generates a testcase CSV.',
          'Result appears automatically in the Review & Export tab.',
          'Each row = one testcase with: title, steps, expected result, priority, tags, and data variants.',
        ],
        code: '/testcase write-lite saved-response---function',
        protip: 'No need to type the full command manually — go to Review & Export, find the feature, and click the "Copy: write-lite" button. It copies the exact command with the correct feature name, ready to paste into your terminal.',
      },
      {
        title: '📤 How to Copy / Export Testcases',
        bullets: [
          'Open the Review & Export tab in the Testcase Manager.',
          'Find the generated CSV file for your feature.',
          'Copy TSV — copies the testcase data as tab-separated values, ready to paste into Google Sheets or Excel.',
          'Export .md — downloads the testcase as a Markdown file, useful for docs or PR reviews.',
          'Preview — click the eye icon to scan the testcase inline before exporting.',
        ],
        protip: 'Use Copy TSV to paste directly into Google Sheets — columns align automatically. Use Export .md when you want to attach testcases to a ticket or pull request.',
      },
      {
        title: '🔍 How to Review Testcases → Take Note → Improve Rules',
        bullets: [
          'Open the generated CSV in the Review & Export tab.',
          'Read through the testcases — look for repeated steps, missing cases, wrong priorities.',
          'Click the 📝 note icon on a file to add your feedback.',
          'Click Copy Note as Command — this formats your note as a ready-to-paste CLI command.',
          'Paste it into the terminal — the agent reads the note and proposes rule updates.',
          'Review and approve the changes (the agent shows a before/after diff).',
          'Re-run /testcase write-lite {feature} — the new output applies the improved rules.',
        ],
        protip: 'Be specific in your notes. Instead of "steps are too long", write "Login as Coach repeats in every row — should only appear once at the top." Specific notes = better rule updates.',
      },
      {
        title: '📌 Other',
        bullets: [
          'Business Rules — team-wide testing rules are in docs/Business_Rules.md. Review them before writing testcases for a new feature.',
          'Testcase Rules — generation rules (priority mapping, tag assignment, step format) live in source/testcase/rule/test-rules.md.',
          'Feature folder — all assets for a feature (spec, result CSVs, notes) are saved in source/testcase/{feature-name}/.',
          'Re-import anytime — if the spec changes, re-import it from the Import Spec tab and regenerate.',
          'Multiple runs are safe — each run saves a new timestamped CSV. Old results are never overwritten.',
        ],
      },
    ],
  },
  full: {
    sections: [
      {
        title: '🚧 Full Mode — Coming Soon',
        upcoming: true,
        bullets: [
          'Full mode uses a deep digest pipeline for richer testcase coverage.',
          'Includes design system component mapping — links UI components to testcase steps.',
          'Better for complex features with many interactive states, modals, and edge cases.',
          'Stay tuned — this tab will be updated when Full mode is released.',
        ],
      },
    ],
  },
}

export const trainAgentContent: WebAppRichContent = {
  sections: [
    {
      title: '🤖 What is Train Agent?',
      bullets: [
        'Improve your AI agents using AGIA — Agent Intelligence Architect.',
        'AGIA finds problems, fixes unclear instructions, and makes agents more reliable.',
        'All changes require your approval — nothing is modified without you saying "Yes".',
        'Works on any agent in .claude/agents/ — testcase-writer, implementer, import-design, and more.',
      ],
    },
    {
      title: '🔄 How Does It Work?',
      flow: ['Choose Operation', 'AGIA Analyzes', 'Review Report', 'Approve', 'Verify'],
      bullets: [
        'Choose Operation — pick audit, update, test, optimize, or system-audit.',
        'AGIA Analyzes — breaks the agent into logic, rules, and format; finds issues.',
        'Review Report — AGIA shows a before/after diff with severity ratings.',
        'Approve — you say "Yes" to apply, or "No" to cancel. Nothing changes without approval.',
        'Verify — AGIA runs chain validation to confirm no downstream agents are broken.',
      ],
    },
    {
      title: '⌨️ Available Commands',
      bullets: [
        '/agent-audit audit {agent} — analyze an agent, get a weakness report.',
        '/agent-audit update {agent} — apply fixes from an audit (requires approval).',
        '/agent-audit test {agent} — run 5 simulation tests against the agent.',
        '/agent-audit optimize {agent} — reduce token count 30–50% via entropy reduction.',
        '/agent-audit create-skill {agent} — split an agent into skill-based architecture.',
        '/agent-audit system-audit — check all system docs for consistency (README, CLAUDE.md, workflows).',
      ],
      code: '/agent-audit update write-lite',
    },
    {
      title: '🔍 The 5 Audit Steps',
      bullets: [
        '📍 Step 1: Deconstruct — breaks agent into parts (logic, rules, output format).',
        '📍 Step 2: Audit — finds unclear instructions, missing error handling, ambiguous rules.',
        '📍 Step 3: Synthesize — rewrites with clear structure, adds missing sections.',
        '📍 Step 4: Simulate — tests with different scenarios and edge cases.',
        '📍 Step 5: Iterate — fixes remaining issues, repeats until all simulations pass.',
      ],
    },
    {
      title: '✅ What You Get',
      bullets: [
        'Audit report with High / Medium / Low severity findings.',
        'Improved agent file with before/after comparison.',
        'Simulation test results (PASS / FAIL per scenario).',
        'Chain validation — confirms no upstream/downstream agents are broken.',
      ],
    },
    {
      title: '📌 Tips',
      bullets: [
        'Always audit before update — run audit first to understand the issues, then update to fix them.',
        'Use the note from testcase review to drive updates — copy it as a command and run /agent-audit update.',
        'Optimize when an agent feels slow — optimize reduces prompt size without changing behavior.',
        'System audit after adding a new agent — keeps README, CLAUDE.md, and workflows in sync.',
      ],
      protip: 'The best time to run an audit is right after you notice inconsistent agent output — e.g., testcases with repeated steps or wrong column order. The audit will pinpoint the exact rule that\'s missing.',
    },
  ],
}

export const buildAppContent: WebAppRichContent = {
  sections: [
    {
      title: '🎯 What is Build App?',
      bullets: [
        'Build new features or fix bugs in the QA-kit application.',
        'You describe what you want — AI agents handle the coding automatically.',
        'Works on: client/src/ (React + TypeScript) and server/src/ (Express + TypeScript).',
        'Uses file-based storage — no database, everything saved as markdown files.',
      ],
    },
    {
      title: '🔄 How Does It Work?',
      flow: ['/start command', 'Classify', 'Plan & Approve', 'Implement', 'Verify'],
      bullets: [
        '/start command — you describe what you want to build or fix.',
        'Classify — task is rated EASY / MEDIUM / HARD based on scope and file count.',
        'Plan & Approve — for MEDIUM/HARD tasks, a plan is shown for your review before any code is written.',
        'Implement — the implementer agent writes TypeScript/React code in the right files.',
        'Verify — TypeScript is checked with tsc --noEmit to confirm no type errors.',
      ],
    },
    {
      title: '⌨️ How to Start',
      bullets: [
        'Open your terminal.',
        'Run: /start {describe what you want}',
        'Be specific — describe the feature, the file, or the bug clearly.',
        'The agent classifies the task and shows you the plan before writing any code.',
      ],
      code: '/start Add export .md button to Review & Export tab',
    },
    {
      title: '📐 Task Classification',
      bullets: [
        'EASY — 1 file, specific fix, path known. Examples: fix typo, update label, CSS tweak.',
        'MEDIUM — 2–3 files, standard UI pattern, props/state addition. Examples: new modal, form with validation.',
        'HARD — 4+ files, new API, complex data flow. Examples: new module, multi-step wizard.',
        'MEDIUM and HARD tasks show a plan + wireframe and ask for your approval before coding starts.',
      ],
      protip: 'Not sure what classification your task is? Just run /start and let the agent decide — it will tell you before doing anything.',
    },
    {
      title: '✅ What You Get',
      bullets: [
        'Updated source code files in client/src/ or server/src/.',
        'TypeScript verified clean — no type errors introduced.',
        'For MEDIUM/HARD: a plan summary showing exactly what changed and why.',
      ],
    },
    {
      title: '📌 Tips for Best Results',
      bullets: [
        'Be specific: "Fix Toggle on Dashboard not changing color" beats "Fix UI bug".',
        'Main app only: use /start for client/ and server/ — not for .md files or agents.',
        'Approve the plan first: read the plan before saying "Yes" — it\'s your last checkpoint before code is written.',
        'One task at a time: if you have multiple unrelated changes, run /start separately for each.',
      ],
    },
  ],
}

export const commandsContent: WebAppRichContent = {
  sections: [
    {
      title: '📋 All Commands at a Glance',
      bullets: [
        '/start — build or fix app features (React + Express)',
        '/testcase — generate and manage QA testcases from specs',
        '/agent-audit — audit, test, and improve AI agents',
        '/doc — create and update project documentation',
        '/import-design-by-image — import UI components from images or code',
        '/ship — commit, push, and merge current branch to main',
      ],
    },
    {
      title: '🚀 /start — Build App Features',
      bullets: [
        'Use when: building new features, fixing bugs, or updating app UI.',
        'Describe what you want in plain text — AI classifies and implements.',
        'EASY (1 file, specific fix) · MEDIUM (2–3 files, standard pattern) · HARD (4+ files, new API).',
        'MEDIUM/HARD: shows plan + wireframe and asks for your approval before writing code.',
        'Scope: client/src/ (React) and server/src/ (Express) only — never .md files.',
      ],
      code: '/start Add export .md button to Review & Export tab',
      protip: 'Be specific. "Fix toggle button color on dashboard" gets better results than "fix UI bug".',
    },
    {
      title: '🧪 /testcase — Generate QA Testcases',
      bullets: [
        'write-lite {feature} — fast, spec-driven generation. Best for most cases. No digest needed.',
        'write {feature} — full generation with digest pipeline + component mapping. For complex features.',
        'update {feature} — add, edit, or remove rows from an existing testcase CSV.',
        'Prerequisites: feature must exist in Testcase Manager + spec must be imported.',
        'Output: timestamped CSV saved to source/testcase/{feature}/result/.',
      ],
      code: '/testcase write-lite saved-response---function',
      protip: 'Go to Review & Export → find your feature → click "Copy: write-lite" to get the exact command with the correct feature name.',
    },
    {
      title: '🤖 /agent-audit — Audit & Improve Agents',
      bullets: [
        'audit {agent} — analyze agent, get a weakness report with High / Medium / Low severity.',
        'update {agent} — apply fixes from an audit (requires your approval before any changes).',
        'test {agent} — run 5 simulation tests against the agent and report PASS / FAIL.',
        'optimize {agent} — reduce token count 30–50% via entropy reduction, no behavior change.',
        'create-skill {agent} — split a monolithic agent into a skill-based architecture.',
        'system-audit — check all system docs for consistency (README, CLAUDE.md, workflows).',
      ],
      code: '/agent-audit audit testcase-writer',
      protip: 'Always run audit before update — understand the issues first, then fix them.',
    },
    {
      title: '📄 /doc — Manage Project Docs',
      bullets: [
        'review — audit all docs for freshness and accuracy.',
        'review {doc-type} — audit a single doc.',
        'create {doc-type} — generate a doc from codebase context (shows draft + asks approval).',
        'update {doc-type} — update an existing doc with latest changes (shows diff + asks approval).',
        'Valid doc types: context · project-overview · codebase-summary · design-guidelines · system-architecture.',
      ],
      code: '/doc create codebase-summary',
      protip: 'Run /doc review first to see which docs are stale before deciding what to create or update.',
    },
    {
      title: '🎨 /import-design-by-image — Import UI Components',
      bullets: [
        'Attach 1 image → SINGLE mode: convert one state to HTML + Tailwind CSS.',
        'Attach 2+ images → MULTI mode: catalog multiple states (hover, disabled, active) and consolidate.',
        'Paste HTML/CSS → VALIDATE mode: check code compliance against your design rules.',
        'No image + component name → UPDATE mode: edit an existing component by description.',
        'Output: source/design-system/{ComponentName}.md with full 9-section documentation.',
      ],
      code: '/import-design-by-image [attach image + type component name]',
      protip: 'For components with multiple states, attach all images at once — the agent catalogs and compares them automatically.',
    },
    {
      title: '🚢 /ship — Commit, Push & Merge',
      bullets: [
        'Stages all changes, generates a commit message from the diff, and pushes the current branch.',
        'Merges into main using --no-ff to preserve branch history.',
        'Switches back to your original branch after the merge.',
        'Stops immediately on conflicts — never auto-resolves. Reports to you.',
        'Optional: pass your own commit message as argument.',
      ],
      code: '/ship "feat: add export button to review tab"',
      protip: 'Run /ship when you\'re happy with everything on the branch. One command: commit → push → merge → back.',
    },
  ],
}

export const useWebappContent: GuideSection = {
  overview: 'Access all your project resources in one place. The web app runs at http://localhost:3000 after you start the development server with npm run dev.',
  workflow: {
    steps: ['Design System', 'Testcase Manager'],
    description: 'Two main sections: Components you can copy → Features you can configure'
  },
  input: [
    '1. Getting Started',
    'Open http://localhost:3000 in your browser',
    'Use the navigation to switch between sections',
    'Click the sub-tabs below for detailed guides on each section'
  ],
  process: [
    '2. What Each Section Does',
    '',
    'Design System: Browse and copy UI components (buttons, cards, forms)',
    'Testcase Manager: Configure features and review generated testcases',
  ],
  output: [
    '3. Common Workflows',
    '',
    'Copy Component: Design System → Click component → Copy code → Paste',
  ],
  examples: [
    'Copy a button → Design System → "Button" → HTML tab → Copy',
    'Configure feature → Testcase Manager → Click feature → Set levels → Save',
  ],
  note: [
    '⚠️ Key Information',
    '',
    'All data saves automatically: No need to manually save',
    'Files are markdown: Everything is stored in source/ as .md files',
    'Click sub-tabs above: For detailed instructions on each section'
  ]
}
