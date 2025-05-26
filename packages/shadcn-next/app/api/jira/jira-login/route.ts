import { NextResponse } from 'next/server'
import { parseCookies } from '@/lib/utils'
import { serviceCache } from '@/store/service'
import { fastifyFetch } from '@/utils/fetch/fastifyFetch'

export async function POST() {
  const username = process.env.JIRA_USERNAME
  const password = process.env.JIRA_PASSWORD

  if (!username || !password) {
    return NextResponse.json(
      { message: 'Missing Jira login credentials' },
      { status: 400 }
    )
  }

  try {
    // 缓存响应的结果，如果存在则直接返回，不再重复请求 设置过期时间为1小时
    // const cachedResponse = serviceCache.get('loginResponse')
    // if (cachedResponse) {
    //   return NextResponse.json(cachedResponse)
    // }

    const response = await fastifyFetch('/jira/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jiraUser: username,
        jiraPassword: password,
      }),
    })

    const { cookies, atlToken } = response

    // serviceCache.set('loginResponse', { cookies, atlToken })

    return NextResponse.json({ cookies, atlToken }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: error }, { status: 500 })
  }
}
