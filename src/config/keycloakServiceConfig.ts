export interface KeycloakServiceConfig {
  refreshTokenMilliseconds: number
}

export const keycloakServiceConfig: KeycloakServiceConfig = {
  refreshTokenMilliseconds: import.meta.env.VITE_REFRESH_TOKEN_MS ?? 50000
}