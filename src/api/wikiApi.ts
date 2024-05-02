import { Api } from "@/api/index"
import useAuthStore from "@/stores/AuthStore"
import { HttpStatusCode } from "axios"
import { keycloakService } from "@/service/KeycloakService"

const apiInstance = new Api({
  baseURL: import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : `http://${window.location.hostname}`
})

apiInstance.instance.interceptors.request.use(
  (config) => {
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

apiInstance.instance.interceptors.response.use((response) => response,
  async function(error) {
    const originalRequest = error?.config
    const status = error?.response?.status

    if (status === HttpStatusCode.Unauthorized && !originalRequest?.retry) {
      originalRequest.retry = true
      await keycloakService.refreshToken()
      originalRequest.headers.Authorization = `Bearer ${useAuthStore().accessToken as string}`
      return wikiApi.instance(originalRequest)
    }
    return Promise.reject(error)
  }
)

export const wikiApi = apiInstance