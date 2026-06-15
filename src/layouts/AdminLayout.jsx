import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Sidebar from '../components/Sidebar'

export default function AdminLayout() {
  const { user } = useAuth()
  if (!user?.isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6 p-4 md:p-6">
        <aside className="hidden md:block">
          <Sidebar />
        </aside>
        <section className="space-y-6">
          <Outlet />
        </section>
      </div>
    </div>
  )
}
