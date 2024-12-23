// 基于supabase的user_role权限管理
import { create } from 'zustand'

export type UserRole = {
  id: string
  name: string
  description: string
  status: string
  // created_by: string
  // updated_by: string
  // created_at: Date
  // updated_at: Date
  // deleted_at: Date | null
}

interface UserRoleStore {
  role: UserRole[] | null
  setRole: (role: UserRole[]) => void
  resetRole: () => void
}

const useRoleStore = create<UserRoleStore>((set) => ({
  role: null,
  setRole: (role) => set({ role }),
  resetRole: () => set({ role: null }),
}))

const setRoleStore = (roles: UserRole[]) => useRoleStore.getState().setRole(roles)
const getRoleStore = () => useRoleStore.getState().role
const resetRoleStore = () => useRoleStore.getState().resetRole()

export {
  useRoleStore,
  setRoleStore,
  getRoleStore,
  resetRoleStore,
}
