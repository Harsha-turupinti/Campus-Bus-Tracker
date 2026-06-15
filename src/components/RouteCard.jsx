import React from 'react'
import { Link } from 'react-router-dom'

export default function RouteCard({ route }) {
  return (
    <Link
      to={`/routes/${route.id}`}
      className="glass p-5 rounded-3xl block hover:-translate-y-1 transform transition-shadow dark:shadow-slate-900/10 shadow-slate-200/10"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold dark:text-white text-slate-900">{route.name}</h3>
        <span className="text-sm dark:text-slate-400 text-slate-600">{route.stops.length} stops</span>
      </div>
      <p className="mt-3 dark:text-slate-300 text-slate-700">{route.description}</p>
    </Link>
  )
}
