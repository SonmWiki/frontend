<script setup lang="ts">
import moment from "moment/moment"
import { wikiApi } from "@/service/WikiApiService"
import { type GetPendingRevisionsResponseElement } from "@/api"
import { type Ref, ref, watch } from "vue"
import router from "@/router"
import { useRoute } from "vue-router"

const revisions: Ref<GetPendingRevisionsResponseElement[]> = ref([])
const route = useRoute()
const empty = ref(false)

const revisionId = ref(route.params.revision)

const select = async (revision: GetPendingRevisionsResponseElement) => {
  revisionId.value = revision.revisionId

  await router.push({ name: "reviewView", params: { article: revision.articleId, revision: revision.revisionId } })
}
const load = async () => {
  try {
    revisions.value = (await wikiApi.api.pendingRevisions()).data.data
    if (revisions.value.length == 0) return empty.value = true
    if (route.params.revision == undefined) await select(revisions.value[0])
  } catch (error) {
    console.error(error)
  }
}

watch(
  () => route.params.revision,
  () => {
    if (route.params.revision == undefined)
      load()
  }
)

load()
</script>

<template>
  <div class="w-full h-full">
    <div v-if="!empty" class="flex flex-column gap-2 p-2">
      <div
        v-for="revision in revisions"
        :key="revision.revisionId"
        :class="revisionId == revision.revisionId ? 'border-primary surface-hover' : 'surface-border'"
        class="border-1 border-round w-full hover:surface-hover p-2"
        @click="select(revision)"
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
        <div class="text-sm"><i class="pi pi-clock"></i>
          {{ moment(revision.timestamp, moment.ISO_8601).format("DD.MM.YYYY HH:mm") }}
        </div>
      </div>
    </div>
    <div v-else class="p-2">
      No articles here!
    </div>
  </div>
</template>

<style scoped>

</style>