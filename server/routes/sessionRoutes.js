import express from 'express'
import { startSession, sendAnswer, getSession, getUserSessions } from '../controllers/sessionController.js'
import protect from '../middleware/auth.js'

const router = express.Router()

router.post('/start', protect, startSession)
router.post('/:id/answer', protect, sendAnswer)
router.get('/', protect, getUserSessions)
router.get('/:id', protect, getSession)

export default router