import { createRouter, createWebHistory } from "vue-router"
import HomeView from "@/views/HomeView.vue"
import ArticleViewComponent from "@/components/article/ArticleViewComponent.vue"
import CategoryArticlesView from "@/components/CategoryArticles.vue"
import CreateArticle from "@/views/article/CreateArticle.vue"
import ReviewView from "@/views/review/ReviewView.vue"
import ArticlesTable from "@/components/article/ArticlesTable.vue"
import NavigationsEditor from "@/components/navigationsEditor/NavigationsEditor.vue"
import { UserRole } from "@/types/UserRole"
import useAuthStore from "@/stores/AuthStore"
import { keycloakService } from "@/service/KeycloakService"

declare module 'vue-router' {
  interface RouteMeta {
    allowedRoles?: UserRole[]
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: HomeView,
      name: "home",
      children: [
        {
          name: "articlesTable",
          path: "articles",
          component: ArticlesTable
        },
        {
          name: "articles",
          path: "articles/:id",
          component: ArticleViewComponent
        },
        {
          name: "categories",
          path: "categories/:id",
          component: CategoryArticlesView
        },
        {
          name: "navigationsEditor",
          path: "navigations/editor",
          component: NavigationsEditor,
          meta: { allowedRoles: [UserRole.ADMIN, UserRole.EDITOR] },
        },
        {
          name: "create",
          path: "create",
          component: CreateArticle,
          meta: { allowedRoles: [UserRole.ADMIN, UserRole.EDITOR, UserRole.USER] },
        },
        {
          name: "review",
          path: "review",
          component: ReviewView,
          meta: { allowedRoles: [UserRole.ADMIN, UserRole.EDITOR] },
          children: [
            {
              name: "reviewView",
              path: ":article/:revision",
              component: ReviewView,
              meta: { allowedRoles: [UserRole.ADMIN, UserRole.EDITOR] },
            }
          ]
        }
      ]
    }
  ]
})

router.beforeEach(async  (to, from, next) =>{
  if(!keycloakService.isInitialized()){
    await new Promise<void>(resolve => {
      keycloakService.onKeycloakReady(()=> resolve())
    })
  }
  next()
})

router.beforeEach(async  (to, from) =>{
  const authStore = useAuthStore()
  let hasAnyRole = to.meta.allowedRoles === undefined

  to.meta.allowedRoles?.forEach((role) =>{
    if(authStore.hasRole(role)){
      hasAnyRole = true
    }
  })

  if(!hasAnyRole)
    return { name: "home" }
})

export default router
