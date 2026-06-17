import { useState } from 'react'
import Navbar from '../components/Navbar'
import api from '../utils/api'

const ATSCheck = () => {
  const [file, setFile] = useState(null)
  const [jobDescription, setJobDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [dragOver, setDragOver] = useState(false)

  const handleFileChange = (e) => {
    const selected = e.target.files[0]
    if (selected && selected.type === 'application/pdf') {
      setFile(selected)
      setError('')
    } else {
      setError('Only PDF files are allowed')
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped && dropped.type === 'application/pdf') {
      setFile(dropped)
      setError('')
    } else {
      setError('Only PDF files are allowed')
    }
  }

  const handleCheck = async () => {
    if (!file || !jobDescription.trim()) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const formData = new FormData()
      formData.append('resume', file)
      formData.append('jobDescription', jobDescription)
      const { data } = await api.post('/ats/quick-check', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setResult(data.result)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to analyze resume')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-emerald-600'
    if (score >= 50) return 'text-amber-500'
    return 'text-red-500'
  }

  const getScoreBg = (score) => {
    if (score >= 75) return 'border-emerald-200 bg-emerald-50'
    if (score >= 50) return 'border-amber-200 bg-amber-50'
    return 'border-red-200 bg-red-50'
  }

  const getScoreBar = (score) => {
    if (score >= 75) return 'bg-emerald-500'
    if (score >= 50) return 'bg-amber-500'
    return 'bg-red-500'
  }

  const getScoreLabel = (score) => {
    if (score >= 75) return 'Strong Match'
    if (score >= 50) return 'Moderate Match'
    return 'Weak Match'
  }

  return (
    <div className="min-h-screen text-gray-900" style={{ background: '#F0E0C8' }}>
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10">

        <div className="mb-8 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Quick ATS Check</h2>
          <p className="text-gray-500 text-sm">
            Upload any resume (PDF) and a job description — get an instant ATS match score.
            No account resume needed.
          </p>
        </div>

        {/* Upload area */}
        <div className="animate-fade-in-up bg-white border border-gray-100 shadow-sm rounded-2xl p-6 mb-6">

          <label className="text-gray-600 text-sm mb-2 block font-medium">Resume (PDF)</label>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById('atsResumeInput').click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all mb-5 ${
              dragOver
                ? 'border-emerald-400 bg-emerald-50'
                : file
                ? 'border-emerald-300 bg-emerald-50/50'
                : 'border-gray-200 hover:border-emerald-300 bg-gray-50/50'
            }`}
          >
            <input
              id="atsResumeInput"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            {file ? (
              <>
                <p className="text-3xl mb-2">📄</p>
                <p className="text-gray-900 text-sm font-medium">{file.name}</p>
                <p className="text-gray-500 text-xs mt-1">
                  {(file.size / 1024 / 1024).toFixed(2)} MB — click to change
                </p>
              </>
            ) : (
              <>
                <p className="text-3xl mb-2">📁</p>
                <p className="text-gray-600 text-sm">Drag & drop your resume PDF here</p>
                <p className="text-gray-400 text-xs mt-1">or click to browse</p>
              </>
            )}
          </div>

          <label className="text-gray-600 text-sm mb-2 block font-medium">Job Description</label>
          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the full job description here..."
            rows={8}
            className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent resize-none transition-all"
          />

          <button
            onClick={handleCheck}
            disabled={!file || !jobDescription.trim() || loading}
            className="mt-4 w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-200 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm transition-all shadow-sm"
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
            <p className="text-red-500 text-sm mt-3">⚠️ {error}</p>
          )}
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-6">

            {/* Score */}
            <div className={`animate-fade-in-up border rounded-2xl p-8 text-center ${getScoreBg(result.atsScore)}`}>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-2 font-medium">ATS Match Score</p>
              <p className={`text-6xl font-bold ${getScoreColor(result.atsScore)}`}>
                {result.atsScore}
                <span className="text-3xl text-gray-400">/100</span>
              </p>
              <p className={`text-sm mt-2 font-medium ${getScoreColor(result.atsScore)}`}>
                {getScoreLabel(result.atsScore)}
              </p>
              <div className="w-full h-2 bg-white rounded-full overflow-hidden mt-4 max-w-md mx-auto">
                <div
                  className={`h-full rounded-full transition-all ${getScoreBar(result.atsScore)}`}
                  style={{ width: `${result.atsScore}%` }}
                />
              </div>
            </div>

            {/* Summary */}
            <div className="animate-fade-in-up bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-3 font-medium">Summary</p>
              <p className="text-gray-700 text-sm leading-relaxed">{result.summary}</p>
            </div>

            {/* Keywords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="animate-fade-in-up bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
                <p className="text-emerald-600 text-xs uppercase tracking-wider mb-4 font-medium">
                  ✓ Matched Keywords ({result.matchedKeywords?.length || 0})
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.matchedKeywords?.map((kw, i) => (
                    <span key={i} className="text-xs bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg">
                      {kw}
                    </span>
                  ))}
                  {result.matchedKeywords?.length === 0 && (
                    <p className="text-gray-400 text-sm">No matches found</p>
                  )}
                </div>
              </div>

              <div className="animate-fade-in-up bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
                <p className="text-red-500 text-xs uppercase tracking-wider mb-4 font-medium">
                  ✕ Missing Keywords ({result.missingKeywords?.length || 0})
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords?.map((kw, i) => (
                    <span key={i} className="text-xs bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg">
                      {kw}
                    </span>
                  ))}
                  {result.missingKeywords?.length === 0 && (
                    <p className="text-gray-400 text-sm">Great! Nothing missing</p>
                  )}
                </div>
              </div>
            </div>

            {/* Format Issues */}
            {result.formatIssues?.length > 0 && (
              <div className="animate-fade-in-up bg-white border border-amber-100 shadow-sm rounded-2xl p-6">
                <p className="text-amber-600 text-xs uppercase tracking-wider mb-4 font-medium">⚠ Format Issues</p>
                <ul className="space-y-2">
                  {result.formatIssues.map((issue, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-700 text-sm">
                      <span className="text-amber-500 mt-0.5">⚠</span>
                      {issue}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Strengths */}
            <div className="animate-fade-in-up bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
              <p className="text-emerald-600 text-xs uppercase tracking-wider mb-4 font-medium">✓ Strengths</p>
              <ul className="space-y-2">
                {result.strengths?.map((s, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-700 text-sm">
                    <span className="text-emerald-500 mt-0.5">✓</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>

            {/* Suggestions */}
            <div className="animate-fade-in-up bg-white border border-gray-100 shadow-sm rounded-2xl p-6">
              <p className="text-purple-600 text-xs uppercase tracking-wider mb-4 font-medium">💡 How to Improve</p>
              <ul className="space-y-3">
                {result.suggestions?.map((sug, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="bg-purple-100 text-purple-600 text-xs w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 font-semibold">
                      {i + 1}
                    </span>
                    <span className="text-gray-700 text-sm">{sug}</span>
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

export default ATSCheck