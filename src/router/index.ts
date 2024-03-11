import {createRouter, createWebHistory} from 'vue-router'
import HomeView from "@/views/HomeView.vue";
import ArticleViewComponent from "@/components/article/ArticleViewComponent.vue";
import CategoryArticlesView from "@/components/CategoryArticles.vue";
import CreateArticle from "@/views/article/CreateArticle.vue";
import ReviewView from "@/views/review/ReviewView.vue";
import ArticlesTable from "@/components/article/ArticlesTable.vue";
import NavigationsEditor from '@/components/navigationsEditor/NavigationsEditor.vue'
import { UserRole } from '@/types/UserRole'
import useAuthStore from '@/stores/AuthStore'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeView,
      children : [
          {
            name: 'articlesTable',
            path: 'articles',
            component: ArticlesTable,
          },
        {
          name: 'articles',
          path: 'articles/:id',
          component: ArticleViewComponent,
        },
        {
          name: 'categories',
          path: 'categories/:id',
          component: CategoryArticlesView
        },
      ]
    },
    {
      name: 'navigationsEditor',
      path:  '/navigations/editor',
      component: NavigationsEditor,
      beforeEnter: (async () => useAuthStore().hasRole(UserRole.EDITOR)),
    },
    {
      name: 'create',
      path: '/create',
      component: CreateArticle,
      beforeEnter: (async () => useAuthStore().hasRole(UserRole.USER)),
    },
    {
      name: 'review',
      path: '/review',
      component: ReviewView,
      beforeEnter: (async () => useAuthStore().hasRole(UserRole.EDITOR)),
      children: [
        {
          name: 'reviewView',
          path: ':article/:revision',
          component: ReviewView,
          beforeEnter: (async () => useAuthStore().hasRole(UserRole.EDITOR)),
        }
      ]
    }
  ]
})

export default router
