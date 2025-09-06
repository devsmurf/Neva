import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseAdmin'

export async function GET() {
  try {
    // For now, allow public access to companies list
    // TODO: Add proper auth when needed

    // Get companies with login email status
    const { data: companies, error } = await supabaseAdmin
      .from('companies')
      .select(`
        *,
        login_emails:company_login_emails(email, is_active)
      `)
      .order('name')

    if (error) {
      console.error('Companies fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Add login status
    const companiesWithLoginStatus = companies?.map((company: any) => ({
      ...company,
      has_login: company.login_emails && company.login_emails.length > 0,
      login_email: company.login_emails?.[0]?.email || null
    })) || []

    return NextResponse.json(companiesWithLoginStatus)
  } catch (error) {
    console.error('Companies API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
