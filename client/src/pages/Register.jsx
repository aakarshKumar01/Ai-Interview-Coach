import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register(name, email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">

      {/* Subtle glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-teal-500 rounded-full filter blur-3xl opacity-5"></div>
      </div>

      <div className="relative w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-white tracking-tight">
            AI Interview Coach
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Practice. Improve. Get Hired.
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#111111] border border-[#222222] rounded-2xl p-8">

          <h2 className="text-xl font-semibold text-white mb-1">Create Account</h2>
          <p className="text-gray-500 text-sm mb-6">Start your interview preparation today</p>

          {/* Error */}
          {error && (
            <div className="mb-5 p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2">
              <span className="text-red-400 text-sm">⚠️ {error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name */}
            <div>
              <label className="text-gray-400 text-sm mb-1.5 block">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Aakarsh Kumar"
                required
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-all"
              />
            </div>

            {/* Email */}
            <div>
              <label className="text-gray-400 text-sm mb-1.5 block">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-gray-400 text-sm mb-1.5 block">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full bg-[#1a1a1a] border border-[#2a2a2a] text-white placeholder-gray-600 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 transition-all"
              />
              <p className="text-gray-600 text-xs mt-1">Minimum 6 characters</p>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-teal-500 hover:bg-teal-400 disabled:bg-teal-800 disabled:cursor-not-allowed text-black font-semibold py-3 rounded-xl transition-all duration-200 text-sm mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Creating account...
                </span>
              ) : 'Create Account →'}
            </button>

          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-[#222]"></div>
            <span className="text-gray-600 text-xs">or</span>
            <div className="flex-1 h-px bg-[#222]"></div>
          </div>

          <p className="text-center text-gray-500 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-teal-400 hover:text-teal-300 font-medium transition-colors">
              Sign in
            </Link>
          </p>

        </div>

        <p className="text-center text-gray-700 text-xs mt-6">
          AI Interview Coach © 2025
        </p>

      </div>
    </div>
  )
}

export default Register