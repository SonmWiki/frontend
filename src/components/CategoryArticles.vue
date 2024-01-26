<script setup lang="ts">
import {inject, ref, watch} from "vue";
import {Api, type GetCategoriesResponseElement} from "@/api";
import {useRoute} from "vue-router";

const api = inject("api") as Api<any>
const route = useRoute()

const articles = ref()
const categories = ref()
const parentCategories = ref()
const childrenCategories = ref()

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
  categories.value = (await api.api.getCategories()).data.data

  if (categories.value === undefined || categories.value === null) return

  parentCategories.value = []
  childrenCategories.value = []

  categories.value.forEach((category: GetCategoriesResponseElement) => {
    if (category.parentId == categoryId.value) childrenCategories.value.push(category)
    if (category.id == categoryId.value ) {
      categoryName.value = category.name
      if (category.parentId !== null)
        parentCategories.value.push(categories.value.find((v: GetCategoriesResponseElement) => v.id == category.parentId))
    }
  })
}

const loadArticles = async () => {
  articles.value = (await api.api.getCategoryArticles(categoryId.value)).data.data
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
        <div v-for="article in articles">
          <div>
            <RouterLink :to="'/articles/'+article.id" class="link-primary">{{ article.title }}</RouterLink>
          </div>
        </div>
      </div>

      <h2 v-else>
        No articles here!
      </h2>

      <div v-if="childrenCategories.length > 0" class="flex flex-column align-items-start">
        Children Categories:
        <div v-for="child in childrenCategories">
          ➡️ <RouterLink :to="'/categories/'+child.id" class="link-primary">{{ child.name }}</RouterLink>;
        </div>
      </div>

      <div v-if="parentCategories.length > 0" class="flex flex-column align-items-start">
        Parent Category:
        <div v-for="parent in parentCategories">
          ➡️ <RouterLink :to="'/categories/'+parent.id" class="link-primary">{{ parent.name }}</RouterLink>
        </div>
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