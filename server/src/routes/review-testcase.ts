import { Router } from 'express'
import multer from 'multer'
import { ReviewTestcaseService } from '../services/ReviewTestcaseService'

const router = Router()

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowedExtensions = ['.pdf', '.md', '.txt']
    const isValid = allowedExtensions.some(ext => file.originalname.toLowerCase().endsWith(ext))
    if (isValid) {
      cb(null, true)
    } else {
      cb(new Error('Only PDF, Markdown, and TXT files are allowed'))
    }
  },
})

// --- Global Rules ---
router.get('/rules', async (_req, res) => {
  try {
    const content = await ReviewTestcaseService.getRules()
    res.json({ content })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rules' })
  }
})

router.put('/rules', async (req, res) => {
  try {
    const { content } = req.body
    if (typeof content !== 'string') {
      return res.status(400).json({ error: 'Content is required' })
    }
    await ReviewTestcaseService.saveRules(content)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to save rules' })
  }
})

// --- Global Template ---
router.get('/template', async (_req, res) => {
  try {
    const columns = await ReviewTestcaseService.getTemplate()
    res.json(columns)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch template' })
  }
})

router.put('/template', async (req, res) => {
  try {
    const columns = req.body
    if (!Array.isArray(columns)) {
      return res.status(400).json({ error: 'Columns array is required' })
    }
    await ReviewTestcaseService.saveTemplate(columns)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to save template' })
  }
})

// List all features
router.get('/', async (_req, res) => {
  try {
    const features = await ReviewTestcaseService.getAllFeatures()
    res.json(features)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch features' })
  }
})

// Create feature
router.post('/', async (req, res) => {
  try {
    const { name } = req.body
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Feature name is required' })
    }
    const sanitized = name.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')
    const result = await ReviewTestcaseService.createFeature(sanitized)
    res.status(201).json(result)
  } catch (error) {
    res.status(400).json({ error: 'Failed to create feature' })
  }
})

// Get feature config
router.get('/:feature', async (req, res) => {
  try {
    const config = await ReviewTestcaseService.getFeatureConfig(req.params.feature)
    if (!config) {
      return res.status(404).json({ error: 'Feature not found' })
    }
    res.json(config)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feature config' })
  }
})

// Update feature config
router.put('/:feature', async (req, res) => {
  try {
    const updated = await ReviewTestcaseService.updateFeatureConfig(req.params.feature, req.body)
    if (!updated) {
      return res.status(404).json({ error: 'Feature not found' })
    }
    res.json(updated)
  } catch (error) {
    res.status(400).json({ error: 'Failed to update feature config' })
  }
})

// Rename feature
router.put('/:feature/rename', async (req, res) => {
  try {
    const { name } = req.body
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'New name is required' })
    }
    const sanitized = name.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')
    const newName = await ReviewTestcaseService.renameFeature(req.params.feature, sanitized)
    if (!newName) {
      return res.status(400).json({ error: 'Failed to rename. Name may already exist.' })
    }
    res.json({ name: newName })
  } catch (error) {
    res.status(400).json({ error: 'Failed to rename feature' })
  }
})

// Delete feature
router.delete('/:feature', async (req, res) => {
  try {
    const success = await ReviewTestcaseService.deleteFeature(req.params.feature)
    if (!success) {
      return res.status(404).json({ error: 'Feature not found' })
    }
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete feature' })
  }
})

// Import spec (PDF upload + AI)
router.post('/:feature/import-spec', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const apiKey = req.headers['x-ai-api-key'] as string
    const model = req.headers['x-ai-model'] as string

    if (!apiKey) {
      return res.status(400).json({ error: 'AI API key not configured' })
    }

    const aiConfig = {
      provider: 'gemini' as const,
      apiKey,
      model: model || 'gemini-2.0-flash',
    }

    const customPrompt = (req.body?.prompt as string) || ''

    const result = await ReviewTestcaseService.importSpec(
      req.params.feature,
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      customPrompt,
      aiConfig
    )

    res.status(201).json({ success: true, ...result })
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Failed to import spec',
    })
  }
})

// Get imported spec
router.get('/:feature/spec', async (req, res) => {
  try {
    const spec = await ReviewTestcaseService.getSpec(req.params.feature)
    if (!spec) {
      return res.status(404).json({ error: 'No spec found' })
    }
    res.json({ content: spec })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch spec' })
  }
})

// Upload knowledge file
router.post('/:feature/knowledge', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const result = await ReviewTestcaseService.uploadKnowledge(
      req.params.feature,
      req.file.buffer,
      req.file.originalname
    )

    res.status(201).json(result)
  } catch (error) {
    res.status(400).json({ error: 'Failed to upload knowledge file' })
  }
})

// Delete knowledge file
router.delete('/:feature/knowledge/:filename', async (req, res) => {
  try {
    const success = await ReviewTestcaseService.deleteKnowledge(
      req.params.feature,
      req.params.filename
    )
    if (!success) {
      return res.status(404).json({ error: 'Knowledge file not found' })
    }
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete knowledge file' })
  }
})

// List result CSVs
router.get('/:feature/results', async (req, res) => {
  try {
    const results = await ReviewTestcaseService.getResults(req.params.feature)
    res.json(results)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch results' })
  }
})

// Download/get result CSV
router.get('/:feature/results/:filename', async (req, res) => {
  try {
    const content = await ReviewTestcaseService.getResultFile(
      req.params.feature,
      req.params.filename
    )
    if (!content) {
      return res.status(404).json({ error: 'Result file not found' })
    }

    if (req.query.download === 'true') {
      const filePath = ReviewTestcaseService.getResultFilePath(
        req.params.feature,
        req.params.filename
      )
      return res.download(filePath)
    }

    res.json({ content })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch result file' })
  }
})

export default router
