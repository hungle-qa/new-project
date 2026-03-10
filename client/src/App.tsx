import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { ToastProvider } from './hooks/useToast'
import { HomePage } from './pages/HomePage'
import { DesignSystemPage } from './pages/DesignSystemPage'
import { TestcaseManagerPage } from './pages/TestcaseManagerPage'
import { FeatureKnowledgePage } from './pages/FeatureKnowledgePage'
import { UserGuidePage } from './pages/UserGuidePage'

function App() {
  return (
    <ToastProvider>
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/design-system" element={<DesignSystemPage />} />
        <Route path="/testcase" element={<TestcaseManagerPage />} />
        <Route path="/review-testcase" element={<Navigate to="/testcase" replace />} />
        <Route path="/feature-knowledge" element={<FeatureKnowledgePage />} />

        <Route path="/user-guide" element={<UserGuidePage />} />
      </Routes>
    </Layout>
    </ToastProvider>
  )
}

export default App
