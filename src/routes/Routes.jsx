import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import StudentLayout from '../layouts/StudentLayout'
import AdminLayout from '../layouts/AdminLayout'
import Home from '../pages/Home'
import BusSchedule from '../pages/BusSchedule'
import RouteDetails from '../pages/RouteDetails'
import LiveTracking from '../pages/LiveTracking'
import Notifications from '../pages/Notifications'
import Profile from '../pages/Profile'
import AdminLogin from '../pages/AdminLogin'
import Login from '../pages/Login'
import AdminDashboard from '../pages/admin/AdminDashboard'
import ManageRoutes from '../pages/admin/ManageRoutes'
import ManageBuses from '../pages/admin/ManageBuses'
import ManageSchedules from '../pages/admin/ManageSchedules'
import DelayManagement from '../pages/admin/DelayManagement'
import Analytics from '../pages/admin/Analytics'

import ProtectedRoute from '../components/ProtectedRoute'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={
        <ProtectedRoute>
          <StudentLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Home />} />
        <Route path="schedule" element={<BusSchedule />} />
        <Route path="routes" element={<Navigate to="/schedule" replace />} />
        <Route path="routes/:id" element={<RouteDetails />} />
        <Route path="live" element={<LiveTracking />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* Login is unprotected */}
      <Route path="login" element={<Login />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="routes" element={<ManageRoutes />} />
        <Route path="buses" element={<ManageBuses />} />
        <Route path="schedules" element={<ManageSchedules />} />
        <Route path="delays" element={<DelayManagement />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
