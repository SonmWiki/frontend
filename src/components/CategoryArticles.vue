<script setup lang="ts">
import { type Ref, ref, watch } from "vue"
import { type GetCategoriesResponseElement, type GetCategoryArticlesResponseElement } from "@/api"
import { useRoute } from "vue-router"
import { wikiApi } from "@/service/WikiApiService"

const route = useRoute()

const articles: Ref<GetCategoryArticlesResponseElement[]> = ref([])
const categories: Ref<GetCategoriesResponseElement[]> = ref([])
const parentCategory: Ref<GetCategoriesResponseElement | undefined> = ref()
const childrenCategories: Ref<GetCategoriesResponseElement[]> = ref([])

const categoryId = ref()
const categoryName = ref()

const loading = ref(true)

const load = async () => {
  categoryId.value = route.params.id
  loading.value = true

  await loadArticles()
  await loadCategories()

  loading.value = false
}

const loadCategories = async () => {
  try {
    categories.value = (await wikiApi.api.getCategories()).data.data
  } catch (error) {
    console.error(error)
  }

  categories.value.forEach((category: GetCategoriesResponseElement) => {
    if (category.parentId == categoryId.value) childrenCategories.value.push(category)
    if (category.id == categoryId.value) {
      categoryName.value = category.name
      if (category.parentId !== null) {
        const t = categories.value.find((v) => v.id == category.parentId)
        if (t) parentCategory.value = t
      }
    }
  })
}

const loadArticles = async () => {
  reset()
  try {
    articles.value = (await wikiApi.api.getCategoryArticles(categoryId.value)).data.data
  } catch (error) {
    console.error(error)
  }
}

const reset = () => {
  articles.value = []
  categories.value = []
  parentCategory.value = undefined
  childrenCategories.value = []
}

watch(
  () => route.params.id,
  () => {
    load()
  }
)

load()
</script>

<template>

  <div
    v-if="!loading"
    class="flex align-items-center justify-content-start flex-column align-items-start w-30rem p-4"
    style="overflow-wrap: break-word;">
    <div class="flex flex-column align-items-center gap-2 w-full bg-transparent">
      <div class="text-xl font-bold w-full text-center">{{ categoryName }}</div>
      <div class="flex flex-column gap-4 w-full" style="overflow-wrap: anywhere;">

        <PrimeFieldset
          v-if="articles.length > 0"
          legend="Articles"
          class="bg-transparent"
          :toggleable="true">
          <div class="flex flex-column gap-1 w-full">
            <RouterLink
              v-for="article in articles"
              :key="article.id"
              class="hover:surface-hover p-2 border-round w-full no-underline text-color"
              :to="{name: 'articles', params: {articleId: article.id}}"
            >
              {{ article.title }}
            </RouterLink>
          </div>
        </PrimeFieldset>

        <PrimeFieldset
          v-if="parentCategory"
          legend="Parent Category"
          class="bg-transparent"
          :toggleable="true">
          <div class="flex flex-column gap-1">
            <RouterLink
              class="hover:surface-hover p-2 border-round w-full no-underline text-color"
              :to="{name: 'categories', params: {id: parentCategory.id}}"
            >
              {{ parentCategory.name }}
            </RouterLink>
          </div>
        </PrimeFieldset>

        <PrimeFieldset
          v-if="childrenCategories.length > 0"
          class="bg-transparent w-full"
          legend="Children Categories"
          :toggleable="true">
          <div class="flex flex-column gap-1 w-full">
            <RouterLink
              v-for="child in childrenCategories"
              :key="child.id"
              class="hover:surface-hover p-2 border-round w-full no-underline text-color"
              :to="{name: 'categories', params: {id: child.id}}"
            >
              {{ child.name }}
            </RouterLink>
          </div>
        </PrimeFieldset>

      </div>
    </div>
  </div>

  <div v-if="loading" class="flex justify-content-center flex-column align-items-center text-center">
    <h1>
      <PrimeSkeleton width="25rem" class="mb-2 fadein animation-duration-2000"></PrimeSkeleton>
    </h1>
    <PrimeSkeleton width="15rem" class="mb-2 fadein animation-duration-2000"></PrimeSkeleton>
    <PrimeSkeleton width="20rem" class="mb-2 fadein animation-duration-2000"></PrimeSkeleton>
    <PrimeSkeleton width="10rem" class="mb-2 fadein animation-duration-2000"></PrimeSkeleton>
  </div>
</template>

<style scoped>

</style>