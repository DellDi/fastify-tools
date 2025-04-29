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
      name: 'user-storage',
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

  const loadUserFromServer = async () => {
    setLoading(true)
    try {
      const user = await fetchBase('/api/user')
      setUser(user)
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
    loadUserFromServer
  }
}

export const getCurrentUser = () => useUserStore.getState().user