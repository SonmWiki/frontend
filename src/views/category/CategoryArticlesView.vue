<script setup lang="ts">
import {inject, ref, watch} from "vue";
import {Api, GetCategoriesResponseElement} from "@/api";
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

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

const load = async () => {
  categoryId.value = route.params.id;
  loading.value = true

  await delay(1000)

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
        parentCategories.value.push(categories.value.find((it) => it.id == category.parentId))
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
  <div v-if="!loading" class="flex justify-content-center flex-column align-items-center text-center">
    <h1>Articles in category "{{ categoryName }}"</h1>

    <div v-for="article in articles">
      <p>
        <RouterLink :to="'/articles/'+article.id" class="link-primary">{{ article.title }}</RouterLink>
      </p>
    </div>

    <small v-if="childrenCategories.length > 0">
      Children Categories:
      <span v-for="child in childrenCategories">
        <RouterLink :to="'/categories/'+child.id" class="link-primary">{{ child.name }}</RouterLink>;
      </span>
    </small>

    <small v-if="parentCategories.length > 0">
      Parent Category:
      <span v-for="parent in parentCategories">
        <RouterLink :to="'/categories/'+parent.id" class="link-primary">{{ parent.name }}</RouterLink>
      </span>
    </small>
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