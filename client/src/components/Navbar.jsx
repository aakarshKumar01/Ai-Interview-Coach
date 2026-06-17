import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [showDropdown, setShowDropdown] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navLinks = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Practice Hub', path: '/practice' },
    { label: 'Progress', path: '/progress' },
    { label: 'ATS Check', path: '/ats-check' },
    { label: 'Resources', path: '/resources' },
  ]

  return (
    <nav className="relative bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl mx-6 mt-4 px-6 py-4 flex items-center justify-between shadow-sm">

      {/* Left — Logo */}
      <h1
        onClick={() => navigate('/dashboard')}
        className="text-lg font-bold tracking-tight cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, #059669, #f59e0b)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        AI Interview Coach
      </h1>

      {/* Center — Nav links */}
      <div className="hidden md:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
        {navLinks.map((link) => (
          <span
            key={link.path}
            onClick={() => navigate(link.path)}
            className={`text-sm cursor-pointer transition-all px-3 py-1.5 rounded-lg ${
              location.pathname === link.path
                ? 'text-emerald-700 font-semibold bg-emerald-50 border border-emerald-200'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
            }`}
          >
            {link.label}
          </span>
        ))}
      </div>

      {/* Right — User */}
      <div className="flex items-center gap-4">
        <span className="text-gray-400 text-sm hidden md:block">
          {user?.resume?.originalName ? '📄 Resume uploaded' : '⚠️ No resume'}
        </span>
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 bg-gradient-to-r from-emerald-50 to-amber-50 border border-emerald-200 rounded-xl px-4 py-2 text-sm hover:border-emerald-400 transition-all text-gray-900"
          >
            <div className="w-6 h-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            {user?.name}
            <span className="text-gray-400">▾</span>
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 shadow-lg rounded-xl overflow-hidden z-10">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-all"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar