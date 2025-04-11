export const fetchFastApi = async (url: string, options: RequestInit) => {
    const baseToolApiUrl = process.env.NEXT_PUBLIC_FAST_API_URL || ''
    // 在服务端环境中，需要完整URL；在客户端环境中，使用相对URL
    let finalUrl = `${baseToolApiUrl}${url}`
    // 判断当前环境
    const isServer = typeof window === 'undefined'
    if (isServer) {
        finalUrl = `${baseToolApiUrl}${url}`
    }
    try {
        const response = await fetch(finalUrl, {
            ...options,
            // 确保跨域请求能正确传递响应头
            headers: {
                ...options.headers,
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_FAST_API_KEY}`,
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
