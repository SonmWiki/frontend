import {Api} from "@/api/index";
import {authService} from "@/main";

const apiInstance = new Api()
apiInstance.instance.defaults.baseURL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : `http://${window.location.hostname}`

export const api = () => {
    const token = authService.getAccessToken()

    if (token != undefined)
        apiInstance.instance.defaults.headers.common = {
            Authorization: `Bearer ${token as string}`
        }
    else apiInstance.instance.defaults.headers.common = {}

    return apiInstance
}