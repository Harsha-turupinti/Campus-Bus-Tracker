import React, { useEffect, useRef, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Polyline, Popup, CircleMarker } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import {
  FiMapPin, FiTruck, FiClock, FiNavigation, FiActivity,
  FiChevronDown, FiChevronUp, FiStar, FiPhone, FiCheckCircle, FiCircle,
  FiAlertCircle
} from 'react-icons/fi'

import { useDashboardData } from '../hooks/useDashboardData'
import { useAuth } from '../context/AuthContext'

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
})

// Distance helper
function getDistance(p1, p2) {
  if (!p1 || !p2 || !p1.lat || !p2.lat) return Infinity;
  const dx = p1.lat - p2.lat
  const dy = p1.lng - p2.lng
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * Animated bus marker component.
 * Uses requestAnimationFrame + ease-out cubic for smooth transitions.
 */
function AnimatedBusMarker({ position, bus }) {
  const markerRef = useRef(null)
  const prevPosRef = useRef(position)

  const busIcon = useMemo(() => L.divIcon({
    className: 'custom-bus-marker',
    html: `<div style="background: linear-gradient(135deg, #22d3ee, #0ea5e9); border: 2px solid #083344; color: #083344; width: 34px; height: 26px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: bold; box-shadow: 0 4px 12px rgba(6,182,212,0.4);">🚌</div>`,
    iconSize: [34, 26],
    iconAnchor: [17, 13],
    popupAnchor: [0, -13]
  }), [])

  useEffect(() => {
    const marker = markerRef.current
    if (!marker) return

    const from = prevPosRef.current
    const to = position

    if (from[0] === to[0] && from[1] === to[1]) return

    const duration = 1500
    const startTime = performance.now()
    let animFrame

    function animate(currentTime) {
      const elapsed = currentTime - startTime
      const t = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      const lat = from[0] + (to[0] - from[0]) * eased
      const lng = from[1] + (to[1] - from[1]) * eased

      marker.setLatLng([lat, lng])

      if (t < 1) {
        animFrame = requestAnimationFrame(animate)
      }
    }

    animFrame = requestAnimationFrame(animate)
    prevPosRef.current = to

    return () => cancelAnimationFrame(animFrame)
  }, [position])

  return (
    <Marker
      ref={markerRef}
      position={position}
      icon={busIcon}
      zIndexOffset={1000}
    >
      <Popup>
        <div className="text-slate-900 text-xs space-y-1 min-w-[160px]">
          <div className="text-sm font-bold text-slate-950 border-b pb-1 mb-1">
            🚌 {bus.number}
            <span className="ml-1 text-emerald-600 text-[10px]">★ Your Bus</span>
          </div>
          <div><strong>Driver:</strong> {bus.driver}</div>
          <div><strong>Status:</strong> {bus.status}</div>
        </div>
      </Popup>
    </Marker>
  )
}

export default function LiveTracking() {
  const { user } = useAuth();
  const { data, loading, error } = useDashboardData(user?.college_email || user?.email);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-14 h-14 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
          <p className="text-cyan-400 font-bold tracking-widest animate-pulse uppercase text-xs">Locating Bus...</p>
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
        <h2 className="text-xl font-bold text-red-400 mb-2">GPS Tracking Unavailable</h2>
        <p className="dark:text-slate-400 text-slate-500 text-sm">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  const { route, bus, boardingStop, routeStops } = data;
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

  let closestStopIndex = 0;
  let minDistance = Infinity;
  routeStops.forEach((stop, idx) => {
    const d = getDistance(bus?.location, stop);
    if (d < minDistance) {
      minDistance = d;
      closestStopIndex = idx;
    }
  });

  const getStopETAs = () => {
    const etas = {}
    routeStops.forEach((stop, idx) => {
      if (idx < closestStopIndex) {
        etas[stop.id] = 'Passed'
      } else {
        etas[stop.id] = computeETA(bus?.location, stop)
      }
    })
    return etas
  }
  const stopETAs = getStopETAs()

  const boardingStopIndex = routeStops.findIndex(s => s.id === boardingStop?.id);
  const isBoardingPassed = closestStopIndex > boardingStopIndex;
  
  const etaToStop = isBoardingPassed ? 'Passed' : computeETA(bus?.location, boardingStop);
  const etaToCollege = computeETA(bus?.location, collegeStop);

  const mapCenter = boardingStop?.lat 
    ? [boardingStop.lat, boardingStop.lng]
    : routeStops[0]
      ? [routeStops[0].lat, routeStops[0].lng]
      : [17.3850, 78.4867]

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col lg:flex-row gap-5 max-w-[1600px] mx-auto p-4 animate-fade-in">
      
      {/* ── Left Sidebar ───────────────────────────────────── */}
      <aside className="lg:w-[400px] shrink-0 flex flex-col gap-4 overflow-y-auto pr-1">

        {/* Header */}
        <div className="glass rounded-2xl p-5 hover:border-cyan-500/20 transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                <FiActivity className="text-cyan-400 animate-pulse text-sm" />
              </div>
              <span className="text-xs font-bold uppercase text-cyan-400 tracking-wider">My Bus — Live</span>
            </div>
            <div className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase border ${
              bus?.status === 'On Route'
                ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/25 text-amber-400'
            }`}>
              {bus?.status || 'Unknown'}
            </div>
          </div>

          <div>
            <p className="text-2xl font-extrabold dark:text-white text-slate-900">{bus?.number || 'N/A'}</p>
            <p className="text-xs dark:text-slate-400 text-slate-500 font-semibold mt-1">Route: {route?.name}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-emerald-950/15 dark:bg-emerald-950/20 border border-emerald-500/15 rounded-xl p-3.5 text-center">
              <p className="text-[9px] dark:text-slate-500 text-slate-400 font-bold uppercase mb-1">Your Stop</p>
              <p className="text-xl font-extrabold text-emerald-400">{etaToStop}</p>
              <p className="text-[9px] dark:text-slate-500 text-slate-400 font-semibold mt-1 truncate">📍 {boardingStop?.name}</p>
            </div>
            <div className="bg-blue-950/15 dark:bg-blue-950/20 border border-blue-500/15 rounded-xl p-3.5 text-center">
              <p className="text-[9px] dark:text-slate-500 text-slate-400 font-bold uppercase mb-1">College</p>
              <p className="text-xl font-extrabold text-blue-400">{etaToCollege}</p>
              <p className="text-[9px] dark:text-slate-500 text-slate-400 font-semibold mt-1 truncate">🎓 {collegeStop?.name}</p>
            </div>
          </div>
        </div>

        {/* Route Timeline */}
        <div className="glass rounded-2xl p-5 flex-1 min-h-[300px] flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
              <FiMapPin className="text-cyan-400 text-sm" />
            </div>
            <p className="text-xs font-bold uppercase dark:text-slate-400 text-slate-500 tracking-wider">Live Route Timeline</p>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-0 relative">
            {routeStops.map((stop, idx) => {
              const isBoarding = stop.id === boardingStop?.id
              const isCollege = stop.id === collegeStop?.id
              const isPassed = idx < closestStopIndex
              const isCurrentTarget = idx === closestStopIndex
              const isLast = idx === routeStops.length - 1

              return (
                <div key={stop.id} className="flex gap-4 group">
                  {/* Timeline icon & line */}
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 transition-all duration-300 ${
                      isCurrentTarget ? 'bg-cyan-500/20 text-cyan-400 border-2 border-cyan-500 animate-pulse shadow-lg shadow-cyan-500/20' :
                      isPassed ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' :
                      isBoarding ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' :
                      isCollege ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30' :
                      'dark:bg-slate-800 bg-slate-100 dark:text-slate-500 text-slate-400 border dark:border-slate-700 border-slate-300'
                    }`}>
                      {isPassed ? <FiCheckCircle className="text-sm" /> : 
                       isCurrentTarget ? <FiNavigation className="text-sm" /> :
                       <FiCircle className="text-[10px]" />}
                    </div>
                    {!isLast && (
                      <div className={`w-0.5 flex-1 min-h-[28px] transition-colors ${
                        isPassed ? 'bg-emerald-500/40' : 'dark:bg-slate-800 bg-slate-200'
                      }`} />
                    )}
                  </div>

                  {/* Stop Details */}
                  <div className={`flex-1 pb-4 min-w-0 flex items-start justify-between gap-2 ${
                    isCurrentTarget ? 'pt-1.5' : 'pt-1'
                  }`}>
                    <div className="min-w-0">
                      <p className={`text-sm font-bold truncate transition-colors ${
                        isCurrentTarget ? 'text-cyan-400' :
                        isPassed ? 'dark:text-slate-600 text-slate-400 line-through' :
                        isBoarding ? 'text-emerald-400' :
                        isCollege ? 'text-blue-400' :
                        'dark:text-slate-300 text-slate-700'
                      }`}>
                        {isBoarding && '📍 '}{isCollege && '🎓 '}{stop.name}
                      </p>
                      {isBoarding && <p className="text-[10px] text-emerald-500/80 font-semibold mt-0.5">Your Boarding Point</p>}
                      {isCollege && <p className="text-[10px] text-blue-500/80 font-semibold mt-0.5">Destination</p>}
                    </div>

                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-lg shrink-0 ${
                      isPassed ? 'bg-emerald-500/10 text-emerald-400' :
                      isCurrentTarget ? 'bg-cyan-500/10 text-cyan-400' :
                      isBoarding ? 'bg-emerald-500/10 text-emerald-400' :
                      'dark:bg-slate-800/60 bg-slate-100 dark:text-slate-500 text-slate-400'
                    }`}>
                      {stopETAs[stop.id] || '--'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

      </aside>

      {/* ── Map ────────────────────────────────────────────── */}
      <div className="flex-1 glass rounded-3xl overflow-hidden relative min-h-[500px]">
        
        {/* Info Badges */}
        <div className="absolute top-4 left-4 right-4 z-[999] flex justify-between pointer-events-none">
          <div className="glass px-4 py-2.5 rounded-2xl flex items-center gap-3 bg-slate-950/85 backdrop-blur-xl shadow-lg">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <div>
              <p className="text-[9px] font-bold uppercase text-slate-500 tracking-wider">Live Route</p>
              <p className="text-xs font-bold text-white">
                {bus?.number} — {route?.name}
              </p>
            </div>
          </div>

          <div className="glass px-4 py-3 rounded-2xl text-center bg-slate-950/85 backdrop-blur-xl shadow-lg">
            <p className="text-[9px] font-bold uppercase text-slate-500 mb-0.5">Arriving at Your Stop</p>
            <p className="text-lg font-extrabold text-emerald-400">{etaToStop}</p>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 z-[999] glass px-4 py-3 rounded-2xl bg-slate-950/85 backdrop-blur-xl pointer-events-none shadow-lg">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-[10px]">
              <span className="w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20 shrink-0" />
              <span className="text-slate-300 font-semibold">Your Boarding Point</span>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <span className="w-3 h-3 rounded-full bg-blue-500 ring-2 ring-blue-500/20 shrink-0" />
              <span className="text-slate-300 font-semibold">College Destination</span>
            </div>
            <div className="flex items-center gap-2 text-[10px]">
              <div className="w-3 h-3 bg-cyan-400 rounded-sm shrink-0" />
              <span className="text-slate-300 font-semibold">Live Bus</span>
            </div>
          </div>
        </div>

        {routeStops.length > 0 && (
          <MapContainer center={mapCenter} zoom={13} className="h-full w-full absolute inset-0">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* Route polyline */}
            <Polyline
              pathOptions={{
                color: '#06b6d4',
                weight: 5,
                opacity: 0.8,
              }}
              positions={routeStops.map(s => [s.lat, s.lng])}
            />

            {/* Stops */}
            {routeStops.map((stop, idx) => {
              const isBoarding = stop.id === boardingStop?.id
              const isCollege = stop.id === collegeStop?.id
              const isPassed = idx < closestStopIndex

              const color = isBoarding ? '#10b981' : isCollege ? '#3b82f6' : isPassed ? '#64748b' : '#06b6d4'
              const radius = (isBoarding || isCollege) ? 10 : 6
              const opacity = isPassed ? 0.4 : 1.0

              return (
                <CircleMarker
                  key={stop.id}
                  center={[stop.lat, stop.lng]}
                  radius={radius}
                  pathOptions={{
                    color: '#1e293b',
                    fillColor: color,
                    fillOpacity: opacity,
                    weight: 2
                  }}
                >
                  <Popup>
                    <div className="text-slate-900 text-xs font-medium min-w-[160px]">
                      <strong className="text-sm block mb-1">{stop.name}</strong>
                      {isBoarding && <div className="text-emerald-600 font-bold">📍 Your Boarding Point</div>}
                      {isCollege && <div className="text-blue-600 font-bold">🎓 College Destination</div>}
                      {isPassed && <div className="text-slate-500 font-bold">✓ Stop Passed</div>}
                      <div className="text-slate-500 mt-1">Stop {idx + 1} of {routeStops.length}</div>
                      <div className="mt-1 font-bold text-slate-700">ETA: {stopETAs[stop.id] || '--'}</div>
                    </div>
                  </Popup>
                </CircleMarker>
              )
            })}

            {/* Animated Bus Marker */}
            {bus?.location?.lat && (
              <AnimatedBusMarker
                position={[bus.location.lat, bus.location.lng]}
                bus={bus}
              />
            )}
          </MapContainer>
        )}
      </div>
    </div>
  )
}
