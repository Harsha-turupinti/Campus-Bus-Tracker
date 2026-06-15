import React from 'react'

export default function DelayManagement() {
  return (
    <div className="space-y-6">
      <div className="glass p-6 rounded-3xl transition-colors duration-300">
        <h2 className="text-2xl font-semibold dark:text-white text-slate-900">Delay Management</h2>
        <p className="dark:text-slate-400 text-slate-600 mt-2">Track live delay reports and notify affected routes.</p>
      </div>
      <div className="glass p-6 rounded-3xl transition-colors duration-300">
        <ul className="space-y-3 dark:text-slate-300 text-slate-700">
          <li>North Loop - Delay 12 min</li>
          <li>South Express - Delay 5 min</li>
          <li>Parking Shuttle - On time</li>
        </ul>
      </div>
    </div>
  )
}
