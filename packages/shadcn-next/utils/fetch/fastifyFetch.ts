import { baseFetch, isServerEnvironment } from './baseFetch'

/**
 * 用于调用 Fastify 服务的 fetch 函数
 * @param url API 路径
 * @param options 请求选项
 * @returns 响应数据
 */
export const fastifyFetch = async (url: string, options: RequestInit = {}) => {
    // 后端调用地址
    const baseFastifyApiUrl = process.env.SERVER_FASTIFY_API || ''
    // 前端调用地址
    const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || ''

    // 根据环境选择基础URL
    const baseUrl = isServerEnvironment() ? baseFastifyApiUrl : baseApiUrl

    // 判断是否是 FormData 类型的请求体
    const isFormData = options.body instanceof FormData

    // 仅当携带 body 且不是 FormData 时才加 JSON Content-Type。
    // 无 body 的 GET/DELETE 带该头会被 Fastify 判 400：
    // "Body cannot be empty when content-type is set to 'application/json'"
    const defaultHeaders: Record<string, string> =
        !isFormData && options.body ? { 'Content-Type': 'application/json' } : {}

    return baseFetch(url, baseUrl, options, defaultHeaders)
}

/**
 * 创建用于 useSWR 的 Fastify 数据获取函数
 */
export const createFastifySWRFetcher = (defaultOptions: RequestInit = {}) => {
    return async (key: string | [string, Record<string, unknown>]) => {
        // 支持 useSWR 的键值对形式，如 [url, params]
        let url: string
        const options = { ...defaultOptions }

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

        return fastifyFetch(url, options)
    }
}

/**
 * 用于 GET 请求的 SWR fetcher
 */
export const fastifySWRFetcher = createFastifySWRFetcher({ method: 'GET' })

/**
 * 用于 POST 请求的 SWR fetcher
 */
export const fastifySWRPostFetcher = createFastifySWRFetcher({ method: 'POST' })
