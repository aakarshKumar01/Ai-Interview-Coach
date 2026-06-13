import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import ResumeUpload from '../components/ResumeUpload'
import Navbar from '../components/Navbar'
import api from '../utils/api'

const Dashboard = () => {

  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)
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

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleUploadSuccess = () => {
    setShowUpload(false)
    window.location.reload()
  }

  const interviewTypes = [
    {
      icon: '💼',
      title: 'HR Interview',
      desc: 'Behavioral & situational questions',
      tag: 'Beginner Friendly',
      tagColor: 'text-teal-400 bg-teal-400/10',
      route: 'hr',
    },
    {
      icon: '⚙️',
      title: 'Technical Interview',
      desc: 'DSA, system design & coding',
      tag: 'Most Popular',
      tagColor: 'text-yellow-400 bg-yellow-400/10',
      route: 'technical',
    },
    {
      icon: '🎯',
      title: 'Mixed Interview',
      desc: 'HR + Technical combined',
      tag: 'Recommended',
      tagColor: 'text-purple-400 bg-purple-400/10',
      route: 'mixed',
    },
    {
      icon: '💻',
      title: 'Coding Round',
      desc: 'Live DSA problem solving',
      tag: 'Advanced',
      tagColor: 'text-red-400 bg-red-400/10',
      route: 'coding',
    },
  ]

  const statCards = [
    { label: 'Interviews Done', value: stats.totalInterviews, icon: '🎤' },
    { label: 'Avg Score', value: stats.avgScore ? `${stats.avgScore}/10` : '--', icon: '📊' },
    { label: 'Weak Topics', value: stats.weakTopics.length > 0 ? stats.weakTopics.length : '--', icon: '📌' },
    { label: 'Current Streak', value: '0 days', icon: '🔥' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

     < Navbar />
      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Welcome */}
        <div className="mb-10">
          <h2 className="text-2xl font-semibold">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h2>
          <p className="text-gray-500 mt-1 text-sm">
            Ready to practice today? Pick an interview type to get started.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {statCards.map((stat, i) => (
            <div key={i} className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-5">
              <p className="text-2xl mb-1">{stat.icon}</p>
              <p className="text-xl font-semibold">{stat.value}</p>
              <p className="text-gray-500 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Resume banner */}
        {!user?.resume?.originalName ? (
          <div className="bg-teal-500/10 border border-teal-500/20 rounded-2xl p-5 mb-10 flex items-center justify-between">
            <div>
              <p className="text-teal-400 font-medium text-sm">Upload your resume</p>
              <p className="text-gray-500 text-xs mt-1">
                AI will generate personalized questions from your resume
              </p>
            </div>
            <button
              onClick={() => setShowUpload(true)}
              className="bg-teal-500 hover:bg-teal-400 text-black text-sm font-semibold px-4 py-2 rounded-xl transition-all"
            >
              Upload PDF →
            </button>
          </div>
        ) : (
          <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-5 mb-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">📄</span>
              <div>
                <p className="text-white text-sm font-medium">{user.resume.originalName}</p>
                <p className="text-gray-500 text-xs mt-0.5">Uploaded · AI parsed ✓</p>
              </div>
            </div>
            <button
              onClick={() => setShowUpload(true)}
              className="text-teal-400 hover:text-teal-300 text-sm transition-all border border-teal-500/30 px-3 py-1.5 rounded-lg"
            >
              Replace
            </button>
          </div>
        )}

        {/* ATS Checker Card */}
        <div
          onClick={() => navigate('/ats-checker')}
          className="bg-[#111] border border-[#1a1a1a] hover:border-purple-500/50 rounded-2xl p-5 mb-10 flex items-center justify-between cursor-pointer transition-all group"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">📄</span>
            <div>
              <p className="text-white text-sm font-medium">ATS Resume Checker</p>
              <p className="text-gray-500 text-xs mt-0.5">
                Check how well your resume matches any job description
              </p>
            </div>
          </div>
          <span className="text-purple-400 text-sm opacity-0 group-hover:opacity-100 transition-all">
            Check now →
          </span>
        </div>

        {/* Interview types */}
        <p className="text-gray-400 text-sm font-medium mb-4 uppercase tracking-wider">
          Choose Interview Type
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {interviewTypes.map((type, i) => (
            <div
              key={i}
              onClick={() => navigate(`/interview/${type.route}`)}
              className="bg-[#111] border border-[#1a1a1a] hover:border-teal-500/50 rounded-2xl p-6 cursor-pointer transition-all group"
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{type.icon}</span>
                <span className={`text-xs px-2 py-1 rounded-lg font-medium ${type.tagColor}`}>
                  {type.tag}
                </span>
              </div>
              <h3 className="text-white font-semibold mb-1">{type.title}</h3>
              <p className="text-gray-500 text-sm">{type.desc}</p>
              <div className="mt-4 flex items-center gap-2 text-teal-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-all">
                Start Interview →
              </div>
            </div>
          ))}
        </div>

        {/* Recent sessions */}
        {/* Recent sessions */}
<p className="text-gray-400 text-sm font-medium mb-4 uppercase tracking-wider">
  Recent Sessions
</p>
{stats.recentSessions.length === 0 ? (
  <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-10 text-center">
    <p className="text-4xl mb-3">🎤</p>
    <p className="text-gray-400 text-sm">No interviews yet</p>
    <p className="text-gray-600 text-xs mt-1">
      Start your first interview to see results here
    </p>
  </div>
) : (
  <div className="flex flex-col gap-3">
    {stats.recentSessions.map((session, i) => (
      <div
        key={i}
        onClick={() => navigate(`/feedback/${session.id}`)}
        className="bg-[#111] border border-[#1a1a1a] hover:border-teal-500/50 rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">
            {session.type === 'hr' ? '💼' : session.type === 'technical' ? '⚙️' : session.type === 'mixed' ? '🎯' : '💻'}
          </span>
          <div>
            <p className="text-white text-sm font-medium capitalize">{session.type} Interview</p>
            <p className="text-gray-500 text-xs mt-0.5">
              {new Date(session.date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className={`text-sm font-semibold ${
            session.score >= 8 ? 'text-teal-400' :
            session.score >= 6 ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {session.score ? `${session.score}/10` : '--'}
          </span>
                  <span className="text-gray-600 text-xs capitalize">{session.difficulty}</span>
                  <span className="text-gray-600">→</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resume Upload Modal */}
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