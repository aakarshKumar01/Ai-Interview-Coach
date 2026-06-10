import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import ResumeUpload from '../components/ResumeUpload'

const Dashboard = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)
  const [showUpload, setShowUpload] = useState(false)

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
    },
    {
      icon: '⚙️',
      title: 'Technical Interview',
      desc: 'DSA, system design & coding',
      tag: 'Most Popular',
      tagColor: 'text-yellow-400 bg-yellow-400/10',
    },
    {
      icon: '🎯',
      title: 'Mixed Interview',
      desc: 'HR + Technical combined',
      tag: 'Recommended',
      tagColor: 'text-purple-400 bg-purple-400/10',
    },
    {
      icon: '💻',
      title: 'Coding Round',
      desc: 'Live DSA problem solving',
      tag: 'Advanced',
      tagColor: 'text-red-400 bg-red-400/10',
    },
  ]

  const stats = [
    { label: 'Interviews Done', value: '0', icon: '🎤' },
    { label: 'Avg Score', value: '--', icon: '📊' },
    { label: 'Weak Topics', value: '--', icon: '📌' },
    { label: 'Current Streak', value: '0 days', icon: '🔥' },
  ]

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* Navbar */}
      <nav className="border-b border-[#1a1a1a] px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-bold tracking-tight">AI Interview Coach</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-400 text-sm hidden md:block">
            {user?.resume?.originalName ? '📄 Resume uploaded' : '⚠️ No resume'}
          </span>
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-2 text-sm hover:border-teal-500 transition-all"
            >
              <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-black text-xs font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              {user?.name}
              <span className="text-gray-500">▾</span>
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-[#111] border border-[#222] rounded-xl overflow-hidden z-10">
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-[#1a1a1a] transition-all"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

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
          {stats.map((stat, i) => (
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
                <p className="text-gray-500 text-xs mt-0.5">
                  Uploaded · AI parsed ✓
                </p>
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

        {/* Interview types */}
        <p className="text-gray-400 text-sm font-medium mb-4 uppercase tracking-wider">
          Choose Interview Type
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          {interviewTypes.map((type, i) => (
            <div
              key={i}
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
                Start Interview <span>→</span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent sessions */}
        <p className="text-gray-400 text-sm font-medium mb-4 uppercase tracking-wider">
          Recent Sessions
        </p>
        <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-10 text-center">
          <p className="text-4xl mb-3">🎤</p>
          <p className="text-gray-400 text-sm">No interviews yet</p>
          <p className="text-gray-600 text-xs mt-1">
            Start your first interview to see results here
          </p>
        </div>

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