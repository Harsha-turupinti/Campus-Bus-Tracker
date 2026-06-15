import React from 'react'

export default function NotificationCard({ notification }) {
  return (
    <div className="glass p-4 rounded-3xl flex justify-between items-start gap-4">
      <div>
        <h4 className="font-semibold dark:text-white text-slate-900">{notification.title}</h4>
        <p className="dark:text-slate-300 text-slate-700 mt-2">{notification.body}</p>
      </div>
      <span className="text-sm dark:text-slate-400 text-slate-600">{notification.time}</span>
    </div>
  )
}
