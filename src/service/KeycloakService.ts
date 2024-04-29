import { type AuthStoreReturnType } from '@/stores/AuthStore'
import Keycloak, { type KeycloakInitOptions } from 'keycloak-js'
import type { InjectionKey } from 'vue'

export const keycloakServiceKey = Symbol() as InjectionKey<KeycloakService>

export interface KeycloakJsConfig {
  url: string
  realm: string
  clientId: string
}

export interface KeycloakServiceConfig {
  refreshTokenMilliseconds: number
}

const keycloakJsConfig: KeycloakJsConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL ?? '',
  realm: import.meta.env.VITE_KEYCLOAK_REALM ?? '',
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID ?? ''
}

const keycloakServiceConfig: KeycloakServiceConfig = {
  refreshTokenMilliseconds: import.meta.env.VITE_REFRESH_TOKEN_MS ?? 50000
}

export class KeycloakService {
  private keycloakInstance: Keycloak

  constructor(
    protected authStore: AuthStoreReturnType,
  ) {
    this.keycloakInstance = new Keycloak(keycloakJsConfig);
  }
  async init(): Promise<void>{
    const initOptions: KeycloakInitOptions = {
      onLoad: 'check-sso',
      checkLoginIframe: false,
      silentCheckSsoRedirectUri: location.origin + '/silent-check-sso.html'
    }

    await this.keycloakInstance.init(initOptions)
  }

  async login(): Promise<void> {
    await this.keycloakInstance.login()
  }

  loadUserData(){
    console.log(this.keycloakInstance.tokenParsed?.preferred_username)
    this.authStore.username = this.keycloakInstance.tokenParsed?.preferred_username
    this.authStore.accessToken = this.keycloakInstance.token ?? null
    this.authStore.refreshToken = this.keycloakInstance.refreshToken ?? null
    const roleKey = this.keycloakInstance.clientId ?? ''
    if (this.keycloakInstance.resourceAccess && Object.prototype.hasOwnProperty.call(this.keycloakInstance.resourceAccess, roleKey)) {
      this.authStore.roles = this.keycloakInstance.resourceAccess[roleKey].roles
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

}