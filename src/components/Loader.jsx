import React from 'react'

export default function Loader() {
  return (
    <div className="flex items-center justify-center py-16">
      <div className="w-12 h-12 border-4 dark:border-slate-700 border-slate-300 dark:border-t-cyan-400 border-t-cyan-500 rounded-full animate-spin transition-colors duration-300"></div>
    </div>
  )
}
