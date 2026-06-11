import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../utils/api'

const Interview = () => {
  const { type } = useParams()
  const navigate = useNavigate()

  const [sessionId, setSessionId] = useState(null)
  const [messages, setMessages] = useState([])
  const [answer, setAnswer] = useState('')
  const [loading, setLoading] = useState(false)
  const [starting, setStarting] = useState(false)
  const [questionsAsked, setQuestionsAsked] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(5)
  const [completed, setCompleted] = useState(false)
  const [difficulty, setDifficulty] = useState('medium')
  const [started, setStarted] = useState(false)

  const bottomRef = useRef(null)

  // Auto scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const startInterview = async () => {
    setStarting(true)
    try {
      const { data } = await api.post('/sessions/start', {
        type,
        difficulty,
        totalQuestions,
      })
      setSessionId(data.session.id)
      setMessages(data.session.messages)
      setQuestionsAsked(data.session.questionsAsked)
      setStarted(true)
    } catch (err) {
      console.error(err)
    } finally {
      setStarting(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!answer.trim() || loading) return

    const userAnswer = answer
    setAnswer('')
    setLoading(true)

    // User message turant show karo
    setMessages(prev => [...prev, {
      role: 'user',
      content: userAnswer,
      timestamp: new Date(),
    }])

    try {
      const { data } = await api.post(`/sessions/${sessionId}/answer`, {
        answer: userAnswer,
      })

      if (data.completed) {
        setCompleted(true)
        navigate(`/feedback/${sessionId}`)
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
        }])
        setQuestionsAsked(data.questionsAsked)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const typeLabels = {
    hr: 'HR Interview',
    technical: 'Technical Interview',
    mixed: 'Mixed Interview',
    coding: 'Coding Round',
  }

  // Pre-interview setup screen
  if (!started) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="w-full max-w-md">

          <button
            onClick={() => navigate('/dashboard')}
            className="text-gray-500 hover:text-white text-sm mb-8 flex items-center gap-2 transition-all"
          >
            ← Back to Dashboard
          </button>

          <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-8">

            <div className="text-center mb-8">
              <p className="text-4xl mb-3">
                {type === 'hr' ? '💼' : type === 'technical' ? '⚙️' : type === 'mixed' ? '🎯' : '💻'}
              </p>
              <h1 className="text-xl font-semibold text-white">{typeLabels[type]}</h1>
              <p className="text-gray-500 text-sm mt-1">Configure your interview</p>
            </div>

            {/* Difficulty */}
            <div className="mb-6">
              <p className="text-gray-400 text-sm mb-3">Difficulty</p>
              <div className="flex gap-3">
                {['easy', 'medium', 'hard'].map(d => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                      difficulty === d
                        ? 'bg-teal-500 text-black'
                        : 'bg-[#1a1a1a] text-gray-400 border border-[#2a2a2a] hover:border-teal-500/50'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions count */}
            <div className="mb-8">
              <p className="text-gray-400 text-sm mb-3">Number of Questions</p>
              <div className="flex gap-3">
                {[5, 10, 15].map(n => (
                  <button
                    key={n}
                    onClick={() => setTotalQuestions(n)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                      totalQuestions === n
                        ? 'bg-teal-500 text-black'
                        : 'bg-[#1a1a1a] text-gray-400 border border-[#2a2a2a] hover:border-teal-500/50'
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={startInterview}
              disabled={starting}
              className="w-full bg-teal-500 hover:bg-teal-400 disabled:bg-teal-800 text-black font-semibold py-3 rounded-xl transition-all"
            >
              {starting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Starting...
                </span>
              ) : 'Start Interview →'}
            </button>

          </div>
        </div>
      </div>
    )
  }

  // Interview screen
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">

      {/* Header */}
      <div className="border-b border-[#1a1a1a] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-white font-semibold">{typeLabels[type]}</h1>
          <span className="text-xs bg-teal-500/10 text-teal-400 px-2 py-1 rounded-lg capitalize">
            {difficulty}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-500 text-sm">
            {questionsAsked} / {totalQuestions} questions
          </span>
          {/* Progress bar */}
          <div className="w-24 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-500 rounded-full transition-all"
              style={{ width: `${(questionsAsked / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-3xl mx-auto w-full">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex mb-6 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-black text-xs font-bold mr-3 flex-shrink-0 mt-1">
                AI
              </div>
            )}
            <div
              className={`max-w-lg px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'assistant'
                  ? 'bg-[#111] border border-[#1a1a1a] text-white'
                  : 'bg-teal-500 text-black'
              }`}
            >
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full flex items-center justify-center text-white text-xs font-bold ml-3 flex-shrink-0 mt-1">
                You
              </div>
            )}
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-start mb-6">
            <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-black text-xs font-bold mr-3 flex-shrink-0">
              AI
            </div>
            <div className="bg-[#111] border border-[#1a1a1a] px-4 py-3 rounded-2xl">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-teal-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-[#1a1a1a] px-4 py-4">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto flex gap-3">
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSubmit(e)
              }
            }}
            placeholder="Type your answer... (Enter to send, Shift+Enter for new line)"
            rows={2}
            className="flex-1 bg-[#111] border border-[#1a1a1a] text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none transition-all"
          />
          <button
            type="submit"
            disabled={!answer.trim() || loading}
            className="bg-teal-500 hover:bg-teal-400 disabled:bg-teal-800 disabled:cursor-not-allowed text-black font-semibold px-6 rounded-xl transition-all"
          >
            Send
          </button>
        </form>
      </div>

    </div>
  )
}

export default Interview