'use client'

import { AlertCircle, TrendingUp, Target, Award } from 'lucide-react'

interface Check {
  engine: string
  presence: boolean
  citations_count: number
  keyword_id: string
}

interface Keyword {
  id: string
  keyword: string
}

interface Project {
  brand_name: string
}

export function RecommendationsPanel({ 
  checks, 
  keywords,
  project 
}: { 
  checks: Check[]
  keywords: Keyword[]
  project: Project
}) {
  const recommendations = []

  // Calculate engine performance
  const engineStats = checks.reduce((acc, check) => {
    if (!acc[check.engine]) {
      acc[check.engine] = { total: 0, present: 0 }
    }
    acc[check.engine].total++
    if (check.presence) acc[check.engine].present++
    return acc
  }, {} as Record<string, { total: number, present: number }>)

  const lowEngines = Object.entries(engineStats)
    .filter(([_, stats]) => (stats.present / stats.total) < 0.4)
    .map(([engine]) => engine)

  if (lowEngines.length > 0) {
    recommendations.push({
      icon: AlertCircle,
      priority: 'high',
      title: `Low visibility on ${lowEngines.length} engine(s)`,
      description: `${lowEngines.join(', ')} showing <40% presence. Focus on optimizing content for these platforms.`,
      action: 'Review content structure and E-E-A-T signals'
    })
  }

  // Check mention-citation gap
  const totalMentions = checks.filter(c => c.presence).length
  const totalCitations = checks.reduce((acc, c) => acc + c.citations_count, 0)
  const citationRate = totalMentions > 0 ? totalCitations / totalMentions : 0

  if (citationRate < 1.5 && totalMentions > 0) {
    recommendations.push({
      icon: Target,
      priority: 'high',
      title: 'Low citation rate detected',
      description: `Average ${citationRate.toFixed(2)} citations per mention. AI engines recognize your brand but don't cite your content as authoritative.`,
      action: 'Improve content authority with original research and structured data'
    })
  }

  // Check keyword performance
  const keywordPerformance = keywords.map(kw => {
    const kwChecks = checks.filter(c => c.keyword_id === kw.id)
    const present = kwChecks.filter(c => c.presence).length
    const rate = kwChecks.length > 0 ? present / kwChecks.length : 0
    return { keyword: kw.keyword, rate }
  })

  const poorKeywords = keywordPerformance.filter(kw => kw.rate < 0.3)

  if (poorKeywords.length > 3) {
    recommendations.push({
      icon: TrendingUp,
      priority: 'medium',
      title: `${poorKeywords.length} keywords underperforming`,
      description: 'Multiple keywords showing <30% visibility. Consider content gaps or optimization opportunities.',
      action: 'Create targeted content addressing these keyword queries'
    })
  }

  // Positive feedback
  const topEngines = Object.entries(engineStats)
    .filter(([_, stats]) => (stats.present / stats.total) > 0.6)
    .map(([engine]) => engine)

  if (topEngines.length > 0) {
    recommendations.push({
      icon: Award,
      priority: 'success',
      title: `Strong performance on ${topEngines.length} engine(s)`,
      description: `${topEngines.join(', ')} showing >60% visibility. Great job!`,
      action: 'Maintain current content strategy for these platforms'
    })
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
      <div className="space-y-4">
        {recommendations.length === 0 ? (
          <p className="text-gray-500">No recommendations yet. Run more visibility checks to get insights.</p>
        ) : (
          recommendations.map((rec, idx) => {
            const Icon = rec.icon
            const colors = {
              high: 'bg-red-50 border-red-200 text-red-700',
              medium: 'bg-yellow-50 border-yellow-200 text-yellow-700',
              success: 'bg-green-50 border-green-200 text-green-700',
            }[rec.priority]

            return (
              <div key={idx} className={`border rounded-lg p-4 ${colors}`}>
                <div className="flex items-start gap-3">
                  <Icon className="w-5 h-5 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">{rec.title}</h4>
                    <p className="text-sm mb-2">{rec.description}</p>
                    <p className="text-sm font-medium">→ {rec.action}</p>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
