import { NextResponse } from 'next/server'


export async function GET() {
  const supabase = await createServerBaseClient()
  const { data: dl_ai_sections, error } = await supabase.from('dl_ai_sections').select('*')
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
  return NextResponse.json({
    code: 200,
    data: dl_ai_sections,
    message: 'success',
  }, { status: 200 })
}
