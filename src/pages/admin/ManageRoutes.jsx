import React from 'react'
import { routes } from '../../services/data'
import DataTable from '../../components/DataTable'

export default function ManageRoutes() {
  const columns = [
    { key: 'name', title: 'Route' },
    { key: 'description', title: 'Description' },
    { key: 'stops', title: 'Stops' }
  ]
  const data = routes.map(route => ({
    name: route.name,
    description: route.description,
    stops: route.stops.length
  }))

  return (
    <div className="space-y-6">
      <div className="glass p-6 rounded-3xl transition-colors duration-300">
        <h2 className="text-2xl font-semibold dark:text-white text-slate-900">Manage Routes</h2>
        <p className="dark:text-slate-400 text-slate-600 mt-2">Review and update route definitions.</p>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
