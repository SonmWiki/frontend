import type { KeycloakInitOptions } from "keycloak-js"
import { type App, provide } from "vue"
import { KeycloakService, keycloakServiceKey } from "@/service/KeycloakService"
import useAuthStore from "@/stores/AuthStore"
import type { Pinia } from "pinia"

const keycloakPlugin = {
  install(app: App, options: { keycloakInitOptions: KeycloakInitOptions, pinia: Pinia }) {
    const keycloakService = new KeycloakService(useAuthStore(options.pinia))
    app.provide(keycloakServiceKey, keycloakService)
    keycloakService.init(options.keycloakInitOptions)
  }
}

export default keycloakPlugin