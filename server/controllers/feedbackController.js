import Session from '../models/Session.js'
import User from '../models/User.js'
import Groq from 'groq-sdk'

export const generateFeedback = async (req, res) => {
  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

    const session = await Session.findById(req.params.id)

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found',
      })
    }

    if (session.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Interview not completed yet',
      })
    }

    // Already feedback generated hai?
    if (session.feedback?.overallScore) {
      return res.status(200).json({
        success: true,
        feedback: session.feedback,
      })
    }

    // Conversation transcript banao
    const transcript = session.messages
      .map(m => `${m.role === 'assistant' ? 'Interviewer' : 'Candidate'}: ${m.content}`)
      .join('\n\n')

    // Filler words count karo
    const allAnswers = session.messages
      .filter(m => m.role === 'user')
      .map(m => m.content)
      .join(' ')
      .toLowerCase()

    const fillerWords = ['umm', 'uh', 'like', 'basically', 'you know', 'kind of', 'sort of', 'actually', 'literally']
    const fillerWordCount = fillerWords.reduce((count, word) => {
      const matches = allAnswers.match(new RegExp(`\\b${word}\\b`, 'g'))
      return count + (matches ? matches.length : 0)
    }, 0)

    // AI se feedback lo
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are an expert interview coach. Analyze the interview transcript and return ONLY a valid JSON object. No markdown, no backticks, just raw JSON.`,
        },
        {
          role: 'user',
          content: `Analyze this ${session.type} interview transcript and return JSON with exactly these keys:
{
  "overallScore": <number 1-10>,
  "confidenceScore": <number 1-10>,
  "strengths": [<3 specific strengths as strings>],
  "weakTopics": [<3 weak areas as strings>],
  "improvements": [<3 actionable improvement tips as strings>],
  "detailedFeedback": "<2-3 sentence overall summary>",
  "questionFeedback": [
    {
      "question": "<interviewer question>",
      "answer": "<candidate answer>",
      "score": <1-10>,
      "comment": "<brief feedback>"
    }
  ]
}

Transcript:
${transcript}`,
        },
      ],
      temperature: 0.3,
    })

    const raw = completion.choices[0].message.content.trim()
    const jsonMatch = raw.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON found in response')

    const feedbackData = JSON.parse(jsonMatch[0])

    // Session mein save karo
    session.feedback = {
      ...feedbackData,
      fillerWordCount,
    }
    await session.save()

    res.status(200).json({
      success: true,
      feedback: session.feedback,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}