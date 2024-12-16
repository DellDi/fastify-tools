// 基于supabase的role_menu菜单管理
import { create } from 'zustand'

export type UserRoleMenu = {
  id: string
  name: string
  description: string
  status: string
  created_by: string
  updated_by: string
  created_at: Date
  updated_at: Date
  deleted_at: Date | null
}

interface UserRoleStore {
  roleMenu: UserRole | null
  setRoleMenu: (role: UserRole | null) => void
  resetRole: () => void
}

const useRoleStore = create<UserRoleStore>((set) => ({
  role: null,
  setRole: (role) => set({ role }),
  resetRole: () => set({ role: null }),
}))

const setRoleStore = (role: UserRole) => useRoleStore.getState().setRole(role)
const getRoleStore = () => useRoleStore.getState().role
const resetRoleStore = () => useRoleStore.getState().resetRole()

export {
  useRoleStore,
  setRoleStore,
  getRoleStore,
  resetRoleStore,
}
