import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { FiGrid, FiMap, FiTruck, FiClock, FiBell, FiBarChart, FiShield, FiLogOut } from 'react-icons/fi'
import { useAuth } from '../context/AuthContext'

const items = [
  { label: 'Dashboard', path: '/admin', icon: FiGrid, end: true },
  { label: 'Routes', path: '/admin/routes', icon: FiMap },
  { label: 'Buses', path: '/admin/buses', icon: FiTruck },
  { label: 'Schedules', path: '/admin/schedules', icon: FiClock },
  { label: 'Delays', path: '/admin/delays', icon: FiBell },
  { label: 'Analytics', path: '/admin/analytics', icon: FiBarChart },
]

export default function Sidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="glass p-5 rounded-3xl min-h-[90vh] flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
          <FiShield className="text-white text-lg" />
        </div>
        <div>
          <h2 className="text-base font-extrabold dark:text-white text-slate-900">Admin</h2>
          <p className="text-[10px] dark:text-slate-500 text-slate-400 font-medium">Transport Management</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1.5 flex-1">
        {items.map(item => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive 
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' 
                    : 'dark:text-slate-400 text-slate-600 dark:hover:bg-slate-800/60 hover:bg-slate-100 hover:text-slate-900 dark:hover:text-slate-200 border border-transparent'
                }`
              }
            >
              <Icon className="text-base" />
              {item.label}
            </NavLink>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="pt-4 border-t dark:border-slate-800/40 border-slate-200/40 mt-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold w-full dark:text-slate-400 text-slate-500 dark:hover:text-red-400 hover:text-red-600 dark:hover:bg-red-500/10 hover:bg-red-50 transition-all duration-200"
        >
          <FiLogOut className="text-base" />
          Logout
        </button>
      </div>
    </div>
  )
}
