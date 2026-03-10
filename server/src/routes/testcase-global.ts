import { Router } from 'express'
import multer from 'multer'
import fs from 'fs/promises'
import path from 'path'
import { TestcaseConfigService } from '../services/TestcaseConfigService'
import { TestcaseLearnService } from '../services/TestcaseLearnService'
import { TestcaseFeatureService } from '../services/TestcaseFeatureService'
import { AIConfig } from '../services/AIService'
import { FEATURE_DIR } from '../services/TestcaseTypes'

const router = Router()

const csvUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (file.originalname.toLowerCase().endsWith('.csv')) {
      cb(null, true)
    } else {
      cb(new Error('Only CSV files are allowed'))
    }
  },
})

// --- Global Rules ---
router.get('/rules', async (_req, res) => {
  try {
    const content = await TestcaseConfigService.getRules()
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
    await TestcaseConfigService.saveRules(content)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to save rules' })
  }
})

// --- Multi-Rule CRUD ---
router.get('/rules/list', async (_req, res) => {
  try {
    res.json(await TestcaseConfigService.listRules())
  } catch (error) {
    res.status(500).json({ error: 'Failed to list rules' })
  }
})

router.get('/rules/:name', async (req, res) => {
  try {
    const content = await TestcaseConfigService.getRule(req.params.name)
    res.json({ content })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch rule' })
  }
})

router.put('/rules/:name', async (req, res) => {
  try {
    if (typeof req.body.content !== 'string') return res.status(400).json({ error: 'Content is required' })
    await TestcaseConfigService.saveRule(req.params.name, req.body.content)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to save rule' })
  }
})

router.post('/rules', async (req, res) => {
  try {
    const { name, content } = req.body
    if (!name || typeof name !== 'string') return res.status(400).json({ error: 'Name is required' })
    const sanitized = name.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')
    await TestcaseConfigService.saveRule(sanitized, content || '')
    res.status(201).json({ name: sanitized })
  } catch (error) {
    res.status(500).json({ error: 'Failed to create rule' })
  }
})

router.put('/rules/:name/rename', async (req, res) => {
  try {
    const { newName } = req.body
    if (!newName || typeof newName !== 'string') return res.status(400).json({ error: 'New name is required' })
    const sanitized = newName.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')
    const success = await TestcaseConfigService.renameRule(req.params.name, sanitized)
    if (!success) return res.status(400).json({ error: 'Failed to rename rule' })
    res.json({ name: sanitized })
  } catch (error) {
    res.status(500).json({ error: 'Failed to rename rule' })
  }
})

router.delete('/rules/:name', async (req, res) => {
  try {
    const success = await TestcaseConfigService.deleteRule(req.params.name)
    if (!success) return res.status(404).json({ error: 'Rule not found' })
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete rule' })
  }
})

// --- Multi-Template CRUD ---
router.get('/templates/list', async (_req, res) => {
  try {
    res.json(await TestcaseConfigService.listTemplates())
  } catch (error) {
    res.status(500).json({ error: 'Failed to list templates' })
  }
})

router.get('/templates/:name', async (req, res) => {
  try {
    const columns = await TestcaseConfigService.getTemplateByName(req.params.name)
    res.json(columns)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch template' })
  }
})

router.put('/templates/:name', async (req, res) => {
  try {
    if (!Array.isArray(req.body)) return res.status(400).json({ error: 'Columns array is required' })
    await TestcaseConfigService.saveTemplateByName(req.params.name, req.body)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to save template' })
  }
})

router.post('/templates', async (req, res) => {
  try {
    const { name, columns } = req.body
    if (!name || typeof name !== 'string') return res.status(400).json({ error: 'Name is required' })
    const sanitized = name.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')
    await TestcaseConfigService.saveTemplateByName(sanitized, columns || [])
    res.status(201).json({ name: sanitized })
  } catch (error) {
    res.status(500).json({ error: 'Failed to create template' })
  }
})

router.put('/templates/:name/rename', async (req, res) => {
  try {
    const { newName } = req.body
    if (!newName || typeof newName !== 'string') return res.status(400).json({ error: 'New name is required' })
    const sanitized = newName.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')
    const success = await TestcaseConfigService.renameTemplate(req.params.name, sanitized)
    if (!success) return res.status(400).json({ error: 'Failed to rename template' })
    res.json({ name: sanitized })
  } catch (error) {
    res.status(500).json({ error: 'Failed to rename template' })
  }
})

router.delete('/templates/:name', async (req, res) => {
  try {
    const success = await TestcaseConfigService.deleteTemplate(req.params.name)
    if (!success) return res.status(404).json({ error: 'Template not found' })
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete template' })
  }
})

