import { Router } from 'express'
import { DesignSystemComponentService } from '../services/DesignSystemComponentService'
import { DesignSystemIconService } from '../services/DesignSystemIconService'
import { DesignSystemRulesService } from '../services/DesignSystemRulesService'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const items = await DesignSystemComponentService.getAll()
    res.json(items)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch design system components' })
  }
})

// ============== RULES ROUTES (must be before /:name) ==============

router.get('/rules', async (req, res) => {
  try {
    const rules = await DesignSystemRulesService.getRules()
    res.json(rules)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch design rules' })
  }
})

router.put('/rules', async (req, res) => {
  try {
    const result = await DesignSystemRulesService.updateRules(req.body)
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
    const item = await DesignSystemComponentService.getByName(req.params.name)
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
    const result = await DesignSystemComponentService.create(req.body)
    res.status(201).json(result)
  } catch (error) {
    res.status(400).json({ error: 'Failed to create component' })
  }
})

router.put('/:name', async (req, res) => {
  try {
    const result = await DesignSystemComponentService.update(req.params.name, req.body)
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
    const success = await DesignSystemComponentService.delete(req.params.name)
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
    const result = await DesignSystemComponentService.updateStatus(req.params.name, status)
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
    const icons = await DesignSystemIconService.getAllIcons()
    res.json(icons)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch icons' })
  }
})

router.get('/icons/:name', async (req, res) => {
  try {
    const icon = await DesignSystemIconService.getIconByName(req.params.name)
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
    const result = await DesignSystemIconService.createIcon({ name, svg, category, tags })
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
    const result = await DesignSystemIconService.updateIcon(req.params.name, req.body)
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
    const success = await DesignSystemIconService.deleteIcon(req.params.name)
    if (!success) {
      return res.status(404).json({ error: 'Icon not found' })
    }
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete icon' })
  }
})

export default router
