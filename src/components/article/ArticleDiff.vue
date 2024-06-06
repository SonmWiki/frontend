<script setup lang="ts">

import { type Ref, ref, watch } from "vue"
import type { GetArticleResponse, GetRevisionHistoryResponseElement } from "@/api"
import { wikiApi } from "@/service/WikiApiService"
import RevisionHistoryList from "@/components/article/RevisionHistoryList.vue"
import useThemeStore from "@/stores/ThemeStore"

const props = defineProps<{
  newRevisionId: string
}>()

const themeStore = useThemeStore()

const newArticleData: Ref<GetArticleResponse | undefined> = ref()
const oldArticleData: Ref<GetArticleResponse | undefined> = ref()

const selectedOldRevision: Ref<GetRevisionHistoryResponseElement | undefined> = ref()
const selectedNewRevision: Ref<GetRevisionHistoryResponseElement | undefined> = ref()

const loadingOld = ref(false)
const loadingNew = ref(false)

const loadOldArticle = async () => {
  try {
    loadingOld.value = true

    if (selectedOldRevision.value?.id && oldArticleData.value?.revisionId != selectedOldRevision.value?.id)
      oldArticleData.value = (await wikiApi.api.getArticleByRevision(selectedOldRevision.value.id)).data
    else if(newArticleData?.value?.id)
      oldArticleData.value = (await wikiApi.api.getArticle(newArticleData.value.id)).data

    loadingOld.value = false
  } catch (error) {
    console.error(error)
  }
}

const loadNewArticle = async () => {
  try {
    loadingNew.value = true

    if (newArticleData.value == undefined || newArticleData.value?.revisionId != selectedNewRevision.value?.id)
      newArticleData.value = (await wikiApi.api.getArticleByRevision(selectedNewRevision.value?.id ? selectedNewRevision.value.id : props.newRevisionId)).data

    loadingNew.value = false
  } catch (error) {
    console.error(error)
  }
}

const swap = () => {
  const temp = selectedOldRevision.value
  selectedOldRevision.value = selectedNewRevision.value
  selectedNewRevision.value = temp
}

loadNewArticle().then(() => loadOldArticle())

watch(
  () => props.newRevisionId,
  () => {
    selectedNewRevision.value = undefined
    selectedOldRevision.value = undefined
    oldArticleData.value = undefined
    newArticleData.value = undefined
    loadNewArticle()
      .then(() => loadOldArticle())
  }
)

watch(
  () => selectedNewRevision.value,
  () => {
    loadNewArticle()
  }
)
watch(
  () => selectedOldRevision.value,
  () => {
    loadOldArticle()
  }
)
</script>

<template>
  <div class="flex flex-column w-full h-full">
    <div class="flex flex-row flex-wrap gap-2 justify-content-center w-full">
      <RevisionHistoryList
        v-model:selected-revision="selectedOldRevision"
        :article="oldArticleData"
        :disabled="loadingOld || !oldArticleData"
      />
      <PrimeButton
        icon="pi pi-arrow-right-arrow-left"
        aria-label="swap"
        text
        :disabled="loadingOld || loadingNew"
        @click="swap"
      />
      <RevisionHistoryList
        v-model:selected-revision="selectedNewRevision"
        :disabled="loadingNew || !newArticleData"
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