<script setup lang="ts">
import moment from "moment/moment";
import {api} from "@/api/api";
import {GetPendingRevisionsResponseElement} from "@/api";
import {type Ref, ref} from "vue";

const revisions: Ref<GetPendingRevisionsResponseElement[]> = ref([])

const revisionId = defineModel('revisionId')
const articleId = defineModel('articleId')

const select = async (revision: GetPendingRevisionsResponseElement) => {
  revisionId.value = revision.revisionId
  articleId.value = revision.articleId
}
const load = async () => {
  try {
    revisions.value = (await api().api.pendingRevisions()).data.data
    if (revisions.value.length != 0) await select(revisions.value[0])
  } catch (error) {
    console.error(error)
  }
}

load()
</script>

<template>
  <div class="w-full h-full">
    <div class="flex flex-column gap-2 p-2">
      <div
          v-for="revision in revisions"
          :key="revision.revisionId"
          @click="select(revision)"
          :class="revisionId == revision.revisionId ? 'border-primary surface-hover' : 'surface-border'"
          class="border-1 border-round w-full hover:surface-hover p-2"
      >
        <div class="text-lg font-bold pb-1">{{ revision.articleIdTitle }}</div>
        <RouterLink
            :to="{name: 'articles', params: {id: revision.articleId}}"
            class="link-primary text-xs"
            target="_blank"
        >
          Current Article
        </RouterLink>
        <div class="text-xs text-color-secondary">Rev. {{ revision.revisionId }}</div>
        <div class="text-sm"><i class="pi pi-user"></i> {{ revision.author.name }}</div>
        <div class="text-sm"><i class="pi pi-clock"></i> {{ moment(revision.timestamp, moment.ISO_8601).format("DD.MM.YYYY HH:mm") }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>