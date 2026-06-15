import React from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import { analytics } from '../../services/data'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend)

export default function Analytics() {
  const ridershipData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Ridership',
        data: analytics.ridership,
        borderColor: '#22d3ee',
        backgroundColor: 'rgba(34,211,238,0.25)',
        tension: 0.4,
        fill: true
      }
    ]
  }

  const delayData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Delay Trends',
        data: analytics.delays,
        backgroundColor: 'rgba(248, 113, 113, 0.6)'
      }
    ]
  }

  return (
    <div className="space-y-6">
      <div className="glass p-6 rounded-3xl transition-colors duration-300">
        <h2 className="text-2xl font-semibold dark:text-white text-slate-900">Analytics Dashboard</h2>
        <p className="dark:text-slate-400 text-slate-600 mt-2">Visualize route popularity and delay patterns.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass p-6 rounded-3xl transition-colors duration-300">
          <h3 className="text-xl font-semibold dark:text-white text-slate-900 mb-4">Daily Ridership</h3>
          <Line data={ridershipData} />
        </div>
        <div className="glass p-6 rounded-3xl transition-colors duration-300">
          <h3 className="text-xl font-semibold dark:text-white text-slate-900 mb-4">Delay Trends</h3>
          <Bar data={delayData} />
        </div>
      </div>
    </div>
  )
}
