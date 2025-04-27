import { baseFetch, isServerEnvironment } from './baseFetch'

/**
 * 用于调用 FastAPI 服务的 fetch 函数
 * @param url API 路径
 * @param options 请求选项
 * @returns 响应数据
 */
export const fetchFastApi = async (url: string, options: RequestInit = {}) => {
    const baseToolApiUrl = process.env.NEXT_PUBLIC_FAST_API_URL || ''
    
    // 添加 API 密钥认证
    const authHeader = { Authorization: `Bearer ${process.env.NEXT_PUBLIC_FAST_API_KEY}` }
    
    return baseFetch(url, baseToolApiUrl, options, authHeader)
}

/**
 * 创建用于 useSWR 的 FastAPI 数据获取函数
 */
export const createFastApiSWRFetcher = (defaultOptions: RequestInit = {}) => {
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
        
        return fetchFastApi(url, options)
    }
}

/**
 * 用于 GET 请求的 SWR fetcher
 */
export const fastApiSWRFetcher = createFastApiSWRFetcher({ method: 'GET' })
