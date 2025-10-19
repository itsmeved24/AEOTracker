import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Sparkles, BarChart3, Globe, Building2, Users, TrendingUp } from 'lucide-react'
import { AddKeywordForm } from '@/components/dashboard/AddKeywordForm'
import { KeywordsList } from '@/components/dashboard/KeywordsList'
import { RunChecksButton } from '@/components/dashboard/RunChecksButton'

export default async function ProjectDetailPage({
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

  const { data: keywords } = await supabase
    .from('keywords')
    .select('*')
    .eq('project_id', id)
    .order('created_at', { ascending: false })

  const keywordIds = keywords?.map(k => k.id) || []
  const { data: checks } = await supabase
    .from('visibility_checks')
    .select('*')
    .in('keyword_id', keywordIds)
    .order('timestamp', { ascending: false })
    .limit(100)

  // Calculate quick stats
  const totalChecks = checks?.length || 0
  const presenceCount = checks?.filter(c => c.presence).length || 0
  const visibilityRate = totalChecks > 0 ? ((presenceCount / totalChecks) * 100).toFixed(1) : '0'

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card/80 backdrop-blur-lg shadow-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="flex items-center gap-2 text-blue-500 hover:text-blue-400 font-medium transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Dashboard
              </Link>
              <div className="h-6 w-px bg-border" />
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-foreground">{project.name}</h1>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href={`/dashboard/projects/${id}/analytics`}
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </Link>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-foreground/80">{user.email}</span>
              </div>
              <form action="/api/auth/logout" method="post">
                <button className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors">
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-card rounded-2xl shadow-lg p-6 border border-border animate-scale-in hover:shadow-xl transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 hover:scale-[1.01]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-500/15 rounded-xl flex items-center justify-center">
                <Globe className="w-5 h-5 text-blue-400" />
              </div>
              <p className="text-sm font-medium text-foreground/70">Domain</p>
            </div>
            <p className="text-lg font-bold text-foreground">{project.domain}</p>
          </div>

          <div className="bg-card rounded-2xl shadow-lg p-6 border border-border animate-scale-in hover:shadow-xl transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 hover:scale-[1.01]" style={{ animationDelay: '100ms' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-purple-500/15 rounded-xl flex items-center justify-center">
                <Building2 className="w-5 h-5 text-purple-400" />
              </div>
              <p className="text-sm font-medium text-foreground/70">Brand</p>
            </div>
            <p className="text-lg font-bold text-foreground">{project.brand_name}</p>
          </div>

          <div className="bg-card rounded-2xl shadow-lg p-6 border border-border animate-scale-in hover:shadow-xl transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 hover:scale-[1.01]" style={{ animationDelay: '200ms' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-green-500/15 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-400" />
              </div>
              <p className="text-sm font-medium text-foreground/70">Visibility</p>
            </div>
            <p className="text-lg font-bold text-foreground">{visibilityRate}%</p>
          </div>

          <div className="bg-card rounded-2xl shadow-lg p-6 border border-border animate-scale-in hover:shadow-xl transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 hover:scale-[1.01]" style={{ animationDelay: '300ms' }}>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-orange-500/15 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-orange-400" />
              </div>
              <p className="text-sm font-medium text-foreground/70">Competitors</p>
            </div>
            <p className="text-lg font-bold text-foreground">{project.competitors?.length || 0} tracked</p>
          </div>
        </div>

        <div className="bg-card rounded-2xl shadow-xl p-8 border border-border animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-blue-600" />
                Keywords
              </h2>
              <p className="text-foreground/70 mt-1">Track AI visibility across keywords</p>
            </div>
            <div className="flex gap-3">
              {keywords && keywords.length > 0 && (
                <RunChecksButton projectId={id} keywords={keywords} />
              )}
            </div>
          </div>

          <div className="mb-8">
            <AddKeywordForm projectId={id} />
          </div>

          {keywords && keywords.length > 0 ? (
            <KeywordsList keywords={keywords} checks={checks || []} />
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">No keywords yet</h3>
              <p className="text-foreground/70">Add your first keyword above to start tracking AI visibility</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
