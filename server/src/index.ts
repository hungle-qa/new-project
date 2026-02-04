import express from 'express'
import cors from 'cors'
import path from 'path'

import designSystemRoutes from './routes/design-system'
import productIdeaRoutes from './routes/product-idea'
import specTemplateRoutes from './routes/spec-template'
import demoRoutes from './routes/demo'

const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// API Routes
app.use('/api/design-system', designSystemRoutes)
app.use('/api/product-idea', productIdeaRoutes)
app.use('/api/spec-template', specTemplateRoutes)
app.use('/api/demo', demoRoutes)

// Serve static files from source folder
app.use('/source', express.static(path.join(__dirname, '../../source')))

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
