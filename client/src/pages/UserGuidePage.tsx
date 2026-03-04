import { useState } from 'react'
import { BookOpen } from 'lucide-react'
import {
  type TabType,
  type WebAppSubTab,
  type RichSection,
  tabs,
  webAppSubTabs,
  webAppSubTabContent,
  buildAppContent,
  trainAgentContent,
  commandsContent,
} from './user-guide/guideData'

export function UserGuidePage() {
  const [activeTab, setActiveTab] = useState<TabType>('edit-app')
  const [activeWebAppSubTab, setActiveWebAppSubTab] = useState<WebAppSubTab>('overview')


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

      {/* Rich content for Use Web App and Build App */}
      {activeTab === 'use-webapp' ? (
        <div className="space-y-4">
          {webAppSubTabContent[activeWebAppSubTab].sections.map((section, i) => (
            <RichSectionCard key={i} section={section} />
          ))}
        </div>
      ) : activeTab === 'edit-app' ? (
        <div className="space-y-4">
          {buildAppContent.sections.map((section, i) => (
            <RichSectionCard key={i} section={section} />
          ))}
        </div>
      ) : activeTab === 'train-agent' ? (
        <div className="space-y-4">
          {trainAgentContent.sections.map((section, i) => (
            <RichSectionCard key={i} section={section} />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {commandsContent.sections.map((section, i) => (
            <RichSectionCard key={i} section={section} />
          ))}
        </div>
      )}
    </div>
  )
}

function RichSectionCard({ section }: { section: RichSection }) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 space-y-3">
      {/* Title */}
      <div className="flex items-center gap-2">
        <h2 className="text-base font-semibold text-gray-900">{section.title}</h2>
        {section.upcoming && (
          <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">
            Upcoming
          </span>
        )}
      </div>

      {/* Flow chips */}
      {section.flow && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {section.flow.map((step, i) => (
            <span key={i} className="flex items-center gap-2">
              <span className="px-3 py-1.5 bg-indigo-100 text-indigo-800 rounded-lg font-mono text-xs">
                {step}
              </span>
              {i < section.flow!.length - 1 && (
                <span className="text-gray-400 text-xs">→</span>
              )}
            </span>
          ))}
        </div>
      )}

      {/* Bullets */}
      {section.bullets && (
        <ul className="space-y-2">
          {section.bullets.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-indigo-400 mt-0.5 shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}

      {/* Code block */}
      {section.code && (
        <div className="px-4 py-3 bg-gray-900 rounded-lg font-mono text-sm text-green-400">
          {section.code}
        </div>
      )}

      {/* Pro-tip */}
      {section.protip && (
        <div className="flex items-start gap-2 px-4 py-3 bg-indigo-50 border border-indigo-200 rounded-lg text-sm text-indigo-800">
          <span className="shrink-0 font-semibold">💡 Pro-tip:</span>
          <span>{section.protip}</span>
        </div>
      )}
    </div>
  )
}

