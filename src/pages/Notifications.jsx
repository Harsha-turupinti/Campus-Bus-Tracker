import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { FiBell, FiAlertCircle, FiInfo, FiCheckCircle, FiSearch, FiTrash2, FiMail, FiAlertTriangle } from 'react-icons/fi'

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/student/notifications')
        const raw = response.data.data || []
        setNotifications(raw.map(n => ({
          id: n.id,
          title: 'Bus Update',
          body: n.message,
          time: new Date(n.created_at).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
          type: n.message.toLowerCase().includes('delay') ? 'delay' : 'announcement',
          severity: n.message.toLowerCase().includes('delay') ? 'high' : 'low',
          read: false
        })))
      } catch (err) {
        setError(err.response?.data?.error?.message || 'Failed to fetch notifications')
      } finally {
        setLoading(false)
      }
    }
    fetchNotifications()
  }, [])

  const filtered = notifications.filter(notif => {
    return notif.body.toLowerCase().includes(search.toLowerCase()) ||
      notif.title.toLowerCase().includes(search.toLowerCase())
  })

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const markSingleRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n))
  }

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  const getSeverityConfig = (severity) => {
    switch (severity) {
      case 'high':
        return { 
          border: 'border-red-500/20', 
          iconBg: 'bg-red-500/10', 
          iconColor: 'text-red-400',
          accentBg: 'dark:bg-red-950/20 bg-red-50',
        }
      case 'medium':
        return { 
          border: 'border-amber-500/20', 
          iconBg: 'bg-amber-500/10', 
          iconColor: 'text-amber-400',
          accentBg: 'dark:bg-amber-950/20 bg-amber-50',
        }
      default:
        return { 
          border: 'border-cyan-500/20', 
          iconBg: 'bg-cyan-500/10', 
          iconColor: 'text-cyan-400',
          accentBg: 'dark:bg-cyan-950/20 bg-cyan-50',
        }
    }
  }

  const getIcon = (type, severity) => {
    if (severity === 'high') return <FiAlertTriangle className="text-lg" />
    if (type === 'delay') return <FiAlertCircle className="text-lg" />
    return <FiInfo className="text-lg" />
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-14 h-14 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
        <p className="text-cyan-400 font-bold tracking-widest text-xs uppercase">Loading Notifications...</p>
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

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-fade-in">
      
      {/* Header Banner */}
      <div className="glass p-6 md:p-8 rounded-3xl relative overflow-hidden">
        <div className="absolute -top-16 -right-16 w-56 h-56 bg-gradient-to-br from-cyan-500/8 to-blue-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-cyan-400 uppercase tracking-[0.2em] text-[11px] font-bold mb-1">Alert Feed</p>
            <h2 className="text-2xl md:text-3xl font-extrabold dark:text-white text-slate-900">Notifications</h2>
            <p className="dark:text-slate-400 text-slate-500 text-sm mt-1.5">
              Stay updated with live delays, weather notices, and driver announcements.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {unreadCount > 0 && (
              <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                {unreadCount} unread
              </span>
            )}
            <button
              onClick={markAllRead}
              className="px-4 py-2.5 text-xs font-bold dark:bg-slate-800/60 bg-slate-100 dark:hover:bg-slate-700 hover:bg-slate-200 dark:text-slate-300 text-slate-600 border dark:border-slate-700 border-slate-300 rounded-xl transition-all flex items-center gap-1.5"
            >
              <FiCheckCircle className="text-emerald-400" /> Mark All Read
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search notifications..."
          className="w-full text-sm rounded-xl px-4 py-3 pl-10 dark:bg-slate-800/60 bg-white border dark:border-slate-700 border-slate-300 dark:text-white text-slate-900 placeholder-slate-400 dark:placeholder-slate-500 focus:border-cyan-500 outline-none transition-all"
        />
        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:text-slate-500 text-slate-400 pointer-events-none" />
      </div>

      {/* Notifications feed list */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map(notification => {
            const config = getSeverityConfig(notification.severity)
            return (
              <div
                key={notification.id}
                onClick={() => markSingleRead(notification.id)}
                className={`glass rounded-2xl p-5 border transition-all duration-300 cursor-pointer flex gap-4 items-start hover:border-slate-600/40 ${
                  config.border
                } ${!notification.read ? 'ring-1 ring-cyan-500/20' : 'opacity-70 hover:opacity-100'}`}
              >
                {/* Icon */}
                <div className="relative shrink-0">
                  <div className={`w-11 h-11 rounded-xl ${config.iconBg} flex items-center justify-center ${config.iconColor}`}>
                    {getIcon(notification.type, notification.severity)}
                  </div>
                  {!notification.read && (
                    <span className="absolute -top-1 -right-1 bg-cyan-400 w-3 h-3 rounded-full border-2 dark:border-slate-950 border-white animate-pulse" />
                  )}
                </div>

                {/* Body */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <h3 className="font-bold dark:text-white text-slate-900 text-sm">{notification.title}</h3>
                    <span className="text-[10px] dark:text-slate-500 text-slate-400 font-semibold shrink-0">{notification.time}</span>
                  </div>
                  <p className="text-sm dark:text-slate-300 text-slate-600 mt-1.5 leading-relaxed">{notification.body}</p>
                  
                  <div className="flex gap-4 items-center mt-3 pt-3 border-t dark:border-slate-800/40 border-slate-200/40">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        markSingleRead(notification.id);
                      }}
                      className="text-[11px] font-semibold dark:text-slate-400 text-slate-500 dark:hover:text-cyan-400 hover:text-cyan-600 transition"
                    >
                      {notification.read ? 'Mark Unread' : 'Mark Read'}
                    </button>
                    <span className="dark:text-slate-700 text-slate-300">•</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNotification(notification.id);
                      }}
                      className="text-[11px] font-semibold dark:text-slate-400 text-slate-500 dark:hover:text-red-400 hover:text-red-600 transition flex items-center gap-1"
                    >
                      <FiTrash2 className="text-[10px]" /> Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="glass rounded-3xl p-14 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl dark:bg-slate-800/60 bg-slate-100 flex items-center justify-center">
              <FiMail className="text-2xl dark:text-slate-500 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold dark:text-slate-300 text-slate-700 mb-1">No alerts found</h3>
            <p className="text-sm dark:text-slate-500 text-slate-400">You are completely up to date.</p>
          </div>
        )}
      </div>
    </div>
  )
}
