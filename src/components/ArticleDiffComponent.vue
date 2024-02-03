<script setup lang="ts">

import {type Ref, ref, watch} from "vue";
import type {GetArticleResponse} from "@/api";
import {api} from "@/api/api";

const props = defineProps<{
  newArticle: string | undefined
  newRevision: string | undefined
  oldArticle?: string | undefined
  oldRevision?: string | undefined
}>()

const newArticleData: Ref<GetArticleResponse | undefined> = ref()
const oldArticleData: Ref<GetArticleResponse | undefined> = ref()

const loadArticles = async () => {
  if (!props.newArticle || props.newArticle == "" || props.newArticle == undefined) return

  try {
    newArticleData.value = (await api().api.getArticle(props.newArticle, {revisionId: props.newRevision})).data
    oldArticleData.value = (
        await api().api.getArticle(
            props.oldArticle ? props.oldArticle : props.newArticle,
            {revisionId: props.oldRevision})
    ).data
  } catch (error) {
    console.error(error)
  }
}

watch(
    () => props.newRevision,
    () => {loadArticles()}
)

loadArticles()

</script>

<template>
  <CodeDiff
      :old-string="oldArticleData?.content != null ? oldArticleData?.content : ''"
      :new-string="newArticleData?.content"
      output-format="line-by-line"
      theme="dark"
      class="surface-border surface-ground w-full"
  />
</template>

<style scoped>

</style>