'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })
      if (response.ok) {
        router.push('/auth')
      } else {
        throw new Error("登出失败")
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handleLogout} disabled={isLoading}>
      {isLoading ? '登出中...' : '登出'}
    </Button>
  )
}

