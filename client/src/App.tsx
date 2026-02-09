import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { DesignSystemPage } from './pages/DesignSystemPage'
import { ReviewTestcasePage } from './pages/ReviewTestcasePage'
import { UserGuidePage } from './pages/UserGuidePage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/design-system" element={<DesignSystemPage />} />
        <Route path="/review-testcase" element={<ReviewTestcasePage />} />

        <Route path="/user-guide" element={<UserGuidePage />} />
      </Routes>
    </Layout>
  )
}

export default App
