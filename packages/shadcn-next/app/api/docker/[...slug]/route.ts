import { NextRequest, NextResponse } from 'next/server'

async function handler(req: NextRequest, ctx: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await ctx.params
  const base = process.env.SERVER_FASTIFY_API || ''
  const url = `${base}/docker/${slug.join('/')}${req.nextUrl.search}`

  const headers: Record<string, string> = {
    Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
    'Content-Type': 'application/json',
  }
  const init: RequestInit = { method: req.method, headers }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    init.body = await req.text()
  }

  try {
    const res = await fetch(url, init)
    const text = await res.text()
    return new NextResponse(text, {
      status: res.status,
      headers: { 'Content-Type': res.headers.get('content-type') ?? 'application/json' },
    })
  } catch (e) {
    return NextResponse.json(
      { message: e instanceof Error ? e.message : '请求失败' },
      { status: 502 }
    )
  }
}

export { handler as GET, handler as POST, handler as DELETE }
