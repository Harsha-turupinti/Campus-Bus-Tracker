import React from 'react'

export default function BusCard({ bus }) {
  return (
    <div className="glass p-5 rounded-3xl hover:shadow-xl transition-shadow dark:hover:shadow-slate-900/20 hover:shadow-slate-200/20">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold dark:text-white text-slate-900">{bus.plate}</h3>
        <span className="text-sm dark:text-emerald-300 text-emerald-600">{bus.status}</span>
      </div>
      <div className="dark:text-slate-300 text-slate-700">Driver: {bus.driver}</div>
      <div className="dark:text-slate-400 text-slate-600 mt-2">Route: {bus.route}</div>
    </div>
  )
}
