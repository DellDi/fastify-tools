import { useMemo } from 'react'

export function useBasePath() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

  const getPath = useMemo(() => {
    return (path: string) => `${basePath}${path}`
  }, [basePath])

  return { basePath, getPath }
}
