import { Router } from 'express'
import { ProductIdeaService } from '../services/ProductIdeaService'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const items = await ProductIdeaService.getAll()
    res.json(items)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product ideas' })
  }
})

router.get('/:name', async (req, res) => {
  try {
    const item = await ProductIdeaService.getByName(req.params.name)
    if (!item) {
      return res.status(404).json({ error: 'Product idea not found' })
    }
    res.json(item)
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product idea' })
  }
})

router.post('/', async (req, res) => {
  try {
    const result = await ProductIdeaService.create(req.body)
    res.status(201).json(result)
  } catch (error) {
    res.status(400).json({ error: 'Failed to create product idea' })
  }
})

router.delete('/:name', async (req, res) => {
  try {
    const success = await ProductIdeaService.delete(req.params.name)
    if (!success) {
      return res.status(404).json({ error: 'Product idea not found' })
    }
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product idea' })
  }
})

export default router
