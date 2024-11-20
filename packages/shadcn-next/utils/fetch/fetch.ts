// packages/shadcn-next/utils/fetch/fetch.ts
export const fetchBase = async (url: string, options: RequestInit) => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
  const __NEXT_PRIVATE_ORIGIN = process.env.BASE_NEXT_API_URL || ''
  const finalUrl = `${__NEXT_PRIVATE_ORIGIN}${basePath}${url}`
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
