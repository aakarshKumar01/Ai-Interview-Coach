import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'

dotenv.config()

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

    app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'ok',
        message: 'AI Interview Coach API running ✓',
        timestamp: new Date().toISOString(),
      })
    })

    //404 handler if frontend req to undefined api
    app.use((req, res) => {
      res.status(404).json({ success: false, message: 'Route not found' })
    })

    //This is an Express error-handling middleware — one of the most important parts of a backend.
    app.use((err, req, res, next) => {
      console.error(err.stack)
      res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal server error',
      })
    })

    const PORT = process.env.PORT || 5000
    //for docker we have to write the 0.0.0.0 other we skip that
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on port ${PORT} ✓`)
    })
  } catch (error) {
    console.error('Server startup failed:', error.message)
    process.exit(1)
  }
}

startServer()