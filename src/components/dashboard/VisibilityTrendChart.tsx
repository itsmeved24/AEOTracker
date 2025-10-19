'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Check {
  engine: string
  presence: boolean
  timestamp: string
}

export function VisibilityTrendChart({ checks }: { checks: Check[] }) {
  // Group by date and calculate daily presence rate
  const dailyData = checks.reduce((acc, check) => {
    const date = new Date(check.timestamp).toLocaleDateString()
    if (!acc[date]) {
      acc[date] = { date, total: 0, present: 0 }
    }
    acc[date].total++
    if (check.presence) acc[date].present++
    return acc
  }, {} as Record<string, { date: string, total: number, present: number }>)

  const chartData = Object.values(dailyData)
    .map(d => ({
      date: d.date,
      presenceRate: ((d.present / d.total) * 100).toFixed(1),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Visibility Trend (30 Days)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis 
            label={{ value: 'Presence Rate (%)', angle: -90, position: 'insideLeft' }}
            domain={[0, 100]}
          />
          <Tooltip />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="presenceRate" 
            stroke="#3b82f6" 
            strokeWidth={2}
            name="Visibility %"
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
