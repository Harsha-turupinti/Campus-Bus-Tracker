import React from 'react'

export default function Footer() {
  return (
    <footer className="mt-auto border-t dark:border-slate-800/40 border-slate-200/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm font-medium dark:text-slate-500 text-slate-400">
          © {new Date().getFullYear()} <span className="dark:text-slate-400 text-slate-500 font-semibold">Campus Bus Tracker</span> — Vardhaman College of Engineering
        </p>
        <div className="flex items-center gap-4 text-xs dark:text-slate-600 text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            All Systems Operational
          </span>
        </div>
      </div>
    </footer>
  )
}
