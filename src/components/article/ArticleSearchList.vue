<script setup lang="ts">
import { type Ref, ref, watch } from "vue"
import type { SearchArticlesResponse, SearchArticlesResponseElement } from "@/api"
import { wikiApi } from "@/service/WikiApiService"
import { MagnifyingGlassIcon } from "@heroicons/vue/24/solid"

const searchTerm = defineModel<string>("searchTerm", { required: true })
const loadingArticles = ref(false)
const articles: Ref<SearchArticlesResponse | undefined> = ref()
const selectedArticle: Ref<SearchArticlesResponseElement | undefined> = ref()

const currentPage = ref(1)
const pageSize = ref(10)
const rowsPerPageOptions = [10, 20, 30]

const emit = defineEmits<{
  search: []
  articleSelect: [articleId?: string]
}>()

const search = async (term: string = "", page: number = 1, size: number = 10) => {
  try {
    loadingArticles.value = true
    currentPage.value = page
    pageSize.value = size

    articles.value = (
      await wikiApi.api.searchArticles({ searchTerm: term, page, pageSize: size })
    ).data
    loadingArticles.value = false
    emit("search")
  } catch (err: any) {
    console.log(err.message)
    loadingArticles.value = false
  }
}

const handlePageChange = (newPage: number) => {
  if (newPage < 1 || !articles.value?.totalCount) return
  search(searchTerm.value, newPage, pageSize.value)
}

const handleRowsChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  const newSize = Number(target.value)
  search(searchTerm.value, 1, newSize)
}

const selectArticle = (article: SearchArticlesResponseElement) => {
  selectedArticle.value = article
}

watch(searchTerm, async () => {
  const curVal = searchTerm.value
  await new Promise((r) => setTimeout(r, 1000))
  if (curVal == searchTerm.value) {
    currentPage.value = 1
    await search(searchTerm.value, 1, pageSize.value)
  }
})

watch(selectedArticle, () => {
  emit("articleSelect", selectedArticle.value?.id)
})

search()
</script>

<template>
  <div class="flex flex-col w-full">
    <div class="relative w-full">
      <input
        v-model="searchTerm"
        type="text"
        class="py-2.5 pe-0 ps-8 w-full bg-transparent border-t-transparent border-b-2 border-x-transparent border-b-line-2 disabled:opacity-50 focus:outline-none transition-colors"
        placeholder="Search articles"
      />
      <div
        class="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-1 peer-disabled:opacity-50 peer-disabled:pointer-events-none"
      >
        <MagnifyingGlassIcon class="size-6"></MagnifyingGlassIcon>
      </div>
    </div>

    <div class="w-full mt-2">
      <div v-if="loadingArticles" class="py-4 text-center text-sm opacity-50">Loading...</div>
      <ul v-else-if="articles?.data && articles.data.length > 0" class="flex flex-col">
        <li
          v-for="article in articles.data"
          :key="article.id"
          @click="selectArticle(article)"
          class="group w-full text-start py-2.5 px-1 bg-transparent border-b border-b-line-2 cursor-pointer transition-colors hover:bg-gray-700"
          :class="{ 'font-semibold text-primary': selectedArticle?.id === article.id }"
        >
          {{ article.articleTitle }}
        </li>
      </ul>
      <div v-else-if="searchTerm" class="py-4 text-center text-sm opacity-50">
        No articles found
      </div>
    </div>

    <div
      v-if="articles?.totalCount && articles.totalCount > 0"
      class="flex flex-col sm:flex-row items-center justify-between mt-4 gap-4"
    >
      <!-- Page Info -->
      <div class="text-sm opacity-70">{{ articles?.totalCount }} results</div>

      <!-- Controls -->
      <div class="flex items-center gap-4">
        <!-- Rows Per Page -->
        <div class="flex items-center gap-2">
          <span class="text-sm opacity-70">Show:</span>
          <select
            :value="pageSize"
            @change="handleRowsChange"
            class="border-b-2 border-b-line-2 border-t-transparent border-x-transparent py-1 px-1 text-sm focus:outline-none cursor-pointer"
          >
            <option v-for="opt in rowsPerPageOptions" :key="opt" :value="opt">
              {{ opt }}
            </option>
          </select>
        </div>

        <!-- Page Navigation -->
        <div class="flex items-center gap-2">
          <button
            @click="handlePageChange(currentPage - 1)"
            :disabled="currentPage <= 1"
            class="text-sm px-2 py-1 border-b-2 border-transparent hover:border-b-line-2 disabled:opacity-30 disabled:hover:border-transparent transition-colors"
          >
            Prev
          </button>

          <span class="text-sm opacity-70"> Page {{ currentPage }} </span>

          <button
            @click="handlePageChange(currentPage + 1)"
            :disabled="!articles?.totalCount || currentPage * pageSize >= articles.totalCount"
            class="text-sm px-2 py-1 border-b-2 border-transparent hover:border-b-line-2 disabled:opacity-30 disabled:hover:border-transparent transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Ensure text-primary exists in your tailwind config,
   otherwise fallback to a standard color class like text-blue-600 */
</style>
