import React from 'react'
import { useAuth } from '../context/AuthContext'
import { useDashboardData } from '../hooks/useDashboardData'
import { FiUser, FiMail, FiMapPin, FiTruck, FiNavigation, FiAlertCircle, FiShield, FiHash, FiArrowRight } from 'react-icons/fi'

export default function Profile() {
  const { user } = useAuth()
  const { data, loading, error } = useDashboardData(user?.college_email || user?.email)

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-14 h-14 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
        <p className="text-cyan-400 font-bold tracking-widest text-xs uppercase">Loading Profile...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass p-8 rounded-3xl text-center max-w-lg mx-auto animate-fade-in">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 flex items-center justify-center">
          <FiAlertCircle className="text-3xl text-red-400" />
        </div>
        <p className="text-red-400 font-bold text-lg">{error}</p>
      </div>
    )
  }

  // Info data (rendered explicitly below to keep Tailwind class names static)

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      
      {/* Profile Header */}
      <div className="glass p-6 md:p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-gradient-to-tr from-emerald-500/8 to-cyan-500/8 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex items-center gap-5">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-3xl font-extrabold text-white shadow-2xl shadow-cyan-500/30 shrink-0">
            {data?.student?.name?.[0] || 'S'}
          </div>
          <div className="min-w-0">
            <h2 className="text-2xl md:text-3xl font-extrabold dark:text-white text-slate-900 truncate">{data?.student?.name}</h2>
            <p className="dark:text-slate-400 text-slate-500 text-sm mt-1 truncate">{data?.student?.email}</p>
            <div className="flex items-center gap-2 mt-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-lg uppercase tracking-wider">
                <FiShield className="text-[10px]" /> Student
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg uppercase tracking-wider">
                Verified
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Student Info */}
        <div className="glass p-6 rounded-3xl hover:border-cyan-500/20 transition-all duration-300">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <FiUser className="text-cyan-400 text-sm" />
            </div>
            <h3 className="text-base font-bold dark:text-white text-slate-900">Student Info</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                <FiUser className="text-cyan-400 text-sm" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] dark:text-slate-500 text-slate-400 font-bold uppercase tracking-wider">Full Name</p>
                <p className="dark:text-slate-200 text-slate-800 font-semibold text-sm truncate mt-0.5">{data?.student?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                <FiMail className="text-blue-400 text-sm" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] dark:text-slate-500 text-slate-400 font-bold uppercase tracking-wider">College Email</p>
                <p className="dark:text-slate-200 text-slate-800 font-semibold text-sm truncate mt-0.5">{data?.student?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                <FiHash className="text-purple-400 text-sm" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] dark:text-slate-500 text-slate-400 font-bold uppercase tracking-wider">Student ID</p>
                <p className="dark:text-slate-200 text-slate-800 font-semibold text-sm truncate mt-0.5">#{data?.student?.id}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Transport Info */}
        <div className="glass p-6 rounded-3xl hover:border-emerald-500/20 transition-all duration-300">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <FiTruck className="text-emerald-400 text-sm" />
            </div>
            <h3 className="text-base font-bold dark:text-white text-slate-900">Transport Details</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                <FiNavigation className="text-cyan-400 text-sm" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] dark:text-slate-500 text-slate-400 font-bold uppercase tracking-wider">Assigned Route</p>
                <p className="dark:text-slate-200 text-slate-800 font-semibold text-sm truncate mt-0.5">{data?.route?.name || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/10 flex items-center justify-center shrink-0">
                <FiTruck className="text-emerald-400 text-sm" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] dark:text-slate-500 text-slate-400 font-bold uppercase tracking-wider">Assigned Bus</p>
                <p className="dark:text-slate-200 text-slate-800 font-semibold text-sm truncate mt-0.5">{data?.bus?.number || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                <FiUser className="text-blue-400 text-sm" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] dark:text-slate-500 text-slate-400 font-bold uppercase tracking-wider">Driver</p>
                <p className="dark:text-slate-200 text-slate-800 font-semibold text-sm truncate mt-0.5">{data?.bus?.driver || 'N/A'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3.5">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
                <FiMapPin className="text-amber-400 text-sm" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] dark:text-slate-500 text-slate-400 font-bold uppercase tracking-wider">Boarding Point</p>
                <p className="dark:text-slate-200 text-slate-800 font-semibold text-sm truncate mt-0.5">{data?.boardingStop?.name || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Full Route */}
      <div className="glass p-6 rounded-3xl hover:border-cyan-500/20 transition-all duration-300">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-9 h-9 rounded-lg bg-cyan-500/10 flex items-center justify-center">
            <FiMapPin className="text-cyan-400 text-sm" />
          </div>
          <h3 className="text-base font-bold dark:text-white text-slate-900">My Route Stops</h3>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {data?.routeStops?.map((stop, i) => (
            <React.Fragment key={stop.id}>
              <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 ${
                stop.name === data?.boardingStop?.name
                  ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30 ring-1 ring-cyan-500/20 glow-cyan'
                  : 'dark:bg-slate-800/60 bg-slate-100 border-slate-700/40 dark:border-slate-700/40 border-slate-200 dark:text-slate-300 text-slate-600 hover:border-cyan-500/30 cursor-default'
              }`}>
                {stop.name}
                {stop.name === data?.boardingStop?.name && ' 📍'}
              </span>
              {i < data.routeStops.length - 1 && (
                <FiArrowRight className="dark:text-slate-600 text-slate-400 text-xs shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  )
}
