import { useState, useEffect } from 'react'
import { IconManager } from '../components/design-system/IconManager'
import { RulesEditor } from '../components/design-system/RulesEditor'
import { DesignSystemHeader } from './design-system/DesignSystemHeader'
import { ComponentsView } from './design-system/ComponentsView'

type ViewMode = 'components' | 'icons' | 'rules'

export function DesignSystemPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('components')
  const [components, setComponents] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [importHandler, setImportHandler] = useState<(() => void) | null>(null)

  const loadComponents = () => {
    fetch('/api/design-system')
      .then(res => res.json())
      .then(data => {
        // Filter out RULE from components list
        const filtered = data.filter((name: string) => name !== 'RULE')
        setComponents(filtered)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    loadComponents()
  }, [])

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div>
      <DesignSystemHeader
        viewMode={viewMode}
        componentCount={components.length}
        onViewModeChange={setViewMode}
        onImportClick={() => importHandler?.()}
      />

      {viewMode === 'components' ? (
        <ComponentsView
          components={components}
          onComponentsChange={loadComponents}
          onImportModalOpen={setImportHandler}
        />
      ) : viewMode === 'icons' ? (
        /* Icons View */
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden" style={{ minHeight: '600px' }}>
          <IconManager />
        </div>
      ) : (
        /* Rules View */
        <div className="bg-white rounded-lg border border-gray-200 p-6" style={{ minHeight: '600px' }}>
          <RulesEditor />
        </div>
      )}
    </div>
  )
}
