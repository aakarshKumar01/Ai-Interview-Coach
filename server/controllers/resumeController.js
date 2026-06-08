import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const pdf = require('pdf-parse')
import User from '../models/User.js'

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a PDF file',
      })
    }

    const pdfData = await pdf(req.file.buffer)
    const extractedText = pdfData.text

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract text from PDF',
      })
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        resume: {
          originalName: req.file.originalname,
          extractedText: extractedText,
          uploadedAt: new Date(),
        },
      },
      { new: true }
    ).select('-password')

    res.status(200).json({
      success: true,
      message: 'Resume uploaded successfully',
      resume: {
        originalName: user.resume.originalName,
        uploadedAt: user.resume.uploadedAt,
        textLength: extractedText.length,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}