import { NextRequest, NextResponse } from 'next/server'
import { fastifyFetch } from '@/utils/fetch/fastifyFetch'

const authHeader = () => ({
  Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
})

export async function GET() {
  try {
    const data = await fastifyFetch('/pages', {
      method: 'GET',
      headers: authHeader(),
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : '查询站点列表失败' },
      { status: 500 },
    )
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { slug } = await req.json()
    const data = await fastifyFetch(`/pages/${encodeURIComponent(slug)}`, {
      method: 'DELETE',
      headers: authHeader(),
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : '删除站点失败' },
      { status: 500 },
    )
  }
}
