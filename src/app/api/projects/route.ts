import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name, domain, brand_name, competitors } = await request.json()

    if (!name || !domain || !brand_name) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Get tenant_id from user metadata
    const tenantId = user.app_metadata?.tenant_id

    if (!tenantId) {
      return NextResponse.json({ error: 'Tenant not found' }, { status: 400 })
    }

    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        tenant_id: tenantId,
        name,
        domain,
        brand_name,
        competitors: competitors || [],
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(projects)
  } catch (error) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}
