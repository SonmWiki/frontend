<script setup lang="ts">
import {type Ref, ref, watch} from "vue";
import {type GetCategoriesResponseElement, type GetCategoryArticlesResponseElement} from "@/api";
import {useRoute} from "vue-router";
import {api} from "@/api/api";

const route = useRoute()

const articles: Ref<GetCategoryArticlesResponseElement[]> = ref([])
const categories: Ref<GetCategoriesResponseElement[]> = ref([])
const parentCategory: Ref<GetCategoriesResponseElement | undefined> = ref()
const childrenCategories: Ref<GetCategoriesResponseElement[]> = ref([])

const categoryId = ref()
const categoryName = ref()

const loading = ref(true)

const load = async () => {
  categoryId.value = route.params.id;
  loading.value = true

  await loadArticles()
  await loadCategories()

  loading.value = false
}

const loadCategories = async () => {
  try {
    categories.value = (await api().api.getCategories()).data.data
  } catch (error) {
    console.error(error)
  }

  categories.value.forEach((category: GetCategoriesResponseElement) => {
    if (category.parentId == categoryId.value) childrenCategories.value.push(category)
    if (category.id == categoryId.value ) {
      categoryName.value = category.name
      if (category.parentId !== null) {
        const t = categories.value.find((v) => v.id == category.parentId)
        if (t) parentCategory.value = t
      }
    }
  })
}

const loadArticles = async () => {
  try {
    articles.value = (await api().api.getCategoryArticles(categoryId.value)).data.data
  } catch (error) {
    console.error(error)
  }
}

watch(
    () => route.params.id,
    () => {load()},
)

load()
</script>

<template>
  <div v-if="!loading" class="flex justify-content-start flex-column align-items-start w-30rem" style="overflow-wrap: break-word; white-space: normal;">
    <h1 class="max-w-full">Category: {{ categoryName }}</h1>

    <div class="flex flex-column align-items-start w-full gap-4 max-w-full">
      <div v-if="articles.length > 0" class="flex flex-column align-items-start">
        Articles:
        <div v-for="article in articles" :key="article.id">
          <RouterLink :to="{name: 'articles', params: {id: article.id}}" class="link-primary">
            {{ article.title }}
          </RouterLink>
        </div>
      </div>

      <h2 v-else>
        No articles here!
      </h2>

      <div v-if="childrenCategories.length > 0" class="flex flex-column align-items-start">
        Children Categories:
        <div v-for="child in childrenCategories" :key="child.id">
          <RouterLink :to="{name: 'categories', params: {id: child.id}}" class="link-primary">
            ➡️ {{ child.name }}
          </RouterLink>;
        </div>
      </div>

      <div v-if="parentCategory" class="flex flex-column align-items-start">
        Parent Category:
          <RouterLink :to="{name: 'categories', params: {id: parentCategory.id}}" class="link-primary">
            ➡️ {{ parentCategory.name }}
          </RouterLink>
      </div>
    </div>
  </div>

  <div v-if="loading" class="flex justify-content-center flex-column align-items-center text-center">
    <h1><Skeleton width="25rem" class="mb-2"></Skeleton></h1>
    <Skeleton width="15rem" class="mb-2"></Skeleton>
    <Skeleton width="20rem" class="mb-2"></Skeleton>
    <Skeleton width="10rem" class="mb-2"></Skeleton>
  </div>
</template>

<style scoped>

</style>