import { defineStore } from 'pinia'
import Keycloak, { type KeycloakConfig, type KeycloakInitOptions } from 'keycloak-js'
import { ref } from 'vue'

const useKeycloakStore = defineStore('keycloakStore', () => {
  const keycloak = ref<Keycloak>()

  async function init() {
    const keycloakConfig: KeycloakConfig = {
      url: import.meta.env.VITE_KEYCLOAK_URL,
      realm: import.meta.env.VITE_KEYCLOAK_REALM,
      clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID
    }

    const initOptions: KeycloakInitOptions = {
      onLoad: 'check-sso',
      checkLoginIframe: false,
      silentCheckSsoRedirectUri: location.origin + '/silent-check-sso.html'
    }

    keycloak.value = new Keycloak(keycloakConfig)
    try {
      await keycloak.value.init(initOptions)
    } catch (e) {
      console.dir(e)
      console.log(`keycloak init exception: ${e}`)
    }
  }

  return { keycloak, init }
})

export default useKeycloakStore