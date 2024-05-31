import { createRouter, createWebHistory } from "vue-router"
import DefaultView from "@/views/DefaultView.vue"
import ArticleViewComponent from "@/components/article/ArticleViewComponent.vue"
import CategoryArticlesView from "@/components/CategoryArticles.vue"
import ReviewView from "@/views/review/ReviewView.vue"
import ArticlesTable from "@/components/article/ArticlesTable.vue"
import NavigationsEditor from "@/components/navigationsEditor/NavigationsEditor.vue"
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
          path: "articles/:id",
          component: ArticleViewComponent
        },
        {
          name: "articlesTable",
          path: "articles",
          component: ArticlesTable
        },
        {
          name: "categories",
          path: "categories/:id",
          component: CategoryArticlesView
        },
      ]
    },
    {
      name: "createArticle",
      path: "/articles/editor",
      component: ArticleEditorView,
      meta: { allowedRoles: [UserRole.ADMIN, UserRole.EDITOR, UserRole.USER] }
    },
    {
      name: "editArticle",
      path: "/articles/editor/:articleId",
      component: ArticleEditorView,
      props: true,
      meta: { allowedRoles: [UserRole.ADMIN, UserRole.EDITOR, UserRole.USER] }
    },
    {
      name: "navigationsEditor",
      path: "/navigations/editor",
      component: NavigationsEditor,
      meta: { allowedRoles: [UserRole.ADMIN, UserRole.EDITOR] }
    },
    {
      name: "review",
      path: "/review",
      component: ReviewView,
      meta: { allowedRoles: [UserRole.ADMIN, UserRole.EDITOR] },
      children: [
        {
          name: "reviewView",
          path: ":article/:revision",
          component: ReviewView,
          meta: { allowedRoles: [UserRole.ADMIN, UserRole.EDITOR] }
        }
      ]
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

  to.meta.allowedRoles?.forEach((role) => {
    if (authStore.hasRole(role)) {
      hasAnyRole = true
    }
  })

  if (!hasAnyRole)
    return { name: "home" }
})

export default router
