'use client'

import { Badge } from './Badge'

interface Keyword {
  id: string
  keyword: string
  category: string | null
  created_at: string
}

interface Check {
  keyword_id: string
  engine: string
  presence: boolean
  position: number | null
  citations_count: number
  timestamp: string
}

export function KeywordsList({ keywords, checks }: { keywords: Keyword[], checks: Check[] }) {
  const getKeywordStats = (keywordId: string) => {
    const keywordChecks = checks.filter(c => c.keyword_id === keywordId)
    if (keywordChecks.length === 0) return null

    const presenceCount = keywordChecks.filter(c => c.presence).length
    const avgPosition = keywordChecks
      .filter(c => c.position)
      .reduce((acc, c) => acc + (c.position || 0), 0) / (keywordChecks.filter(c => c.position).length || 1)
    const totalCitations = keywordChecks.reduce((acc, c) => acc + c.citations_count, 0)

    return {
      presenceRate: (presenceCount / keywordChecks.length * 100).toFixed(0),
      avgPosition: avgPosition.toFixed(1),
      totalCitations,
      lastChecked: new Date(keywordChecks[0].timestamp).toLocaleDateString()
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 hover:scale-[1.01]">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border/60">
          <thead className="bg-secondary">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/80 uppercase tracking-wider">
                Keyword
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/80 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/80 uppercase tracking-wider">
                Visibility
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/80 uppercase tracking-wider">
                Avg Position
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/80 uppercase tracking-wider">
                Citations
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-foreground/80 uppercase tracking-wider">
                Last Checked
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border/60">
            {keywords.map((keyword, i) => {
              const stats = getKeywordStats(keyword.id)
              return (
                <tr 
                  key={keyword.id} 
                  className="hover:bg-accent/30 transition-colors animate-fade-in"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-foreground">{keyword.keyword}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {keyword.category ? (
                      <Badge variant="blue">{keyword.category}</Badge>
                    ) : (
                      <span className="text-sm text-gray-400">-</span>
                    )}
                  </td>
                  {stats ? (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={Number(stats.presenceRate) > 60 ? 'green' : Number(stats.presenceRate) > 30 ? 'yellow' : 'red'}>
                          {stats.presenceRate}%
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-foreground">{stats.avgPosition}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm font-semibold text-foreground">{stats.totalCitations}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground/60">
                        {stats.lastChecked}
                      </td>
                    </>
                  ) : (
                    <td colSpan={4} className="px-6 py-4 text-sm text-gray-400 text-center">
                      No checks run yet
                    </td>
                  )}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
