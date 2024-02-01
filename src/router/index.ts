import { createRouter, createWebHistory } from 'vue-router'
import ArticleEditor from "@/views/article/ArticleEditor.vue";
import HomeView from "@/views/HomeView.vue";
import ArticleViewComponent from "@/components/ArticleViewComponent.vue";
import CategoryArticlesView from "@/components/CategoryArticles.vue";

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
      name: 'editor',
      path: '/editor',
      component: ArticleEditor
    },
  ]
})

export default router
