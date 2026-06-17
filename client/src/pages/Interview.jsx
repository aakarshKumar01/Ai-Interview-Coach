import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import VoiceRecorder from '../components/VoiceRecorder'
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
  const [difficulty, setDifficulty] = useState('medium')
  const [started, setStarted] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(true)

  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const speakMessage = (text) => {
    if (!('speechSynthesis' in window) || !voiceEnabled) return
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 0.9
    utterance.pitch = 1
    utterance.volume = 1
    const voices = window.speechSynthesis.getVoices()
    const englishVoice = voices.find(v => v.lang.startsWith('en'))
    if (englishVoice) utterance.voice = englishVoice
    window.speechSynthesis.speak(utterance)
  }

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
      speakMessage(data.session.messages[0].content)
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
        navigate(`/feedback/${sessionId}`)
      } else {
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: data.message,
          timestamp: new Date(),
        }])
        setQuestionsAsked(data.questionsAsked)
        speakMessage(data.message)
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
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#F0E0C8' }}>
        <div className="w-full max-w-md">

          <button
            onClick={() => navigate('/practice')}
            className="text-gray-500 hover:text-gray-900 text-sm mb-6 flex items-center gap-2 transition-all"
          >
            ← Back to Practice Hub
          </button>

          <div className="animate-fade-in-up bg-white border border-gray-100 shadow-sm rounded-2xl p-8">

            <div className="text-center mb-8">
              <p className="text-4xl mb-3">
                {type === 'hr' ? '💼' : type === 'technical' ? '⚙️' : type === 'mixed' ? '🎯' : '💻'}
              </p>
              <h1 className="text-xl font-semibold text-gray-900">{typeLabels[type]}</h1>
              <p className="text-gray-500 text-sm mt-1">Configure your interview</p>
            </div>

            {/* Difficulty */}
            <div className="mb-6">
              <p className="text-gray-600 text-sm mb-3 font-medium">Difficulty</p>
              <div className="flex gap-3">
                {['easy', 'medium', 'hard'].map(d => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium capitalize transition-all ${
                      difficulty === d
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'bg-gray-50 text-gray-500 border border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions count */}
            <div className="mb-8">
              <p className="text-gray-600 text-sm mb-3 font-medium">Number of Questions</p>
              <div className="flex gap-3">
                {[5, 10, 15].map(n => (
                  <button
                    key={n}
                    onClick={() => setTotalQuestions(n)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
                      totalQuestions === n
                        ? 'bg-emerald-500 text-white shadow-sm'
                        : 'bg-gray-50 text-gray-500 border border-gray-200 hover:border-emerald-300'
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
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-200 text-white font-semibold py-3 rounded-xl transition-all shadow-sm"
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
    <div className="min-h-screen flex flex-col" style={{ background: '#F0E0C8' }}>

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <h1 className="text-gray-900 font-semibold">{typeLabels[type]}</h1>
          <span className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded-lg capitalize">
            {difficulty}
          </span>
        </div>
        <div className="flex items-center gap-4">
          {/* Voice toggle */}
          <button
            onClick={() => {
              setVoiceEnabled(!voiceEnabled)
              window.speechSynthesis.cancel()
            }}
            className={`text-sm px-3 py-1.5 rounded-lg border transition-all ${
              voiceEnabled
                ? 'border-emerald-300 text-emerald-700 bg-emerald-50'
                : 'border-gray-200 text-gray-400'
            }`}
          >
            {voiceEnabled ? '🔊 Voice On' : '🔇 Voice Off'}
          </button>

          <span className="text-gray-500 text-sm">
            {questionsAsked} / {totalQuestions} questions
          </span>

          <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all"
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
              <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 flex-shrink-0 mt-1">
                AI
              </div>
            )}
            <div
              className={`max-w-lg px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === 'assistant'
                  ? 'bg-white border border-gray-100 text-gray-900'
                  : 'bg-emerald-500 text-white'
              }`}
            >
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div className="w-8 h-8 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center text-gray-700 text-xs font-bold ml-3 flex-shrink-0 mt-1">
                You
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex justify-start mb-6">
            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold mr-3 flex-shrink-0">
              AI
            </div>
            <div className="bg-white border border-gray-100 shadow-sm px-4 py-3 rounded-2xl">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-100 px-4 py-4">
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
            placeholder="Type your answer or use mic... (Enter to send, Shift+Enter for new line)"
            rows={2}
            className="flex-1 bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent resize-none transition-all"
          />
          <div className="flex flex-col gap-2">
            <VoiceRecorder
              onTranscript={(text) => setAnswer(prev => prev + ' ' + text)}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={!answer.trim() || loading}
              className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-200 disabled:cursor-not-allowed text-white font-semibold px-6 rounded-xl transition-all flex-1 shadow-sm"
            >
              Send
            </button>
          </div>
        </form>
      </div>

    </div>
  )
}

export default Interview