import React from 'react'

export default function ManageSchedules() {
  return (
    <div className="space-y-6">
      <div className="glass p-6 rounded-3xl transition-colors duration-300">
        <h2 className="text-2xl font-semibold dark:text-white text-slate-900">Manage Schedules</h2>
        <p className="dark:text-slate-400 text-slate-600 mt-2">Create and publish updated daily schedules.</p>
      </div>
      <div className="glass p-6 rounded-3xl">
        <p className="dark:text-slate-300 text-slate-700 transition-colors duration-300">Schedule management UI will support shifts, stop windows, and timetable adjustments.</p>
      </div>
    </div>
  )
}
