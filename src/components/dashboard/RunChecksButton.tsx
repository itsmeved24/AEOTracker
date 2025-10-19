'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Play, Loader2, CheckCircle } from 'lucide-react'
import { AI_ENGINES } from '@/types/database'

interface Keyword {
  id: string
  keyword: string
}

export function RunChecksButton({ projectId, keywords }: { projectId: string, keywords: Keyword[] }) {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleRunChecks = async () => {
    setLoading(true)
    setError('')
    setSuccess(false)

    const response = await fetch('/api/checks/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId,
        keywordIds: keywords.map(k => k.id),
        engines: AI_ENGINES,
      }),
    })

    const data = await response.json()

    if (data.error) {
      setError(data.error)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
      setTimeout(() => {
        setSuccess(false)
        router.refresh()
      }, 2000)
    }
  }

  return (
    <div>
      {error && (
        <div className="mb-2 text-red-600 text-sm animate-slide-down">{error}</div>
      )}
      <button
        onClick={handleRunChecks}
        disabled={loading || success}
        className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-transform duration-300 ease-[cubic-bezier(.22,1,.36,1)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 hover:-translate-y-0.5 hover:scale-[1.02]"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Running checks...
          </>
        ) : success ? (
          <>
            <CheckCircle className="w-5 h-5" />
            Completed!
          </>
        ) : (
          <>
            <Play className="w-5 h-5" />
            Run Visibility Checks
          </>
        )}
      </button>
    </div>
  )
}
