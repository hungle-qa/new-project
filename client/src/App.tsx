import { Routes, Route } from 'react-router-dom'
import { Layout } from './components/Layout'
import { HomePage } from './pages/HomePage'
import { DesignSystemPage } from './pages/DesignSystemPage'
import { ProductIdeasPage } from './pages/ProductIdeasPage'
import { DemosPage } from './pages/DemosPage'
import { DemoPreviewPage } from './pages/DemoPreviewPage'
import { UserGuidePage } from './pages/UserGuidePage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/design-system" element={<DesignSystemPage />} />
        <Route path="/product-ideas" element={<ProductIdeasPage />} />
        <Route path="/demos" element={<DemosPage />} />
        <Route path="/demos/:name/preview" element={<DemoPreviewPage />} />
        <Route path="/user-guide" element={<UserGuidePage />} />
      </Routes>
    </Layout>
  )
}

export default App
