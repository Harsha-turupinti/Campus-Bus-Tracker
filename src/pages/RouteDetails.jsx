import React from 'react'
import { Navigate } from 'react-router-dom'

// RouteDetails now redirects to Live Tracking since the student's route data comes from the DB API
export default function RouteDetails() {
  return <Navigate to="/live" replace />
}
