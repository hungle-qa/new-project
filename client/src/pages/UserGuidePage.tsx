import { useState } from 'react'
import { BookOpen, Code, Layers, Monitor, AlertCircle, Palette, Lightbulb, FileText, Layout as LayoutIcon, Bot } from 'lucide-react'

type TabType = 'edit-app' | 'create-demos' | 'use-webapp' | 'train-agent'
type WebAppSubTab = 'design-system' | 'product-ideas' | 'spec-templates' | 'demo-projects'

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
  { id: 'product-ideas', label: 'Product Ideas', icon: Lightbulb },
  { id: 'spec-templates', label: 'Spec Templates', icon: FileText },
  { id: 'demo-projects', label: 'Demo Projects', icon: LayoutIcon },
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
  'product-ideas': {
    overview: 'Store and organize your product requirements. Each idea includes problem statements, user stories, and acceptance criteria. Use ideas to generate demos automatically.',
    workflow: {
      steps: ['Browse Ideas', 'View Details', 'Edit', 'Use for Demo'],
      description: 'See all ideas → Click to read details → Edit if needed → Generate demo from idea'
    },
    input: [
      '1. Browsing Ideas',
      'View all: Ideas appear as cards in a grid',
      'Search: Type keywords to filter (like "client" or "dashboard")',
      'Click card: Opens the full idea details'
    ],
    process: [
      '2. What Each Idea Contains',
      'When you open an idea, you see:',
      '',
      'Title and Description: What the product is',
      'Problem Statement: What problem it solves',
      'Target Users: Who will use it',
      'User Stories: What users can do',
      'Acceptance Criteria: How to know it works',
      'Technical Notes: Implementation details'
    ],
    output: [
      '3. Using Ideas',
      'You can:',
      '',
      'Edit: Click Edit button to change any section',
      'Delete: Click Delete button (requires confirmation)',
      'Create Demo: Use /create-demo from @product-idea {name} in CLI'
    ],
    examples: [
      'View idea → Click "Fitness Tracker" card',
      'Edit idea → Click Edit → Change description → Save',
      'Create demo from idea → /create-demo from @product-idea fitness-tracker'
    ],
    note: [
      '⚠️ Tips',
      '',
      'File location: Ideas are saved as markdown in source/product-idea/',
      'Auto-save: Your edits save automatically',
      'Import new ideas: Use /import-idea command to add from PDF or Confluence'
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
  },
  'demo-projects': {
    overview: 'View and manage your demo projects. Each demo is a collection of HTML pages built from design system components. Demos include auto-generated specification documents.',
    workflow: {
      steps: ['Browse Demos', 'Open Project', 'Preview Pages', 'View Spec'],
      description: 'See all demos → Click to open → Preview HTML pages → Read the specification'
    },
    input: [
      '1. Browsing Demos',
      'View all: Demos appear as cards in a grid',
      'Click card: Opens project details',
      'See info: Each card shows page count and components used'
    ],
    process: [
      '2. Project Contents',
      'Each demo project includes:',
      '',
      'HTML Pages: Standalone pages in the pages/ folder',
      'Specification: Documentation in the spec/ folder',
      'Components List: Shows which design system parts were used',
      'Creation Date: When the demo was generated'
    ],
    output: [
      '3. Working with Demos',
      'You can:',
      '',
      'Preview pages: Click any page link to open it in browser',
      'View spec: Click "View Spec" button to see documentation',
      'Create new: Use /create-demo command in CLI',
      'Fix issues: Use /fix-demo {name}: {issue} in CLI'
    ],
    examples: [
      'Preview page → Click "Client Portal" → Click "login.html"',
      'View spec → Click demo → "View Spec" button',
      'Create new → /create-demo my-project',
      'Fix bug → /fix-demo my-project: button not aligned'
    ],
    note: [
      '⚠️ Tips',
      '',
      'File location: Demos are saved in source/demo/{project-name}/',
      'Plain HTML: Demo pages are HTML files, not React',
      'Auto documentation: Specs are generated automatically when you create a demo'
    ]
  }
}

