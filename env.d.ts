/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_APP_NAME: string,
    readonly VITE_APP_FULL_NAME: string,
    readonly VITE_APP_LOGO: string,
    readonly VITE_API_URL: string,
    readonly VITE_KEYCLOAK_URL: string,
    readonly VITE_KEYCLOAK_REALM: string,
    readonly VITE_KEYCLOAK_CLIENT_ID: string,
    readonly VITE_KEYCLOAK_RESOURCE_ACCESS_ROLE_KEY: string,
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}