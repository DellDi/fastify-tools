import { useMemo } from 'react'
import getConfig from 'next/config'

export function useBasePath() {
  const basePath = useMemo(() => {
    const { publicRuntimeConfig } = getConfig()
    return publicRuntimeConfig.basePath || ''
  }, [])

  const getPath = useMemo(() => {
    return (path: string) => `${basePath}${path}`
  }, [basePath])

  return { basePath, getPath }
}
