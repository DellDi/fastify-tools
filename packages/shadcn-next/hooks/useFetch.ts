/**
 * 数据获取 hooks 集合
 * 提供基于 SWR 的数据获取功能
 */
import useSWR, { SWRConfiguration, SWRResponse } from 'swr'
import { fetchFastApi, fastApiSWRFetcher } from '@/utils/fetch/fastFetch'
import { fastifyFetch, fastifySWRFetcher } from '@/utils/fetch/fastifyFetch'
import { fetchBase, nextSWRFetcher } from '@/utils/fetch/fetch'

/**
 * 用于调用 FastAPI 服务的 hook
 * @param url API 路径
 * @param params 查询参数（GET 请求）或请求体（POST 请求）
 * @param options SWR 配置选项
 * @returns SWR 响应对象
 */
export function useFastApi<T = any>(
  url: string | null, 
  params?: Record<string, any>,
  options?: SWRConfiguration
): SWRResponse<T, Error> {
  const key = url ? (params ? [url, params] : url) : null
  
  return useSWR<T>(key, fastApiSWRFetcher, {
    suspense: false,
    revalidateOnFocus: false,
    dedupingInterval: 5000,
    ...options,
  })
}

/**
 * 用于调用 Fastify 服务的 hook
 * @param url API 路径
 * @param params 查询参数（GET 请求）或请求体（POST 请求）
 * @param options SWR 配置选项
 * @returns SWR 响应对象
 */
export function useFastify<T = any>(
  url: string | null, 
  params?: Record<string, any>,
  options?: SWRConfiguration
): SWRResponse<T, Error> {
  const key = url ? (params ? [url, params] : url) : null
  
  return useSWR<T>(key, fastifySWRFetcher, {
    suspense: false,
    revalidateOnFocus: false,
    dedupingInterval: 5000,
    ...options,
  })
}

/**
 * 用于调用 Next.js API 路由的 hook
 * @param url API 路径
 * @param params 查询参数（GET 请求）或请求体（POST 请求）
 * @param options SWR 配置选项
 * @returns SWR 响应对象
 */
export function useNextApi<T = any>(
  url: string | null, 
  params?: Record<string, any>,
  options?: SWRConfiguration
): SWRResponse<T, Error> {
  const key = url ? (params ? [url, params] : url) : null
  
  return useSWR<T>(key, nextSWRFetcher, {
    suspense: false,
    revalidateOnFocus: false,
    dedupingInterval: 5000,
    ...options,
  })
}

/**
 * 创建一个自定义的数据获取 hook
 * @param fetcher 自定义的数据获取函数
 * @param defaultOptions 默认配置选项
 * @returns 自定义 hook
 */
export function createFetchHook<T = any>(
  fetcher: (key: string | [string, any]) => Promise<T>,
  defaultOptions: SWRConfiguration = {}
) {
  return (url: string | null, params?: Record<string, any>, options?: SWRConfiguration) => {
    const key = url ? (params ? [url, params] : url) : null
    
    return useSWR<T>(key, fetcher, {
      ...defaultOptions,
      ...options,
    })
  }
}
