import Session from '../models/Session.js'

export const getUserStats = async (req, res) => {
  try {
    const sessions = await Session.find({
      userId: req.user.id,
      status: 'completed',
    })

    if (sessions.length === 0) {
      return res.status(200).json({
        success: true,
        stats: {
          totalInterviews: 0,
          avgScore: null,
          weakTopics: [],
          recentSessions: [],
          scoreHistory: [],
          performanceByType: [],
          allSessions: [],
        },
      })
    }

    // Average score
    const avgScore = (
      sessions.reduce((sum, s) => sum + (s.feedback?.overallScore || 0), 0) /
      sessions.length
    ).toFixed(1)

    // Weak topics — sabse zyada repeat hone wale
    const allWeakTopics = sessions.flatMap(s => s.feedback?.weakTopics || [])
    const topicCount = {}
    allWeakTopics.forEach(t => {
      topicCount[t] = (topicCount[t] || 0) + 1
    })
    const weakTopics = Object.entries(topicCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([topic]) => topic)

    // Recent sessions — last 5
    const recentSessions = sessions
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(s => ({
        id: s._id,
        type: s.type,
        difficulty: s.difficulty,
        score: s.feedback?.overallScore || null,
        date: s.createdAt,
      }))

    // Score history — chronological order for chart
    const scoreHistory = [...sessions]
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      .map(s => ({
        date: s.createdAt,
        score: s.feedback?.overallScore || 0,
        type: s.type,
      }))

    // Performance by interview type
    const typeStats = {}
    sessions.forEach(s => {
      if (!typeStats[s.type]) {
        typeStats[s.type] = { total: 0, count: 0 }
      }
      typeStats[s.type].total += s.feedback?.overallScore || 0
      typeStats[s.type].count += 1
    })
    const performanceByType = Object.entries(typeStats).map(([type, data]) => ({
      type,
      avgScore: (data.total / data.count).toFixed(1),
      count: data.count,
    }))

    // All sessions — full history table
    const allSessions = [...sessions]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map(s => ({
        id: s._id,
        type: s.type,
        difficulty: s.difficulty,
        score: s.feedback?.overallScore || null,
        date: s.createdAt,
      }))

    res.status(200).json({
      success: true,
      stats: {
        totalInterviews: sessions.length,
        avgScore,
        weakTopics,
        recentSessions,
        scoreHistory,
        performanceByType,
        allSessions,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}