import { NextResponse } from 'next/server'
import { parseCookies } from '@/utils/utils'
import { serviceCache } from '@/store/service'

export async function POST() {
  const loginUrl = "http://bug.new-see.com:8088/rest/gadget/1.0/login"
  const username = process.env.JIRA_USERNAME
  const password = process.env.JIRA_PASSWORD

  if (!loginUrl || !username || !password) {
    return NextResponse.json({ message: 'Missing Jira login credentials' }, { status: 400 })
  }

  try {
    // 缓存响应的结果，如果存在则直接返回，不再重复请求 设置过期时间为1小时
    const cachedResponse = serviceCache.get('loginResponse')
    if (cachedResponse) {
      return NextResponse.json(cachedResponse)
    }

    const response = await fetch(loginUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`newsee:newsee`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `os_username=${encodeURIComponent(username)}&os_password=${encodeURIComponent(password)}&os_cookie=true`,
    })
    if (!response.ok) {
      return NextResponse.json({ message: 'Login failed' }, { status: 500 })
    }
    // 获取fetch接口成功后的headers
    const setCookieHeader = response.headers.get('set-cookie') ?? []
    const cookies = parseCookies(setCookieHeader)

    const data = await response.json()
    serviceCache.set('loginResponse', { cookies, data })
    return NextResponse.json({ data, cookies }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 })
  }
}
