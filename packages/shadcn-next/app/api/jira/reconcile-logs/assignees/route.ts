import { NextResponse } from 'next/server'
import { fastifyFetch } from '@/utils/fetch/fastifyFetch'

export async function GET() {
  try {
    const data = await fastifyFetch('/jira/reconcile-logs/assignees', {
      method: 'GET',
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : '查询经办人列表失败' },
      { status: 500 },
    )
  }
}
