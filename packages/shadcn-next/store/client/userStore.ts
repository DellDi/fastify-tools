// 用户信息状态管理
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User } from '@/generated/client'
import { fetchBase } from '@/utils/fetch/fetch'

interface UserState {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setLoading: (isLoading: boolean) => void
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'user',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isLoading: state.isLoading
      })
    }
  )
)

export const useUserActions = () => {
  const { user, setUser, isLoading, setLoading } = useUserStore()

  const loadUser = async () => {
    setLoading(true)
    try {
      const response = await fetchBase('/api/auth/user')
      const data = await response.json()
      setUser(data.user)
    } catch (error) {
      console.error('加载用户失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const clearUserOnLogout = () => {
    setUser(null)
  }

  return {
    user,
    setUser,
    isLoading,
    setLoading,
    clearUserOnLogout,
    loadUser
  }
}

export const getCurrentUser = () => useUserStore.getState().user