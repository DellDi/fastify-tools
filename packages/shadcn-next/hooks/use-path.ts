import { useMemo } from 'react'

export function useBasePath() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
  const baseToolApiUrl = process.env.NEXT_PUBLIC_FAST_API_URL || ''
  const getPath = useMemo(() => {
    return (path: string) => `${basePath}${path}`
  }, [basePath])

  return { basePath, getPath, baseToolApiUrl }
}


