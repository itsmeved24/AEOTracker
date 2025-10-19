'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface Check {
  engine: string
  presence: boolean
  citations_count: number
}

export function EngineBreakdownChart({ checks }: { checks: Check[] }) {
  // Group by engine
  const engineData = checks.reduce((acc, check) => {
    if (!acc[check.engine]) {
      acc[check.engine] = { engine: check.engine, total: 0, present: 0, citations: 0 }
    }
    acc[check.engine].total++
    if (check.presence) {
      acc[check.engine].present++
      acc[check.engine].citations += check.citations_count
    }
    return acc
  }, {} as Record<string, { engine: string, total: number, present: number, citations: number }>)

  const chartData = Object.values(engineData).map(d => ({
    engine: d.engine.charAt(0).toUpperCase() + d.engine.slice(1).replace('_', ' '),
    presenceRate: ((d.present / d.total) * 100).toFixed(1),
    avgCitations: d.present > 0 ? (d.citations / d.present).toFixed(2) : 0,
  }))

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance by Engine</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="engine" tick={{ fontSize: 12 }} />
          <YAxis 
            label={{ value: 'Presence Rate (%)', angle: -90, position: 'insideLeft' }}
            domain={[0, 100]}
          />
          <Tooltip />
          <Legend />
          <Bar dataKey="presenceRate" fill="#3b82f6" name="Visibility %" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
