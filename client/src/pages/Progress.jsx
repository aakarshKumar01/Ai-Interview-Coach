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
    hr: '#10b981',
    technical: '#f59e0b',
    mixed: '#8b5cf6',
    coding: '#f43f5e',
  }

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
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#F0E0C8' }}>
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-emerald-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-gray-900" style={{ background: '#F0E0C8' }}>
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 py-10">

        <div className="mb-8 animate-fade-in-up">
          <h2 className="text-3xl font-bold text-gray-900">Your Progress</h2>
          <p className="text-gray-500 text-sm mt-2">
            Track your improvement over time across all interviews.
          </p>
        </div>

        {stats.totalInterviews === 0 ? (
          <div className="animate-fade-in-up bg-white border border-gray-100 shadow-sm rounded-2xl p-16 text-center">
            <p className="text-4xl mb-3">📈</p>
            <p className="text-gray-500 text-sm">No data yet</p>
            <p className="text-gray-400 text-xs mt-1 mb-6">
              Complete your first interview to see your progress
            </p>
            <button
              onClick={() => navigate('/practice')}
              className="animate-pulse-glow bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-all shadow-sm"
            >
              Start an Interview →
            </button>
          </div>
        ) : (
          <>
            {/* Top stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="animate-fade-in-up delay-100 card-hover bg-white border border-orange-100 rounded-2xl p-5 shadow-sm">
                <p className="text-2xl mb-1">🎤</p>
                <p className="text-xl font-semibold text-orange-500">{stats.totalInterviews}</p>
                <p className="text-gray-500 text-xs mt-1">Total Interviews</p>
              </div>
              <div className="animate-fade-in-up delay-200 card-hover bg-white border border-emerald-100 rounded-2xl p-5 shadow-sm">
                <p className="text-2xl mb-1">📊</p>
                <p className="text-xl font-semibold text-emerald-600">{stats.avgScore}/10</p>
                <p className="text-gray-500 text-xs mt-1">Average Score</p>
              </div>
              <div className="animate-fade-in-up delay-300 card-hover bg-white border border-amber-100 rounded-2xl p-5 shadow-sm">
                <p className="text-2xl mb-1">🏆</p>
                <p className="text-xl font-semibold text-amber-500">
                  {Math.max(...stats.scoreHistory.map(s => s.score))}/10
                </p>
                <p className="text-gray-500 text-xs mt-1">Best Score</p>
              </div>
              <div className="animate-fade-in-up delay-400 card-hover bg-white border border-rose-100 rounded-2xl p-5 shadow-sm">
                <p className="text-2xl mb-1">📌</p>
                <p className="text-xl font-semibold text-rose-500">{stats.weakTopics.length}</p>
                <p className="text-gray-500 text-xs mt-1">Areas to Improve</p>
              </div>
            </div>

            {/* Score Trend Chart */}
            <div className="animate-fade-in-up bg-white border border-gray-100 shadow-sm rounded-2xl p-6 mb-6">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-4 font-medium">
                Score Trend Over Time
              </p>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0e0c8" />
                  <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                  <YAxis domain={[0, 10]} stroke="#9ca3af" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    }}
                    labelStyle={{ color: '#111' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    dot={{ fill: '#10b981', r: 5, strokeWidth: 2, stroke: '#fff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Performance by Type */}
            <div className="animate-fade-in-up bg-white border border-gray-100 shadow-sm rounded-2xl p-6 mb-6">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-4 font-medium">
                Performance by Interview Type
              </p>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0e0c8" />
                  <XAxis dataKey="type" stroke="#9ca3af" fontSize={12} />
                  <YAxis domain={[0, 10]} stroke="#9ca3af" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: '#fff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    }}
                    labelStyle={{ color: '#111' }}
                  />
                  <Bar dataKey="avgScore" radius={[8, 8, 0, 0]}>
                    {barData.map((entry, i) => (
                      <Cell key={i} fill={typeColors[entry.rawType] || '#10b981'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Weak Topics */}
            {stats.weakTopics.length > 0 && (
              <div className="animate-fade-in-up bg-white border border-amber-100 shadow-sm rounded-2xl p-6 mb-6">
                <p className="text-amber-600 text-xs uppercase tracking-wider mb-4 font-medium">
                  ⚠ Recurring Weak Areas
                </p>
                <div className="flex flex-wrap gap-2">
                  {stats.weakTopics.map((topic, i) => (
                    <span key={i} className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-lg">
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Session History Table */}
            <div className="animate-fade-in-up bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden">
              <p className="text-gray-500 text-xs uppercase tracking-wider p-6 pb-4 font-medium">
                Session History
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-t border-gray-100 text-gray-400 text-xs uppercase">
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
                        className="border-t border-gray-50 hover:bg-orange-50 cursor-pointer transition-all"
                      >
                        <td className="px-6 py-3 capitalize text-gray-900 font-medium">{session.type}</td>
                        <td className="px-6 py-3 capitalize text-gray-500">{session.difficulty}</td>
                        <td className="px-6 py-3 text-gray-500">
                          {new Date(session.date).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric',
                          })}
                        </td>
                        <td className={`px-6 py-3 text-right font-semibold ${
                          session.score >= 8 ? 'text-emerald-600' :
                          session.score >= 6 ? 'text-amber-500' : 'text-red-500'
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