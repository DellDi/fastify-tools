import { NextRequest, NextResponse } from 'next/server'

// 透传 /fs/* 到 fastify：二进制下载/图片流走 body 直通，JSON 操作同样适用
const HOP_HEADERS = new Set(['connection', 'transfer-encoding', 'keep-alive', 'content-encoding'])

async function handler(req: NextRequest, ctx: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await ctx.params
  const base = process.env.SERVER_FASTIFY_API || ''
  const url = `${base}/fs/${slug.join('/')}${req.nextUrl.search}`

  const headers: Record<string, string> = {
    Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
  }
  const init: RequestInit = { method: req.method, headers }
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    const ct = req.headers.get('content-type')
    if (ct) headers['Content-Type'] = ct
    init.body = await req.arrayBuffer()
    ;(init as { duplex?: string }).duplex = 'half'
  }

  try {
    const res = await fetch(url, init)
    const outHeaders = new Headers()
    res.headers.forEach((v, k) => {
      if (!HOP_HEADERS.has(k.toLowerCase())) outHeaders.set(k, v)
    })
    return new NextResponse(res.body, { status: res.status, headers: outHeaders })
  } catch (e) {
    return NextResponse.json(
      { message: e instanceof Error ? e.message : '请求失败' },
      { status: 502 }
    )
  }
}

export { handler as GET, handler as POST, handler as DELETE, handler as PUT }
