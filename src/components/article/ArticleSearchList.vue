<script setup lang="ts">
import { type Ref, ref, watch } from "vue"
import type { SearchArticlesResponse, SearchArticlesResponseElement } from "@/api"
import { wikiApi } from "@/service/WikiApiService"
import { PrimeIcons } from "primevue/api"
import type { PageState } from "primevue/paginator"

const searchTerm = defineModel<string>("searchTerm", { required: true })
const loadingArticles = ref(false)
const articles: Ref<SearchArticlesResponse | undefined> = ref()
const selectedArticle: Ref<SearchArticlesResponseElement | undefined> = ref()
const emit = defineEmits<{
  search: [],
  articleSelect: [articleId?: string]
}>()

const search = async (searchTerm: string = "", page: number = 1, pageSize: number = 10) => {
  try {
    loadingArticles.value = true
    articles.value = (await wikiApi.api.searchArticles({ searchTerm, page, pageSize })).data
    loadingArticles.value = false
    emit("search")
  } catch (err: any) {
    console.log(err.message)
  }
}

const onPageChange = (state: PageState) => {
  search(searchTerm.value, state.page + 1, state.rows)
}

watch(searchTerm, async () => {
    const curVal = searchTerm.value
    await (new Promise(r => setTimeout(r, 1000)))
    if (curVal == searchTerm.value) {
      await search(searchTerm.value)
    }
  }
)

watch(selectedArticle, () => {
  emit("articleSelect", selectedArticle.value?.id)
})

</script>

<template>
  <PrimeIconField icon-position="left">
    <PrimeInputIcon :class="PrimeIcons.SEARCH" />
    <PrimeInputText
      v-model="searchTerm"
      autofocus
      placeholder="Search"
      class="w-full"
    />
  </PrimeIconField>
  <PrimeSkeleton
    v-if="loadingArticles"
    width="full"
    height="8rem"
    class="mb-2 fadein animation-duration-2000"
  />
  <PrimeListbox
    v-else
    v-model="selectedArticle"
    :options="articles?.data"
    option-label="articleTitle"
    class="w-full mt-2"
  />
  <PrimePaginator
    class="mt-2"
    :template="{
          '639px': 'PrevPageLink CurrentPageReport NextPageLink',
          default: 'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown'
        }"
    :rows="10"
    :rows-per-page-options="[10, 20, 30]"
    :total-records="articles?.totalCount"
    @page="onPageChange"
  />
</template>

<style scoped>

</style>