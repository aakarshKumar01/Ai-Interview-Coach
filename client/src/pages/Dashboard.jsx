import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ResumeUpload from '../components/ResumeUpload'
import Navbar from '../components/Navbar'
import api from '../utils/api'

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showUpload, setShowUpload] = useState(false)
  const [stats, setStats] = useState({
    totalInterviews: 0,
    avgScore: null,
    weakTopics: [],
    recentSessions: [],
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/stats')
      setStats(data.stats)
    } catch (err) {
      console.error(err)
    }
  }

  const handleUploadSuccess = () => {
    setShowUpload(false)
    window.location.reload()
  }

  return (
    <div className="min-h-screen text-gray-900" style={{ background: '#F0E0C8' }}>
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Welcome */}
        <div className="mb-10 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-gray-900">
            Welcome back, <span className="gradient-text-light">{user?.name?.split(' ')[0]}</span> 👋
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            Ready to practice today? Head to Practice Hub to get started.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <div className="animate-fade-in-up delay-100 card-hover bg-white border border-orange-100 rounded-2xl p-5 shadow-sm">
            <p className="text-2xl mb-1">🎤</p>
            <p className="text-xl font-semibold text-orange-500">{stats.totalInterviews}</p>
            <p className="text-gray-500 text-xs mt-1">Interviews Done</p>
          </div>
          <div className="animate-fade-in-up delay-200 card-hover bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm">
            <p className="text-2xl mb-1">📊</p>
            <p className="text-xl font-semibold text-emerald-600">{stats.avgScore ? `${stats.avgScore}/10` : '--'}</p>
            <p className="text-gray-500 text-xs mt-1">Avg Score</p>
          </div>
          <div className="animate-fade-in-up delay-300 card-hover bg-white border border-rose-100 rounded-2xl p-5 shadow-sm">
            <p className="text-2xl mb-1">📌</p>
            <p className="text-xl font-semibold text-rose-500">{stats.weakTopics.length > 0 ? stats.weakTopics.length : '--'}</p>
            <p className="text-gray-500 text-xs mt-1">Weak Topics</p>
          </div>
          <div className="animate-fade-in-up delay-400 card-hover bg-white border border-amber-100 rounded-2xl p-5 shadow-sm">
            <p className="text-2xl mb-1">🔥</p>
            <p className="text-xl font-semibold text-amber-500">0 days</p>
            <p className="text-gray-500 text-xs mt-1">Current Streak</p>
          </div>
        </div>

        {/* Resume banner */}
        {!user?.resume?.originalName ? (
          <div className="animate-fade-in-up card-hover bg-emerald-50 border border-emerald-100 rounded-2xl p-5 mb-10 flex items-center justify-between shadow-sm">
            <div>
              <p className="text-emerald-700 font-medium text-sm">Upload your resume</p>
              <p className="text-gray-500 text-xs mt-1">
                AI will generate personalized questions from your resume
              </p>
            </div>
            <button
              onClick={() => setShowUpload(true)}
              className="animate-pulse-glow bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-sm"
            >
              Upload PDF →
            </button>
          </div>
        ) : (
          <div className="animate-fade-in-up card-hover bg-white border border-gray-100 shadow-sm rounded-2xl p-5 mb-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📄</span>
              <div>
                <p className="text-gray-900 text-sm font-medium">{user.resume.originalName}</p>
                <p className="text-gray-500 text-xs mt-0.5">Uploaded · AI parsed ✓</p>
              </div>
            </div>
            <button
              onClick={() => setShowUpload(true)}
              className="text-emerald-600 hover:text-emerald-700 text-sm transition-all border border-emerald-200 hover:border-emerald-300 px-3 py-1.5 rounded-lg"
            >
              Replace
            </button>
          </div>
        )}

        {/* Quick CTA */}
        <div
          onClick={() => navigate('/practice')}
          className="animate-fade-in-up animate-pulse-glow card-hover relative overflow-hidden bg-gradient-to-br from-emerald-50 to-white border border-emerald-200 hover:border-emerald-400 rounded-2xl p-6 mb-10 flex items-center justify-between cursor-pointer transition-all group shadow-sm"
        >
          <div>
            <p className="text-gray-900 font-semibold text-lg">Ready for a mock interview?</p>
            <p className="text-gray-500 text-sm mt-1">
              Choose from HR, Technical, Mixed or Coding rounds
            </p>
          </div>
          <span className="text-emerald-600 text-sm font-medium group-hover:translate-x-1 transition-transform inline-block">
            Go to Practice Hub →
          </span>
        </div>

        {/* Recent sessions */}
        <p className="text-gray-500 text-sm font-medium mb-4 uppercase tracking-wider animate-fade-in-up">
          Recent Sessions
        </p>
        {stats.recentSessions.length === 0 ? (
          <div className="animate-fade-in-up bg-white border border-gray-100 shadow-sm rounded-2xl p-10 text-center">
            <p className="text-4xl mb-3">🎤</p>
            <p className="text-gray-500 text-sm">No interviews yet</p>
            <p className="text-gray-400 text-xs mt-1">
              Start your first interview to see results here
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {stats.recentSessions.map((session, i) => (
              <div
                key={i}
                onClick={() => navigate(`/feedback/${session.id}`)}
                className="animate-fade-in-up card-hover bg-white border border-gray-100 hover:border-emerald-300 shadow-sm rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">
                    {session.type === 'hr' ? '💼' : session.type === 'technical' ? '⚙️' : session.type === 'mixed' ? '🎯' : '💻'}
                  </span>
                  <div>
                    <p className="text-gray-900 text-sm font-medium capitalize">{session.type} Interview</p>
                    <p className="text-gray-500 text-xs mt-0.5">
                      {new Date(session.date).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-semibold ${
                    session.score >= 8 ? 'text-emerald-600' :
                    session.score >= 6 ? 'text-amber-500' : 'text-red-500'
                  }`}>
                    {session.score ? `${session.score}/10` : '--'}
                  </span>
                  <span className="text-gray-400 text-xs capitalize">{session.difficulty}</span>
                  <span className="text-gray-400">→</span>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {showUpload && (
        <ResumeUpload
          onUploadSuccess={handleUploadSuccess}
          onClose={() => setShowUpload(false)}
        />
      )}
    </div>
  )
}

export default Dashboard