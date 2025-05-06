import { toast } from "sonner"

/**
 * 基础 fetch 实现，用于内部代码复用
 * 不直接暴露给外部使用
 */
export const baseFetch = async (
  url: string,
  baseUrl: string = '',
  options: RequestInit = {},
  extraHeaders: Record<string, string> = {}
) => {
  const finalUrl = `${baseUrl}${url}`

  try {
    // 判断是否是 FormData 类型的请求体
    const isFormData = options.body instanceof FormData

    // 如果是 FormData，不要设置 Content-Type，让浏览器自动设置带边界的值
    const headers = isFormData
      ? { ...options.headers }
      : { ...options.headers, ...extraHeaders }

    const response = await fetch(finalUrl, {
      ...options,
      headers,
    })

    if (!response.ok) {
      // 尝试获取错误详情
      const errorText = await response.text().catch(() => response.statusText)

      if (isServerEnvironment()) {
        throw new Error(`请求失败: ${response.status} ${errorText}`)
      }

      toast.error(errorText)
      return {
        code: response.status,
        message: errorText,
        data: null,
      }
    }

    // 对于 JSON 响应，解析为 JSON 对象
    if (response.headers.get('Content-Type')?.includes('application/json')) {
      return await response.json()
    }

    // 其他类型的响应，克隆一份以确保可以多次读取
    return response.clone()
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
}

/**
 * 确定当前运行环境
 * @returns 是否为服务端环境
 */
export const isServerEnvironment = () => typeof window === 'undefined'
