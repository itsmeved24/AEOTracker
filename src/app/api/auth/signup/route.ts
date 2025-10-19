import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const { email, password, companyName } = await request.json()
    
    const adminClient = createAdminClient()
    const serverClient = await createClient()

    // Create tenant
    const { data: tenant, error: tenantError } = await adminClient
      .from('tenants')
      .insert({ name: companyName })
      .select()
      .single()

    if (tenantError) {
      return NextResponse.json({ error: tenantError.message }, { status: 400 })
    }

    // Create user with tenant_id in app_metadata
    const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: {
        tenant_id: tenant.id,
      },
    })

    if (authError) {
      await adminClient.from('tenants').delete().eq('id', tenant.id)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    // Sign in the user
    const { error: signInError } = await serverClient.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      return NextResponse.json({ error: signInError.message }, { status: 400 })
    }

    return NextResponse.json({ success: true, tenant_id: tenant.id })
  } catch (error) {
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}
