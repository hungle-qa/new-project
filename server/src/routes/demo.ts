import { Router } from 'express'
import { DemoService } from '../services/DemoService'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const items = await DemoService.getAll()
    res.json(items)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch demos' })
  }
})

router.get('/:name', async (req, res) => {
  try {
    const item = await DemoService.getByName(req.params.name)
    if (!item) {
      return res.status(404).json({ error: 'Demo not found' })
    }
    res.json(item)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch demo' })
  }
})

router.get('/:name/pages/:pageName', async (req, res) => {
  try {
    const content = await DemoService.getPage(req.params.name, req.params.pageName)
    if (!content) {
      return res.status(404).json({ error: 'Page not found' })
    }
    res.setHeader('Content-Type', 'text/html')
    res.send(content)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch page' })
  }
})

router.delete('/:name', async (req, res) => {
  try {
    const success = await DemoService.delete(req.params.name)
    if (!success) {
      return res.status(404).json({ error: 'Demo not found' })
    }
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete demo' })
  }
})

export default router
