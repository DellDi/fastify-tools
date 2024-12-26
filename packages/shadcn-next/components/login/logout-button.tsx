'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Loader } from 'lucide-react'

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
        router.push('/')
      } else {
        return new Error('登出失败')
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {!isLoading ?
        (<div className="flex items-center gap-2 w-full" onClick={
            () => handleLogout()}>
            <LogOut className="h-4 w-4 text-muted-foreground"/>
            Log out
          </div>
        )
        : <Loader/>}
    </>
  )
}

