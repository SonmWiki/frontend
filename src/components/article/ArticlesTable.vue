<script setup lang="ts">

import { type Ref, ref, watch } from "vue"
import { wikiApi } from "@/service/WikiApiService"
import type { SearchArticlesResponse } from "@/api"
import type { DataTablePageEvent } from "primevue/datatable"

const articles: Ref<SearchArticlesResponse | undefined> = ref()
const count: Ref<number> = ref(5)

const load = async (event?: DataTablePageEvent) => {
  try {
    articles.value = (await wikiApi.api.searchArticles({
      page: event ? event.page + 1 : 1,
      pageSize: count.value
    })).data
  } catch (e) {
    console.log(e)
  }
}

load()

watch(
  () => count.value,
  () => {
    load()
  }
)
</script>

<template>
  <div class="flex flex-column align-items-center w-full">
    <h1>Article List</h1>
    <div class="p-1 md:p-4 border-1 border-round surface-section surface-border w-full">
      <PrimeDataTable
        v-if="articles"
        v-model:rows='count'
        :value="articles!.data"
        table-style="width: 100%;"
        scroll-height="40vh"
        lazy
        paginator
        scrollable
        :total-records="articles!.totalCount"
        :rows-per-page-options="[5, 10, 20, 50]"
        @page="(event: DataTablePageEvent) => load(event)"
      >
        <PrimeColumn field="id" header="ID"></PrimeColumn>
        <PrimeColumn field="articleTitle" header="Title"></PrimeColumn>
      </PrimeDataTable>
    </div>
  </div>
</template>

<style scoped>

</style>