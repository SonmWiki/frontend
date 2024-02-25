import {Api} from "@/api/index";
import useAuthStore from '@/stores/AuthStore'

const apiInstance = new Api()
apiInstance.instance.defaults.baseURL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : `http://${window.location.hostname}`

export const api = () => {
    if (useAuthStore().token != undefined)
        apiInstance.instance.defaults.headers.common = {
            Authorization: `Bearer ${useAuthStore().token as string}`
        }
    else apiInstance.instance.defaults.headers.common = {}

    return apiInstance
}