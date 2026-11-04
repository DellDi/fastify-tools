import { NextResponse } from 'next/server'
import { fastifyFetch } from '@/utils/fetch/fastifyFetch'

export async function GET() {
  try {
    const data = await fastifyFetch('/jira/field-rules/combos', { method: 'GET' })
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : '查询项目组合失败' },
      { status: 500 },
    )
  }
}
