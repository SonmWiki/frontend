<script setup lang="ts">
import { type Ref, ref } from "vue"
import type { GetArticleResponse } from "@/api"
import { MdPreview } from "md-editor-v3"
import useThemeStore from "@/stores/ThemeStore"
import { wikiApi } from "@/service/WikiApiService"

const id = import.meta.env.VITE_HOME_ARTICLE_ID
const articleData: Ref<GetArticleResponse | undefined> = ref()
const loading = ref(true)
const themeStore = useThemeStore()
const loadArticle = async () => {

  articleData.value = undefined
  loading.value = true

  try {
    articleData.value = (await wikiApi.api.getArticle(id)).data
  } catch (err) {
    console.log(err)
  }
  loading.value = false
}

loadArticle()
</script>

<template>
  <MdPreview
    v-if="articleData"
    language="en-US"
    preview-theme='github'
    :theme="themeStore.theme"
    :editor-id="id"
    :model-value="articleData.content"
  />
  <div v-else>
    <h1>Looks like there is nothing on homepage here.</h1>
    <div>To populate this special page create article with title <b>HOME</b></div>
    <div>You can do it
      <RouterLink :to=" {name: 'articleEditor'}">here</RouterLink>
    </div>
  </div>
</template>

<style scoped>

</style>