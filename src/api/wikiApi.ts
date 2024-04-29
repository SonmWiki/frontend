import { Api } from "@/api/index"
import useAuthStore from "@/stores/AuthStore"

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

export const wikiApi = apiInstance