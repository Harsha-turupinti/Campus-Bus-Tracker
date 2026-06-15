import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { FiMapPin, FiClock, FiTruck, FiArrowRight, FiSearch, FiCalendar, FiList, FiAlertCircle, FiNavigation } from 'react-icons/fi'

export default function BusSchedule() {
  const [scheduleData, setScheduleData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/student/schedule')
        setScheduleData(response.data.data)
      } catch (err) {
        setError(err.response?.data?.error?.message || 'Failed to fetch schedule')
      } finally {
        setLoading(false)
      }
    }
    fetchSchedule()
  }, [])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-14 h-14 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
        <p className="text-cyan-400 font-bold tracking-widest text-xs uppercase">Loading Schedule...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass p-8 rounded-3xl text-center max-w-lg mx-auto animate-fade-in">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 flex items-center justify-center">
          <FiAlertCircle className="text-3xl text-red-400" />
        </div>
        <p className="text-red-400 font-bold text-lg mb-1">Something went wrong</p>
        <p className="text-sm dark:text-slate-400 text-slate-500">{error}</p>
      </div>
    )
  }

  const { route, stops, buses, schedules } = scheduleData

  const filteredStops = stops.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  )

  const schedulesByBus = {}
  schedules.forEach(sc => {
    if (!schedulesByBus[sc.busNumber]) schedulesByBus[sc.busNumber] = []
    schedulesByBus[sc.busNumber].push(sc)
  })

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      
      {/* Header */}
      <section className="glass rounded-3xl p-6 md:p-8 relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-blue-500/8 to-cyan-500/8 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-cyan-400 uppercase tracking-[0.2em] text-[11px] font-bold mb-1">University Transport</p>
            <h1 className="text-2xl md:text-3xl font-extrabold dark:text-white text-slate-900">Bus Schedule & Route</h1>
            <p className="dark:text-slate-400 text-slate-500 text-sm mt-1.5">
              {route ? route.name : 'N/A'} — {route ? `${route.totalDistanceKm} km total distance` : ''}
            </p>
          </div>
          <div className="w-full md:w-96">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search stops..."
                className="w-full text-sm rounded-xl px-4 py-3.5 pl-10 dark:bg-slate-800/60 bg-white border dark:border-slate-700 border-slate-300 dark:text-white text-slate-900 placeholder-slate-400 dark:placeholder-slate-500 focus:border-cyan-500 outline-none transition-all"
              />
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:text-slate-500 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Route Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass rounded-2xl p-5 text-center group hover:border-cyan-500/30 transition-all duration-300">
          <div className="w-11 h-11 mx-auto mb-3 rounded-xl bg-cyan-500/10 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
            <FiMapPin className="text-lg text-cyan-400" />
          </div>
          <p className="text-2xl font-extrabold dark:text-white text-slate-900">{stops.length}</p>
          <p className="text-[11px] dark:text-slate-400 text-slate-500 mt-1 font-medium">Total Stops</p>
        </div>
        <div className="glass rounded-2xl p-5 text-center group hover:border-emerald-500/30 transition-all duration-300">
          <div className="w-11 h-11 mx-auto mb-3 rounded-xl bg-emerald-500/10 flex items-center justify-center group-hover:bg-emerald-500/20 transition-colors">
            <FiTruck className="text-lg text-emerald-400" />
          </div>
          <p className="text-2xl font-extrabold dark:text-white text-slate-900">{buses.length}</p>
          <p className="text-[11px] dark:text-slate-400 text-slate-500 mt-1 font-medium">Buses Assigned</p>
        </div>
        <div className="glass rounded-2xl p-5 text-center group hover:border-blue-500/30 transition-all duration-300">
          <div className="w-11 h-11 mx-auto mb-3 rounded-xl bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
            <FiCalendar className="text-lg text-blue-400" />
          </div>
          <p className="text-2xl font-extrabold dark:text-white text-slate-900">{schedules.length}</p>
          <p className="text-[11px] dark:text-slate-400 text-slate-500 mt-1 font-medium">Scheduled Stops</p>
        </div>
        <div className="glass rounded-2xl p-5 text-center group hover:border-amber-500/30 transition-all duration-300">
          <div className="w-11 h-11 mx-auto mb-3 rounded-xl bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500/20 transition-colors">
            <FiClock className="text-lg text-amber-400" />
          </div>
          <p className="text-2xl font-extrabold dark:text-white text-slate-900">{route ? route.totalDistanceKm : 0} km</p>
          <p className="text-[11px] dark:text-slate-400 text-slate-500 mt-1 font-medium">Route Distance</p>
        </div>
      </div>

      {/* Route Stops Sequence */}
      <div className="glass rounded-3xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
            <FiList className="text-cyan-400 text-sm" />
          </div>
          <span className="text-xs uppercase font-bold dark:text-slate-400 text-slate-500 tracking-wider">Route Stops Sequence</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
          {filteredStops.map((stop, index) => (
            <React.Fragment key={stop.id}>
              <span className="dark:bg-slate-800/80 bg-slate-100 border dark:border-slate-700/60 border-slate-200 px-3 py-1.5 rounded-lg dark:text-slate-300 text-slate-600 text-xs font-semibold hover:border-cyan-500/40 transition-colors cursor-default">
                {stop.order}. {stop.name}
              </span>
              {index < filteredStops.length - 1 && (
                <FiArrowRight className="dark:text-slate-600 text-slate-400 text-xs shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Buses and their schedules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {buses.map(bus => (
          <div key={bus.id} className="glass rounded-3xl p-6 flex flex-col justify-between hover:border-cyan-500/20 transition-all duration-300 group">
            <div>
              {/* Bus Meta */}
              <div className="flex justify-between items-start gap-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/20 flex items-center justify-center">
                    <FiTruck className="text-cyan-400 text-lg" />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold dark:text-white text-slate-900">{bus.number}</h3>
                    <p className="text-xs dark:text-slate-400 text-slate-500 mt-0.5 font-medium">Driver: {bus.driver}</p>
                  </div>
                </div>
                <div className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border font-bold ${
                  bus.status === 'On Route' 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : bus.status === 'Idle'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    : 'bg-red-500/10 text-red-400 border-red-500/20'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    bus.status === 'On Route' ? 'bg-emerald-400' :
                    bus.status === 'Idle' ? 'bg-amber-400' : 'bg-red-400'
                  }`} />
                  {bus.status}
                </div>
              </div>

              {/* Schedule for this bus */}
              {schedulesByBus[bus.number] && schedulesByBus[bus.number].length > 0 ? (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-3">
                    <FiCalendar className="text-emerald-400 text-sm" />
                    <span className="text-xs uppercase font-bold dark:text-slate-400 text-slate-500 tracking-wider">Stop Arrival Times</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {schedulesByBus[bus.number].map((sc, idx) => (
                      <div key={idx} className="dark:bg-slate-800/40 bg-slate-50 border dark:border-slate-700/40 border-slate-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold flex justify-between items-center hover:border-cyan-500/30 transition-colors">
                        <span className="dark:text-slate-300 text-slate-600 truncate mr-2">{sc.stopName}</span>
                        <span className="text-cyan-400 font-bold shrink-0">{sc.arrivalTime}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="dark:bg-slate-800/20 bg-slate-50 rounded-xl p-4 mb-4 text-center">
                  <p className="text-xs dark:text-slate-500 text-slate-400 font-medium">No schedule data available for this bus.</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex justify-between items-center pt-4 border-t dark:border-slate-800/60 border-slate-200/60">
              <span className="text-xs dark:text-slate-400 text-slate-500">
                Route: <strong className="dark:text-cyan-400 text-cyan-700">{route?.name}</strong>
              </span>
              <Link
                to="/live"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:text-cyan-300 transition group-hover:gap-2.5"
              >
                <FiNavigation className="text-sm" /> Track Live <FiArrowRight className="text-[10px] transition-all" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
