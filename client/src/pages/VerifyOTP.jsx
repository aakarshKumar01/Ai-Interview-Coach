import { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import api from '../utils/api'

const VerifyOTP = () => {
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email

  if (!email) {
    navigate('/forgot-password')
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/auth/verify-otp', { email, otp })
      navigate('/reset-password', { state: { email, otp } })
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#F0E0C8' }}>
      <div className="relative w-full max-w-md animate-fade-in-up">

        <div className="text-center mb-10">
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #059669, #f59e0b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            AI Interview Coach
          </h1>
          <p className="text-gray-600 mt-2 text-sm">
            Reset your password
          </p>
        </div>

        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-8">

          <h2 className="text-xl font-semibold text-gray-900 mb-1">Enter OTP</h2>
          <p className="text-gray-500 text-sm mb-6">
            We sent a 6-digit code to <span className="text-emerald-600 font-medium">{email}</span>
          </p>

          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2">
              <span className="text-red-600 text-sm">⚠️ {error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-gray-600 text-sm mb-1.5 block font-medium">
                One-Time Code
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                maxLength={6}
                required
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-300 rounded-xl px-4 py-3 text-center text-2xl tracking-[0.5em] font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all"
              />
              <p className="text-gray-400 text-xs mt-1.5">Code expires in 10 minutes</p>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-200 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-all duration-200 text-sm mt-2 shadow-sm"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Verifying...
                </span>
              ) : 'Verify Code →'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            <Link to="/forgot-password" className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
              ← Resend code
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}

export default VerifyOTP