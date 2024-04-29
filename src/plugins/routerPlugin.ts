import router from "@/router"
import { type App, inject } from "vue"
import { keycloakServiceKey } from "@/service/KeycloakService"

const routerPlugin = {
  install(app: App, options: any) {
    router.install(app)

    router.beforeEach(async  (to, from, next) =>{
      const keycloakService = inject(keycloakServiceKey)
      if(!keycloakService?.isInitialized()){
        await new Promise<void>(resolve => {
          keycloakService?.onKeycloakReady(()=> resolve())
        })
      }
      next()
    })
  },
};

export default routerPlugin