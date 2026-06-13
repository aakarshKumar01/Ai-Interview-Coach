import express from 'express'
import { generateFeedback } from '../controllers/feedbackController.js'
import protect from '../middleware/auth.js'

const router = express.Router()

router.get('/:id', protect, generateFeedback)

export default router