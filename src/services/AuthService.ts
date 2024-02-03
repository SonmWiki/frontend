import Keycloak, { type KeycloakConfig } from 'keycloak-js'
import type { App, InjectionKey } from 'vue'

const env = () => import.meta.env

export interface AuthService{
  login(): void;
  logout(): void;
  isLoggedIn(): boolean
  getAccessToken() : string | undefined;
  updateToken(successCallback: any): void;
  getUsername() : string | undefined;
  getUserRoles() : string[] | undefined;
}

export class KeycloakService implements AuthService{
  private readonly keycloakInstance: Keycloak

  constructor(callback: ()=>void) {
    const initOptions: KeycloakConfig = {
      url: env().VITE_KEYCLOAK_URL,
      realm: env().VITE_KEYCLOAK_REALM,
      clientId: env().VITE_KEYCLOAK_CLIENT_ID
    }
    this.keycloakInstance = new Keycloak(initOptions);
    this.keycloakInstance
      .init({
        onLoad: 'check-sso',
        checkLoginIframe: false,
        silentCheckSsoRedirectUri: location.origin + '/silent-check-sso.html'
      })
      .then((authenticated) => {
        authenticated ? console.log("Authenticated " + this.getUsername() + " " + this.getUserRoles()) : console.log("Unauthenticated")
        callback()
      })
      .catch((e) => {
        console.dir(e)
        console.log(`keycloak init exception: ${e}`)
      })
  }

  login() {
    this.keycloakInstance.login()
  }

  getUsername(): string | undefined {
    return this.keycloakInstance?.tokenParsed?.preferred_username
  }

  getAccessToken(): string | undefined {
    return this.keycloakInstance?.token
  }

  logout() {
    this.keycloakInstance.logout()
  }

  getUserRoles(): string[] | undefined {
    if (this.keycloakInstance.resourceAccess === undefined) return undefined
    if (this.keycloakInstance.resourceAccess[env().VITE_KEYCLOAK_CLIENT_ID] === undefined) return undefined

    return this.keycloakInstance.resourceAccess[env().VITE_KEYCLOAK_CLIENT_ID].roles
  }

  updateToken(successCallback: any){
    this.keycloakInstance.updateToken(5).then(successCallback).catch((e) => console.dir(e))
  }

  isLoggedIn(): boolean {
    return !!this.keycloakInstance.token
  }
}

export const authServiceKey = Symbol() as InjectionKey<AuthService>

