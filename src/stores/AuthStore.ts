import { defineStore } from 'pinia'
import { type Ref, ref } from 'vue'
import { UserRole } from '@/types/UserRole'
import useKeycloakStore from '@/stores/KeycloakStore'

const useAuthStore = defineStore('authStore', () => {
  const keycloakStore = useKeycloakStore()
  const isAuthenticated : Ref<Boolean | undefined> = ref()
  const userName: Ref<string | undefined> = ref()
  const token: Ref<string | undefined> = ref()
  const refreshToken: Ref<string | undefined> = ref()
  const roles: Ref<string[] | undefined> = ref()

  function loadUserData(){
    isAuthenticated.value = keycloakStore.keycloak?.authenticated
    userName.value = keycloakStore.keycloak?.tokenParsed?.preferred_username
    token.value = keycloakStore.keycloak?.token
    refreshToken.value = keycloakStore.keycloak?.refreshToken
    if (keycloakStore.keycloak?.resourceAccess !== undefined) {
      roles.value = keycloakStore.keycloak?.resourceAccess[import.meta.env.VITE_KEYCLOAK_CLIENT_ID].roles
    }
  }

  async function login(){
    await keycloakStore.keycloak?.login()
  }

  async function logout(){
    await keycloakStore.keycloak?.logout()
    loadUserData()
  }

  async function updateToken(){
    try {
      await keycloakStore.keycloak?.updateToken(5);
      loadUserData();
    } catch (error) {
      console.error(error);
    }
  }

  function hasRole(role: UserRole){
    return roles.value === undefined ? false : roles.value.includes(role)
  }

  return { isAuthenticated, userName, token, refreshToken, roles, loadUserData, login, logout, updateToken, hasRole }
})

export default useAuthStore