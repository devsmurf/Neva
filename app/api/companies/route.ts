import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabaseClient'

export async function GET() {
  try {
    // First get basic company data with admin client (bypasses RLS)
    const { data: companies, error } = await supabaseAdmin
      .from('companies')
      .select('*')
      .order('name')

    if (error) {
      console.error('Companies fetch error:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Get password status for each company
    const companiesWithPasswordStatus = await Promise.all(
      companies?.map(async (company) => {
        const { data: passwordData } = await supabaseAdmin
          .from('company_passwords')
          .select('id')
          .eq('company_id', company.id)
          .limit(1)
        
        return {
          ...company,
          has_password: passwordData && passwordData.length > 0
        }
      }) || []
    )

    return NextResponse.json(companiesWithPasswordStatus)
  } catch (error) {
    console.error('Companies API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
