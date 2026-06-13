import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import Navbar from '../components/Navbar'
import api from '../utils/api'

const Progress = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalInterviews: 0,
    avgScore: null,
    weakTopics: [],
    scoreHistory: [],
    performanceByType: [],
    allSessions: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/stats')
      setStats(data.stats)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const typeLabels = {
    hr: 'HR',
    technical: 'Technical',
    mixed: 'Mixed',
    coding: 'Coding',
  }

  const typeColors = {
    hr: '#2dd4bf',
    technical: '#facc15',
    mixed: '#a78bfa',
    coding: '#f87171',
  }

  // Chart data ready karo
  const chartData = stats.scoreHistory.map((s, i) => ({
    name: `#${i + 1}`,
    score: s.score,
    type: s.type,
  }))

  const barData = stats.performanceByType.map(t => ({
    type: typeLabels[t.type] || t.type,
    avgScore: parseFloat(t.avgScore),
    rawType: t.type,
  }))

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-teal-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">

        <div className="mb-8">
          <h2 className="text-2xl font-semibold">Your Progress</h2>
          <p className="text-gray-500 text-sm mt-1">
            Track your improvement over time across all interviews.
          </p>
        </div>

        {stats.totalInterviews === 0 ? (
          <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-16 text-center">
            <p className="text-4xl mb-3">📈</p>
            <p className="text-gray-400 text-sm">No data yet</p>
            <p className="text-gray-600 text-xs mt-1 mb-6">
              Complete your first interview to see your progress
            </p>
            <button
              onClick={() => navigate('/practice')}
              className="bg-teal-500 hover:bg-teal-400 text-black text-sm font-semibold px-6 py-2.5 rounded-xl transition-all"
            >
              Start an Interview →
            </button>
          </div>
        ) : (
          <>
            {/* Top stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-5">
                <p className="text-2xl mb-1">🎤</p>
                <p className="text-xl font-semibold">{stats.totalInterviews}</p>
                <p className="text-gray-500 text-xs mt-1">Total Interviews</p>
              </div>
              <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-5">
                <p className="text-2xl mb-1">📊</p>
                <p className="text-xl font-semibold">{stats.avgScore}/10</p>
                <p className="text-gray-500 text-xs mt-1">Average Score</p>
              </div>
              <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-5">
                <p className="text-2xl mb-1">🏆</p>
                <p className="text-xl font-semibold">
                  {Math.max(...stats.scoreHistory.map(s => s.score))}/10
                </p>
                <p className="text-gray-500 text-xs mt-1">Best Score</p>
              </div>
              <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-5">
                <p className="text-2xl mb-1">📌</p>
                <p className="text-xl font-semibold">{stats.weakTopics.length}</p>
                <p className="text-gray-500 text-xs mt-1">Areas to Improve</p>
              </div>
            </div>

            {/* Score Trend Chart */}
            <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-6 mb-6">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-4">
                Score Trend Over Time
              </p>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                  <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                  <YAxis domain={[0, 10]} stroke="#6b7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Line type="monotone" dataKey="score" stroke="#2dd4bf" strokeWidth={2} dot={{ fill: '#2dd4bf', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Performance by Type */}
            <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-6 mb-6">
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-4">
                Performance by Interview Type
              </p>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                  <XAxis dataKey="type" stroke="#6b7280" fontSize={12} />
                  <YAxis domain={[0, 10]} stroke="#6b7280" fontSize={12} />
                  <Tooltip
                    contentStyle={{ background: '#111', border: '1px solid #2a2a2a', borderRadius: '8px' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="avgScore" radius={[8, 8, 0, 0]}>
                    {barData.map((entry, i) => (
                      <Cell key={i} fill={typeColors[entry.rawType] || '#2dd4bf'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Weak Topics */}
            {stats.weakTopics.length > 0 && (
              <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl p-6 mb-6">
                <p className="text-yellow-400 text-xs uppercase tracking-wider mb-4">
                  ⚠ Recurring Weak Areas
                </p>
                <div className="flex flex-wrap gap-2">
                  {stats.weakTopics.map((topic, i) => (
                    <span key={i} className="text-xs bg-yellow-400/10 text-yellow-400 px-3 py-1.5 rounded-lg">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Session History Table */}
            <div className="bg-[#111] border border-[#1a1a1a] rounded-2xl overflow-hidden">
              <p className="text-gray-400 text-xs uppercase tracking-wider p-6 pb-4">
                Session History
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-t border-[#1a1a1a] text-gray-500 text-xs uppercase">
                      <th className="text-left px-6 py-3">Type</th>
                      <th className="text-left px-6 py-3">Difficulty</th>
                      <th className="text-left px-6 py-3">Date</th>
                      <th className="text-right px-6 py-3">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.allSessions.map((session, i) => (
                      <tr
                        key={i}
                        onClick={() => navigate(`/feedback/${session.id}`)}
                        className="border-t border-[#1a1a1a] hover:bg-[#1a1a1a] cursor-pointer transition-all"
                      >
                        <td className="px-6 py-3 capitalize text-white">{session.type}</td>
                        <td className="px-6 py-3 capitalize text-gray-400">{session.difficulty}</td>
                        <td className="px-6 py-3 text-gray-400">
                          {new Date(session.date).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </td>
                        <td className={`px-6 py-3 text-right font-semibold ${
                          session.score >= 8 ? 'text-teal-400' :
                          session.score >= 6 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {session.score ? `${session.score}/10` : '--'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  )
}

export default Progress