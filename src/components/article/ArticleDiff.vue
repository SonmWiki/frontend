<script setup lang="ts">

import { type Ref, ref, watch } from "vue"
import type { GetArticleResponse, GetRevisionHistoryResponseElement } from "@/api"
import { wikiApi } from "@/service/WikiApiService"
import RevisionHistoryList from "@/components/article/RevisionHistoryList.vue"
import useThemeStore from "@/stores/ThemeStore"

const props = defineProps<{
  articleId?: string
  newRevisionId?: string
  oldRevisionId?: string
}>()

const themeStore = useThemeStore()

const newArticleData: Ref<GetArticleResponse | undefined> = ref()
const oldArticleData: Ref<GetArticleResponse | undefined> = ref()

const selectedOldRevision: Ref<GetRevisionHistoryResponseElement | undefined> = ref()
const selectedNewRevision: Ref<GetRevisionHistoryResponseElement | undefined> = ref()

const loaded = ref(false)

const loadArticles = async () => {
  if (!props.articleId) return

  try {
    if (newArticleData.value == undefined || newArticleData.value?.revisionId != selectedNewRevision.value?.id)
      newArticleData.value = (await wikiApi.api.getArticle(props.articleId,
        { revisionId: selectedNewRevision.value?.id ? selectedNewRevision.value.id : props.newRevisionId }
      )).data

    if (oldArticleData.value == undefined || oldArticleData.value?.revisionId != selectedOldRevision.value?.id)
      oldArticleData.value = (await wikiApi.api.getArticle(props.articleId,
        { revisionId: selectedOldRevision.value?.id ? selectedOldRevision.value.id : props.oldRevisionId }
      )).data

    loaded.value = true
  } catch (error) {
    console.error(error)
  }
}

const swap = () => {
  const temp = selectedOldRevision.value
  selectedOldRevision.value = selectedNewRevision.value
  selectedNewRevision.value = temp
}

loadArticles()

watch(
  () => props.newRevisionId,
  () => {
    selectedNewRevision.value = undefined
    selectedOldRevision.value = undefined
    oldArticleData.value = undefined
    newArticleData.value = undefined
    loadArticles()
  }
)
</script>

<template>
  <div class="flex flex-column w-full h-full">
    <div v-if="loaded" class="flex flex-row flex-wrap gap-2 justify-content-center w-full">
      <RevisionHistoryList
        v-if="oldArticleData"
        v-model:selectedRevision="selectedOldRevision"
        :on-update="loadArticles"
        :article="oldArticleData"
      />
      <PrimeButton
        icon="pi pi-arrow-right-arrow-left"
        aria-label="swap"
        text
        @click="swap"
      />
      <RevisionHistoryList
        v-if="newArticleData"
        v-model:selectedRevision="selectedNewRevision"
        :on-update="loadArticles"
        :article="newArticleData"
      />
    </div>

    <CodeDiff
      :old-string="oldArticleData?.content != null ? oldArticleData?.content : ''"
      :new-string="newArticleData?.content"
      output-format="line-by-line"
      :theme="themeStore.theme"
      class="surface-border surface-ground w-full"
    />
  </div>
</template>

<style scoped>

</style>