// --- Global Template ---
router.get('/template', async (_req, res) => {
  try {
    const columns = await TestcaseConfigService.getTemplate()
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
    await TestcaseConfigService.saveTemplate(columns)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to save template' })
  }
})

// --- Default Spec Prompt ---
router.get('/default-prompt', async (_req, res) => {
  try {
    const prompt = await TestcaseConfigService.getDefaultPrompt()
    res.json({ prompt })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch default prompt' })
  }
})

router.put('/default-prompt', async (req, res) => {
  try {
    const { prompt } = req.body
    if (typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required' })
    }
    await TestcaseConfigService.saveDefaultPrompt(prompt)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to save default prompt' })
  }
})

// --- Strategies ---
router.get('/strategies', async (_req, res) => {
  try {
    const strategies = await TestcaseConfigService.getStrategies()
    res.json(strategies)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch strategies' })
  }
})

router.get('/strategies/:name', async (req, res) => {
  try {
    const content = await TestcaseConfigService.getStrategyContent(req.params.name)
    if (!content) {
      return res.status(404).json({ error: 'Strategy not found' })
    }
    res.json({ content })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch strategy content' })
  }
})

// --- Learn from Testcase ---
router.post('/learn/analyze', csvUpload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'CSV file is required' })
    }

    const apiKey = req.headers['x-ai-api-key'] as string
    if (!apiKey) {
      return res.status(400).json({ error: 'AI API key is required' })
    }

    const aiConfig: AIConfig = {
      provider: 'gemini',
      apiKey,
      model: (req.headers['x-ai-model'] as string) || 'gemini-2.0-flash',
    }

    const csvContent = req.file.buffer.toString('utf-8')
    const { headers, rows } = TestcaseLearnService.parseCsv(csvContent)

    // Load spec if feature is provided
    let spec: string | null = req.body.spec || null
    if (!spec && req.body.feature) {
      try {
        spec = await TestcaseFeatureService.getSpec(req.body.feature)
      } catch { /* no spec available */ }
    }

    const analysis = await TestcaseLearnService.analyzeTestcase(headers, rows, spec, aiConfig)
    res.json(analysis)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Analysis failed'
    const status = message.includes('CSV') || message.includes('at least') ? 400 : 500
    res.status(status).json({ error: message })
  }
})

router.post('/learn/save', async (req, res) => {
  try {
    const { templateName, ruleName, columns, rulesContent } = req.body

    if (!templateName || !ruleName) {
      return res.status(400).json({ error: 'Template name and rule name are required' })
    }
    if (!Array.isArray(columns)) {
      return res.status(400).json({ error: 'Columns array is required' })
    }
    if (typeof rulesContent !== 'string') {
      return res.status(400).json({ error: 'Rules content is required' })
    }

    const sanitizedTemplate = templateName.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')
    const sanitizedRule = ruleName.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-')

    await TestcaseConfigService.saveTemplateByName(sanitizedTemplate, columns)
    await TestcaseConfigService.saveRule(sanitizedRule, rulesContent)

    res.status(201).json({
      template: sanitizedTemplate,
      rule: sanitizedRule,
    })
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to save' })
  }
})

// --- Learn Session (temp data for CLI) ---
const LEARN_SESSION_FILE = '_learn-session.json'

router.post('/learn/session', csvUpload.single('file'), async (req, res) => {
  try {
    const feature = req.body.feature
    if (!feature) return res.status(400).json({ error: 'Feature name is required' })
    if (!req.file) return res.status(400).json({ error: 'CSV file is required' })

    const featureDir = path.join(FEATURE_DIR, feature)
    try { await fs.access(featureDir) } catch {
      return res.status(404).json({ error: `Feature "${feature}" not found` })
    }

    const csvContent = req.file.buffer.toString('utf-8')
    const spec = req.body.spec || null

    const sessionData = { csv: csvContent, spec, createdAt: new Date().toISOString() }
    await fs.writeFile(
      path.join(featureDir, LEARN_SESSION_FILE),
      JSON.stringify(sessionData, null, 2)
    )

    res.status(201).json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error instanceof Error ? error.message : 'Failed to save session' })
  }
})

router.get('/learn/session/:feature', async (req, res) => {
  try {
    const filePath = path.join(FEATURE_DIR, req.params.feature, LEARN_SESSION_FILE)
    const content = await fs.readFile(filePath, 'utf-8')
    res.json(JSON.parse(content))
  } catch {
    res.status(404).json({ error: 'No learn session found' })
  }
})

router.delete('/learn/session/:feature', async (req, res) => {
  try {
    const filePath = path.join(FEATURE_DIR, req.params.feature, LEARN_SESSION_FILE)
    await fs.unlink(filePath)
    res.json({ success: true })
  } catch {
    res.json({ success: true }) // already deleted or doesn't exist — fine
  }
})

export default router
