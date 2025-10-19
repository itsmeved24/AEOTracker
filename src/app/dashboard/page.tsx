import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Sparkles, TrendingUp, BarChart3, Users } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-card/80 backdrop-blur-lg shadow-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">
                AEO Tracker
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-foreground/80">{user.email}</span>
              </div>
              <form action="/api/auth/logout" method="post">
                <button className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center animate-fade-in">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Your Projects</h2>
            <p className="text-foreground/70 mt-1">Track AI visibility across all your brands</p>
          </div>
              <Link
            href="/dashboard/projects/new"
                className="group px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 hover:scale-[1.02] flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Project
          </Link>
        </div>

        {!projects || projects.length === 0 ? (
          <div className="bg-card rounded-2xl shadow-xl p-16 text-center animate-scale-in border border-border">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <BarChart3 className="w-10 h-10 text-blue-600" />
            </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">
              No projects yet
            </h3>
            <p className="text-foreground/70 mb-8 max-w-md mx-auto">
              Create your first project to start tracking AI search visibility across ChatGPT, Gemini, Claude, and more.
            </p>
            <Link
              href="/dashboard/projects/new"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:scale-105 transition-transform"
            >
              <Plus className="w-5 h-5" />
              Create Your First Project
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <Link
                key={project.id}
                href={`/dashboard/projects/${project.id}`}
                className="group bg-card rounded-2xl shadow-lg hover:shadow-2xl transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] p-6 border border-border hover:border-blue-400/40 hover:-translate-y-1 hover:scale-[1.01] animate-scale-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>{project.competitors?.length || 0}</span>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-blue-500 transition-colors">
                  {project.name}
                </h3>
                
                <p className="text-foreground/70 text-sm mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  {project.domain}
                </p>
                
                <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-sm text-foreground/60">
                    Brand: <span className="font-medium text-foreground/80">{project.brand_name}</span>
                  </span>
                  <span className="text-blue-600 group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
