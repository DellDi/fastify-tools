import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const loginUrl = 'http://bug.new-see.com:8088/rest/gadget/1.0/login'
  const username = 'liufengxiao'
  const password = 'lfx123456'

  try {
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
    res.status(200).json({ data, cookies })
  } catch (error) {
    res.status(500).json({ message: 'Error logging in to Jira' })
  }
}
