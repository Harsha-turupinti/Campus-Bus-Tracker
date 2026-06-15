import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FiMap, FiBell, FiUser, FiHome, FiMoon, FiSun, FiLogOut, FiShield, FiCalendar, FiMenu, FiX } from 'react-icons/fi'
import { useTheme } from '../context/ThemeContext'
import { useAuth } from '../context/AuthContext'

const navLinks = [
  { to: '/', label: 'Dashboard', icon: FiHome },
  { to: '/schedule', label: 'Schedule', icon: FiCalendar },
  { to: '/live', label: 'Live Map', icon: FiMap },
  { to: '/notifications', label: 'Alerts', icon: FiBell },
  { to: '/profile', label: 'Profile', icon: FiUser },
]

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
    setMobileOpen(false)
  }

  return (
    <header className="glass sticky top-0 z-50 border-b border-slate-800/40 dark:border-slate-800/40 shadow-lg shadow-slate-950/10 dark:shadow-slate-950/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25 group-hover:shadow-cyan-500/40 transition-shadow">
              <FiMap className="text-white text-lg" />
            </div>
            <div className="hidden sm:block">
              <span className="text-base font-extrabold dark:text-white text-slate-900 tracking-tight">
                Campus <span className="text-gradient">Bus Tracker</span>
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-400 dark:text-cyan-300 shadow-sm'
                      : 'dark:text-slate-400 text-slate-600 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="text-[15px]" />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {user?.isAdmin && (
              <Link
                to="/admin"
                className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold dark:text-amber-400 text-amber-600 hover:bg-amber-500/10 transition"
              >
                <FiShield className="text-[15px]" />
                Admin
              </Link>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl dark:bg-slate-800/60 bg-slate-100 dark:hover:bg-slate-700 hover:bg-slate-200 transition-all duration-200 dark:text-slate-300 text-slate-600"
              aria-label="Toggle theme"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <FiSun className="w-4 h-4 text-amber-400" />
              ) : (
                <FiMoon className="w-4 h-4" />
              )}
            </button>

            {/* Auth Button */}
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold dark:bg-slate-800/60 bg-slate-100 dark:hover:bg-red-500/15 hover:bg-red-50 dark:text-slate-300 text-slate-600 dark:hover:text-red-400 hover:text-red-600 transition-all duration-200 border border-transparent dark:hover:border-red-500/20 hover:border-red-200"
              >
                <FiLogOut className="text-[15px]" />
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex items-center px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-200"
              >
                Login
              </Link>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 rounded-xl dark:bg-slate-800/60 bg-slate-100 dark:hover:bg-slate-700 hover:bg-slate-200 transition dark:text-slate-300 text-slate-600"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="lg:hidden border-t dark:border-slate-800/60 border-slate-200/60 animate-slide-up">
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-1">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-cyan-500/15 text-cyan-400'
                      : 'dark:text-slate-400 text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`
                }
              >
                <Icon className="text-base" />
                {label}
              </NavLink>
            ))}
            {user?.isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold dark:text-amber-400 text-amber-600 hover:bg-amber-500/10 transition"
              >
                <FiShield className="text-base" />
                Admin Panel
              </Link>
            )}
            <div className="pt-2 border-t dark:border-slate-800/40 border-slate-200/40">
              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold w-full dark:text-red-400 text-red-600 hover:bg-red-500/10 transition"
                >
                  <FiLogOut className="text-base" />
                  Logout
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
