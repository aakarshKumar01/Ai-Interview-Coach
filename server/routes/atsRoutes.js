import express from 'express'
import { checkATS, quickATSCheck } from '../controllers/atsController.js'
import protect from '../middleware/auth.js'
import upload from '../middleware/upload.js'

const router = express.Router()

router.post('/check', protect, checkATS)
router.post('/quick-check', protect, upload.single('resume'), quickATSCheck)

export default router