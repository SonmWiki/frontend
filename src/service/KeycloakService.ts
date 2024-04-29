import { type AuthStoreReturnType } from "@/stores/AuthStore"
import Keycloak, { type KeycloakInitOptions } from "keycloak-js"
import { keycloakJsConfig } from "@/config/keycloakJsConfig"
import { keycloakServiceConfig } from "@/config/keycloakServiceConfig"
import type { InjectionKey } from "vue"

export const keycloakServiceKey = Symbol() as InjectionKey<KeycloakService>

export class KeycloakService {
  private keycloakInitialized = false
  private keycloakInstance: Keycloak
  private keycloakReadyCallbacks: (() => void)[] = []

  constructor(protected authStore: AuthStoreReturnType) {
    this.keycloakInstance = new Keycloak(keycloakJsConfig)
  }

  async init(initOptions: KeycloakInitOptions): Promise<void> {
    await this.keycloakInstance.init(initOptions)
    this.loadUserData()
    this.keycloakReadyCallbacks.forEach(callback => callback())
    this.keycloakInitialized = true
  }

  isInitialized(): boolean{
    return this.keycloakInitialized
  }

  async login(): Promise<void> {
    await this.keycloakInstance.login()
  }

  loadUserData() {
    console.log(this.keycloakInstance.tokenParsed?.preferred_username)
    this.authStore.username = this.keycloakInstance.tokenParsed?.preferred_username
    this.authStore.accessToken = this.keycloakInstance.token ?? null
    this.authStore.refreshToken = this.keycloakInstance.refreshToken ?? null
    const roleKey = this.keycloakInstance.clientId ?? ""
    if (this.keycloakInstance.resourceAccess && Object.prototype.hasOwnProperty.call(this.keycloakInstance.resourceAccess, roleKey)) {
      this.authStore.roles = this.keycloakInstance.resourceAccess[roleKey].roles
    }else {
      this.authStore.roles = []
    }
  }

  logout(): void {
    this.keycloakInstance.logout()
    this.authStore.username = null
    this.authStore.accessToken = null
    this.authStore.refreshToken = null
    this.authStore.roles = []
  }

  async refreshToken(): Promise<void> {
    const refreshed = await this.keycloakInstance.updateToken(5)

    if (refreshed) {
      this.authStore.accessToken = this.keycloakInstance.token as string
    }

    setTimeout(async () => {
      await this.refreshToken()
    }, keycloakServiceConfig.refreshTokenMilliseconds)
  }
  onKeycloakReady(callback: () => void){
    if(this.keycloakInitialized){
      callback()
    } else {
      this.keycloakReadyCallbacks.push(callback)
    }
  }

}