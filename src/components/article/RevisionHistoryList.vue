<script setup lang="ts">
import { type Ref, ref, watch } from "vue"
import { type GetArticleResponse, type GetRevisionHistoryResponseElement, ReviewStatus } from "@/api"
import { wikiApi } from "@/service/WikiApiService"
import moment from "moment"

const props = defineProps<{
  article?: GetArticleResponse
  disabled: boolean
}>()

const selectedRevision = defineModel<GetRevisionHistoryResponseElement | undefined>("selectedRevision")
const loading = ref(false)

const revisions: Ref<GetRevisionHistoryResponseElement[]> = ref([])

const load = async () => {
  if (props.article === undefined) return

  try {
    loading.value = true
    revisions.value = (await wikiApi.api.revisionHistory(props.article.id)).data.data
    loading.value = false

    if (selectedRevision.value == undefined)
      selectedRevision.value = revisions.value.find((v) => v.id == props.article?.revisionId)

  } catch (e) {
    console.error(e)
  }
}

watch(
  () => props.article,
  () => {
    load()
  }
)

load()
</script>

<template>
  <PrimeDropdown
    v-model="selectedRevision"
    :options="revisions"
    option-label="id"
    placeholder="Select a Revision"
    class="w-full md:w-14rem"
    :disabled="disabled || loading"
  >
    <template #option="slotProps">
      <div class="flex align-items-center">
        <div>
          <i v-if="slotProps.option?.latestReview?.status == ReviewStatus.Removed" class="pi pi-trash text-bluegray-500"></i>
          <i v-else-if="slotProps.option?.latestReview?.status == ReviewStatus.Rejected" class="pi pi-times-circle text-red-500"></i>
          <i v-else-if="slotProps.option?.latestReview?.status == ReviewStatus.Accepted" class="pi pi-check-circle text-green-500"></i>
          <i v-else class="pi pi-clock text-yellow-500"></i>
          {{ slotProps.option?.id.substring(0, 8) }}
          ({{ moment(slotProps.option?.timestamp, moment.ISO_8601).format("DD.MM.YYYY HH:mm") }})
        </div>
      </div>
    </template>
  </PrimeDropdown>
</template>

<style scoped>

</style>