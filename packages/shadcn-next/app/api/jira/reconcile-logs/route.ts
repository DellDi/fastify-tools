import { NextRequest, NextResponse } from 'next/server'
import { fastifyFetch } from '@/utils/fetch/fastifyFetch'

export async function GET(req: NextRequest) {
  try {
    const data = await fastifyFetch(`/jira/reconcile-logs${req.nextUrl.search}`, {
      method: 'GET',
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : '查询巡检日志失败' },
      { status: 500 },
    )
  }
}
