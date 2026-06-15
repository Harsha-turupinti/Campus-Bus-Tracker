import React from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import { routes, buses, notifications, analytics } from '../../data'
import { FiTrendingUp, FiTrendingDown, FiAlertCircle, FiCheckCircle, FiTruck, FiCalendar, FiSettings, FiPlus } from 'react-icons/fi'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

export default function AdminDashboard() {
  // Calculate active and delayed buses
  const activeBuses = buses.filter(b => b.status === 'On Route').length
  const delayedBuses = notifications.filter(n => n.type === 'delay' && !n.read).length
  const inMaintenanceBuses = buses.filter(b => b.status === 'In Maintenance').length
  const recentNotifications = notifications.slice(0, 5)

  // Chart data
  const ridershipData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Daily Ridership',
        data: analytics.ridership,
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        tension: 0.4,
        fill: true,
        pointBackgroundColor: '#06b6d4',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7
      }
    ]
  }

  const delayTrendData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Avg Delays (min)',
        data: analytics.delays,
        backgroundColor: 'rgba(248, 113, 113, 0.6)',
        borderColor: '#f87171',
        borderRadius: 8,
        borderWidth: 0
      }
    ]
  }

  const routePopularityData = {
    labels: Object.keys(analytics.routePopularity).map(name => name.length > 15 ? name.substring(0, 12) + '...' : name),
    datasets: [
      {
        label: 'Passengers',
        data: Object.values(analytics.routePopularity),
        backgroundColor: [
          '#06b6d4', '#10b981', '#3b82f6', '#f59e0b',
          '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#6366f1'
        ],
        borderColor: '#000',
        borderWidth: 1
      }
    ]
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: { labels: { color: '#cbd5e1', font: { size: 12 } } }
    },
    scales: {
      y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148, 163, 184, 0.1)' } },
      x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148, 163, 184, 0.1)' } }
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass p-6 rounded-3xl transition-colors duration-300">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold dark:text-white text-slate-900 mb-2">Dashboard</h2>
            <p className="dark:text-slate-400 text-slate-600">Real-time fleet and route management overview</p>
          </div>
          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl dark:bg-slate-700/50 dark:hover:bg-slate-700 bg-slate-300/50 hover:bg-slate-300 transition dark:text-slate-200 text-slate-800">
              <FiCalendar /> Today
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-xl dark:bg-cyan-500/20 dark:hover:bg-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 transition dark:text-cyan-300 text-cyan-700 font-semibold">
              <FiSettings /> Settings
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass p-6 rounded-3xl dark:border-cyan-500/20 border-cyan-500/10 border transition-colors duration-300">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="dark:text-slate-400 text-slate-600 text-sm">Active Buses</p>
              <p className="text-3xl font-bold dark:text-white text-slate-900 mt-2">{activeBuses}</p>
            </div>
            <div className="flex items-center justify-center h-12 w-12 rounded-2xl dark:bg-cyan-500/20 dark:text-cyan-300 bg-cyan-500/10 text-cyan-700 transition-colors duration-300">
              <FiTruck />
            </div>
          </div>
          <p className="text-xs dark:text-emerald-400 text-emerald-600 flex items-center gap-1">
            <FiTrendingUp /> 2.4% from last week
          </p>
        </div>

        <div className="glass p-6 rounded-3xl dark:border-red-500/20 border-red-500/10 border transition-colors duration-300">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="dark:text-slate-400 text-slate-600 text-sm">Delayed Buses</p>
              <p className="text-3xl font-bold dark:text-white text-slate-900 mt-2">{delayedBuses}</p>
            </div>
            <div className="flex items-center justify-center h-12 w-12 rounded-2xl dark:bg-red-500/20 dark:text-red-300 bg-red-500/10 text-red-700 transition-colors duration-300">
              <FiAlertCircle />
            </div>
          </div>
          <p className="text-xs dark:text-red-400 text-red-600 flex items-center gap-1">
            <FiTrendingDown /> 1.2% from average
          </p>
        </div>

        <div className="glass p-6 rounded-3xl dark:border-emerald-500/20 border-emerald-500/10 border transition-colors duration-300">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="dark:text-slate-400 text-slate-600 text-sm">On-Time Ratio</p>
              <p className="text-3xl font-bold dark:text-white text-slate-900 mt-2">{analytics.serviceMetrics.onTimePercentage}%</p>
            </div>
            <div className="flex items-center justify-center h-12 w-12 rounded-2xl dark:bg-emerald-500/20 dark:text-emerald-300 bg-emerald-500/10 text-emerald-700 transition-colors duration-300">
              <FiCheckCircle />
            </div>
          </div>
          <p className="text-xs dark:text-emerald-400 text-emerald-600 flex items-center gap-1">
            <FiTrendingUp /> Excellent performance
          </p>
        </div>

        <div className="glass p-6 rounded-3xl dark:border-blue-500/20 border-blue-500/10 border transition-colors duration-300">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="dark:text-slate-400 text-slate-600 text-sm">Daily Ridership</p>
              <p className="text-3xl font-bold dark:text-white text-slate-900 mt-2">{analytics.serviceMetrics.totalPassengersToday.toLocaleString()}</p>
            </div>
            <div className="flex items-center justify-center h-12 w-12 rounded-2xl dark:bg-blue-500/20 dark:text-blue-300 bg-blue-500/10 text-blue-700 transition-colors duration-300">
              <FiTrendingUp />
            </div>
          </div>
          <p className="text-xs dark:text-blue-400 text-blue-600">Across {routes.length} active routes</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ridership Chart */}
        <div className="glass p-6 rounded-3xl transition-colors duration-300">
          <h3 className="text-lg font-bold dark:text-white text-slate-900 mb-4">Weekly Ridership Trend</h3>
          <div className="h-80">
            <Line data={ridershipData} options={chartOptions} />
          </div>
        </div>

        {/* Delay Trends */}
        <div className="glass p-6 rounded-3xl transition-colors duration-300">
          <h3 className="text-lg font-bold dark:text-white text-slate-900 mb-4">Delay Trends</h3>
          <div className="h-80">
            <Bar data={delayTrendData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Route Usage and Service Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Route Popularity */}
        <div className="lg:col-span-2 glass p-6 rounded-3xl transition-colors duration-300">
          <h3 className="text-lg font-bold dark:text-white text-slate-900 mb-4">Route Usage</h3>
          <div className="h-64">
            <Bar
              data={routePopularityData}
              options={{
                ...chartOptions,
                indexAxis: 'y',
                scales: {
                  x: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148, 163, 184, 0.1)' } },
                  y: { ticks: { color: '#94a3b8' }, grid: { display: false } }
                }
              }}
            />
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="space-y-4">
          <div className="glass p-4 rounded-3xl transition-colors duration-300">
            <p className="text-sm dark:text-slate-400 text-slate-600 mb-2">Fleet Status</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="dark:text-slate-300 text-slate-700">Total Buses</span>
                <span className="font-bold dark:text-cyan-300 text-cyan-700">{buses.length}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="dark:text-slate-300 text-slate-700">Active</span>
                <span className="font-bold dark:text-emerald-300 text-emerald-700">{activeBuses}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="dark:text-slate-300 text-slate-700">Maintenance</span>
                <span className="font-bold dark:text-orange-300 text-orange-700">{inMaintenanceBuses}</span>
              </div>
            </div>
          </div>

          <div className="glass p-4 rounded-3xl transition-colors duration-300">
            <p className="text-sm dark:text-slate-400 text-slate-600 mb-2">Service Metrics</p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="dark:text-slate-300 text-slate-700">Avg Wait</span>
                <span className="font-bold dark:text-blue-300 text-blue-700">{analytics.serviceMetrics.averageWaitTime} min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="dark:text-slate-300 text-slate-700">Efficiency</span>
                <span className="font-bold dark:text-emerald-300 text-emerald-700">{analytics.serviceMetrics.operationalEfficiency}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="dark:text-slate-300 text-slate-700">Routes Active</span>
                <span className="font-bold dark:text-cyan-300 text-cyan-700">{routes.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Notifications and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notifications Table */}
        <div className="lg:col-span-2 glass p-6 rounded-3xl transition-colors duration-300">
          <h3 className="text-lg font-bold dark:text-white text-slate-900 mb-4">Recent Notifications</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {recentNotifications.map(notif => (
              <div key={notif.id} className="flex items-start gap-3 p-3 rounded-xl dark:bg-slate-900/50 dark:hover:bg-slate-900 bg-slate-200/50 hover:bg-slate-200 transition">
                <div className={`flex-shrink-0 w-2 h-2 rounded-full mt-2 ${
                  notif.severity === 'high' ? 'bg-red-500' : notif.severity === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`} />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold dark:text-slate-200 text-slate-800">{notif.title}</p>
                      <p className="text-xs dark:text-slate-400 text-slate-600 mt-1">{notif.body}</p>
                    </div>
                    <span className="text-xs dark:text-slate-500 text-slate-600 flex-shrink-0">{notif.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass p-6 rounded-3xl transition-colors duration-300">
          <h3 className="text-lg font-bold dark:text-white text-slate-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl dark:bg-cyan-500/20 dark:hover:bg-cyan-500/30 bg-cyan-500/10 hover:bg-cyan-500/20 transition dark:text-cyan-300 text-cyan-700 font-medium">
              <FiPlus /> Add New Route
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl dark:bg-emerald-500/20 dark:hover:bg-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 transition dark:text-emerald-300 text-emerald-700 font-medium">
              <FiTruck /> Register Bus
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl dark:bg-blue-500/20 dark:hover:bg-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 transition dark:text-blue-300 text-blue-700 font-medium">
              <FiAlertCircle /> Report Delay
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl dark:bg-purple-500/20 dark:hover:bg-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 transition dark:text-purple-300 text-purple-700 font-medium">
              <FiCalendar /> Schedule Update
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
