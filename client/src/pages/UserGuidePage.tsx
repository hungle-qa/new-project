import { useState } from 'react'
import { BookOpen, Code, Layers, Monitor, AlertCircle, Palette, Lightbulb, FileText, Layout as LayoutIcon } from 'lucide-react'

type TabType = 'edit-app' | 'create-demos' | 'use-webapp'
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
  { id: 'edit-app', label: 'Edit App', icon: Code },
  { id: 'create-demos', label: 'Create Demos', icon: Layers },
  { id: 'use-webapp', label: 'Use Web App', icon: Monitor },
]

const webAppSubTabs: { id: WebAppSubTab; label: string; icon: typeof Palette }[] = [
  { id: 'design-system', label: 'Design System', icon: Palette },
  { id: 'product-ideas', label: 'Product Ideas', icon: Lightbulb },
  { id: 'spec-templates', label: 'Spec Templates', icon: FileText },
  { id: 'demo-projects', label: 'Demo Projects', icon: LayoutIcon },
]

const webAppSubTabContent: Record<WebAppSubTab, GuideSection> = {
  'design-system': {
    overview: 'Browse and manage reusable UI components from the design system. View live previews, copy HTML/CSS code, and manage component status.',
    workflow: {
      steps: ['Browse', 'Search', 'Click', 'Switch tabs', 'Copy', 'Change status'],
      description: 'Component browsing and usage workflow'
    },
    input: [
      'Browse components - Scroll grid or use search',
      'Search - Type component name to filter',
      'View preview - Click component card',
      'Copy code - Click HTML/CSS/Full Code tab → Copy button',
      'Change status - Click status badge to cycle',
      'Filter by status - Use status filter chips'
    ],
    process: [
      'Component library displays all components',
      'Preview tab shows live render',
      'HTML tab shows markup with syntax highlighting',
      'CSS tab shows stylesheet code',
      'Full Code tab shows combined HTML + CSS',
      'Status badges: Active/Draft/Inactive'
    ],
    output: [
      'Copied HTML code for component',
      'Copied CSS styles for component',
      'Updated component status',
      'Filtered component list'
    ],
    examples: [
      'Copy Button component: Click "Button" → HTML tab → Copy → Paste in demo',
      'Change Card status: Click "Card" → Click status badge → Select "Active"',
      'Search components: Type "nav" → See Navigation Bar results',
      'Copy full code: Click component → Full Code tab → Copy button'
    ],
    note: [
      'All components are HTML-based, not React',
      'Status changes save automatically',
      'Search filters by component name',
      'Copy button available in all code tabs'
    ]
  },
  'product-ideas': {
    overview: 'Manage product requirements and feature ideas. View, edit, and organize product concepts with detailed information including user stories and acceptance criteria.',
    workflow: {
      steps: ['View grid', 'Search', 'Click', 'Edit', 'Import new'],
      description: 'Product idea management workflow'
    },
    input: [
      'View all ideas - Grid displays idea cards',
      'Search ideas - Type in search box to filter',
      'View details - Click idea card for full view',
      'Edit/Delete - Use buttons on detail view',
      'Import new - Use /import-idea command from CLI'
    ],
    process: [
      'Grid view shows all product ideas',
      'Title and description header',
      'Problem statement section',
      'Target users information',
      'User stories with details',
      'Acceptance criteria list',
      'Technical notes and considerations'
    ],
    output: [
      'Product idea details for review',
      'Edited and saved idea information',
      'Requirements ready for demo generation',
      'Filtered and searched ideas'
    ],
    examples: [
      'View idea: Click "Fitness Tracker" card → See full details',
      'Edit idea: Click idea → Edit button → Modify description → Save',
      'Search: Type "client" → See all client-related ideas',
      'Delete: Click idea → Delete button → Confirm'
    ],
    note: [
      'Ideas stored as markdown files in source/product-ideas/',
      'Changes save automatically',
      'Use ideas as input for /create-demo from @product-idea',
      'Import ideas from PDF/Confluence using CLI commands'
    ]
  },
  'spec-templates': {
    overview: 'Browse and manage reusable specification templates. Templates provide structured formats with placeholders for quick documentation creation.',
    workflow: {
      steps: ['Browse', 'Click', 'Expand', 'Copy', 'Import'],
      description: 'Template browsing and usage workflow'
    },
    input: [
      'Browse templates - Scroll template list',
      'Preview template - Click template card',
      'View sections - Expand collapsible sections',
      'Copy template - Click Copy button',
      'Import new - Use /import-spec-template command'
    ],
    process: [
      'Template library displays all templates',
      'Section headers (H1, H2, H3) for structure',
      'Placeholder fields like {name}, {date}, {version}',
      'Tables and lists for organized content',
      'Instructions and comments for guidance',
      'Markdown formatting preserved'
    ],
    output: [
      'Copied template content',
      'Reusable formats for documentation',
      'Structured spec ready for customization',
      'Template with placeholders to fill'
    ],
    examples: [
      'Copy template: Click "PRD Template" → Copy button → Paste in editor',
      'View sections: Click template → Expand sections → Review structure',
      'Use template: Copy → Replace {name} with project → Fill sections',
      'Import: CLI → /import-spec-template → Use in app'
    ],
    note: [
      'Templates stored in source/spec-templates/',
      'Placeholders use {bracketed} format',
      'Templates are markdown files',
      'Reusable across multiple projects'
    ]
  },
  'demo-projects': {
    overview: 'View and manage generated demo projects. Each demo contains HTML pages built from design system components with auto-generated specifications.',
    workflow: {
      steps: ['Browse', 'Click', 'Preview pages', 'View spec', 'Create/Fix'],
      description: 'Demo project management workflow'
    },
    input: [
      'Browse demos - Grid displays demo cards',
      'View demo info - Click demo card',
      'Preview pages - Click page links to open',
      'View spec - Click View Spec button',
      'Create new - Use /create-demo command',
      'Fix issues - Use /fix-demo {name}: {issue}'
    ],
    process: [
      'Demo grid shows all projects',
      'Project name and page count displayed',
      'Components used list shows dependencies',
      'Creation date for tracking',
      'Quick preview links for each page',
      'Spec document link for documentation'
    ],
    output: [
      'HTML pages viewable in browser',
      'Specification documents',
      'List of components used',
      'Ready-to-deploy demo projects'
    ],
    examples: [
      'Preview demo: Click "Client Portal" → Click "login.html" → Opens in tab',
      'View spec: Click demo → View Spec button → See documentation',
      'Create demo: CLI → /create-demo my-app → View in app',
      'Fix demo: CLI → /fix-demo my-app: button not aligned'
    ],
    note: [
      'Demos stored in source/demo/ directory',
      'Each demo has pages/ and spec/ folders',
      'HTML pages use design system components',
      'Specs auto-generated during creation',
      'Use /create-demo from @product-idea to build from idea'
    ]
  }
}

