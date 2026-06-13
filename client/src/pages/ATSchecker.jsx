import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../utils/api'

const ATSChecker = () => {
  const navigate = useNavigate()
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleCheck = async () => {
    if (!jobDescription.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const { data } = await api.post('/ats/check', { jobDescription })
      setResult(data.result)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze resume')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-teal-400'
    if (score >= 50) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getScoreBg = (score) => {
    if (score >= 75) return 'border-teal-500/30 bg-teal-500/5'
    if (score >= 50) return 'border-yellow-500/30 bg-yellow-500/5'
    return 'border-red-500/30 bg-red-500/5'
  }

  const getScoreLabel = (score) => {
    if (score >= 75) return 'Strong Match'
    if (score >= 50) return 'Moderate Match'
    return 'Weak Match'
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* Header */}
      <div className="border-b border-[#1a1a1a] px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold">ATS Resume Checker</h1>
        <button
          onClick={() => navigate('/dashboard')}
          className="text-sm text-gray-400 hover:text-white transition-all"
        >
          ← Back to Dashboard
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* Intro */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-2">Check your resume against any job</h2>
          <p className="text-gray-500 text-sm">
            Paste a job description below — we'll analyze your uploaded resume against it,
            give you an ATS match score, and tell you exactly what to fix.
          </p>
        </div>

        {/* JD Input */}
        <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-6 mb-6">
          <label className="text-gray-400 text-sm mb-2 block">Job Description</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here..."
            rows={8}
            className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 resize-none transition-all"
          />
          <button
            onClick={handleCheck}
            disabled={!jobDescription.trim() || loading}
            className="mt-4 w-full bg-teal-500 hover:bg-teal-400 disabled:bg-teal-800 disabled:cursor-not-allowed text-black font-semibold py-3 rounded-xl text-sm transition-all"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                </svg>
                Analyzing resume...
              </span>
            ) : 'Analyze Resume →'}
          </button>
          {error && (
            <p className="text-red-400 text-sm mt-3">⚠️ {error}</p>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">

            {/* Score */}
            <div className={`border rounded-2xl p-8 text-center ${getScoreBg(result.atsScore)}`}>
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">ATS Match Score</p>
              <p className={`text-6xl font-bold ${getScoreColor(result.atsScore)}`}>
                {result.atsScore}
                <span className="text-3xl text-gray-600">/100</span>
              </p>
              <p className={`text-sm mt-2 font-medium ${getScoreColor(result.atsScore)}`}>
                {getScoreLabel(result.atsScore)}
              </p>
              {/* Progress bar */}
              <div className="w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden mt-4 max-w-md mx-auto">
                <div
                  className={`h-full rounded-full transition-all ${
                    result.atsScore >= 75 ? 'bg-teal-500' :
                    result.atsScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${result.atsScore}%` }}
                />
              </div>
            </div>

            {/* Summary */}
            <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-6">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-3">Summary</p>
              <p className="text-gray-300 text-sm leading-relaxed">{result.summary}</p>
            </div>

            {/* Keywords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Matched */}
              <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-6">
                <p className="text-teal-400 text-xs uppercase tracking-wider mb-4">
                  ✓ Matched Keywords ({result.matchedKeywords?.length || 0})
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.matchedKeywords?.map((kw, i) => (
                    <span key={i} className="text-xs bg-teal-500/10 text-teal-400 px-3 py-1.5 rounded-lg">
                      {kw}
                    </span>
                  ))}
                  {result.matchedKeywords?.length === 0 && (
                    <p className="text-gray-600 text-sm">No matches found</p>
                  )}
                </div>
              </div>

              {/* Missing */}
              <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-6">
                <p className="text-red-400 text-xs uppercase tracking-wider mb-4">
                  ✕ Missing Keywords ({result.missingKeywords?.length || 0})
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords?.map((kw, i) => (
                    <span key={i} className="text-xs bg-red-500/10 text-red-400 px-3 py-1.5 rounded-lg">
                      {kw}
                    </span>
                  ))}
                  {result.missingKeywords?.length === 0 && (
                    <p className="text-gray-600 text-sm">Great! Nothing missing</p>
                  )}
                </div>
              </div>

            </div>

            {/* Format Issues */}
            {result.formatIssues?.length > 0 && (
              <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-6">
                <p className="text-yellow-400 text-xs uppercase tracking-wider mb-4">⚠ Format Issues</p>
                <ul className="space-y-2">
                  {result.formatIssues.map((issue, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                      <span className="text-yellow-500 mt-0.5">⚠</span>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Strengths */}
            <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-6">
              <p className="text-teal-400 text-xs uppercase tracking-wider mb-4">✓ Strengths</p>
              <ul className="space-y-2">
                {result.strengths?.map((s, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                    <span className="text-teal-500 mt-0.5">✓</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Suggestions */}
            <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-6">
              <p className="text-purple-400 text-xs uppercase tracking-wider mb-4">💡 How to Improve</p>
              <ul className="space-y-3">
                {result.suggestions?.map((sug, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="bg-purple-500/20 text-purple-400 text-xs w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-gray-300 text-sm">{sug}</span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}

export default ATSChecker