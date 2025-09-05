import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseClient'
import { getSessionUser } from '@/lib/auth-helpers'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser()
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { password } = body
    const { id: company_id } = params

    if (!password) {
      return NextResponse.json(
        { error: 'Password required' },
        { status: 400 }
      )
    }

    // Verify company exists
    const { data: company, error: companyError } = await supabaseAdmin
      .from('companies')
      .select('name')
      .eq('id', company_id)
      .single()

    if (companyError || !company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 404 }
      )
    }

    // Set company password using the helper function
    const { data: success, error: passwordError } = await supabaseAdmin
      .rpc('set_company_password', {
        company_uuid: company_id,
        new_password: password
      })

    if (passwordError || !success) {
      return NextResponse.json(
        { error: 'Failed to set password' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `Password set for ${company.name}`
    })
  } catch (error) {
    console.error('Company password API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
