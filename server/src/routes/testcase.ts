import { Router } from 'express'
import multer from 'multer'
import { TestcaseFeatureService } from '../services/TestcaseFeatureService'
import { TestcaseConfigService } from '../services/TestcaseConfigService'
import { TestcaseDigestService } from '../services/TestcaseDigestService'
import { TestcaseDigestLiteService } from '../services/TestcaseDigestLiteService'
import globalRoutes from './testcase-global'

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

// Mount global config routes (rules, template, strategies, default-prompt)
router.use('/', globalRoutes)

// List all features
router.get('/', async (_req, res) => {
  try {
    const features = await TestcaseFeatureService.getAllFeatures()
    res.json(features)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch features' })
  }
})

// Create feature
router.post('/', async (req, res) => {
  try {
    const { name } = req.body
    if (!name || typeof name !== 'string') return res.status(400).json({ error: 'Feature name is required' })
    const sanitized = name.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')
    res.status(201).json(await TestcaseFeatureService.createFeature(sanitized))
  } catch (error) {
    res.status(400).json({ error: 'Failed to create feature' })
  }
})

// Get feature config
router.get('/:feature', async (req, res) => {
  try {
    const config = await TestcaseFeatureService.getFeatureConfig(req.params.feature)
    if (!config) return res.status(404).json({ error: 'Feature not found' })
    res.json(config)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feature config' })
  }
})

// Update feature config
router.put('/:feature', async (req, res) => {
  try {
    const updated = await TestcaseFeatureService.updateFeatureConfig(req.params.feature, req.body)
    if (!updated) return res.status(404).json({ error: 'Feature not found' })
    res.json(updated)
  } catch (error) {
    res.status(400).json({ error: 'Failed to update feature config' })
  }
})

// Rename feature
router.put('/:feature/rename', async (req, res) => {
  try {
    const { name } = req.body
    if (!name || typeof name !== 'string') return res.status(400).json({ error: 'New name is required' })
    const sanitized = name.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')
    const newName = await TestcaseFeatureService.renameFeature(req.params.feature, sanitized)
    if (!newName) return res.status(400).json({ error: 'Failed to rename. Name may already exist.' })
    res.json({ name: newName })
  } catch (error) {
    res.status(400).json({ error: 'Failed to rename feature' })
  }
})

// Delete feature
router.delete('/:feature', async (req, res) => {
  try {
    const success = await TestcaseFeatureService.deleteFeature(req.params.feature)
    if (!success) return res.status(404).json({ error: 'Feature not found' })
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete feature' })
  }
})

// --- Per-feature Digest ---
router.get('/:feature/digest-status', async (req, res) => {
  try { res.json(await TestcaseDigestService.checkDigestFreshness(req.params.feature)) }
  catch (error) { res.status(500).json({ error: 'Failed to check digest status' }) }
})

router.post('/:feature/context-digest', async (req, res) => {
  try {
    const { warnings } = await TestcaseDigestService.generateContextDigest(req.params.feature)
    res.json({ success: true, warnings })
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to generate context digest' })
  }
})

