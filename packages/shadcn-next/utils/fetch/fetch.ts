export const fetchBase = async (url: string, options: RequestInit) => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
  
  // 判断当前环境
  const isServer = typeof window === 'undefined'
  
  // 在服务端环境中，需要完整URL；在客户端环境中，使用相对URL
  let finalUrl = url
  
  if (isServer) {
    // 服务端渲染时需要完整URL
    const baseUrl = process.env.BASE_NEXT_API_URL
    if (!baseUrl) {
      console.warn('BASE_NEXT_API_URL 未设置，服务端渲染可能无法正确请求API')
      // 在服务端但没有设置BASE_NEXT_API_URL时，返回空结果避免错误
      if (url.startsWith('/api/')) {
        console.log('服务端渲染跳过API请求:', url)
        return { skipped: true, message: 'API request skipped in server environment without BASE_NEXT_API_URL' }
      }
    }
    finalUrl = `${baseUrl || ''}${basePath}${url}`
  } else {
    // 客户端渲染时使用相对URL
    finalUrl = `${basePath}${url}`
  }
  
  try {
    const response = await fetch(finalUrl, options)
    if (!response.ok) {
      return new Error(`Fetch error: ${response.statusText}`)
    }
    if (response.headers.get('Content-Type')?.includes('application/json')) {
      return await response.json()
    }
    return await response.text()
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
}
