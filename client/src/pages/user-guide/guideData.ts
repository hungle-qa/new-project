import { Code, Monitor, Bot, Palette, ClipboardCheck } from 'lucide-react'

export type TabType = 'edit-app' | 'use-webapp' | 'train-agent'
export type WebAppSubTab = 'design-system' | 'testcase-manager'

export interface GuideSection {
  overview: string
  workflow: { steps: string[]; description?: string }
  input: string[]
  process: string[]
  output: string[]
  examples: string[]
  note: string[]
}

export const tabs: { id: TabType; label: string; icon: typeof Code }[] = [
  { id: 'edit-app', label: 'Build App', icon: Code },
  { id: 'use-webapp', label: 'Use Web App', icon: Monitor },
  { id: 'train-agent', label: 'Train Agent', icon: Bot },
]

export const webAppSubTabs: { id: WebAppSubTab; label: string; icon: typeof Palette }[] = [
  { id: 'design-system', label: 'Design System', icon: Palette },
  { id: 'testcase-manager', label: 'Testcase Manager', icon: ClipboardCheck },
]

export const webAppSubTabContent: Record<WebAppSubTab, GuideSection> = {
  'design-system': {
    overview: 'Find and copy UI components for your projects. Browse buttons, cards, forms, and more. Each component shows a live preview and gives you ready-to-use code.',
    workflow: {
      steps: ['Browse', 'Search', 'Preview', 'Copy Code', 'Use'],
      description: 'Find a component → View it live → Copy the code → Paste into your project'
    },
    input: [
      '1. Finding Components',
      'Browse: Scroll through the component grid',
      'Search: Type a name (like "button" or "card") in the search box',
      'Filter: Click status chips to show only Active, Draft, or Inactive components'
    ],
    process: [
      '2. Viewing a Component',
      'Click any component card to open it. You will see:',
      '',
      'Preview Tab: Shows how the component looks and works',
      'HTML Tab: The markup code you can copy',
      'CSS Tab: The styling code you can copy',
      'Full Code Tab: HTML + CSS combined, ready to paste'
    ],
    output: [
      '3. Copying Code',
      'To use a component in your project:',
      '',
      'Click the component card to open it',
      'Select the tab you need (HTML, CSS, or Full Code)',
      'Click the Copy button',
      'Paste into your project'
    ],
    examples: [
      'Find a button → Click "Button" card → HTML tab → Copy',
      'Search for navigation → Type "nav" → Click result → Full Code → Copy',
      'Change status → Click component → Click status badge → Select new status'
    ],
    note: [
      '⚠️ Tips',
      '',
      'Components are HTML: These are not React components, they are plain HTML',
      'Auto-save: Status changes save automatically',
      'Copy works everywhere: The Copy button appears in all code tabs'
    ]
  },
  'testcase-manager': {
    overview: 'Manage feature testcase configurations. Select testing strategy, define hierarchy levels, scope, map design system components, import specs via AI, and review generated testcase CSVs.',
    workflow: {
      steps: ['Create Feature', 'Select Strategy', 'Configure Levels', 'Import Spec', 'Review Results'],
      description: 'Create feature → Select strategy → Define hierarchy → Import spec → Generate & review testcases'
    },
    input: [
      '1. Managing Features',
      'Create: Click "Create Feature" button and enter a name',
      'Select: Click a feature in the sidebar to configure it',
      'Delete: Click Delete button on the feature detail panel'
    ],
    process: [
      '2. Feature Configuration Tabs',
      '',
      'Strategy: Select testing approach (Scenario-based or Component Testing)',
      'Levels: Define component hierarchy (Lv1 component, Lv2 sub-component, Lv3 functions)',
      'Scope: Define happy case and corner case definitions',
      'Knowledge: Upload reference files (PDF, MD, TXT)',
      'Components: Map design system components to the feature',
      'Import Spec: Upload a PDF spec, AI extracts and structures it',
      'Review & Export: View generated testcase CSVs and download them'
    ],
    output: [
      '3. Generating Testcases',
      'After configuring:',
      '',
      'Run /testcase write {feature} in CLI to generate testcases',
      'Results appear in Review & Export tab as downloadable CSVs',
      'Preview first 100 rows inline before downloading'
    ],
    examples: [
      'Create feature → Click "Create Feature" → Type "inbox" → Create',
      'Add levels → Levels tab → Add Level → Set type and value → Save',
      'Import spec → Import Spec tab → Upload PDF → AI processes → Preview',
      'Download CSV → Review & Export tab → Click Download'
    ],
    note: [
      '⚠️ Tips',
      '',
      'File location: Features saved in source/testcase/{feature-name}/',
      'AI required: Import Spec needs AI settings configured (Google Gemini)',
      'Generate testcases: Use /testcase write {feature} after configuring'
    ]
  }
}

