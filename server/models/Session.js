import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['assistant', 'user'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
})

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['hr', 'technical', 'mixed', 'coding'],
      required: true,
    },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'abandoned'],
      default: 'active',
    },
    messages: [messageSchema],
    totalQuestions: {
      type: Number,
      default: 5,
    },
    questionsAsked: {
      type: Number,
      default: 0,
    },
    feedback: {
      overallScore: Number,
      weakTopics: [String],
      strengths: [String],
      improvements: [String],
      fillerWordCount: Number,
      confidenceScore: Number,
      detailedFeedback: String,
    },
  },
  { timestamps: true }
)

const Session = mongoose.model('Session', sessionSchema)
export default Session