router.post('/:feature/context-digest-lite', async (req, res) => {
  try { res.json(await TestcaseDigestLiteService.generateContextDigestLite(req.params.feature)) }
  catch (error) { res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to generate context digest lite' }) }
})

router.get('/:feature/context-digest-lite/status', async (req, res) => {
  try { res.json(await TestcaseDigestLiteService.checkDigestLiteFreshness(req.params.feature)) }
  catch (error) { res.status(500).json({ error: 'Failed to check digest lite status' }) }
})

// --- Per-feature Rules/Template Status ---
router.get('/:feature/rules/status', async (req, res) => {
  try { res.json(await TestcaseConfigService.checkRulesCustomized(req.params.feature)) }
  catch (error) { res.status(500).json({ error: 'Failed to check rules status' }) }
})

router.get('/:feature/template/status', async (req, res) => {
  try { res.json(await TestcaseConfigService.checkTemplateCustomized(req.params.feature)) }
  catch (error) { res.status(500).json({ error: 'Failed to check template status' }) }
})

// --- Per-feature Rules ---
router.get('/:feature/rules', async (req, res) => {
  try { res.json({ content: await TestcaseConfigService.getFeatureRules(req.params.feature) }) }
  catch (error) { res.status(500).json({ error: 'Failed to fetch feature rules' }) }
})

router.put('/:feature/rules', async (req, res) => {
  try {
    if (typeof req.body.content !== 'string') return res.status(400).json({ error: 'Content is required' })
    await TestcaseConfigService.saveFeatureRules(req.params.feature, req.body.content)
    res.json({ success: true })
  } catch (error) { res.status(500).json({ error: 'Failed to save feature rules' }) }
})

// --- Per-feature Template ---
router.get('/:feature/template', async (req, res) => {
  try { res.json(await TestcaseConfigService.getFeatureTemplate(req.params.feature)) }
  catch (error) { res.status(500).json({ error: 'Failed to fetch feature template' }) }
})

router.put('/:feature/template', async (req, res) => {
  try {
    if (!Array.isArray(req.body)) return res.status(400).json({ error: 'Columns array is required' })
    await TestcaseConfigService.saveFeatureTemplate(req.params.feature, req.body)
    res.json({ success: true })
  } catch (error) { res.status(500).json({ error: 'Failed to save feature template' }) }
})

// --- Per-feature Spec Prompt ---
router.get('/:feature/spec-prompt', async (req, res) => {
  try { res.json({ prompt: await TestcaseConfigService.getSpecPrompt(req.params.feature) }) }
  catch (error) { res.status(500).json({ error: 'Failed to fetch spec prompt' }) }
})

router.put('/:feature/spec-prompt', async (req, res) => {
  try {
    if (typeof req.body.prompt !== 'string') return res.status(400).json({ error: 'Prompt is required' })
    await TestcaseConfigService.saveSpecPrompt(req.params.feature, req.body.prompt)
    res.json({ success: true })
  } catch (error) { res.status(500).json({ error: 'Failed to save spec prompt' }) }
})

// Import spec
router.post('/:feature/import-spec', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
    const skipAi = req.body?.skipAi === 'true'
    const apiKey = req.headers['x-ai-api-key'] as string
    const model = req.headers['x-ai-model'] as string
    if (!skipAi && !apiKey) return res.status(400).json({ error: 'AI API key not configured' })

    const result = await TestcaseFeatureService.importSpec(
      req.params.feature, req.file.buffer, req.file.originalname, req.file.mimetype,
      (req.body?.prompt as string) || '',
      { provider: 'gemini' as const, apiKey: apiKey || '', model: model || 'gemini-2.0-flash' },
      skipAi
    )
    res.status(201).json({ success: true, ...result })
  } catch (error) {
    res.status(400).json({ error: error instanceof Error ? error.message : 'Failed to import spec' })
  }
})

// Get spec
router.get('/:feature/spec', async (req, res) => {
  try {
    const spec = await TestcaseFeatureService.getSpec(req.params.feature)
    if (!spec) return res.status(404).json({ error: 'No spec found' })
    res.json({ content: spec })
  } catch (error) { res.status(500).json({ error: 'Failed to fetch spec' }) }
})

// Results
router.get('/:feature/results', async (req, res) => {
  try { res.json(await TestcaseFeatureService.getResults(req.params.feature)) }
  catch (error) { res.status(500).json({ error: 'Failed to fetch results' }) }
})

router.get('/:feature/results/:filename', async (req, res) => {
  try {
    const content = await TestcaseFeatureService.getResultFile(req.params.feature, req.params.filename)
    if (!content) return res.status(404).json({ error: 'Result file not found' })
    if (req.query.download === 'true') {
      return res.download(TestcaseFeatureService.getResultFilePath(req.params.feature, req.params.filename))
    }
    res.json({ content })
  } catch (error) { res.status(500).json({ error: 'Failed to fetch result file' }) }
})

router.delete('/:feature/results/:filename', async (req, res) => {
  try {
    const success = await TestcaseFeatureService.deleteResultFile(req.params.feature, req.params.filename)
    if (!success) return res.status(404).json({ error: 'Result file not found' })
    res.json({ success: true })
  } catch (error) { res.status(500).json({ error: 'Failed to delete result file' }) }
})

export default router
