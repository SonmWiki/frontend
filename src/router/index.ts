import { createRouter, createWebHistory } from 'vue-router'
import HomeView from "@/views/HomeView.vue";
import ArticleViewComponent from "@/components/ArticleViewComponent.vue";
import CategoryArticlesView from "@/components/CategoryArticles.vue";
import CreateArticle from "@/views/article/CreateArticle.vue";
import ReviewView from "@/views/review/ReviewView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: HomeView,
      children : [
          {
            name: 'articles',
            path: 'articles/:id',
            component: ArticleViewComponent
          },
        {
          name: 'categories',
          path: 'categories/:id',
          component: CategoryArticlesView
        },
      ]
    },
    {
      name: 'create',
      path: '/create',
      component: CreateArticle
    },
    {
      name: 'review',
      path: '/review',
      component: ReviewView,
      children: [
        {
          name: 'reviewView',
          path: ':article/:revision',
          component: ReviewView,
        }
      ]
    }
  ]
})

export default router
