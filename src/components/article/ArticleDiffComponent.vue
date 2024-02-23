<script setup lang="ts">

import {type Ref, ref, watch} from "vue";
import type {GetArticleResponse, GetRevisionHistoryResponseElement} from "@/api";
import {api} from "@/api/api";
import RevisionHistoryList from "@/components/article/RevisionHistoryList.vue";
import {themeService} from "@/main";

const props = defineProps<{
  article: string | undefined
  newRevision: string | undefined
  oldRevision?: string | undefined
}>()

const newArticleData: Ref<GetArticleResponse | undefined> = ref()
const oldArticleData: Ref<GetArticleResponse | undefined> = ref()

const selectedOldRevision: Ref<GetRevisionHistoryResponseElement | undefined> = ref()
const selectedNewRevision: Ref<GetRevisionHistoryResponseElement | undefined> = ref()

const loaded = ref(false)

const loadArticles = async () => {
  if (!props.article || props.article == "" || props.article == undefined) return

  try {
    if (newArticleData.value == undefined || newArticleData.value?.revisionId != selectedNewRevision.value?.id)
      newArticleData.value = (await api().api.getArticle(props.article,
          {revisionId: selectedNewRevision.value?.id ? selectedNewRevision.value.id : props.newRevision}
      )).data

    if (oldArticleData.value == undefined || oldArticleData.value?.revisionId != selectedOldRevision.value?.id)
      oldArticleData.value = (await api().api.getArticle(props.article,
          {revisionId: selectedOldRevision.value?.id ? selectedOldRevision.value.id : props.oldRevision}
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
    () => props.newRevision,
    () => {loadArticles()}
)
</script>

<template>
  <div class="flex flex-column w-full h-full">
    <div v-if="loaded" class="flex flex-row flex-wrap gap-2 justify-content-center w-full">
      <RevisionHistoryList v-if="oldArticleData" :onUpdate="loadArticles" :article="oldArticleData" v-model:selectedRevision="selectedOldRevision" />
      <Button @click="swap" icon="pi pi-arrow-right-arrow-left" aria-label="swap" text />
      <RevisionHistoryList v-if="newArticleData" :onUpdate="loadArticles" :article="newArticleData" v-model:selectedRevision="selectedNewRevision" />
    </div>

    <CodeDiff
        :old-string="oldArticleData?.content != null ? oldArticleData?.content : ''"
        :new-string="newArticleData?.content"
        output-format="line-by-line"
        :theme="themeService.theme.value"
        class="surface-border surface-ground w-full"
    />
  </div>
</template>

<style scoped>

</style>