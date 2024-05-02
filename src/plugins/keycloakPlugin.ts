import type { KeycloakInitOptions } from "keycloak-js"
import { type App } from "vue"
import useAuthStore from "@/stores/AuthStore"
import { keycloakService } from "@/service/KeycloakService"

const keycloakPlugin = {
  install(app: App, options: { keycloakInitOptions: KeycloakInitOptions }) {
    keycloakService.init(options.keycloakInitOptions, useAuthStore())
  }
}

export default keycloakPlugin