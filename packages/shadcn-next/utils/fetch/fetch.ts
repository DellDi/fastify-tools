// packages/shadcn-next/utils/fetch/fetch.ts

export const fetchBase = async (url: string, options: RequestInit) => {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
  const __NEXT_PRIVATE_ORIGIN = process.env.__NEXT_PRIVATE_ORIGIN || ''

  // Ensure the URL is correctly formed
  if (!__NEXT_PRIVATE_ORIGIN) {
    console.warn('Environment variable __NEXT_PRIVATE_ORIGIN is not set')
    return null
  }

  const finalUrl = `${__NEXT_PRIVATE_ORIGIN}${basePath}${url}`

  console.log('🚀 ~ file:fetch.ts, line:11-----', finalUrl)

  try {
    const response = await fetch(finalUrl, options)

    if (!response.ok) {
      console.warn('Failed to fetch', finalUrl)
      return null
    }

    if (response.headers.get('Content-Type')?.includes('application/json')) {
      return await response.json()
    }
    return await response.text()
  } catch (error) {
    console.error('Fetch error:', error)
    return null
  }
}
