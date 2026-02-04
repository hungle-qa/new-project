import { Router } from 'express'
import { DesignSystemService } from '../services/DesignSystemService'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const items = await DesignSystemService.getAll()
    res.json(items)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch design system components' })
  }
})

// ============== RULES ROUTES (must be before /:name) ==============

router.get('/rules', async (req, res) => {
  try {
    const rules = await DesignSystemService.getRules()
    res.json(rules)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch design rules' })
  }
})

router.put('/rules', async (req, res) => {
  try {
    const result = await DesignSystemService.updateRules(req.body)
    res.json(result)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message })
    }
    res.status(400).json({ error: 'Failed to update rules' })
  }
})

router.get('/:name', async (req, res) => {
  try {
    const item = await DesignSystemService.getByName(req.params.name)
    if (!item) {
      return res.status(404).json({ error: 'Component not found' })
    }
    res.json(item)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch component' })
  }
})

router.post('/', async (req, res) => {
  try {
    const result = await DesignSystemService.create(req.body)
    res.status(201).json(result)
  } catch (error) {
    res.status(400).json({ error: 'Failed to create component' })
  }
})

router.put('/:name', async (req, res) => {
  try {
    const result = await DesignSystemService.update(req.params.name, req.body)
    res.json(result)
  } catch (error) {
    if (error instanceof Error && error.message === 'Component not found') {
      return res.status(404).json({ error: 'Component not found' })
    }
    res.status(400).json({ error: 'Failed to update component' })
  }
})

router.delete('/:name', async (req, res) => {
  try {
    const success = await DesignSystemService.delete(req.params.name)
    if (!success) {
      return res.status(404).json({ error: 'Component not found' })
    }
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete component' })
  }
})

router.patch('/:name/status', async (req, res) => {
  try {
    const { status } = req.body
    if (!status) {
      return res.status(400).json({ error: 'Status is required' })
    }
    const result = await DesignSystemService.updateStatus(req.params.name, status)
    res.json(result)
  } catch (error) {
    if (error instanceof Error && error.message === 'Component not found') {
      return res.status(404).json({ error: 'Component not found' })
    }
    res.status(400).json({ error: 'Failed to update status' })
  }
})

// ============== ICON ROUTES ==============

router.get('/icons/list', async (req, res) => {
  try {
    const icons = await DesignSystemService.getAllIcons()
    res.json(icons)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch icons' })
  }
})

router.get('/icons/:name', async (req, res) => {
  try {
    const icon = await DesignSystemService.getIconByName(req.params.name)
    if (!icon) {
      return res.status(404).json({ error: 'Icon not found' })
    }
    res.json(icon)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch icon' })
  }
})

router.post('/icons', async (req, res) => {
  try {
    const { name, svg, category, tags } = req.body
    if (!name || !svg) {
      return res.status(400).json({ error: 'Name and SVG content are required' })
    }
    const result = await DesignSystemService.createIcon({ name, svg, category, tags })
    res.status(201).json(result)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message })
    }
    res.status(400).json({ error: 'Failed to create icon' })
  }
})

router.put('/icons/:name', async (req, res) => {
  try {
    const result = await DesignSystemService.updateIcon(req.params.name, req.body)
    res.json(result)
  } catch (error) {
    if (error instanceof Error && error.message === 'Icon not found') {
      return res.status(404).json({ error: 'Icon not found' })
    }
    res.status(400).json({ error: 'Failed to update icon' })
  }
})

router.delete('/icons/:name', async (req, res) => {
  try {
    const success = await DesignSystemService.deleteIcon(req.params.name)
    if (!success) {
      return res.status(404).json({ error: 'Icon not found' })
    }
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete icon' })
  }
})

export default router
