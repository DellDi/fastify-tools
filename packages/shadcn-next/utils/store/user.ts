// 基于supabase的user store, 内部存储关于user的相关状态

import { create } from 'zustand'
import { type User } from '@supabase/supabase-js'

interface UserStore {
  user: User | null
  setUser: (user: User | null) => void
  resetUser: () => void
}

const useUserStore = create<UserStore>((set) => ({
  user: null,
  resetUser: () => set({ user: null }),
  setUser: (user) => set({ user }),
}))

const setUserStore = (user: User) => useUserStore.getState().setUser(user)
const getUserStore = () => useUserStore.getState().user
const resetUserStore = () => useUserStore.getState().resetUser()

export {
  useUserStore,
  setUserStore,
  getUserStore,
  resetUserStore,
}