const guideContent: Record<TabType, GuideSection> = {
  'edit-app': {
    overview: 'Guide to edit the main BA Demo Tool application using Claude agents. Use this workflow for React/TypeScript changes in client/ and server/ directories.',
    workflow: {
      steps: ['/start', 'scout', 'planner', 'designer', 'implementer'],
      description: 'Full workflow for app development'
    },
    input: [
      'Feature description or bug report',
      'Use /start {description} command'
    ],
    process: [
      'Scout searches client/src/ and server/ for context',
      'Planner creates implementation plan in plans/',
      'Designer suggests UI/UX (if applicable)',
      'Implementer writes TypeScript code'
    ],
    output: [
      'Modified files in client/ or server/',
      'Implementation plan in plans/ folder',
      'TypeScript/React components'
    ],
    examples: [
      '/start Add search to design system page',
      '/start Fix status toggle not updating',
      '/start Add pagination to API'
    ],
    note: [
      'Designer step skipped automatically for non-UI changes',
      'This workflow is for main app only, not demos'
    ]
  },
  'create-demos': {
    overview: 'Guide to create and manage demo projects. Demos are HTML pages built using design system components, stored in source/demo/.',
    workflow: {
      steps: ['/create-demo', 'scout', 'planner', 'designer', 'implementer', 'write-spec'],
      description: 'Full workflow for demo creation'
    },
    input: [
      'Project name or product idea reference',
      '/create-demo {name} - create new demo',
      '/create-demo from @product-idea {name} - create from idea',
      '/fix-demo {name} - fix existing demo'
    ],
    process: [
      'Creates folder in source/demo/{name}/',
      'Scouts design system components',
      'Plans demo pages structure',
      'Builds HTML pages using components',
      'Generates specification document'
    ],
    output: [
      'Demo project in source/demo/{name}/',
      'HTML pages in pages/ subfolder',
      'Generated spec in spec/ folder'
    ],
    examples: [
      '/create-demo client-portal',
      '/create-demo from @product-idea fitness-tracker',
      '/fix-demo hello-world: button not aligned'
    ],
    note: [
      'Demo files are HTML, not React',
      'Uses design system components from source/design-system/',
      'Use /fix-demo {name}: {issue} to describe specific problems'
    ]
  },
  'use-webapp': {
    overview: `The BA Demo Tool web app provides a unified interface for managing design system components, product ideas, spec templates, and demo projects.

**Access:** http://localhost:3000 (after running npm run dev)

**Main Pages:**
• Design System - Browse/manage UI components
• Product Ideas - View/edit product requirements
• Spec Templates - Manage specification templates
• Demo Projects - Preview generated demos`,
    workflow: {
      steps: ['Flow 1: Build Demo from Scratch', 'Flow 2: Copy Component', 'Flow 3: Create Spec from Demo', 'Flow 4: Manage Ideas'],
      description: 'Common user flows for different use cases'
    },
    input: [
      '**Design System Page:** Browse components - Scroll grid or search',
      'Search - Type to filter by name',
      'View preview - Click component card',
      'Copy HTML/CSS - Click tab → Copy button',
      'Change status - Click status badge',
      'Filter by status - Use filter chips',
      '',
      '**Product Ideas Page:** View all ideas - Grid displays cards',
      'Search ideas - Type in search box',
      'View details - Click idea card',
      'Edit/Delete - Buttons on detail view',
      'Import new - Use /import-idea command',
      '',
      '**Spec Templates Page:** Browse templates - Scroll list',
      'Preview template - Click card',
      'Copy template - Click Copy button',
      'View sections - Expand collapsibles',
      'Import new - Use /import-spec-template',
      '',
      '**Demo Projects Page:** Browse demos - Grid displays cards',
      'View demo info - Click demo card',
      'Preview pages - Click page links',
      'View spec - Click View Spec button',
      'Create new - Use /create-demo',
      'Fix issues - Use /fix-demo'
    ],
    process: [
      '**Design System Features:**',
      'Preview tab - Live render of component',
      'HTML tab - Markup with syntax highlighting',
      'CSS tab - Stylesheet code',
      'Full Code tab - Combined HTML + CSS',
      'Status badges - Active/Draft/Inactive',
      '',
      '**Product Ideas Features:**',
      'Title and description header',
      'Problem statement section',
      'Target users info',
      'User stories list',
      'Acceptance criteria',
      'Technical notes',
      '',
      '**Spec Templates Features:**',
      'Section headers (H1, H2, H3)',
      'Placeholder fields ({name}, {date})',
      'Tables and lists',
      'Instructions/comments',
      '',
      '**Demo Projects Features:**',
      'Project name and page count',
      'Components used list',
      'Creation date',
      'Quick preview links',
      'Spec document link'
    ],
    output: [
      '**Design System** → Copy code for use in demos or external projects',
      '**Product Ideas** → Requirements ready for demo generation',
      '**Spec Templates** → Reusable formats for documentation',
      '**Demo Projects** → HTML pages + specification documents'
    ],
    examples: [
      'Copy Button component: Design System → Click "Button" → HTML tab → Copy → Paste in demo',
      'Edit product idea: Product Ideas → Click idea → Edit button → Modify → Save',
      'Preview demo page: Demo Projects → Click demo → Click page link → Opens in new tab',
      'Use spec template: Spec Templates → Click template → Copy → Use for new spec'
    ],
    note: [
      'All data is stored as markdown files in source/ directory for easy version control',
      'Changes made in the app are saved automatically',
      'Flow 1: Build Demo from Scratch → Import Components → Create Product Idea → Generate Demo → Review & Fix',
      'Flow 2: Copy Component → Design System → Select Component → Copy HTML/CSS → Paste to Project',
      'Flow 3: Create Spec from Demo → Create Demo → Auto-generates spec → View Spec → Export',
      'Flow 4: Manage Ideas → Import from PDF/Confluence → Review in App → Edit → Use in Demo'
    ]
  }
}

export function UserGuidePage() {
  const [activeTab, setActiveTab] = useState<TabType>('edit-app')
  const [activeWebAppSubTab, setActiveWebAppSubTab] = useState<WebAppSubTab>('design-system')

  const content = activeTab === 'use-webapp'
    ? webAppSubTabContent[activeWebAppSubTab]
    : guideContent[activeTab]

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
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {content.input.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </Section>

        {/* Process */}
        <Section title="Process">
          <ol className="list-decimal list-inside space-y-1 text-gray-700">
            {content.process.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ol>
        </Section>

        {/* Output */}
        <Section title="Output">
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {content.output.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
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
          <ul className="space-y-1 text-gray-700">
            {content.note.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                {item}
              </li>
            ))}
          </ul>
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
