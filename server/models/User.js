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
        name: String,
        email: String,
        phone: String,
        skills: [String],
        experience: [
          {
            company: String,
            role: String,
            duration: String,
          }
        ],
        projects: [
          {
            name: String,
            description: String,
            technologies: [String],
          }
        ],
        education: [
          {
            degree: String,
            institution: String,
            year: String,
          }
        ],
      },
      uploadedAt: Date,
    },
  },
  { timestamps: true }
)

const User = mongoose.model('User', userSchema)
export default User