import { useState, useEffect } from 'react'

export function usePermissions() {
  const [permissions, setPermissions] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {

  }, [])


  return { permissions, isLoading }
}

