import { Api } from "@/api"
import useAuthStore from "@/stores/AuthStore"
import { HttpStatusCode } from "axios"
import { keycloakService } from "@/service/KeycloakService"
import { appConfig } from "@/config/appConfig"

export const wikiApi = new Api({
  baseURL: appConfig.apiUrl
})

wikiApi.instance.interceptors.request.use((config) => {
    const authStore = useAuthStore()
    if (authStore.isAuthenticated) {
      config.headers.Authorization = `Bearer ${authStore.accessToken as string}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

wikiApi.instance.interceptors.response.use((response) => response,
  async function(error) {
    const originalRequest = error?.config
    const status = error?.response?.status

    if ((status === HttpStatusCode.Unauthorized || status === HttpStatusCode.NotFound) && !originalRequest?.retry) {
      originalRequest.retry = true
      await keycloakService.refreshToken()
      originalRequest.headers.Authorization = `Bearer ${useAuthStore().accessToken as string}`
      return wikiApi.instance(originalRequest)
    }
    return Promise.reject(error)
  }
)
