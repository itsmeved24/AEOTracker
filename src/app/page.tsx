import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Sparkles, TrendingUp, Target, Zap, Shield, BarChart3 } from 'lucide-react'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-[#0a0a0c] dark:via-[#0a0a0c] dark:to-[#0a0a0c]">
      <nav className="container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AEO Tracker
            </span>
          </div>
          <Link
            href="/login"
            className="px-6 py-2.5 text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
          >
            Sign In
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-6 pt-24 pb-40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Track AI Search Visibility
            </div>
            <h1 className="text-6xl md:text-8xl font-extrabold text-foreground mb-8 leading-[1.05] tracking-tight">
              Dominate AI Search
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-2">
                Across Every Engine
              </span>
            </h1>
            <p className="text-xl text-foreground/70 mb-10 max-w-3xl mx-auto leading-relaxed">
              Track your brand's visibility across ChatGPT, Gemini, Claude, Perplexity, and Google AI Overviews. 
              Get actionable insights to boost your AI search presence.
            </p>
            <div className="flex gap-5 justify-center">
              <Link
                href="/signup"
                className="group px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-semibold text-lg shadow-lg shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 hover:scale-[1.02]"
              >
                Get Started Free
                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                href="#features"
                className="px-10 py-5 bg-card text-foreground/80 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-2xl transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-0.5 hover:scale-[1.02]"
              >
                Learn More
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mb-24">
            {[
              { number: '5', label: 'AI Engines' },
              { number: '24/7', label: 'Monitoring' },
              { number: '∞', label: 'Keywords' },
            ].map((stat, i) => (
              <div 
                key={i} 
                className="text-center animate-slide-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-foreground/70 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          <div id="features" className="grid md:grid-cols-3 gap-8 mb-24">
            {[
              {
                icon: TrendingUp,
                title: 'Real-Time Tracking',
                description: 'Monitor your visibility across all major AI search engines with live updates and historical trends.',
                color: 'from-blue-500 to-cyan-500',
              },
              {
                icon: Target,
                title: 'Smart Insights',
                description: 'Get actionable recommendations based on AI-powered analysis of your visibility patterns.',
                color: 'from-purple-500 to-pink-500',
              },
              {
                icon: BarChart3,
                title: 'Beautiful Analytics',
                description: 'Visualize your performance with stunning charts and comprehensive breakdowns by engine.',
                color: 'from-orange-500 to-red-500',
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Built on Next.js 15 and Supabase for blazing-fast performance and real-time updates.',
                color: 'from-yellow-500 to-orange-500',
              },
              {
                icon: Shield,
                title: 'Enterprise Security',
                description: 'Multi-tenant architecture with row-level security ensures your data stays private.',
                color: 'from-green-500 to-emerald-500',
              },
              {
                icon: Sparkles,
                title: 'AI-Powered',
                description: 'Leverage machine learning to predict trends and optimize your AI search strategy.',
                color: 'from-indigo-500 to-purple-500',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative bg-card rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] hover:-translate-y-1 hover:scale-[1.01] animate-scale-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-110`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                <p className="text-foreground/70 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white shadow-2xl">
            <h2 className="text-4xl font-bold mb-4">Ready to dominate AI search?</h2>
            <p className="text-xl mb-8 text-blue-100">Start tracking your visibility today. No credit card required.</p>
            <Link
              href="/signup"
              className="inline-block px-10 py-4 bg-white text-blue-600 rounded-xl font-bold text-lg hover:scale-105 transition-transform shadow-xl"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-card/50 backdrop-blur">
        <div className="container mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
            <span className="font-semibold text-foreground">AEO Tracker</span>
            </div>
            <p className="text-foreground/70 text-sm">© 2025 AEO Tracker. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
