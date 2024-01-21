<script setup lang="ts">
import {inject, ref, watch} from "vue";
import {Api} from "@/api";
import {useRoute} from "vue-router";

const api = inject("api") as Api<any>
const article = ref()

const articleId = ref()
const route = useRoute()

articleId.value = route.params.id

const loadArticle = async () => {
  article.value = (await api.api.getArticle(articleId.value)).data
  console.log(article.value)
}

watch(
    () => route.params.id,
    () => {
      articleId.value = route.params.id;
      loadArticle();
    },
);

loadArticle()
</script>

<template>
  <div class="flex justify-content-center flex-column align-items-center text-center">
    <h1>Article "{{ article.title }}"</h1>

    <p>{{ article.content }}</p>

  </div>
</template>

<style scoped>

</style>