import { Router } from 'express'
import multer from 'multer'
import { FeatureKnowledgeService } from '../services/FeatureKnowledgeService'

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

// List all knowledge items
router.get('/', async (_req, res) => {
  try {
    const items = await FeatureKnowledgeService.getAll()
    res.json(items)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch knowledge items' })
  }
})

// Get default prompt
router.get('/default-prompt', async (_req, res) => {
  try {
    const prompt = await FeatureKnowledgeService.getDefaultPrompt()
    res.json({ prompt })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch default prompt' })
  }
})

// Save default prompt
router.put('/default-prompt', async (req, res) => {
  try {
    const { prompt } = req.body
    if (typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required' })
    }
    await FeatureKnowledgeService.saveDefaultPrompt(prompt)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to save default prompt' })
  }
})

// Create knowledge item
router.post('/', async (req, res) => {
  try {
    const { name } = req.body
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ error: 'Knowledge name is required' })
    }
    const sanitized = name.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')
    const result = await FeatureKnowledgeService.create(sanitized)
    res.status(201).json(result)
  } catch (error) {
    res.status(400).json({ error: 'Failed to create knowledge item' })
  }
})

// Get knowledge item
router.get('/:name', async (req, res) => {
  try {
    const item = await FeatureKnowledgeService.getByName(req.params.name)
    if (!item) {
      return res.status(404).json({ error: 'Knowledge item not found' })
    }
    res.json(item)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch knowledge item' })
  }
})

// Delete knowledge item
router.delete('/:name', async (req, res) => {
  try {
    const success = await FeatureKnowledgeService.delete(req.params.name)
    if (!success) {
      return res.status(404).json({ error: 'Knowledge item not found' })
    }
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete knowledge item' })
  }
})

// Update prompt
router.put('/:name/prompt', async (req, res) => {
  try {
    const { prompt } = req.body
    if (typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required' })
    }
    const success = await FeatureKnowledgeService.updatePrompt(req.params.name, prompt)
    if (!success) {
      return res.status(404).json({ error: 'Knowledge item not found' })
    }
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update prompt' })
  }
})

// Update knowledge content
router.put('/:name/content', async (req, res) => {
  try {
    const { content } = req.body
    if (typeof content !== 'string') {
      return res.status(400).json({ error: 'Content is required' })
    }
    const success = await FeatureKnowledgeService.updateContent(req.params.name, content)
    if (!success) {
      return res.status(404).json({ error: 'Knowledge item not found' })
    }
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to update content' })
  }
})

// Delete a single source file from knowledge item
router.delete('/:name/files/:filename', async (req, res) => {
  try {
    const success = await FeatureKnowledgeService.deleteFile(req.params.name, req.params.filename)
    if (!success) {
      return res.status(404).json({ error: 'File not found' })
    }
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete file' })
  }
})

// Import knowledge (upload file + AI processing or save original)
router.post('/:name/import', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    const skipAi = req.body?.skipAi === 'true'
    const apiKey = req.headers['x-ai-api-key'] as string
    const model = req.headers['x-ai-model'] as string

    if (!skipAi && !apiKey) {
      return res.status(400).json({ error: 'AI API key not configured' })
    }

    const customPrompt = req.body.prompt || 'Keep the original content exactly as-is. Only convert to clean, well-formatted markdown that is easy to read. Do not summarize, rewrite, or omit any content.'

    const aiConfig = {
      provider: 'gemini' as const,
      apiKey: apiKey || '',
      model: model || 'gemini-2.0-flash',
    }

    const result = await FeatureKnowledgeService.importKnowledge(
      req.params.name,
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      customPrompt,
      aiConfig,
      skipAi
    )

    res.status(201).json({ success: true, ...result })
  } catch (error) {
    res.status(400).json({
      error: error instanceof Error ? error.message : 'Failed to import knowledge',
    })
  }
})

export default router
