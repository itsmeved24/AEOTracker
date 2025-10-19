import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { AI_ENGINES, SENTIMENTS } from '@/types/database'

function simulateVisibilityCheck(keyword: string, engine: string) {
  const basePresence = 0.35 + Math.random() * 0.40
  const presence = Math.random() < basePresence
  
  return {
    presence,
    position: presence ? Math.floor(Math.random() * 5) + 1 : null,
    citations_count: presence ? Math.floor(Math.random() * 4) : 0,
    answer_snippet: presence 
      ? `This is a simulated answer mentioning ${keyword}. The brand appears in the context of ${engine} search results with relevant information.`
      : null,
    observed_urls: presence 
      ? Array.from({ length: Math.floor(Math.random() * 3) + 1 }, (_, i) => 
          `https://example${i + 1}.com/${keyword.replace(/\s+/g, '-').toLowerCase()}`
        )
      : [],
    sentiment: presence 
      ? SENTIMENTS[Math.floor(Math.random() * SENTIMENTS.length)]
      : null,
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { projectId, keywordIds, engines } = await request.json()

    if (!projectId || !keywordIds || !engines) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select('id')
      .eq('id', projectId)
      .single()

    if (projectError || !project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const { data: keywords, error: keywordsError } = await supabase
      .from('keywords')
      .select('id, keyword')
      .in('id', keywordIds)

    if (keywordsError) {
      return NextResponse.json({ error: keywordsError.message }, { status: 400 })
    }

    const checks = []

    for (const keyword of keywords) {
      for (const engine of engines) {
        const result = simulateVisibilityCheck(keyword.keyword, engine)
        
        checks.push({
          keyword_id: keyword.id,
          engine,
          presence: result.presence,
          position: result.position,
          citations_count: result.citations_count,
          answer_snippet: result.answer_snippet,
          observed_urls: result.observed_urls,
          sentiment: result.sentiment,
          timestamp: new Date().toISOString(),
        })
      }
    }

    const { error: insertError } = await supabase
      .from('visibility_checks')
      .insert(checks)

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true, 
      checksRun: checks.length,
      message: `Successfully ran ${checks.length} visibility checks`
    })
  } catch (error) {
    console.error('Error running checks:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}
