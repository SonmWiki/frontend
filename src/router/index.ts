import { createRouter, createWebHistory } from 'vue-router'
import Home from "@/views/HomeView.vue";
import Register from "@/views/auth/RegisterView.vue";
import Login from "@/views/auth/LoginView.vue";
import Category from "@/views/category/CategoryView.vue";
import CategoryArticles from "@/views/category/CategoryArticlesView.vue";
import ArticleView from "@/views/article/ArticleView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/register',
      component: Register,
    },
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/categories',
      component: Category,
    },
    {
      path: '/categories/:id',
      component: CategoryArticles
    },
    {
      path: '/articles/:id',
      component: ArticleView
    },
  ]
})

export default router
