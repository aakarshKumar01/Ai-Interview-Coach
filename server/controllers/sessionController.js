import Session from '../models/Session.js'
import User from '../models/User.js'
import Groq from 'groq-sdk'



// System prompt generate karo resume + interview type ke basis pe
const generateSystemPrompt = (type, difficulty, resumeData) => {


  const resumeContext = resumeData
    ? `
Candidate's Resume:
- Name: ${resumeData.name || 'Candidate'}
- Skills: ${resumeData.skills?.join(', ') || 'Not provided'}
- Projects: ${resumeData.projects?.map(p => p.name).join(', ') || 'Not provided'}
- Experience: ${resumeData.experience?.map(e => `${e.role} at ${e.company}`).join(', ') || 'Fresher'}
- Education: ${resumeData.education?.map(e => `${e.degree} from ${e.institution}`).join(', ') || 'Not provided'}
`
    : 'No resume provided — ask general questions.'

  const typePrompts = {
    hr: 'You are a professional HR interviewer. Ask behavioral and situational questions like "Tell me about yourself", "Where do you see yourself in 5 years", "Tell me about a challenge you faced". Focus on soft skills, communication, and cultural fit.',
    technical: 'You are a senior technical interviewer. Ask questions about DSA, system design, and the candidate\'s tech stack from their resume. Ask follow-up questions based on their answers.',
    mixed: 'You are an interviewer conducting a mixed interview. Alternate between HR behavioral questions and technical questions based on the candidate\'s resume.',
    coding: 'You are a coding interview conductor. Give the candidate one DSA problem at a time. After they explain their approach, give feedback and move to the next problem.',
  }

  const difficultyMap = {
    easy: 'Ask basic, beginner-friendly questions.',
    medium: 'Ask intermediate level questions.',
    hard: 'Ask advanced, challenging questions that test deep understanding.',
  }

  return `You are a professional interviewer conducting a ${type.toUpperCase()} interview.

${typePrompts[type]}

${difficultyMap[difficulty]}

${resumeContext}

RULES:
- Ask ONE question at a time
- After candidate answers, give a very brief acknowledgment (1 line max) then ask next question
- Be professional but friendly
- Do NOT give long explanations or feedback during the interview
- Do NOT reveal you are an AI
- Do NOT add meta commentary like "(I have asked X questions so far)"
- Start by greeting the candidate and asking the first question immediately`
}

// @desc   Start new interview session
// @route  POST /api/sessions/start
export const startSession = async (req, res) => {
  try {

     const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

    const { type, difficulty, totalQuestions } = req.body

    if (!type) {
      return res.status(400).json({
        success: false,
        message: 'Interview type is required',
      })
    }

    // User ka resume data lo
    const user = await User.findById(req.user.id).select('-password')
    const resumeData = user?.resume?.parsedData || null

    // System prompt banao
    const systemPrompt = generateSystemPrompt(type, difficulty || 'medium', resumeData)

    // Groq se pehla question lo
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: 'Start the interview.' },
      ],
      temperature: 0.7,
    })

    const firstMessage = completion.choices[0].message.content

    // Session banao
    const session = await Session.create({
      userId: req.user.id,
      type,
      difficulty: difficulty || 'medium',
      totalQuestions: totalQuestions || 5,
      questionsAsked: 1,
      messages: [
        { role: 'assistant', content: firstMessage },
      ],
    })

    res.status(201).json({
      success: true,
      message: 'Interview session started',
      session: {
        id: session._id,
        type: session.type,
        difficulty: session.difficulty,
        totalQuestions: session.totalQuestions,
        questionsAsked: session.questionsAsked,
        messages: session.messages,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc   Send answer, get next question
// @route  POST /api/sessions/:id/answer
export const sendAnswer = async (req, res) => {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
    const { answer } = req.body
    const session = await Session.findById(req.params.id)

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found',
      })
    }

    if (session.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'Session is not active',
      })
    }

    // User answer save karo
    session.messages.push({ role: 'user', content: answer })

    // Check karo interview complete hua ya nahi
    if (session.questionsAsked >= session.totalQuestions) {
      session.status = 'completed'
      await session.save()

      return res.status(200).json({
        success: true,
        completed: true,
        message: 'Interview completed! Generating feedback...',
        sessionId: session._id,
      })
    }

    // User ka resume lo
    const user = await User.findById(session.userId).select('resume')
    const resumeData = user?.resume?.parsedData || null
    const systemPrompt = generateSystemPrompt(session.type, session.difficulty, resumeData)

    // Poori conversation history bhejo Groq ko
    const messages = [
      { role: 'system', content: systemPrompt },
      ...session.messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
    ]

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.7,
    })

    const nextQuestion = completion.choices[0].message.content

    // Next question save karo
    session.messages.push({ role: 'assistant', content: nextQuestion })
    session.questionsAsked += 1
    await session.save()

    res.status(200).json({
      success: true,
      completed: false,
      message: nextQuestion,
      questionsAsked: session.questionsAsked,
      totalQuestions: session.totalQuestions,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc   Get session by ID
// @route  GET /api/sessions/:id
export const getSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found',
      })
    }

    res.status(200).json({
      success: true,
      session,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc   Get all sessions of user
// @route  GET /api/sessions
export const getUserSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ userId: req.user.id })
      .select('-messages')
      .sort({ createdAt: -1 })

    res.status(200).json({
      success: true,
      sessions,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}