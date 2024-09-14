import { defineStore } from "pinia"
import { UserRole } from "@/types/UserRole"
import type Keycloak from "keycloak-js"


export type AuthStoreReturnType = ReturnType<typeof useAuthStore>

export type AuthStore = {
  username: string | null,
  accessToken: string | null,
  roles: string[]
}

const useAuthStore = defineStore({
  id: "authStore",
  state: (): AuthStore => {
    return {
      username: "",
      accessToken: null,
      roles: []
    }
  },
  getters: {
    isAuthenticated(): boolean {
      return !!this.accessToken
    }
  },
  actions: {
    loadUserData(keycloak: Keycloak) {
      this.username = keycloak.tokenParsed?.preferred_username
      this.accessToken = keycloak.token ?? null
      const roleKey = import.meta.env.VITE_KEYCLOAK_RESOURCE_ACCESS_ROLE_KEY
      if (keycloak.resourceAccess && Object.prototype.hasOwnProperty.call(keycloak.resourceAccess, roleKey)) {
        this.roles = keycloak.resourceAccess[roleKey].roles
      } else {
        this.roles = []
      }
    },
    hasRole(role: UserRole) {
      return this.roles === undefined ? false : this.roles.includes(role)
    }
  }
})

export default useAuthStore