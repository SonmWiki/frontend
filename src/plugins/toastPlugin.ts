import { type App } from "vue"
import ToastContainer from "@/components/common/ToastContainer.vue"

const toastPlugin = {
  install(app: App) {
    app.component("ToastContainer", ToastContainer)
  },
}

export default toastPlugin