import { useState } from 'react'
import { BookOpen, AlertCircle } from 'lucide-react'
import {
  type TabType,
  type WebAppSubTab,
  type GuideSection,
  tabs,
  webAppSubTabs,
  webAppSubTabContent,
  guideContent,
  useWebappContent
} from './user-guide/guideData'

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
