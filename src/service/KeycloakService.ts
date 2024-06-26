import Keycloak, { type KeycloakInitOptions, type KeycloakLoginOptions } from "keycloak-js"
import { keycloakJsConfig, type KeycloakJsConfig } from "@/config/keycloakJsConfig"
import { type AuthStoreReturnType } from "@/stores/AuthStore"
import router from "@/router"

export class KeycloakService {
  private keycloakInitialized = false
  private readonly keycloakInstance: Keycloak
  private keycloakReadyCallbacks: (() => void)[] = []
  private authStore: AuthStoreReturnType | undefined

  constructor(keycloakJsConfig: KeycloakJsConfig) {
    this.keycloakInstance = new Keycloak(keycloakJsConfig)
  }

  async init(initOptions: KeycloakInitOptions, authStore: AuthStoreReturnType): Promise<void> {
    this.authStore = authStore
    await this.keycloakInstance.init(initOptions)
    this.authStore?.loadUserData(this.keycloakInstance)
    this.keycloakReadyCallbacks.forEach(callback => callback())
    this.keycloakInitialized = true
  }

  isInitialized(): boolean {
    return this.keycloakInitialized
  }

  async login(options: KeycloakLoginOptions | undefined = undefined): Promise<void> {
    await this.keycloakInstance.login(options)
  }

  async logout(): Promise<void> {
    await this.keycloakInstance.logout()
    this.authStore?.loadUserData(this.keycloakInstance)
  }

  async refreshToken(): Promise<void> {
    try {
      await this.keycloakInstance.updateToken(5)
      this.authStore?.loadUserData(this.keycloakInstance)
    }catch (e){
      this.authStore?.loadUserData(this.keycloakInstance)
      await router.push({name: "home"})
    }
  }

  onKeycloakReady(callback: () => void) {
    if (this.keycloakInitialized) {
      callback()
    } else {
      this.keycloakReadyCallbacks.push(callback)
    }
  }
}

export const keycloakService = new KeycloakService(keycloakJsConfig)