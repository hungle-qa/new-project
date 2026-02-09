import { Link } from 'react-router-dom'
import { Palette, ClipboardCheck, Brain } from 'lucide-react'

const features = [
  {
    title: 'Design System',
    description: 'Import and manage HTML/CSS components',
    icon: Palette,
    path: '/design-system',
    color: 'bg-blue-500',
  },
  {
    title: 'Review Testcase',
    description: 'Manage features and review generated testcases',
    icon: ClipboardCheck,
    path: '/review-testcase',
    color: 'bg-yellow-500',
  },
  {
    title: 'Feature Knowledge',
    description: 'Import and manage AI-structured knowledge docs',
    icon: Brain,
    path: '/feature-knowledge',
    color: 'bg-purple-500',
  },
]

export function HomePage() {
  return (
    <div>
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">QA Kit</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Import design components, configure features, and generate QA testcases.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map(({ title, description, icon: Icon, path, color }) => (
          <Link
            key={path}
            to={path}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-4`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </Link>
        ))}
      </div>

      <div className="mt-12 bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Workflow</h2>
        <div className="flex items-center justify-center gap-4 text-sm">
          <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg">Import Components</span>
          <span className="text-gray-400">→</span>
          <span className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg">Configure Feature</span>
          <span className="text-gray-400">→</span>
          <span className="px-4 py-2 bg-green-100 text-green-800 rounded-lg">Import Spec</span>
          <span className="text-gray-400">→</span>
          <span className="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg">Generate Testcases</span>
        </div>
      </div>
    </div>
  )
}
