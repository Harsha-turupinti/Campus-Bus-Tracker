import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Polyline, Popup, CircleMarker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import {
  FiMapPin, FiClock, FiTruck, FiUsers, FiBell, FiChevronRight,
  FiPhone, FiStar, FiNavigation, FiCheckCircle, FiCircle,
  FiArrowRight, FiCalendar, FiShield, FiActivity, FiAlertCircle
} from 'react-icons/fi'

import { useDashboardData } from '../hooks/useDashboardData'
import { useAuth } from '../context/AuthContext'

// Fix Leaflet marker icon issues
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
})

export default function Home() {
  const { user } = useAuth();
  const { data, loading, error } = useDashboardData(user?.college_email || user?.email);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
          <p className="text-cyan-400 font-bold tracking-widest animate-pulse uppercase text-xs">Syncing Live Route...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass rounded-3xl p-8 max-w-2xl mx-auto mt-10 border border-red-500/20 text-center animate-fade-in">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 flex items-center justify-center">
          <FiAlertCircle className="text-3xl text-red-400" />
        </div>
        <h2 className="text-xl font-bold text-red-400 mb-2">Connection Error</h2>
        <p className="dark:text-slate-400 text-slate-500 text-sm">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  const { student, route, bus, boardingStop, routeStops } = data;
  const collegeStop = routeStops[routeStops.length - 1];

  const computeETA = (busLoc, stopLoc) => {
    if (!busLoc || !stopLoc || !busLoc.lat || !stopLoc.lat) return '--'
    
    // Haversine formula for realistic distance in km
    const R = 6371; 
    const dLat = (stopLoc.lat - busLoc.lat) * Math.PI / 180;
    const dLon = (stopLoc.lng - busLoc.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(busLoc.lat * Math.PI / 180) * Math.cos(stopLoc.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    const distanceKm = R * c;
    
    // Assume average speed of 25 km/h in city traffic (0.416 km/min)
    const avgSpeedKmPerMin = 25 / 60;
    let minutes = Math.round(distanceKm / avgSpeedKmPerMin);
    
    // Add 1 minute buffer for every 2 km to account for stops/lights
    minutes += Math.floor(distanceKm / 2);

    return `${Math.max(1, minutes)} min`
  }

  const boardingStopIndex = routeStops.findIndex(s => s.id === boardingStop?.id);
  const etaToStop = bus && bus.location.lat ? computeETA(bus.location, boardingStop) : '--';
  const etaToCollege = bus && bus.location.lat ? computeETA(bus.location, collegeStop) : '--';

  const getBusLocationText = () => {
    if (!bus || !bus.location.lat) return 'Bus location unavailable'
    if (bus.status !== 'On Route') return `Bus is ${bus.status.toLowerCase()}`
    return `Heading towards destination`
  }

  const getStatusBadge = (status) => {
    const map = {
      'On Route': { bg: 'bg-emerald-500/10', border: 'border-emerald-500/25', text: 'text-emerald-400', dot: 'bg-emerald-500' },
      'Idle': { bg: 'bg-amber-500/10', border: 'border-amber-500/25', text: 'text-amber-400', dot: 'bg-amber-500' },
      'In Maintenance': { bg: 'bg-red-500/10', border: 'border-red-500/25', text: 'text-red-400', dot: 'bg-red-500' },
    }
    return map[status] || map['Idle']
  }

  const statusStyle = getStatusBadge(bus?.status || 'Idle');

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good Morning'
    if (hour < 17) return 'Good Afternoon'
    return 'Good Evening'
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      
      {/* ── Welcome Header ────────────────────────────────── */}
      <section className="glass rounded-3xl p-6 md:p-8 relative overflow-hidden">
        {/* Decorative orbs */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-gradient-to-tr from-emerald-500/8 to-cyan-500/8 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <p className="text-cyan-400 uppercase tracking-[0.2em] text-[11px] font-bold mb-1">{getGreeting()}, {student?.name?.split(' ')[0]}</p>
            <h1 className="text-2xl md:text-3xl font-extrabold dark:text-white text-slate-900 leading-tight">
              Your Daily Commute
            </h1>
            <p className="dark:text-slate-400 text-slate-500 text-sm mt-1.5 max-w-md">
              {student?.email} • Student ID: {student?.id}
            </p>
          </div>
          <div className="flex gap-3">
            <Link 
              to="/live" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40"
            >
              <FiNavigation /> Track My Bus
            </Link>
            <Link 
              to="/schedule" 
              className="inline-flex items-center gap-2 glass px-5 py-3 rounded-xl hover:bg-slate-800/40 transition-all dark:text-slate-200 text-slate-700 text-sm font-semibold border dark:border-slate-700/60 border-slate-300"
            >
              <FiCalendar /> Schedule
            </Link>
          </div>
        </div>
      </section>

      {/* ── Primary Info Cards Row ─────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Assigned Bus */}
        <div className="glass rounded-2xl p-5 group hover:border-cyan-500/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase dark:text-slate-500 text-slate-400 tracking-wider">Assigned Bus</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
              <FiTruck className="text-cyan-400 text-sm" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-cyan-400 tracking-wide">{bus?.number || 'N/A'}</p>
          <p className="text-[11px] dark:text-slate-500 text-slate-400 mt-1.5 font-medium">Route: {route?.name}</p>
        </div>

        {/* Bus Status */}
        <div className="glass rounded-2xl p-5 group hover:border-emerald-500/30 transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold uppercase dark:text-slate-500 text-slate-400 tracking-wider">Bus Status</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
              <FiActivity className="text-emerald-400 text-sm" />
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <span className={`w-2.5 h-2.5 rounded-full ${statusStyle.dot} ${bus?.status === 'On Route' ? 'animate-pulse' : ''}`} />
            <p className={`text-lg font-extrabold ${statusStyle.text}`}>{bus?.status || 'Unknown'}</p>
          </div>
          <p className="text-[11px] dark:text-slate-500 text-slate-400 mt-1.5 font-medium">Auto-updated every 4s</p>
        </div>

        {/* ETA to Your Stop */}
        <div className="glass rounded-2xl p-5 relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-emerald-500/10 transition-all" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase dark:text-slate-500 text-slate-400 tracking-wider">ETA to Your Stop</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <FiMapPin className="text-emerald-400 text-sm" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-emerald-400">{etaToStop}</p>
            <p className="text-[11px] dark:text-slate-500 text-slate-400 mt-1.5 font-medium truncate">📍 {boardingStop?.name}</p>
          </div>
        </div>

        {/* ETA to College */}
        <div className="glass rounded-2xl p-5 relative overflow-hidden group hover:border-blue-500/30 transition-all duration-300">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none group-hover:bg-blue-500/10 transition-all" />
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-bold uppercase dark:text-slate-500 text-slate-400 tracking-wider">ETA to College</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <FiClock className="text-blue-400 text-sm" />
              </div>
            </div>
            <p className="text-2xl font-extrabold text-blue-400">{etaToCollege}</p>
            <p className="text-[11px] dark:text-slate-500 text-slate-400 mt-1.5 font-medium truncate">🎓 {collegeStop?.name}</p>
          </div>
        </div>
      </div>

      {/* ── Main Content: Map + Sidebar ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Driver, Location, Boarding */}
        <div className="lg:col-span-5 space-y-5">

          {/* Bus Current Location */}
          <div className="glass rounded-2xl p-5 hover:border-cyan-500/20 transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <FiNavigation className="text-cyan-400 text-sm" />
              </div>
              <span className="text-xs font-bold uppercase dark:text-slate-400 text-slate-500 tracking-wider">Current Bus Location</span>
            </div>
            <p className="text-sm font-semibold dark:text-white text-slate-900 mb-3">{getBusLocationText()}</p>
            {bus?.location?.lat && (
              <div className="dark:bg-slate-900/60 bg-slate-100/80 border dark:border-slate-800 border-slate-200 rounded-xl p-3.5 flex items-center gap-3">
                <div className="shrink-0">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                    <FiMapPin className="text-cyan-400 text-sm" />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] dark:text-slate-500 text-slate-400 font-bold uppercase tracking-wider">GPS Coordinates</p>
                  <p className="text-xs font-mono dark:text-slate-300 text-slate-700 tracking-wide mt-0.5">
                    {bus.location.lat.toFixed(4)}°N, {bus.location.lng.toFixed(4)}°E
                  </p>
                </div>
                <div className="ml-auto shrink-0">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Driver Information */}
          <div className="glass rounded-2xl p-5 hover:border-cyan-500/20 transition-all duration-300">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <FiShield className="text-cyan-400 text-sm" />
              </div>
              <span className="text-xs font-bold uppercase dark:text-slate-400 text-slate-500 tracking-wider">Driver Information</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/25 flex items-center justify-center font-bold text-lg text-cyan-300 relative shrink-0">
                {(bus?.driver || 'NA').split(' ').map(w => w[0]).join('').toUpperCase()}
                <div className="absolute -bottom-0.5 -right-0.5 bg-emerald-500 w-3.5 h-3.5 rounded-full border-2 dark:border-slate-950 border-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold dark:text-white text-slate-900 text-base truncate">{bus?.driver || 'Unknown Driver'}</h4>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/15">Licensed Driver</span>
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">On Duty</span>
                </div>
              </div>
            </div>
          </div>

          {/* Boarding Point Details */}
          <div className="glass rounded-2xl p-5 hover:border-emerald-500/20 transition-all duration-300">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <FiMapPin className="text-emerald-400 text-sm" />
              </div>
              <span className="text-xs font-bold uppercase dark:text-slate-400 text-slate-500 tracking-wider">Your Boarding Point</span>
            </div>
            <div className="bg-emerald-950/15 dark:bg-emerald-950/20 border border-emerald-500/15 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-base font-extrabold text-emerald-400">{boardingStop?.name}</p>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  Stop {boardingStopIndex + 1} of {routeStops.length}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Live Map */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="glass rounded-2xl overflow-hidden flex-1 flex flex-col min-h-[480px]">
            {/* Map Header */}
            <div className="p-4 border-b dark:border-slate-800/60 border-slate-200/60 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
                <h3 className="font-bold dark:text-white text-slate-900 text-sm">Live Bus Location</h3>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 text-[10px] dark:text-slate-400 text-slate-500 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" /> Your Stop
                </div>
                <div className="flex items-center gap-1.5 text-[10px] dark:text-slate-400 text-slate-500 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-blue-500/20" /> College
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="flex-1 relative">
              {routeStops && routeStops.length > 0 && (
                <MapContainer
                  center={[boardingStop?.lat || routeStops[0].lat, boardingStop?.lng || routeStops[0].lng]}
                  zoom={13}
                  className="h-full w-full absolute inset-0"
                  style={{ minHeight: '400px' }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                  {/* Route polyline */}
                  <Polyline
                    pathOptions={{ color: '#06b6d4', weight: 4, opacity: 0.75, dashArray: '8 4' }}
                    positions={routeStops.map(s => [s.lat, s.lng])}
                  />

                  {/* All stops */}
                  {routeStops.map((stop, idx) => {
                    const isBoarding = stop.id === boardingStop?.id
                    const isCollege = stop.id === collegeStop?.id
                    const color = isBoarding ? '#10b981' : isCollege ? '#3b82f6' : '#06b6d4'
                    const radius = (isBoarding || isCollege) ? 10 : 6
                    return (
                      <CircleMarker
                        key={stop.id}
                        center={[stop.lat, stop.lng]}
                        radius={radius}
                        pathOptions={{
                          color,
                          fillColor: color,
                          fillOpacity: 0.85,
                          weight: (isBoarding || isCollege) ? 3 : 1.5
                        }}
                      >
                        <Popup>
                          <div className="text-slate-900 text-xs font-medium">
                            <strong className="text-sm">{stop.name}</strong>
                            {isBoarding && <div className="text-emerald-600 font-bold mt-1">📍 Your Boarding Point</div>}
                            {isCollege && <div className="text-blue-600 font-bold mt-1">🎓 College Destination</div>}
                            <div className="text-slate-500 mt-1">Stop {idx + 1} of {routeStops.length}</div>
                          </div>
                        </Popup>
                      </CircleMarker>
                    )
                  })}

                  {/* Bus marker */}
                  {bus?.location?.lat && (() => {
                    const busIcon = L.divIcon({
                      className: 'custom-bus-marker',
                      html: `<div style="background: linear-gradient(135deg, #22d3ee, #0ea5e9); border: 2px solid #083344; color: #083344; width: 34px; height: 26px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; box-shadow: 0 4px 12px rgba(6,182,212,0.4);">🚌</div>`,
                      iconSize: [34, 26],
                      iconAnchor: [17, 13],
                      popupAnchor: [0, -13]
                    });

                    return (
                      <Marker position={[bus.location.lat, bus.location.lng]} icon={busIcon} zIndexOffset={1000}>
                        <Popup>
                          <div className="text-slate-900 text-xs space-y-1">
                            <div className="text-sm font-bold text-slate-950">🚌 {bus.number}</div>
                            <div><strong>Driver:</strong> {bus.driver}</div>
                            <div><strong>Status:</strong> {bus.status}</div>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })()}
                </MapContainer>
              )}
            </div>
          </div>

          {/* Route Stops Strip below map */}
          <div className="glass rounded-2xl p-4 mt-4">
            <p className="text-[10px] font-bold uppercase dark:text-slate-500 text-slate-400 tracking-wider mb-3">
              Route: {route?.name} — Stop Sequence
            </p>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {routeStops.map((stop, idx) => {
                const isBoarding = stop.id === boardingStop?.id
                const isCollege = stop.id === collegeStop?.id
                const isLast = idx === routeStops.length - 1
                return (
                  <React.Fragment key={stop.id}>
                    <div className={`shrink-0 px-3 py-2 rounded-xl text-[11px] font-bold border transition-all duration-200 ${
                      isBoarding ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 glow-emerald' :
                      isCollege  ? 'bg-blue-500/15 border-blue-500/30 text-blue-400' :
                                   'dark:bg-slate-900/40 bg-slate-100 border-slate-800 dark:border-slate-800 dark:text-slate-400 text-slate-500'
                    }`}>
                      {isBoarding && '📍 '}{isCollege && '🎓 '}{stop.name}
                    </div>
                    {!isLast && <FiArrowRight className="dark:text-slate-700 text-slate-300 shrink-0 text-xs" />}
                  </React.Fragment>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Bottom Info Row ─────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-5 flex items-center gap-4 hover:border-cyan-500/20 transition-all duration-300">
          <div className="w-11 h-11 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
            <FiShield className="text-lg" />
          </div>
          <div>
            <p className="text-sm font-bold dark:text-white text-slate-900">Student Account</p>
            <p className="text-[11px] dark:text-slate-500 text-slate-400 mt-0.5">Authenticated via College Database</p>
          </div>
          <span className="ml-auto text-[10px] font-bold px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Verified</span>
        </div>

        <div className="glass rounded-2xl p-5 flex items-center gap-4 hover:border-emerald-500/20 transition-all duration-300">
          <div className="w-11 h-11 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <FiActivity className="text-lg" />
          </div>
          <div>
            <p className="text-sm font-bold dark:text-white text-slate-900">Live Services Active</p>
            <p className="text-[11px] dark:text-slate-500 text-slate-400 mt-0.5">Connected to {route?.name}</p>
          </div>
          <span className="ml-auto flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        </div>
      </div>

    </div>
  )
}
