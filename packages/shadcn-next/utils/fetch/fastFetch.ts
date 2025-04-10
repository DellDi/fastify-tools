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
            headers: {
                ...options.headers,
                Authorization: `Bearer ${process.env.NEXT_PUBLIC_FAST_API_KEY}`,
            },
            
        })
        if (!response.ok) {
            return new Error(`Fetch error: ${response.statusText}`)
        }
        if (response.headers.get('Content-Type')?.includes('application/json')) {
            return await response.json()
        }
        return await response
    } catch (error) {
        console.error('Fetch error:', error)
        throw error
    }
}
