import { Router } from 'express'
import { AIService } from '../services/AIService'

const router = Router()

// Test AI connection
router.post('/test', async (req, res) => {
  try {
    const apiKey = req.headers['x-ai-api-key'] as string
    const { model } = req.body

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        error: 'API key is required'
      })
    }

    const success = await AIService.testConnection({
      provider: 'gemini',
      apiKey,
      model: model || 'gemini-2.0-flash',
    })

    res.json({ success })
  } catch (error) {
    console.error('AI test error:', error)
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Connection test failed'
    })
  }
})

// List available AI models
router.get('/models', async (req, res) => {
  try {
    const apiKey = req.headers['x-ai-api-key'] as string

    if (!apiKey) {
      return res.status(400).json({
        success: false,
        error: 'API key is required'
      })
    }

    const models = await AIService.listModels(apiKey)
    res.json({ success: true, models })
  } catch (error) {
    console.error('AI models error:', error)
    res.status(400).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch models'
    })
  }
})

export default router
