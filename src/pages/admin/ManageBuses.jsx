import React from 'react'
import { buses } from '../../services/data'
import BusCard from '../../components/BusCard'

export default function ManageBuses() {
  return (
    <div className="space-y-6">
      <div className="glass p-6 rounded-3xl transition-colors duration-300">
        <h2 className="text-2xl font-semibold dark:text-white text-slate-900">Manage Buses</h2>
        <p className="dark:text-slate-400 text-slate-600 mt-2">Monitor fleet status and vehicle details.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {buses.map(bus => <BusCard key={bus.id} bus={bus} />)}
      </div>
    </div>
  )
}
