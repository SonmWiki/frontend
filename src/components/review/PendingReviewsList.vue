<script setup lang="ts">
import moment from "moment/moment"
import { wikiApi } from "@/service/WikiApiService"
import { type GetPendingRevisionsResponseElement } from "@/api"
import { type Ref, ref, watch } from "vue"
import { isNullOrWhitespace } from "@/utils/stringUtils"

const props = defineProps<{
  selectedRevision?: string
}>()
const emit = defineEmits<{
  select: [id?: string]
}>()

const revisions: Ref<GetPendingRevisionsResponseElement[]> = ref([])
const loading = ref(false)

const select = (revision: string | undefined) => {
  emit("select", revision)
}
const load = async () => {
  loading.value = true
  try {
    revisions.value = (await wikiApi.api.getPendingRevisions()).data.data
    loading.value = false
    if (revisions.value.length == 0) return
    select(revisions.value[0].revisionId)
  } catch (error) {
    console.error(error)
  }
}

watch(props, () => {
  if(isNullOrWhitespace(props.selectedRevision))
    load()
})

load()
</script>

<template>
  <div v-if="loading">
    <PrimeSkeleton class="fadein animation-duration-2000 h-7rem mb-2" />
    <PrimeSkeleton class="fadein animation-duration-2000 h-7rem mb-2" />
    <PrimeSkeleton class="fadein animation-duration-2000 h-7rem mb-2" />
  </div>
  <div
    v-for="revision in revisions"
    v-else
    :key="revision.revisionId"
    :class="selectedRevision == revision.revisionId ? 'border-primary surface-hover' : 'surface-border'"
    class="border-1 border-round w-full cursor-pointer hover:surface-hover p-2 mb-2 fadeinleft animation-duration-200"
    @click="select(revision.revisionId)"
  >
    <div class="text-lg font-bold pb-1">{{ revision.articleIdTitle }}</div>
    <RouterLink
      :to="{name: 'articles', params: {articleId: revision.articleId}}"
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
</template>

<style scoped>

</style>