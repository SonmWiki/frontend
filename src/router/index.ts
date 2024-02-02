import { createRouter, createWebHistory } from 'vue-router'
import HomeView from "@/views/HomeView.vue";
import ArticleViewComponent from "@/components/ArticleViewComponent.vue";
import CategoryArticlesView from "@/components/CategoryArticles.vue";
import CreateArticle from "@/views/article/CreateArticle.vue";
import ReviewArticleCard from "@/components/review/ReviewArticleView.vue";

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
      component: ReviewArticleCard
    }
  ]
})

export default router