const guideContent: Record<Exclude<TabType, 'use-webapp'>, GuideSection> = {
  'train-agent': {
    overview: 'Improve your AI agents with AGIA (Agent Intelligence Architect). This tool helps you find problems in agent instructions, fix unclear wording, and make agents work more reliably.',
    workflow: {
      steps: ['Choose Agent', 'Run Audit', 'Review Report', 'Apply Fixes', 'Verify Results'],
      description: 'How AGIA works: You select an agent → AGIA analyzes it → You get a detailed report → AGIA suggests improvements → You approve changes.'
    },
    input: [
      '1. Available Commands',
      'Type these in the chat to use AGIA:',
      '',
      'Audit one agent → @agia audit {agent-name}',
      'Check all documentation → @agia audit system files',
      'Update docs after adding agent → @agia sync after adding {agent-name}',
      'Full system check → @agia full audit'
    ],
    process: [
      '2. What AGIA Does',
      'When you run an audit, AGIA performs 5 steps automatically:',
      '',
      'Step 1 - Deconstruct: Breaks down the agent into parts (logic, rules, output format)',
      'Step 2 - Audit: Finds problems like unclear instructions or missing error handling',
      'Step 3 - Synthesize: Rewrites the agent with clear, structured instructions',
      'Step 4 - Simulate: Tests the new version with different scenarios',
      'Step 5 - Iterate: Fixes any remaining issues until all tests pass'
    ],
    output: [
      '3. What You Receive',
      'After the audit completes, you get:',
      '',
      'Audit Report: List of problems found with severity levels (High/Medium/Low)',
      'Improved Agent: The rewritten agent code, ready to use',
      'Comparison Table: Side-by-side view of before and after changes',
      'Test Results: Shows which scenarios pass or fail'
    ],
    examples: [
      '@agia audit import-design-by-image',
      '@agia audit system files',
      '@agia sync after adding doc-writer',
      '@agia full audit'
    ],
    note: [
      '⚠️ Important Tips',
      '',
      'Always backup: AGIA creates a backup before making changes',
      'Approval required: You must approve all changes before they are applied',
      'Safe to use: AGIA never changes the core purpose of an agent without your permission'
    ]
  },
  'edit-app': {
    overview: 'Build new features or fix bugs in the main application. You describe what you want, and AI agents handle the coding automatically.',
    workflow: {
      steps: ['Scout', 'Planner', 'Designer', 'Implementer'],
      description: 'How it works: You give a command → Scout finds relevant files → Planner creates a plan → Designer suggests UI (if needed) → Implementer writes the code.'
    },
    input: [
      '1. How to Start',
      'Use this command to begin:',
      '',
      '/start {describe what you want}',
      '',
      '2. Example Commands',
      'Add a feature → /start Add search to design system page',
      'Fix a bug → /start Fix status toggle not updating',
      'Backend change → /start Add pagination to API'
    ],
    process: [
      '3. What Happens Next',
      'After you send the command, the system works automatically:',
      '',
      'Scout Phase: Scans the codebase to find relevant files and understand the current setup',
      'Planning Phase: Creates a plan file in the plans/ folder (you can review this)',
      'Design Phase: Suggests UI layout if your request involves screens (skipped for backend-only changes)',
      'Implementation Phase: Writes or updates TypeScript/React code in client/ or server/'
    ],
    output: [
      '4. Results',
      'When finished, you receive:',
      '',
      'Updated Code: Your changes are applied to the relevant files',
      'Plan Document: Saved in /plans for reference and auditing',
      'Ready Components: New UI elements work immediately'
    ],
    examples: [
      '/start Add search to design system page',
      '/start Fix status toggle not updating',
      '/start Add pagination to API'
    ],
    note: [
      '⚠️ Best Practices',
      '',
      'Be specific: "Fix Toggle button on Dashboard not changing color" is better than "Fix UI bug"',
      'Main app only: Use this for client/ and server/ code, not for demo projects',
      'Review plans: Check the /plans folder to see what the AI will do before it starts'
    ]
  },
  'create-demos': {
    overview: 'Create demo projects quickly using your design system components. Demos are standalone HTML pages perfect for presentations, client reviews, or prototyping.',
    workflow: {
      steps: ['Create Folder', 'Scout Components', 'Plan Pages', 'Build HTML', 'Generate Spec'],
      description: 'How it works: You name your project → System creates folder structure → Finds available components → Builds HTML pages → Creates documentation automatically.'
    },
    input: [
      '1. Commands',
      'Use these commands to create or fix demos:',
      '',
      'Create new demo → /create-demo {project-name}',
      'Create from idea → /create-demo from @product-idea {idea-name}',
      'Fix existing demo → /fix-demo {project-name}: {issue description}'
    ],
    process: [
      '2. Creation Process',
      'When you create a demo, the system:',
      '',
      'Creates Folder: Sets up source/demo/{project-name}/ with subfolders',
      'Finds Components: Scans your design system for available buttons, cards, forms, etc.',
      'Plans Pages: Decides which pages to create and what components to use',
      'Builds HTML: Creates standalone HTML files with Tailwind CSS styling',
      'Writes Spec: Generates a specification document describing the demo'
    ],
    output: [
      '3. What You Get',
      'After creation, your demo includes:',
      '',
      'Project Folder: Located at source/demo/{project-name}/',
      'HTML Pages: In the pages/ subfolder, ready to open in browser',
      'Spec Document: In the spec/ subfolder for documentation'
    ],
    examples: [
      '/create-demo client-portal',
      '/create-demo from @product-idea fitness-tracker',
      '/fix-demo hello-world: button not aligned'
    ],
    note: [
      '⚠️ Good to Know',
      '',
      'HTML only: Demo files are plain HTML, not React components',
      'Uses your design system: All demos use components from source/design-system/',
      'Describe issues clearly: When fixing, include the specific problem like "button not aligned"'
    ]
  }
}

const useWebappContent: GuideSection = {
  overview: 'Access all your project resources in one place. The web app runs at http://localhost:3000 after you start the development server with npm run dev.',
  workflow: {
    steps: ['Design System', 'Product Ideas', 'Spec Templates', 'Demo Projects'],
    description: 'Four main sections: Components you can copy → Ideas you can develop → Templates you can use → Demos you can preview'
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
    'Product Ideas: Manage requirements and feature specifications',
    'Spec Templates: Use ready-made document templates',
    'Demo Projects: Preview and manage generated demo pages'
  ],
  output: [
    '3. Common Workflows',
    '',
    'Build a Demo: Import components → Create idea → Generate demo → Review',
    'Copy Component: Design System → Click component → Copy code → Paste',
    'Create Documentation: Spec Templates → Copy template → Fill placeholders',
    'Review Demo: Demo Projects → Click project → Preview pages'
  ],
  examples: [
    'Copy a button → Design System → "Button" → HTML tab → Copy',
    'Edit an idea → Product Ideas → Click idea → Edit → Save',
    'Preview demo → Demo Projects → Click project → Click page link'
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
