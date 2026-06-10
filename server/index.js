import dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import connectDB from './config/db.js'
import authRoutes from './routes/authRoutes.js'
import resumeRoutes from './routes/resumeRoutes.js'
import sessionRoutes from './routes/sessionRoutes.js'


const startServer = async () => {
  try {
    await connectDB()

    const app = express()

    app.use(cors({
      origin: process.env.CLIENT_URL || 'http://localhost:3000',
      credentials: true,
    }))
    app.use(express.json({ limit: '10mb' }))
    app.use(express.urlencoded({ extended: true, limit: '10mb' }))

    // Routes — baad mein add hote jayenge

    // app.use('/api/auth', authRoutes)
    app.use('/api/auth', authRoutes)
    app.use('/api/resume', resumeRoutes)
    app.use('/api/sessions', sessionRoutes)

    app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'ok',
        message: 'AI Interview Coach API running ✓',
        timestamp: new Date().toISOString(),
      })
    })

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({ success: false, message: 'Route not found' })
    })

    // Global error handler
    app.use((err, req, res, next) => {
      console.error(err.stack)
      res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
      })
    })

    const PORT = process.env.PORT || 5000
    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT} ✓`)
    })

    // Docker graceful shutdown — SIGTERM Docker bhejta hai container stop karte waqt
    process.on('SIGTERM', () => {
      console.log('SIGTERM received — shutting down gracefully')
      server.close(() => {
        console.log('Server closed ✓')
        process.exit(0)
      })
    })

    // Ctrl+C se local development mein
    process.on('SIGINT', () => {
      console.log('SIGINT received — shutting down gracefully')
      server.close(() => {
        console.log('Server closed ✓')
        process.exit(0)
      })
    })

  } catch (error) {
    console.error('Server startup failed:', error.message)
    process.exit(1)
  }
}

startServer()