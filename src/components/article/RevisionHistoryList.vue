<script setup lang="ts">
import {type ModelRef, type Ref, ref, watch} from "vue";
import {type GetArticleResponse, type GetRevisionHistoryResponseElement} from "@/api";
import {api} from "@/api/api";
import moment from "moment";

const props = defineProps<{
  article: GetArticleResponse
}>()

const revisions: Ref<GetRevisionHistoryResponseElement[]> = ref([])

const selectedRevision: ModelRef<GetRevisionHistoryResponseElement | undefined> = defineModel('selectedRevision')
const selectedRevisionId: ModelRef<string | null | undefined> = defineModel('selectedRevisionId')
const onUpdate: ModelRef<any> = defineModel('onUpdate')

const load = async () => {
  if (!props.article) return

  console.log(props.article.id)

  try {
    if (revisions.value.length == 0)
      revisions.value = (await api().api.revisionHistory(props.article.id)).data.data

    if (selectedRevision.value == undefined && props.article != undefined)
      selectedRevision.value = revisions.value.find((v) => v.id == props.article.revisionId)

  } catch (e) {
    console.error(e)
  }
}

watch(
    () => selectedRevision.value,
    () => {
      selectedRevisionId.value = selectedRevision.value?.id
      onUpdate.value()
    }
)

load()
</script>

<template>
  <Dropdown v-model="selectedRevision" :options="revisions" optionLabel="id" placeholder="Select a Revision" class="w-full md:w-14rem">
    <template #option="slotProps">
      <div class="flex align-items-center">
        <div>
          <i v-if="slotProps.option?.latestReview?.status == 0" class="pi pi-trash text-bluegray-500"></i>
          <i v-else-if="slotProps.option?.latestReview?.status == 1" class="pi pi-times-circle text-red-500"></i>
          <i v-else-if="slotProps.option?.latestReview?.status == 2" class="pi pi-check-circle text-green-500"></i>
          <i v-else class="pi pi-clock text-yellow-500"></i>
          {{ slotProps.option?.id.substring(0, 8) }} ({{ moment(slotProps.option?.timestamp, moment.ISO_8601).format("DD.MM.YYYY HH:mm") }})
        </div>
      </div>
    </template>
  </Dropdown>
</template>

<style scoped>

</style>