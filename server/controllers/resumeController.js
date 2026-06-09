import { extractText } from 'unpdf'
import User from '../models/User.js'
import Groq from 'groq-sdk'

const parseResumeWithAI = async (resumeText) => {
  const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

  const completion = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: `You are a resume parser. Return ONLY a valid JSON object. No markdown, no backticks, no javascript, no comments, no extra text. Just raw JSON starting with { and ending with }. Use double quotes for all keys and string values.`,
      },
      {
        role: 'user',
        content: `Parse this resume and return JSON with these exact keys: name, email, phone, skills (array of strings), experience (array of {company, role, duration}), projects (array of {name, description, technologies}), education (array of {degree, institution, year}).

        Resume:
        ${resumeText}`,
      },
    ],
    temperature: 0.1,
  })

  const raw = completion.choices[0].message.content.trim()
  
  // JSON extract karo — { se } tak
  const jsonMatch = raw.match(/\{[\s\S]*\}/)
  if (!jsonMatch) throw new Error('No JSON found in response')
  
  return JSON.parse(jsonMatch[0])
}

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a PDF file',
      })
    }

    // PDF se text extract
    const uint8Array = new Uint8Array(req.file.buffer)
    const { text } = await extractText(uint8Array, { mergePages: true })

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract text from PDF',
      })
    }

    // Gemini se parse karo
    let parsedData = {}
    try {
      parsedData = await parseResumeWithAI(text)
    } catch (aiError) {
      console.error('AI parsing failed:', aiError.message)
      // AI fail ho toh bhi resume save karo
    }

    // MongoDB mein save karo
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        resume: {
          originalName: req.file.originalname,
          extractedText: text,
          parsedData,
          uploadedAt: new Date(),
        },
      },
      { returnDocument: 'after' }  
    ).select('-password')

    res.status(200).json({
      success: true,
      message: 'Resume uploaded and parsed successfully',
      resume: {
        originalName: user.resume.originalName,
        uploadedAt: user.resume.uploadedAt,
        parsedData,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}