import { useState } from 'react'
import { BookOpen, Code, Layers, Monitor, AlertCircle, Palette, ClipboardCheck, FileText, Bot } from 'lucide-react'

type TabType = 'edit-app' | 'create-demos' | 'use-webapp' | 'train-agent'
type WebAppSubTab = 'design-system' | 'review-testcase' | 'spec-templates'

interface GuideSection {
  overview: string
  workflow: { steps: string[]; description?: string }
  input: string[]
  process: string[]
  output: string[]
  examples: string[]
  note: string[]
}

const tabs: { id: TabType; label: string; icon: typeof Code }[] = [
  { id: 'edit-app', label: 'Build App', icon: Code },
  { id: 'create-demos', label: 'Create Demos', icon: Layers },
  { id: 'use-webapp', label: 'Use Web App', icon: Monitor },
  { id: 'train-agent', label: 'Train Agent', icon: Bot },
]

const webAppSubTabs: { id: WebAppSubTab; label: string; icon: typeof Palette }[] = [
  { id: 'design-system', label: 'Design System', icon: Palette },
  { id: 'review-testcase', label: 'Review Testcase', icon: ClipboardCheck },
  { id: 'spec-templates', label: 'Spec Templates', icon: FileText },
]

const webAppSubTabContent: Record<WebAppSubTab, GuideSection> = {
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
  'review-testcase': {
    overview: 'Manage feature testcase configurations. Define hierarchy levels, scope, map design system components, import specs via AI, and review generated testcase CSVs.',
    workflow: {
      steps: ['Create Feature', 'Configure Levels', 'Set Scope', 'Import Spec', 'Review Results'],
      description: 'Create feature → Define hierarchy → Set scope → Import spec → Generate & review testcases'
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
  },
  'spec-templates': {
    overview: 'Use ready-made templates for specifications and documentation. Templates include placeholders like {project-name} that you fill in with your details.',
    workflow: {
      steps: ['Browse', 'Preview', 'Copy', 'Customize'],
      description: 'Find a template → Preview the structure → Copy it → Replace placeholders with your content'
    },
    input: [
      '1. Finding Templates',
      'Browse: Scroll through the template list',
      'Click: Select a template to see its full structure',
      'Expand: Click sections to see details'
    ],
    process: [
      '2. Template Structure',
      'Each template contains:',
      '',
      'Section Headers: H1, H2, H3 for organization',
      'Placeholders: Fields like {name}, {date}, {version} to fill in',
      'Tables: For requirements, features, or comparisons',
      'Instructions: Comments explaining what to write'
    ],
    output: [
      '3. Using a Template',
      'To use:',
      '',
      'Click the Copy button',
      'Paste into your editor',
      'Replace all {placeholders} with your content',
      'Delete any sections you don\'t need'
    ],
    examples: [
      'Copy PRD template → Click "PRD Template" → Copy → Paste in editor',
      'Fill placeholders → Replace {project-name} with "Client Portal"',
      'Import new → /import-spec-template in CLI'
    ],
    note: [
      '⚠️ Tips',
      '',
      'File format: Templates are markdown files (.md)',
      'Location: Stored in source/spec-template/',
      'Reusable: Use the same template for multiple projects'
    ]
  }
}

const guideContent: Record<Exclude<TabType, 'use-webapp'>, GuideSection> = {
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
      '• Main app only: Use for client/ and server/, not demos',
      '• Review first: Check /plans folder before implementation starts'
    ]
  },
  'create-demos': {
    overview: 'Create demo projects using your design system components. Demos are standalone HTML pages for presentations, client reviews, or prototyping.',
    workflow: {
      steps: ['Create Folder', 'Scout', 'Plan', 'Build', 'Generate Spec'],
      description: 'You name project → System creates folders → Finds components → Builds HTML → Creates spec'
    },
    input: [
      '1. Commands',
      '',
      '• /create-demo {project-name} → Create new demo',
      '• /create-demo from @product-idea {name} → Create from idea',
      '• /fix-demo {name}: {issue} → Fix existing demo'
    ],
    process: [
      '2. The 5 Phases',
      '',
      '📍 Create Folder Phase',
      '• Creates source/demo/{project-name}/',
      '• Adds subfolders: pages/, spec/, components/',
      '',
      '📍 Scout Phase',
      '• Scans source/design-system/',
      '• Lists available buttons, cards, forms, etc.',
      '',
      '📍 Planning Phase',
      '• Decides which pages to create',
      '• Assigns components to each page',
      '',
      '📍 Build Phase',
      '• Creates standalone HTML files',
      '• Applies Tailwind CSS styling',
      '',
      '📍 Spec Phase',
      '• Generates documentation',
      '• Saves to spec/ folder'
    ],
    output: [
      '3. What You Get',
      '',
      '• ✓ Project folder at source/demo/{name}/',
      '• ✓ HTML pages in pages/ subfolder',
      '• ✓ Spec document in spec/ subfolder'
    ],
    examples: [
      '💡 Example: Creating a Demo',
      '',
      'Command: /create-demo client-portal',
      '',
      'Folder created → source/demo/client-portal/',
      'Scout finds → Button, Card, Navigation, Form',
      'Planner creates → login.html, dashboard.html, settings.html',
      'Builder outputs → 3 HTML pages with Tailwind',
      'Spec written → client-portal-spec.md',
      '',
      'Result: Open pages/login.html in browser to preview'
    ],
    note: [
      '⚠️ Tips',
      '',
      '• HTML only: Demos are plain HTML, not React',
      '• Design system: All demos use components from source/design-system/',
      '• Be specific: When fixing, say "button not aligned" not just "broken"'
    ]
  }
}

