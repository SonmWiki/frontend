import { createRouter, createWebHistory } from "vue-router"
import DefaultView from "@/views/DefaultView.vue"
import ArticleContent from "@/components/article/ArticleContent.vue"
import CategoryArticles from "@/components/CategoryArticles.vue"
import ReviewView from "@/views/review/ReviewView.vue"
import ArticlesTable from "@/components/article/ArticlesTable.vue"
import NavigationsEditorView from "@/views/navigationsEditor/NavigationsEditorView.vue"
import { UserRole } from "@/types/UserRole"
import useAuthStore from "@/stores/AuthStore"
import { keycloakService } from "@/service/KeycloakService"
import ArticleEditorView from "@/views/article/ArticleEditorView.vue"

declare module "vue-router" {
  interface RouteMeta {
    allowedRoles?: UserRole[]
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: DefaultView,
      name: "home",
      children: [
        {
          name: "articles",
          path: "articles/:articleId",
          component: ArticleContent,
          props: true
        },
        {
          name: "articlesTable",
          path: "articles",
          component: ArticlesTable
        },
        {
          name: "categories",
          path: "categories/:id",
          component: CategoryArticles
        },
      ]
    },
    {
      name: "articleEditor",
      path: "/articles/editor/:articleId?",
      component: ArticleEditorView,
      props: true,
      meta: { allowedRoles: [UserRole.ADMIN, UserRole.EDITOR, UserRole.USER] }
    },
    {
      name: "navigationsEditor",
      path: "/navigations/editor",
      component: NavigationsEditorView,
      meta: { allowedRoles: [UserRole.ADMIN, UserRole.EDITOR] }
    },
    {
      name: "review",
      path: "/review/:revisionId?",
      component: ReviewView,
      props: true,
      meta: { allowedRoles: [UserRole.ADMIN, UserRole.EDITOR] }
    }
  ]
})

router.beforeEach(async (to, from) => {
  if (!keycloakService.isInitialized()) {
    await new Promise<void>(resolve => {
      keycloakService.onKeycloakReady(() => resolve())
    })
  }
})

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore()
  let hasAnyRole = to.meta.allowedRoles === undefined
  const requireAuthentication = to.meta.allowedRoles !== undefined

  if(requireAuthentication && !authStore.isAuthenticated) {
    await keycloakService.login({ redirectUri: `${window.location.origin}/${to.fullPath}` })
  }

  to.meta.allowedRoles?.forEach((role) => {
    if (authStore.hasRole(role)) {
      hasAnyRole = true
    }
  })

  if (!hasAnyRole)
    return { name: "home" }
})

export default router
