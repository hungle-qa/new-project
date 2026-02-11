import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { DesignSystemPage } from './pages/DesignSystemPage'
import { TestcaseManagerPage } from './pages/TestcaseManagerPage'
import { FeatureKnowledgePage } from './pages/FeatureKnowledgePage'
import { UserGuidePage } from './pages/UserGuidePage'

function App() {
  return (
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
  )
}

export default App
