// 用户状态管理
// 使用zustand实现，支持持久化存储

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User } from '@/generated/client'

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

export const getUserStore = () => useUserStore

export const getCurrentUser = () => useUserStore.getState().user