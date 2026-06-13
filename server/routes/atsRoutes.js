import express from 'express'
import { checkATS } from '../controllers/atsController.js'
import protect from '../middleware/auth.js'

const router = express.Router()

router.post('/check', protect, checkATS)

export default router