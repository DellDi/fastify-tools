export const fastifyFetch = async (url: string, options: RequestInit) => {
    // 后端调用地址
    const baseFastifyApiUrl = process.env.BASE_FASTIFY_API_URL || ''
    // 前端调用地址
    const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || ''
    let finalUrl = url
    // 判断当前环境
    const isServer = typeof window === 'undefined'
    if (isServer) {
        finalUrl = `${baseFastifyApiUrl}${url}`
    } else {
        finalUrl = `${baseApiUrl}${url}`
    }
    try {
        console.log("🚀 ~ fastifyFetch ~ finalUrl:", finalUrl, isServer)

        const response = await fetch(finalUrl, {
            ...options,
            // 确保跨域请求能正确传递响应头
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        })
        if (!response.ok) {
            throw new Error(`Fetch error: ${response.statusText}`)
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
