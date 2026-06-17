import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../utils/api'

const Feedback = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchFeedback()
  }, [])

  const fetchFeedback = async () => {
    try {
      const { data } = await api.get(`/feedback/${id}`)
      setFeedback(data.feedback)
    } catch (err) {
      setError('Failed to load feedback')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 8) return 'text-emerald-600'
    if (score >= 6) return 'text-amber-500'
    return 'text-red-500'
  }

  const getScoreBg = (score) => {
    if (score >= 8) return 'bg-emerald-50 border-emerald-200'
    if (score >= 6) return 'bg-amber-50 border-amber-200'
    return 'bg-red-50 border-red-200'
  }

  const getScoreLabel = (score) => {
    if (score >= 8) return 'Excellent'
    if (score >= 6) return 'Good'
    if (score >= 4) return 'Average'
    return 'Needs Work'
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F0E0C8' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Generating your feedback...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F0E0C8' }}>
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <button onClick={() => navigate('/dashboard')} className="text-emerald-600 mt-4 text-sm">
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-gray-900" style={{ background: '#F0E0C8' }}>

      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
        <h1 className="text-lg font-bold">Interview Feedback</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-sm text-gray-500 hover:text-gray-900 transition-all"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Score cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">

          <div className={`animate-fade-in-up border rounded-2xl p-6 text-center col-span-2 md:col-span-1 shadow-sm ${getScoreBg(feedback.overallScore)}`}>
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-2 font-medium">Overall Score</p>
            <p className={`text-5xl font-bold ${getScoreColor(feedback.overallScore)}`}>
              {feedback.overallScore}
              <span className="text-2xl text-gray-400">/10</span>
            </p>
            <p className={`text-sm mt-2 font-medium ${getScoreColor(feedback.overallScore)}`}>
              {getScoreLabel(feedback.overallScore)}
            </p>
          </div>

          <div className={`animate-fade-in-up delay-100 border rounded-2xl p-6 text-center shadow-sm ${getScoreBg(feedback.confidenceScore)}`}>
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-2 font-medium">Confidence</p>
            <p className={`text-5xl font-bold ${getScoreColor(feedback.confidenceScore)}`}>
              {feedback.confidenceScore}
              <span className="text-2xl text-gray-400">/10</span>
            </p>
            <p className={`text-sm mt-2 font-medium ${getScoreColor(feedback.confidenceScore)}`}>
              {getScoreLabel(feedback.confidenceScore)}
            </p>
          </div>

          <div className={`animate-fade-in-up delay-200 border rounded-2xl p-6 text-center shadow-sm ${feedback.fillerWordCount > 5 ? 'bg-red-50 border-red-200' : 'bg-emerald-50 border-emerald-200'}`}>
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-2 font-medium">Filler Words</p>
            <p className={`text-5xl font-bold ${feedback.fillerWordCount > 5 ? 'text-red-500' : 'text-emerald-600'}`}>
              {feedback.fillerWordCount}
            </p>
            <p className={`text-sm mt-2 font-medium ${feedback.fillerWordCount > 5 ? 'text-red-500' : 'text-emerald-600'}`}>
              {feedback.fillerWordCount === 0 ? 'Perfect' : feedback.fillerWordCount > 5 ? 'Too Many' : 'Acceptable'}
            </p>
          </div>

        </div>

        {/* Detailed feedback */}
        <div className="animate-fade-in-up bg-white border border-gray-100 shadow-sm rounded-2xl p-6 mb-6">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-3 font-medium">Overall Feedback</p>
          <p className="text-gray-700 text-sm leading-relaxed">{feedback.detailedFeedback}</p>
        </div>

        {/* Strengths + Weak Topics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

          <div className="animate-fade-in-up bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
            <p className="text-emerald-600 text-xs uppercase tracking-wider mb-4 font-medium">✓ Strengths</p>
            <ul className="space-y-3">
              {feedback.strengths?.map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-emerald-500 mt-0.5 flex-shrink-0">✓</span>
                  <span className="text-gray-700 text-sm">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="animate-fade-in-up bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
            <p className="text-amber-600 text-xs uppercase tracking-wider mb-4 font-medium">⚠ Areas to Improve</p>
            <ul className="space-y-3">
              {feedback.weakTopics?.map((w, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-amber-500 mt-0.5 flex-shrink-0">⚠</span>
                  <span className="text-gray-700 text-sm">{w}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Improvements */}
        <div className="animate-fade-in-up bg-white border border-gray-100 shadow-sm rounded-2xl p-6 mb-10">
          <p className="text-purple-600 text-xs uppercase tracking-wider mb-4 font-medium">💡 Action Items</p>
          <ul className="space-y-3">
            {feedback.improvements?.map((imp, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="bg-purple-100 text-purple-600 text-xs w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 font-semibold">
                  {i + 1}
                </span>
                <span className="text-gray-700 text-sm">{imp}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 bg-white border border-gray-200 text-gray-600 py-3 rounded-xl text-sm hover:border-emerald-300 transition-all shadow-sm"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate('/practice')}
            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl text-sm transition-all shadow-sm"
          >
            Practice Again →
          </button>
        </div>

      </div>
    </div>
  )
}

export default Feedback