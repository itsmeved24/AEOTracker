import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { VisibilityTrendChart } from '@/components/dashboard/VisibilityTrendChart'
import { EngineBreakdownChart } from '@/components/dashboard/EngineBreakdownChart'
import { RecommendationsPanel } from '@/components/dashboard/RecommendationsPanel'

export default async function AnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (projectError || !project) {
    notFound()
  }

  // Get keywords
  const { data: keywords } = await supabase
    .from('keywords')
    .select('*')
    .eq('project_id', id)

  const keywordIds = keywords?.map(k => k.id) || []

  // Get all visibility checks for last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: checks } = await supabase
    .from('visibility_checks')
    .select('*')
    .in('keyword_id', keywordIds)
    .gte('timestamp', thirtyDaysAgo.toISOString())
    .order('timestamp', { ascending: true })

  // Calculate overall metrics
  const totalChecks = checks?.length || 0
  const presenceChecks = checks?.filter(c => c.presence).length || 0
  const overallPresenceRate = totalChecks > 0 ? ((presenceChecks / totalChecks) * 100).toFixed(1) : '0.0'
  
  const avgPosition = checks
    ?.filter(c => c.position)
    .reduce((acc, c) => acc + (c.position || 0), 0) / (checks?.filter(c => c.position).length || 1)
  
  const totalCitations = checks?.reduce((acc, c) => acc + c.citations_count, 0) || 0
  const avgCitations = totalChecks > 0 ? (totalCitations / presenceChecks).toFixed(2) : '0.00'

  // Calculate 7-day trend
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
  
  const recentChecks = checks?.filter(c => new Date(c.timestamp) >= sevenDaysAgo) || []
  const recentPresence = recentChecks.filter(c => c.presence).length
  const recentRate = recentChecks.length > 0 ? (recentPresence / recentChecks.length) * 100 : 0
  
  const olderChecks = checks?.filter(c => new Date(c.timestamp) < sevenDaysAgo) || []
  const olderPresence = olderChecks.filter(c => c.presence).length
  const olderRate = olderChecks.length > 0 ? (olderPresence / olderChecks.length) * 100 : 0
  
  const trend = recentRate - olderRate

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <Link href={`/dashboard/projects/${id}`} className="text-blue-600 hover:text-blue-700">
                ← Back to Project
              </Link>
              <h1 className="text-2xl font-bold text-gray-900">{project.name} - Analytics</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">{user.email}</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500 mb-1">Overall Visibility</p>
            <p className="text-3xl font-bold text-gray-900">{overallPresenceRate}%</p>
            <p className={`text-sm mt-2 ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}% (7 days)
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500 mb-1">Avg Position</p>
            <p className="text-3xl font-bold text-gray-900">{avgPosition.toFixed(1)}</p>
            <p className="text-sm text-gray-500 mt-2">When present</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500 mb-1">Total Citations</p>
            <p className="text-3xl font-bold text-gray-900">{totalCitations}</p>
            <p className="text-sm text-gray-500 mt-2">Avg {avgCitations} per mention</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-sm text-gray-500 mb-1">Keywords Tracked</p>
            <p className="text-3xl font-bold text-gray-900">{keywords?.length || 0}</p>
            <p className="text-sm text-gray-500 mt-2">{totalChecks} checks total</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <VisibilityTrendChart checks={checks || []} />
          <EngineBreakdownChart checks={checks || []} />
        </div>

        <RecommendationsPanel 
          checks={checks || []} 
          keywords={keywords || []}
          project={project}
        />
      </main>
    </div>
  )
}
