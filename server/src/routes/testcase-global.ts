import { Router } from 'express'
import { TestcaseConfigService } from '../services/TestcaseConfigService'

const router = Router()

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

export default router
