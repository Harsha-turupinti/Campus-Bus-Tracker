import React, { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { FiEye, FiEyeOff, FiMail, FiLock, FiShield, FiArrowRight } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

export default function AdminLogin() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (user?.isAdmin) {
    return <Navigate to="/admin" replace />
  }

  function validate() {
    const e = {}
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email'
    if (!password || password.length < 6) e.password = 'Password must be at least 6 characters'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(ev) {
    ev.preventDefault()
    setFormError('')
    if (!validate()) return
    setSubmitting(true)
    try {
      await login({ email, password, role: 'admin' })
      navigate('/admin', { replace: true })
    } catch (error) {
      setFormError(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex dark:bg-slate-950 bg-gray-50 transition-colors duration-300">
      
      {/* Left — Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-slate-900 via-amber-950/40 to-slate-900">
        <div className="absolute inset-0 bg-dot-pattern opacity-40" />
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-float-delayed" />
        
        <div className="relative z-10 flex flex-col justify-center px-16 text-white">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-8 shadow-2xl shadow-amber-500/30">
            <FiShield className="text-3xl" />
          </div>
          <h1 className="text-4xl font-extrabold leading-tight mb-4">
            Admin<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-400">Control Panel</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-md leading-relaxed mb-8">
            Manage routes, buses, schedules, and monitor the entire Campus transport fleet from one dashboard.
          </p>
          <div className="space-y-4">
            {['Fleet Management', 'Route Configuration', 'Delay & Analytics'].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-amber-400" />
                </div>
                <span className="text-sm font-medium text-slate-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-10">
        <div className="w-full max-w-md animate-fade-in">
          
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-10">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
              <FiShield className="text-white text-xl" />
            </div>
            <span className="text-xl font-extrabold dark:text-white text-slate-900">
              Admin <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-400">Panel</span>
            </span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-extrabold dark:text-white text-slate-900 mb-2">Admin Sign In</h2>
            <p className="text-sm dark:text-slate-400 text-slate-500">Enter your admin credentials to access the dashboard.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold dark:text-slate-300 text-slate-700 mb-2">
                <span className="flex items-center gap-2"><FiMail className="text-slate-400" /> Admin Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={`w-full rounded-xl px-4 py-3.5 text-sm dark:bg-slate-800/60 bg-white border ${
                  errors.email ? 'border-red-400' : 'dark:border-slate-700 border-slate-300'
                } dark:text-white text-slate-900 placeholder-slate-400 dark:placeholder-slate-500 focus:border-amber-500 outline-none transition-all duration-200`}
                placeholder="admin@vardhaman.org"
                aria-invalid={!!errors.email}
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && <p id="email-error" className="text-xs text-red-400 mt-1.5 font-medium">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold dark:text-slate-300 text-slate-700 mb-2">
                <span className="flex items-center gap-2"><FiLock className="text-slate-400" /> Password</span>
              </label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={`w-full rounded-xl px-4 py-3.5 pr-12 text-sm dark:bg-slate-800/60 bg-white border ${
                    errors.password ? 'border-red-400' : 'dark:border-slate-700 border-slate-300'
                  } dark:text-white text-slate-900 placeholder-slate-400 dark:placeholder-slate-500 focus:border-amber-500 outline-none transition-all duration-200`}
                  placeholder="••••••••"
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShow(s => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg dark:text-slate-400 text-slate-500 dark:hover:text-white hover:text-slate-900 dark:hover:bg-slate-700 hover:bg-slate-100 transition"
                >
                  {show ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p id="password-error" className="text-xs text-red-400 mt-1.5 font-medium">{errors.password}</p>}
            </div>

            {formError && (
              <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 font-medium text-center">
                {formError}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-xl px-5 py-3.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-bold text-sm shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In <FiArrowRight />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm dark:text-slate-500 text-slate-400">
            Need help? <span className="dark:text-amber-400 text-amber-600 font-semibold">Contact your system administrator</span>
          </p>
        </div>
      </div>
    </div>
  )
}
