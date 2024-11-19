import { NextResponse } from 'next/server'
import { serviceCache } from '@/utils/store/service'
const cache = serviceCache

export async function POST() {
  const loginUrl = 'http://bug.new-see.com:8088/rest/gadget/1.0/login'
  const username = 'liufengxiao'
  const password = 'lfx123456'

  try {
    // 缓存响应的结果，如果存在则直接返回，不再重复请求 设置过期时间为1小时
    const cachedResponse = cache.get('loginResponse')
    if (cachedResponse) {
      return NextResponse.json(cachedResponse)
    }

    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic bmV3c2VlOm5ld3NlZQ==`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `os_username=${encodeURIComponent(username)}&os_password=${encodeURIComponent(password)}&os_cookie=true`,
    })
    if (!response.ok) {
      return new Error('Login failed')
    }
    // 获取fetch接口成功后的headers
    const setCookieHeader = response.headers.get('set-cookie') ?? []
    const cookies = Array.isArray(setCookieHeader)
      ? setCookieHeader
      .map((cookie: string) => cookie.split(';')[0])
      .join(';')
      : setCookieHeader.split(';')[0]
    const data = await response.json()
    cache.set('loginResponse', { cookies, data })
    return NextResponse.json({ data, cookies }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 })
  }
}
