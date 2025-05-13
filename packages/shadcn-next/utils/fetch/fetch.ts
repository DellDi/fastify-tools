import { baseFetch } from './baseFetch'

/**
 * 用于调用 Next.js 本地服务端的 fetch 函数
 * @param url API 路径
 * @param options 请求选项
 * @returns 响应数据
 */
export const fetchBase = async (url: string, options: RequestInit = {}) => {
  const isServer = typeof window === 'undefined'
  
  // 获取 basePath 前缀
  let basePath = ''
  
  // 客户端环境下需要考虑 basePath
  if (!isServer) {
    basePath = (window as any).__NEXT_DATA__?.basePath || process.env.NEXT_PUBLIC_BASE_PATH || ''
  } 
  // 服务端环境下，对内部 API 路由不需要 basePath
  else if (!url.startsWith('/api/')) {
    // 非内部 API 路由可能需要 basePath
    basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
  }
  
  // 确保 URL 正确拼接 basePath
  return baseFetch(url, basePath, options)
}

/**
 * 创建用于 useSWR 的 Next.js API 数据获取函数
 */
export const createNextSWRFetcher = (defaultOptions: RequestInit = {}) => {
  return async (key: string | [string, any]) => {
    // 支持 useSWR 的键值对形式，如 [url, params]
    let url: string
    let options = { ...defaultOptions }
    
    if (Array.isArray(key)) {
      url = key[0]
      const params = key[1]
      
      // 如果第二个参数是对象，将其作为请求体或查询参数
      if (params && typeof params === 'object') {
        if (options.method === 'GET' || !options.method) {
          // GET 请求：转换为查询参数
          const queryParams = new URLSearchParams()
          Object.entries(params).forEach(([k, v]) => {
            if (v !== undefined && v !== null) {
              queryParams.append(k, String(v))
            }
          })
          const queryString = queryParams.toString()
          if (queryString) {
            url = `${url}${url.includes('?') ? '&' : '?'}${queryString}`
          }
        } else {
          // 其他请求：作为 JSON 请求体
          options.headers = {
            ...options.headers,
            'Content-Type': 'application/json',
          }
          options.body = JSON.stringify(params)
        }
      }
    } else {
      url = key
    }
    
    // 在客户端环境中才执行请求
    if (typeof window === 'undefined') {
      // 服务端环境跳过 API 请求，返回空数据
      if (url.startsWith('/api/')) {
        return { skipped: true, message: 'API request skipped in server environment' }
      }
    }
    
    return fetchBase(url, options)
  }
}

/**
 * 用于 GET 请求的 SWR fetcher
 */
export const nextSWRFetcher = createNextSWRFetcher({ method: 'GET' })

/**
 * 用于 POST 请求的 SWR fetcher
 */
export const nextSWRPostFetcher = createNextSWRFetcher({ method: 'POST' })
