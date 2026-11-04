import { NextRequest, NextResponse } from 'next/server'
import { fastifyFetch } from '@/utils/fetch/fastifyFetch'

type RouteParams = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const { id } = await params
  try {
    const body = await req.json()
    const data = await fastifyFetch(`/jira/field-rules/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : '更新字段规则失败' },
      { status: 500 },
    )
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const { id } = await params
  try {
    const data = await fastifyFetch(`/jira/field-rules/${id}`, { method: 'DELETE' })
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : '删除字段规则失败' },
      { status: 500 },
    )
  }
}
