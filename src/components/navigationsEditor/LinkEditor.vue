<script setup lang="ts">
import { AppConstants } from '@/constants/AppConstants'
import { type Ref, ref, watch } from 'vue'
import { api } from '@/api/api'
import type { GetCategoriesResponseElement, SearchArticlesResponse, SearchArticlesResponseElement } from '@/api'
import type { PageState } from 'primevue/paginator'
import { isNullOrWhitespace } from '@/utils/stringUtils'

enum EditorMode {
  MANUAL = 'manual',
  CATEGORY = 'category',
  ARTICLE = 'article'
}

interface EditorOption {
  label: String,
  mode: EditorMode
}

const link = defineModel<string | null>('link', { default: null })
const visible = defineModel<boolean>('visible', { default: false })
const previewLink: Ref<string | null> = ref(null)
const linkEditorDisabled = ref(false)

const editorOptions: Array<EditorOption> = [
  { label: 'Manual', mode: EditorMode.MANUAL },
  { label: 'Category', mode: EditorMode.CATEGORY },
  { label: 'Article', mode: EditorMode.ARTICLE }
]
const selectedEditorOption: Ref<EditorOption> = ref(editorOptions[0])
const categories: Ref<Array<GetCategoriesResponseElement>> = ref([])
const articles: Ref<SearchArticlesResponse | null> = ref(null)
const selectedPage: Ref<GetCategoriesResponseElement | SearchArticlesResponseElement | null> = ref(null)
const articleQuery = ref('')
const loadingCategories = ref(false)
const loadingArticles = ref(false)

const loadCategories = async () => {
  try {
    loadingCategories.value = true
    categories.value = []
    categories.value = (await api().api.getCategories()).data.data
    loadingCategories.value = false
  } catch (error) {
    console.error(error)
  }
}

const loadArticles = async (searchTerm: string = '', page: number = 1, pageSize: number = 10) => {
  try {
    loadingArticles.value = true
    articles.value = (await api().api.searchArticles({ searchTerm, page, pageSize })).data
    loadingArticles.value = false
  } catch (error) {
    console.error(error)
  }
}

const onPageChange = (state: PageState) => {
  loadArticles(articleQuery.value, state.page + 1, state.rows)
}

const onConfirm = () => {
  link.value = previewLink.value;
  visible.value = false;
}

const onCancel = () => {
  visible.value = false;
}

watch(visible, () => {
  if (visible.value) {
    previewLink.value = link.value
  } else {
    selectedPage.value = null
    selectedEditorOption.value = editorOptions[0]
  }
})

watch(previewLink, () => {
  if (isNullOrWhitespace(previewLink.value)) {
    previewLink.value = null
  }
})

watch(selectedPage, () => {
  if (selectedPage.value?.id != null) {
    let prefix: string
    switch (selectedEditorOption.value.mode) {
      case EditorMode.MANUAL:
        prefix = '/categories/'
        break
      case EditorMode.CATEGORY:
        prefix = '/categories/'
        break
      case EditorMode.ARTICLE:
        prefix = '/articles/'
        break
    }
    previewLink.value = `${prefix}${selectedPage.value.id}`
  } else
    previewLink.value = '/'
})

watch(selectedEditorOption, async (newValue) => {
  linkEditorDisabled.value = newValue.mode == EditorMode.CATEGORY || newValue.mode == EditorMode.ARTICLE

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
  <Dialog
    v-model:visible="visible"
    modal
    maximizable
    header="Edit link"
    :position="'top'"
    class="w-full md:w-30rem"
    :breakpoints="AppConstants.dialogBreakpoints"
  >
    <SelectButton
      v-model="selectedEditorOption"
      class="mt-2 w-full"
      :options="editorOptions"
      option-label="label"
    />
    <FloatLabel class="mt-5">
      <InputText id="link" v-model="previewLink" :disabled="linkEditorDisabled" />
      <label for="link">Link</label>
    </FloatLabel>
    <div v-if="selectedEditorOption?.mode == EditorMode.MANUAL" class="w-full mt-2" />
    <div v-if="selectedEditorOption?.mode == EditorMode.CATEGORY" class="w-full mt-2">
      <Skeleton
        v-if="loadingCategories"
        width="full"
        height="8rem"
        class="mb-2"
      />
      <Listbox
        v-else
        v-model="selectedPage"
        :options="categories"
        option-label="name"
        class="w-full"
      />
    </div>
    <div v-if="selectedEditorOption?.mode == EditorMode.ARTICLE" class="w-full mt-2">
      <IconField icon-position="left">
        <InputText v-model="articleQuery" placeholder="Search" class="w-full" />
      </IconField>
      <Skeleton
        v-if="loadingArticles"
        width="full"
        height="8rem"
        class="mb-2"
      />
      <Listbox
        v-else
        v-model="selectedPage"
        :options="articles?.data"
        option-label="articleTitle"
        class="w-full mt-2"
      />
      <Paginator
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
      <Button
        type="button"
        label="Cancel"
        severity="secondary"
        @click="onCancel"
      />
      <Button
        type="button"
        label="Confirm"
        @click="onConfirm"
      />
    </div>
  </Dialog>
</template>

<style scoped>

</style>