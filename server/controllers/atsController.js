import { extractText } from 'unpdf'
import User from '../models/User.js'
import Groq from 'groq-sdk'

// @desc   Check saved resume against JD
// @route  POST /api/ats/check
export const checkATS = async (req, res) => {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
    const { jobDescription } = req.body

    if (!jobDescription || jobDescription.trim().length < 20) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid job description',
      })
    }

    const user = await User.findById(req.user.id).select('resume')

    if (!user?.resume?.extractedText) {
      return res.status(400).json({
        success: false,
        message: 'Please upload your resume first',
      })
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are an ATS (Applicant Tracking System) analyzer. Compare the resume against the job description and return ONLY a valid JSON object. No markdown, no backticks.`,
        },
        {
          role: 'user',
          content: `Compare this resume against the job description. Return JSON with exactly these keys:
{
  "atsScore": <number 0-100, overall match score>,
  "matchedKeywords": [<array of important keywords/skills from JD that ARE present in resume>],
  "missingKeywords": [<array of important keywords/skills from JD that are MISSING from resume>],
  "formatIssues": [<array of 2-4 ATS formatting issues if any, e.g. "Use standard section headings", "Avoid tables/columns">],
  "strengths": [<array of 3 things the resume does well for this JD>],
  "suggestions": [<array of 4-5 specific actionable suggestions to improve match score>],
  "summary": "<2-3 sentence overall assessment>"
}

Resume Text:
${user.resume.extractedText}

Job Description:
${jobDescription}`,
        },
      ],
      temperature: 0.2,
    })

    const raw = completion.choices[0].message.content.trim()
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON found in response')

    const result = JSON.parse(jsonMatch[0])

    res.status(200).json({
      success: true,
      result,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc   Quick ATS check — upload any PDF, no saved resume needed
// @route  POST /api/ats/quick-check
export const quickATSCheck = async (req, res) => {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
    const { jobDescription } = req.body

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a resume PDF',
      })
    }

    if (!jobDescription || jobDescription.trim().length < 20) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid job description',
      })
    }

    // PDF se text extract karo
    const uint8Array = new Uint8Array(req.file.buffer)
    const { text } = await extractText(uint8Array, { mergePages: true })

    if (!text || text.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract text from PDF',
      })
    }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are an ATS (Applicant Tracking System) analyzer. Compare the resume against the job description and return ONLY a valid JSON object. No markdown, no backticks.`,
        },
        {
          role: 'user',
          content: `Compare this resume against the job description. Return JSON with exactly these keys:
{
  "atsScore": <number 0-100, overall match score>,
  "matchedKeywords": [<array of important keywords/skills from JD that ARE present in resume>],
  "missingKeywords": [<array of important keywords/skills from JD that are MISSING from resume>],
  "formatIssues": [<array of 2-4 ATS formatting issues if any, e.g. "Use standard section headings", "Avoid tables/columns">],
  "strengths": [<array of 3 things the resume does well for this JD>],
  "suggestions": [<array of 4-5 specific actionable suggestions to improve match score>],
  "summary": "<2-3 sentence overall assessment>"
}

Resume Text:
${text}

Job Description:
${jobDescription}`,
        },
      ],
      temperature: 0.2,
    })

    const raw = completion.choices[0].message.content.trim()
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON found in response')

    const result = JSON.parse(jsonMatch[0])

    res.status(200).json({
      success: true,
      result,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}