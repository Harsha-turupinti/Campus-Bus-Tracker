import React from 'react'
import { Navigate } from 'react-router-dom'

// BusRoutes now just redirects to Live Tracking since all route data comes from the DB
export default function BusRoutes() {
  return <Navigate to="/live" replace />
}
