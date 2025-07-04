'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, Loader } from 'lucide-react'
import { useMenuActions } from '@/store/client/menuStore'
import { fetchBase } from '@/utils/fetch/fetch'
import { useToast } from '@/components/ui/use-toast'
import { useUserActions } from '@/store/client/userStore'

export function LogoutButton() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const { clearMenusOnLogout } = useMenuActions()
  const { clearUserOnLogout } = useUserActions()
  const router = useRouter()
  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await fetchBase('/api/auth/logout', {
        method: 'POST',
      })

      toast({
        title: '登出成功',
        description: '你已经成功登出',
        variant: 'default',
      })

      // 清楚客户端缓存
      localStorage.clear()
      // 清除菜单数据
      clearMenusOnLogout()
      // 清除用户数据
      clearUserOnLogout()

      router.push('/')

    } catch (error) {
      console.error('Logout error:', error)
      toast({
        title: '登出失败',
        description: '请检查网络连接或API权限',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {!isLoading ? (
        <div
          className="flex items-center gap-2 w-full"
          onClick={() => handleLogout()}
        >
          <LogOut className="h-4 w-4 text-muted-foreground" />
          Log out
        </div>
      ) : (
        <Loader />
      )}
    </>
  )
}
