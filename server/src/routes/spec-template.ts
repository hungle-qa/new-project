import { Router } from 'express'
import { SpecTemplateService } from '../services/SpecTemplateService'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const items = await SpecTemplateService.getAll()
    res.json(items)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch spec templates' })
  }
})

router.get('/:name', async (req, res) => {
  try {
    const item = await SpecTemplateService.getByName(req.params.name)
    if (!item) {
      return res.status(404).json({ error: 'Spec template not found' })
    }
    res.json(item)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch spec template' })
  }
})

router.post('/', async (req, res) => {
  try {
    const result = await SpecTemplateService.create(req.body)
    res.status(201).json(result)
  } catch (error) {
    res.status(400).json({ error: 'Failed to create spec template' })
  }
})

router.delete('/:name', async (req, res) => {
  try {
    const success = await SpecTemplateService.delete(req.params.name)
    if (!success) {
      return res.status(404).json({ error: 'Spec template not found' })
    }
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete spec template' })
  }
})

export default router
