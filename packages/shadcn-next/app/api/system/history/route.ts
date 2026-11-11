import { NextRequest, NextResponse } from 'next/server'
import { fastifyFetch } from '@/utils/fetch/fastifyFetch'

export async function GET(req: NextRequest) {
  try {
    const hours = req.nextUrl.searchParams.get('hours') || '24'
    const data = await fastifyFetch(`/system/history?hours=${encodeURIComponent(hours)}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
      },
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : '获取历史采样失败' },
      { status: 500 },
    )
  }
}
