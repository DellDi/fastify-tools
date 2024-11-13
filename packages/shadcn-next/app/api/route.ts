import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET() {
  const supabase = await createClient()
  const { data: dl_ai_sections, error } = await supabase.from('dl_ai_sections').select('*')
  console.log('🚀 ~ file:route.ts, line:7-----', dl_ai_sections)
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({
    code: 200,
    data: dl_ai_sections,
    message: 'success',
  }, { status: 200 })
}