export const guideContent: Record<Exclude<TabType, 'use-webapp'>, GuideSection> = {
  'train-agent': {
    overview: 'Improve your AI agents with AGIA (Agent Intelligence Architect). Find problems, fix unclear wording, make agents more reliable.',
    workflow: {
      steps: ['Choose Agent', 'Run Audit', 'Review Report', 'Apply Fixes', 'Verify'],
      description: 'You select an agent → AGIA analyzes it → You review the report → You approve changes'
    },
    input: [
      '1. Commands',
      '',
      '• @agia audit {agent-name} → Check one agent',
      '• @agia audit system files → Check all documentation',
      '• @agia sync after adding {name} → Update docs for new agent',
      '• @agia full audit → Complete system check'
    ],
    process: [
      '2. The 5 Audit Steps',
      '',
      '📍 Step 1: Deconstruct',
      '• Breaks agent into parts (logic, rules, format)',
      '',
      '📍 Step 2: Audit',
      '• Finds unclear instructions',
      '• Identifies missing error handling',
      '',
      '📍 Step 3: Synthesize',
      '• Rewrites with clear structure',
      '• Adds missing sections',
      '',
      '📍 Step 4: Simulate',
      '• Tests with different scenarios',
      '• Checks edge cases',
      '',
      '📍 Step 5: Iterate',
      '• Fixes remaining issues',
      '• Repeats until all tests pass'
    ],
    output: [
      '3. What You Get',
      '',
      '• ✓ Audit Report (High/Medium/Low severity)',
      '• ✓ Improved agent code (ready to use)',
      '• ✓ Before/After comparison',
      '• ✓ Test results (PASS/FAIL)'
    ],
    examples: [
      '💡 Example: Auditing an Agent',
      '',
      'Command: @agia audit import-design-by-image',
      '',
      'AGIA finds → Missing Glob tool, unclear CSS rules',
      'AGIA suggests → Add Glob, clarify CSS section',
      'You approve → Changes applied',
      '',
      'Result: Agent works more reliably'
    ],
    note: [
      '⚠️ Tips',
      '',
      '• Backup created: AGIA saves original before changes',
      '• Approval required: You must say "Yes" to apply',
      '• Safe: Core purpose never changed without permission'
    ]
  },
  'edit-app': {
    overview: 'Build new features or fix bugs in the main application. You describe what you want, and AI agents handle the coding automatically.',
    workflow: {
      steps: ['Scout', 'Planner', 'Designer', 'Implementer'],
      description: 'You give a command → 4 agents work in sequence → You get working code'
    },
    input: [
      '1. How to Start',
      '',
      '• Open your terminal',
      '• Type: /start {describe what you want}',
      '• Press Enter',
      '',
      '2. Example Commands',
      '',
      '• /start Add search to design system page',
      '• /start Fix status toggle not updating',
      '• /start Add pagination to API'
    ],
    process: [
      '3. The 4 Phases',
      '',
      '📍 Scout Phase',
      '• Scans client/src/ and server/ folders',
      '• Finds files related to your request',
      '• Output: List of relevant files',
      '',
      '📍 Planning Phase',
      '• Creates step-by-step plan',
      '• Saves plan to plans/ folder',
      '• Output: Plan document you can review',
      '',
      '📍 Design Phase (UI only)',
      '• Suggests layout and components',
      '• Skipped for backend-only changes',
      '• Output: UI recommendations',
      '',
      '📍 Implementation Phase',
      '• Writes TypeScript/React code',
      '• Updates existing files or creates new ones',
      '• Output: Working code in client/ or server/'
    ],
    output: [
      '4. What You Get',
      '',
      '• ✓ Updated source code files',
      '• ✓ Plan document in /plans folder',
      '• ✓ Ready-to-use components'
    ],
    examples: [
      '💡 Example: Adding Search Feature',
      '',
      'Command: /start Add search to design system page',
      '',
      'Scout finds → DesignSystemPage.tsx',
      'Planner creates → plans/design-system-search.md',
      'Designer suggests → Search input at top of page',
      'Implementer adds → useState, filter logic, input component',
      '',
      'Result: Search box appears, filters components as you type'
    ],
    note: [
      '⚠️ Tips for Best Results',
      '',
      '• Be specific: "Fix Toggle on Dashboard not changing color" beats "Fix UI bug"',
      '• Main app only: Use for client/ and server/',
      '• Review first: Check /plans folder before implementation starts'
    ]
  }
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
