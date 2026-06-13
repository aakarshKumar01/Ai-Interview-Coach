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
    { label: 'Resources', path: '/resources' },
  ]

  return (
    <nav className="relative border-b border-[#1a1a1a] px-6 py-4 flex items-center justify-between">

      {/* Left — Logo */}
      <h1
        onClick={() => navigate('/dashboard')}
        className="text-lg font-bold tracking-tight cursor-pointer"
      >
        AI Interview Coach
      </h1>

      {/* Center — Nav links */}
      <div className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
        {navLinks.map((link) => (
          <span
            key={link.path}
            onClick={() => navigate(link.path)}
            className={`text-sm cursor-pointer transition-all ${
              location.pathname === link.path
                ? 'text-teal-400 font-medium'
                : 'text-gray-500 hover:text-white'
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
            className="flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl px-4 py-2 text-sm hover:border-teal-500 transition-all"
          >
            <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center text-black text-xs font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            {user?.name}
            <span className="text-gray-500">▾</span>
          </button>
          {showDropdown && (
            <div className="absolute right-0 mt-2 w-40 bg-[#111] border border-[#222] rounded-xl overflow-hidden z-10">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-[#1a1a1a] transition-all"
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