import dns from 'dns'
dns.setDefaultResultOrder('ipv4first')
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
dotenv.config()


const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

export const sendOTPEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"AI Interview Coach" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset OTP',
    html: `
      <div style="font-family: sans-serif; max-width: 400px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2dd4bf;">AI Interview Coach</h2>
        <p>You requested to reset your password. Use the OTP below:</p>
        <div style="background: #f0f0f0; padding: 16px; text-align: center; border-radius: 8px; margin: 16px 0;">
          <span style="font-size: 28px; font-weight: bold; letter-spacing: 4px;">${otp}</span>
        </div>
        <p style="color: #666; font-size: 14px;">This OTP will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
      </div>
    `,
  })
}