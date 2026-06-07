import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    resume: {
      originalName: String,
      extractedText: String,
      parsedData: {
        skills: [String],
        experience: [String],
        projects: [String],
        education: [String],
      },
      uploadedAt: Date,
    },
  },
  { timestamps: true }
)

const User = mongoose.model('User', userSchema)
export default User