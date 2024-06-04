<script setup lang="ts">
import { AppConstants } from "@/constants/AppConstants"
import { type Ref, ref, watch } from "vue"
import { wikiApi } from "@/service/WikiApiService"
import type { GetCategoriesResponseElement, SearchArticlesResponse, SearchArticlesResponseElement } from "@/api"
import type { PageState } from "primevue/paginator"
import { isNullOrWhitespace } from "@/utils/stringUtils"
import { maxLength, minLength, required } from "@vuelidate/validators"
import { useVuelidate } from "@vuelidate/core"

enum EditorMode {
  MANUAL = "manual",
  CATEGORY = "category",
  ARTICLE = "article"
}

interface EditorOption {
  label: String,
  mode: EditorMode
}

const uri = defineModel<string | null>("uri", { default: null })
const visible = defineModel<boolean>("visible", { default: false })
const previewUri: Ref<string | null> = ref(null)
const inputDisabled = ref(false)

const rules = {
  previewUri: { maxLength: maxLength(2048) }
}

const vuelidate = useVuelidate(rules, { previewUri: previewUri }, { $lazy: true })

const editorOptions: Array<EditorOption> = [
  { label: "Manual", mode: EditorMode.MANUAL },
  { label: "Category", mode: EditorMode.CATEGORY },
  { label: "Article", mode: EditorMode.ARTICLE }
]
const selectedEditorOption: Ref<EditorOption> = ref(editorOptions[0])
const categories: Ref<Array<GetCategoriesResponseElement>> = ref([])
const articles: Ref<SearchArticlesResponse | null> = ref(null)
const selectedPage: Ref<GetCategoriesResponseElement | SearchArticlesResponseElement | null> = ref(null)
const articleQuery = ref("")
const loadingCategories = ref(false)
const loadingArticles = ref(false)

const loadCategories = async () => {
  try {
    loadingCategories.value = true
    categories.value = []
    categories.value = (await wikiApi.api.getCategories()).data.data
    loadingCategories.value = false
  } catch (error) {
    console.error(error)
  }
}

const loadArticles = async (searchTerm: string = "", page: number = 1, pageSize: number = 10) => {
  try {
    loadingArticles.value = true
    articles.value = (await wikiApi.api.searchArticles({ searchTerm, page, pageSize })).data
    loadingArticles.value = false
  } catch (error) {
    console.error(error)
  }
}

const onPageChange = (state: PageState) => {
  loadArticles(articleQuery.value, state.page + 1, state.rows)
}

const onConfirm = () => {
  uri.value = previewUri.value
  visible.value = false
}

const onCancel = () => {
  previewUri.value = null
  visible.value = false
}

watch(visible, () => {
  if (visible.value) {
    previewUri.value = uri.value
  } else {
    selectedPage.value = null
    selectedEditorOption.value = editorOptions[0]
  }
})

watch(previewUri, () => {
  if (isNullOrWhitespace(previewUri.value)) {
    previewUri.value = null
  }
  vuelidate.value.previewUri.$touch()
})

watch(selectedPage, () => {
  if (selectedPage.value?.id != null) {
    let prefix: string
    switch (selectedEditorOption.value.mode) {
      case EditorMode.MANUAL:
        prefix = "/categories/"
        break
      case EditorMode.CATEGORY:
        prefix = "/categories/"
        break
      case EditorMode.ARTICLE:
        prefix = "/articles/"
        break
    }
    previewUri.value = `${prefix}${selectedPage.value.id}`
  } else
    previewUri.value = "/"
})

watch(selectedEditorOption, async (newValue) => {
  inputDisabled.value = newValue.mode == EditorMode.CATEGORY || newValue.mode == EditorMode.ARTICLE

  if (newValue.mode == EditorMode.CATEGORY) {
    await loadCategories()
  } else if (newValue?.mode == EditorMode.ARTICLE) {
    await loadArticles(articleQuery.value)
  }
})

watch(articleQuery, async () => {
    const curVal = articleQuery.value
    await (new Promise(r => setTimeout(r, 1000)))
    if (curVal == articleQuery.value) {
      await loadArticles(articleQuery.value)
    }
  }
)
</script>

<template>
  <PrimeDialog
    v-model:visible="visible"
    modal
    maximizable
    header="Edit URI"
    :position="'top'"
    class="w-full md:w-30rem"
    :breakpoints="AppConstants.dialogBreakpoints"
    @hide="onCancel"
  >
    <PrimeSelectButton
      v-model="selectedEditorOption"
      class="mt-2 w-full"
      :allow-empty="false"
      :options="editorOptions"
      option-label="label"
    />
    <PrimeFloatLabel class="mt-5">
      <PrimeInputText
        id="uri"
        v-model="previewUri"
        class="w-full"
        :invalid="vuelidate.previewUri.$error"
        :disabled="inputDisabled" />
      <label for="uri">URI</label>
      <PrimeTag v-for="error in vuelidate.$errors" :key="error.$uid" severity="danger">
        {{ error.$message }}
      </PrimeTag>
    </PrimeFloatLabel>
    <div v-if="selectedEditorOption?.mode == EditorMode.MANUAL" class="w-full mt-2" />
    <div v-if="selectedEditorOption?.mode == EditorMode.CATEGORY" class="w-full mt-2">
      <PrimeSkeleton
        v-if="loadingCategories"
        width="full"
        height="8rem"
        class="mb-2 fadein animation-duration-2000"
      />
      <PrimeListbox
        v-else
        v-model="selectedPage"
        :options="categories"
        option-label="name"
        class="w-full"
      />
    </div>
    <div v-if="selectedEditorOption?.mode == EditorMode.ARTICLE" class="w-full mt-2">
      <PrimeIconField icon-position="left">
        <PrimeInputText v-model="articleQuery" placeholder="Search" class="w-full" />
      </PrimeIconField>
      <PrimeSkeleton
        v-if="loadingArticles"
        width="full"
        height="8rem"
        class="mb-2 fadein animation-duration-2000"
      />
      <PrimeListbox
        v-else
        v-model="selectedPage"
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
    </div>
    <div class="flex justify-content-end gap-2 w-full mt-2">
      <PrimeButton
        type="button"
        label="Cancel"
        severity="secondary"
        @click="onCancel"
      />
      <PrimeButton
        type="button"
        label="Confirm"
        :disabled="vuelidate.$error"
        @click="onConfirm"
      />
    </div>
  </PrimeDialog>
</template>

<style scoped>

</style>