import { Router } from 'express'
import multer from 'multer'
import { ProductIdeaService } from '../services/ProductIdeaService'

const router = Router()

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'text/markdown']
    const allowedExtensions = ['.pdf', '.md']

    const isValidType = allowedTypes.includes(file.mimetype)
    const isValidExtension = allowedExtensions.some(ext => file.originalname.endsWith(ext))

    if (isValidType || isValidExtension) {
      cb(null, true)
    } else {
      cb(new Error('Only PDF and Markdown files are allowed'))
    }
  },
})

router.get('/', async (req, res) => {
  try {
    const items = await ProductIdeaService.getAll()
    res.json(items)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product ideas' })
  }
})

router.get('/:name', async (req, res) => {
  try {
    const item = await ProductIdeaService.getByName(req.params.name)
    if (!item) {
      return res.status(404).json({ error: 'Product idea not found' })
    }
    res.json(item)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product idea' })
  }
})

router.post('/', async (req, res) => {
  try {
    const result = await ProductIdeaService.create(req.body)
    res.status(201).json(result)
  } catch (error) {
    res.status(400).json({ error: 'Failed to create product idea' })
  }
})

router.delete('/:name', async (req, res) => {
  try {
    const success = await ProductIdeaService.delete(req.params.name)
    if (!success) {
      return res.status(404).json({ error: 'Product idea not found' })
    }
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product idea' })
  }
})

router.post('/import', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    // Get AI config and product name from headers
    const apiKey = req.headers['x-ai-api-key'] as string
    const model = req.headers['x-ai-model'] as string
    const productName = req.headers['x-product-name'] as string | undefined

    if (!apiKey) {
      return res.status(400).json({
        error: 'AI API key not configured. Please set up AI settings first.'
      })
    }

    const aiConfig = {
      provider: 'gemini' as const,
      apiKey,
      model: model || 'gemini-2.0-flash',
    }

    const result = await ProductIdeaService.importFromFile(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      aiConfig,
      productName
    )

    res.status(201).json({
      success: true,
      name: result.name,
      path: result.path,
    })
  } catch (error) {
    console.error('Import route error:', error)
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Failed to import product idea',
    })
  }
})

export default router
