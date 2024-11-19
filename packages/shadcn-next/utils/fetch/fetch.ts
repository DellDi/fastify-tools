// 封装标准fetch方法，方便调用、导出函数传参即可
export const fetchBase = async (url: string, options: RequestInit) => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

  // 这种写法可以同时支持客户端和服务端的fetch请求
  const __NEXT_PRIVATE_ORIGIN = process.env.__NEXT_PRIVATE_ORIGIN || ''

  // 拼接基础路径和目标URL，形成最终的请求URL
  const finalUrl = `${__NEXT_PRIVATE_ORIGIN}${basePath}${url}`
  console.log('🚀 ~ file:fetch.ts, line:8-----', finalUrl, options.method)
  // 发起请求，并传入请求选项
  const response = await fetch(finalUrl, options)

  // 检查响应是否成功，如果不成功则抛出错误
  if (!response.ok) {
    throw new Error('Failed to fetch')
  }

  // 判断响应类型，如果是JSON则返回JSON数据，否则返回文本数据
  if (response.headers.get('Content-Type')?.includes('application/json')) {
    return await response.json()
  }
  return await response.text()
}
