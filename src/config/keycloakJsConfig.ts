export interface KeycloakJsConfig {
  url: string,
  realm: string,
  clientId: string
}

export const keycloakJsConfig: KeycloakJsConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL ?? "",
  realm: import.meta.env.VITE_KEYCLOAK_REALM ?? "",
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID ?? ""
}