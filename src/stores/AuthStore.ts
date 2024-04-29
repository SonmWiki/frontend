import { defineStore } from 'pinia'
import { UserRole } from '@/types/UserRole'


export type AuthStoreReturnType = ReturnType<typeof useAuthStore>

export type AuthStore = {
  username: string | null,
  accessToken: string | null,
  refreshToken: string | null,
  roles: string[]
}

const useAuthStore = defineStore({
  id: "authStore",
  state: (): AuthStore => {
    return{
      username: "",
      accessToken: null,
      refreshToken: null,
      roles: [],
    }
  },
  persist: true,
  getters: {
    isAuthenticated(): boolean {
      return !!this.accessToken
    }
  },
  actions: {
    hasRole(role: UserRole){
      return this.roles === undefined ? false : this.roles.includes(role)
    }
  }
})

export default useAuthStore