const useWebappContent: GuideSection = {
  overview: 'Access all your project resources in one place. The web app runs at http://localhost:3000 after you start the development server with npm run dev.',
  workflow: {
    steps: ['Design System', 'Review Testcase', 'Spec Templates'],
    description: 'Three main sections: Components you can copy → Features you can configure → Templates you can use'
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
    'Review Testcase: Configure features and review generated testcases',
    'Spec Templates: Use ready-made document templates',
  ],
  output: [
    '3. Common Workflows',
    '',
    'Copy Component: Design System → Click component → Copy code → Paste',
    'Create Documentation: Spec Templates → Copy template → Fill placeholders',
  ],
  examples: [
    'Copy a button → Design System → "Button" → HTML tab → Copy',
    'Configure feature → Review Testcase → Click feature → Set levels → Save',
  ],
  note: [
    '⚠️ Key Information',
    '',
    'All data saves automatically: No need to manually save',
    'Files are markdown: Everything is stored in source/ as .md files',
    'Click sub-tabs above: For detailed instructions on each section'
  ]
}

export function UserGuidePage() {
  const [activeTab, setActiveTab] = useState<TabType>('edit-app')
  const [activeWebAppSubTab, setActiveWebAppSubTab] = useState<WebAppSubTab>('design-system')

  const getContent = (): GuideSection => {
    if (activeTab === 'use-webapp') {
      return activeWebAppSubTab ? webAppSubTabContent[activeWebAppSubTab] : useWebappContent
    }
    return guideContent[activeTab as Exclude<TabType, 'use-webapp'>]
  }
  const content = getContent()

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">User Guide</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 pb-2">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-colors ${
              activeTab === id
                ? 'bg-white border border-b-0 border-gray-200 text-indigo-600 -mb-[3px]'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Sub-tabs for Use Web App */}
      {activeTab === 'use-webapp' && (
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          {webAppSubTabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveWebAppSubTab(id)}
              className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium border-b-2 transition-colors ${
                activeWebAppSubTab === id
                  ? 'border-indigo-500 text-indigo-700'
                  : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-8">
        {/* Overview */}
        <Section title="Overview">
          <p className="text-gray-700">{content.overview}</p>
        </Section>

        {/* Workflow */}
        <Section title="Workflow">
          <div className="flex flex-wrap items-center gap-2 text-sm mb-2">
            {content.workflow.steps.map((step, i) => (
              <span key={i} className="flex items-center gap-2">
                <span className="px-3 py-1.5 bg-indigo-100 text-indigo-800 rounded-lg font-mono">
                  {step}
                </span>
                {i < content.workflow.steps.length - 1 && (
                  <span className="text-gray-400">→</span>
                )}
              </span>
            ))}
          </div>
          {content.workflow.description && (
            <p className="text-sm text-gray-500 mt-2">{content.workflow.description}</p>
          )}
        </Section>

        {/* Input */}
        <Section title="Input">
          <FormattedList items={content.input} />
        </Section>

        {/* Process */}
        <Section title="Process">
          <FormattedList items={content.process} />
        </Section>

        {/* Output */}
        <Section title="Output">
          <FormattedList items={content.output} />
        </Section>

        {/* Examples */}
        <Section title="Examples">
          <ul className="space-y-2">
            {content.examples.map((item, i) => (
              <li key={i} className="px-3 py-2 bg-gray-50 rounded-lg font-mono text-sm text-gray-800">
                {item}
              </li>
            ))}
          </ul>
        </Section>

        {/* Note */}
        <Section title="Note" icon={AlertCircle}>
          <FormattedList items={content.note} variant="note" />
        </Section>
      </div>
    </div>
  )
}

function Section({
  title,
  icon: Icon,
  children
}: {
  title: string
  icon?: typeof AlertCircle
  children: React.ReactNode
}) {
  return (
    <div>
      <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-3">
        {Icon && <Icon className="w-4 h-4 text-amber-500" />}
        {title}
      </h2>
      {children}
    </div>
  )
}

function FormattedList({
  items,
  variant = 'default'
}: {
  items: string[]
  variant?: 'default' | 'note'
}) {
  // Check if item is a heading (starts with number + period or has specific pattern)
  const isHeading = (item: string) => /^\d+\.\s/.test(item) || /^⚠️/.test(item)
  const isSubHeading = (item: string) => item.includes('→') && !item.startsWith(' ')
  const isEmpty = (item: string) => item.trim() === ''

  return (
    <div className="space-y-2 text-gray-700">
      {items.map((item, i) => {
        if (isEmpty(item)) {
          return <div key={i} className="h-2" />
        }

        if (isHeading(item)) {
          return (
            <h3 key={i} className="font-semibold text-gray-900 mt-4 first:mt-0">
              {item}
            </h3>
          )
        }

        if (isSubHeading(item)) {
          const [label, command] = item.split('→').map(s => s.trim())
          return (
            <div key={i} className="flex items-center gap-2 pl-4">
              <span className="text-gray-600">{label}</span>
              <span className="text-gray-400">→</span>
              <code className="px-2 py-0.5 bg-gray-100 rounded text-sm font-mono text-indigo-600">
                {command}
              </code>
            </div>
          )
        }

        if (variant === 'note') {
          return (
            <div key={i} className="flex items-start gap-2 pl-4">
              <span className="text-amber-500 mt-0.5">•</span>
              <span>{item}</span>
            </div>
          )
        }

        // Regular content with indentation
        return (
          <p key={i} className="pl-4 text-gray-600">
            {item}
          </p>
        )
      })}
    </div>
  )
}
