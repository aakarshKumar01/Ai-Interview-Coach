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
    if (score >= 8) return 'text-teal-400'
    if (score >= 6) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreBg = (score) => {
    if (score >= 8) return 'bg-teal-400/10 border-teal-400/20'
    if (score >= 6) return 'bg-yellow-400/10 border-yellow-400/20'
    return 'bg-red-400/10 border-red-400/20'
  }

  const getScoreLabel = (score) => {
    if (score >= 8) return 'Excellent'
    if (score >= 6) return 'Good'
    if (score >= 4) return 'Average'
    return 'Needs Work'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-teal-500 mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Generating your feedback...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400">{error}</p>
          <button onClick={() => navigate('/dashboard')} className="text-teal-400 mt-4 text-sm">
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* Header */}
      <div className="border-b border-[#1a1a1a] px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold">Interview Feedback</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-sm text-gray-400 hover:text-white transition-all"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Score cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">

          {/* Overall Score */}
          <div className={`border rounded-2xl p-6 text-center col-span-2 md:col-span-1 ${getScoreBg(feedback.overallScore)}`}>
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Overall Score</p>
            <p className={`text-5xl font-bold ${getScoreColor(feedback.overallScore)}`}>
              {feedback.overallScore}
              <span className="text-2xl text-gray-600">/10</span>
            </p>
            <p className={`text-sm mt-2 font-medium ${getScoreColor(feedback.overallScore)}`}>
              {getScoreLabel(feedback.overallScore)}
            </p>
          </div>

          {/* Confidence Score */}
          <div className={`border rounded-2xl p-6 text-center ${getScoreBg(feedback.confidenceScore)}`}>
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Confidence</p>
            <p className={`text-5xl font-bold ${getScoreColor(feedback.confidenceScore)}`}>
              {feedback.confidenceScore}
              <span className="text-2xl text-gray-600">/10</span>
            </p>
            <p className={`text-sm mt-2 font-medium ${getScoreColor(feedback.confidenceScore)}`}>
              {getScoreLabel(feedback.confidenceScore)}
            </p>
          </div>

          {/* Filler Words */}
          <div className={`border rounded-2xl p-6 text-center ${feedback.fillerWordCount > 5 ? 'bg-red-400/10 border-red-400/20' : 'bg-teal-400/10 border-teal-400/20'}`}>
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Filler Words</p>
            <p className={`text-5xl font-bold ${feedback.fillerWordCount > 5 ? 'text-red-400' : 'text-teal-400'}`}>
              {feedback.fillerWordCount}
            </p>
            <p className={`text-sm mt-2 font-medium ${feedback.fillerWordCount > 5 ? 'text-red-400' : 'text-teal-400'}`}>
              {feedback.fillerWordCount === 0 ? 'Perfect' : feedback.fillerWordCount > 5 ? 'Too Many' : 'Acceptable'}
            </p>
          </div>

        </div>

        {/* Detailed feedback */}
        <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-6 mb-6">
          <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">Overall Feedback</p>
          <p className="text-gray-300 text-sm leading-relaxed">{feedback.detailedFeedback}</p>
        </div>

        {/* Strengths + Weak Topics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

          {/* Strengths */}
          <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-6">
            <p className="text-teal-400 text-xs uppercase tracking-wider mb-4">✓ Strengths</p>
            <ul className="space-y-3">
              {feedback.strengths?.map((s, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-teal-500 mt-0.5 flex-shrink-0">✓</span>
                  <span className="text-gray-300 text-sm">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Weak Topics */}
          <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-6">
            <p className="text-yellow-400 text-xs uppercase tracking-wider mb-4">⚠ Areas to Improve</p>
            <ul className="space-y-3">
              {feedback.weakTopics?.map((w, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-yellow-500 mt-0.5 flex-shrink-0">⚠</span>
                  <span className="text-gray-300 text-sm">{w}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Improvements */}
        <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-6 mb-10">
          <p className="text-purple-400 text-xs uppercase tracking-wider mb-4">💡 Action Items</p>
          <ul className="space-y-3">
            {feedback.improvements?.map((imp, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="bg-purple-500/20 text-purple-400 text-xs w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-gray-300 text-sm">{imp}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="flex gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex-1 bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400 py-3 rounded-xl text-sm hover:border-teal-500/50 transition-all"
          >
            Back to Dashboard
          </button>
          <button
            onClick={() => navigate(`/interview/${window.location.pathname.split('/')[2]}`)}
            className="flex-1 bg-teal-500 hover:bg-teal-400 text-black font-semibold py-3 rounded-xl text-sm transition-all"
          >
            Practice Again →
          </button>
        </div>

      </div>
    </div>
  )
}

export default Feedback