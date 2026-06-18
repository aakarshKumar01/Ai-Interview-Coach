import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import { sendOTPEmail } from '../config/email.js'

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}


// @desc   Send OTP for password reset
// @route  POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email',
      })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'No account found with this email',
      })
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    user.resetOTP = otp
    user.resetOTPExpiry = Date.now() + 10 * 60 * 1000
    await user.save()

    await sendOTPEmail(email, otp)

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email',
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc   Verify OTP
// @route  POST /api/auth/verify-otp
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    if (user.resetOTP !== otp || Date.now() > user.resetOTPExpiry) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP',
      })
    }

    res.status(200).json({
      success: true,
      message: 'OTP verified',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc   Reset password with verified OTP
// @route  POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters',
      })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    if (user.resetOTP !== otp || Date.now() > user.resetOTPExpiry) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired OTP',
      })
    }

    // Naya password hash karo
    const salt = await bcrypt.genSalt(12)
    user.password = await bcrypt.hash(newPassword, salt)
    user.resetOTP = undefined
    user.resetOTPExpiry = undefined
    await user.save()

    res.status(200).json({
      success: true,
      message: 'Password reset successful',
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Register user
// @route   POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all fields',
      })
    }

    // Check user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      })
    }

    // Hash password
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    })

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        resume: user.resume,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      })
    }

    // Check user exists
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        resume: user.resume,
      },
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// @desc    Get current user
// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}