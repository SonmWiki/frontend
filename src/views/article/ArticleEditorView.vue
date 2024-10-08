<script setup lang="ts">
import { computed, onBeforeMount, onUnmounted, type Ref, ref } from "vue"
import type { CreateArticleRequest, EditArticleRequest, GetCategoriesResponseElement } from "@/api"
import { useToast } from "primevue/usetoast"
import { MdEditor } from "md-editor-v3"
import WikiHeader from "@/components/navigation/WikiHeader.vue"
import WikiFooter from "@/components/navigation/WikiFooter.vue"
import BaseLayout from "@/layouts/BaseLayout.vue"
import { wikiApi } from "@/service/WikiApiService"
import useArticleEditorStore from "@/stores/ArticleEditorStore"
import { isNullOrWhitespace } from "@/utils/stringUtils"
import { PrimeIcons } from "@primevue/core/api"
import { useVuelidate } from "@vuelidate/core"
import { maxLength, required } from "@vuelidate/validators"
import useThemeStore from "@/stores/ThemeStore"

const props = defineProps<{
  articleId?: string
}>()

const isNewArticle = computed(() => isNullOrWhitespace(props.articleId))
const title = ref("")
const note = ref("")
const content = ref("")
const categories: Ref<GetCategoriesResponseElement[]> = ref([])
const selectedCategories: Ref<string[]> = ref([])
const loadingArticle = ref(false)
const loadingCategories = ref(false)
const editorStore = useArticleEditorStore()
const toast = useToast()
const themeStore = useThemeStore()

const rules = {
  title: { required, maxLength: maxLength(128) },
  note: { required },
  content: { required }
}
const vuelidate = useVuelidate(rules, { title: title, note: note, content: content })

const loadCategories = async () => {
  if (loadingCategories.value) return
  loadingCategories.value = true

  try {
    categories.value = (await wikiApi.api.getCategories()).data.data
    if (isNewArticle.value)
      selectedCategories.value = editorStore.categories
    selectedCategories.value = selectedCategories.value.filter(x => categories.value.some(e => e.id === x))
    loadingCategories.value = false
  } catch (error) {
    toast.add({ severity: "error", summary: "An error occured", detail: "Couldn't load categories" })
    console.log(error)
  }
}

const loadArticle = async () => {
  if (loadingArticle.value) return
  loadingArticle.value = true

  if (!isNewArticle.value) {
    try {
      const result = (await wikiApi.api.getArticle(props.articleId!!)).data
      title.value = result.title
      if (!isNullOrWhitespace(result.content))
        content.value = result.content!
      selectedCategories.value = result.categories.map(x => x.id)
      loadingArticle.value = false
    } catch (e: any) {
      toast.add({ severity: "error", summary: "An error occured", detail: "Couldn't load article for editing" })
    }
  } else {
    title.value = editorStore.title
    content.value = editorStore.content
    loadingArticle.value = false
  }
}

const saveDraft = (notify: boolean = true) => {
  if (isNewArticle.value) {
    editorStore.title = title.value
    editorStore.note = note.value
    editorStore.content = content.value
    editorStore.categories = selectedCategories.value
    if (notify)
      toast.add({ severity: "info", summary: "Draft saved", life: 3000 })
  }
}

const submit = async () => {
  const request = async (data: CreateArticleRequest | EditArticleRequest) => {
    if (isNewArticle.value) return wikiApi.api.createArticle(data as CreateArticleRequest)
    else return wikiApi.api.editArticle(props.articleId!, data as EditArticleRequest)
  }

  const requestData: CreateArticleRequest | EditArticleRequest = isNewArticle.value ? {
    title: title.value,
    content: content.value,
    authorsNote: note.value,
    categoryIds: selectedCategories.value
  } : {
    content: content.value,
    authorsNote: note.value,
    categoryIds: selectedCategories.value
  }

  const successSummary = isNewArticle.value ? "Article submitted" : "Revision submitted"

  try {
    const result = (await request(requestData)).data
    if (isNewArticle.value) {
      title.value = ""
      note.value = ""
      content.value = ""
      categories.value = []
      saveDraft()
    }
    toast.add({ severity: "success", summary: successSummary, detail: `id: ${result.id}`, life: 3000 })
  } catch (e: any) {
    if (e.isAxiosError) {
      if (e.response?.data?.detail != undefined) {
        toast.add({ severity: "error", summary: "An error occurred", detail: e.response.data.detail })
      }
    } else {
      console.log(e)
    }
  }
}

let draftTimer: number | undefined

onBeforeMount(async () => {
  await Promise.all([loadCategories(), loadArticle()])
  if (isNewArticle.value) {
    draftTimer = setInterval(() => {
      saveDraft(false)
    }, 30 * 1000)
  }
  vuelidate.value.$touch()
})


onUnmounted(() => {
  if (draftTimer !== undefined)
    clearInterval(draftTimer)
})
</script>

<template>
  <BaseLayout>
    <template #header>
      <WikiHeader />
    </template>
    <template #default>
      <div class="container flex flex-column w-full">
        <h1 v-if="isNewArticle" class="m-0">Create Article</h1>
        <h1 v-else class="m-0">Edit Article</h1>
        <PrimeDivider class="mb-5" />
        <div class="flex justify-content-between w-full mb-5">
          <div>
            <PrimeFloatLabel class="w-full md:20rem">
              <PrimeSkeleton v-if="loadingArticle" class="h-full w-full md:w-20rem fadein animation-duration-2000" />
              <PrimeInputText
                id="title"
                v-model="title"
                :invalid="vuelidate.title.$error"
                :disabled="!isNewArticle || loadingArticle"
                class="w-full md:w-20rem" />
              <label for="title">Title</label>
            </PrimeFloatLabel>
            <PrimeTag v-for="error in vuelidate.title.$errors" :key="error.$uid" severity="danger">
              {{ error.$message }}
            </PrimeTag>
          </div>
          <PrimeButton
            severity="primary"
            :disabled="vuelidate.$error || loadingArticle || loadingCategories"
            label="Submit"
            :icon="PrimeIcons.SAVE"
            class="hidden md:inline-flex align-self-start"
            @click="submit"
          />
        </div>
        <PrimeFloatLabel class="mb-5">
          <PrimeMultiSelect
            id="categories"
            v-model="selectedCategories"
            :loading="loadingCategories"
            :options="categories"
            display="chip"
            filter
            option-value="id"
            option-label="name"
            placeholder="Select Categories"
            class="w-full"
          />
          <label for="categories">Categories</label>
        </PrimeFloatLabel>
        <PrimeFloatLabel class="w-full md:20rem mb-5">
          <PrimeSkeleton v-if="loadingArticle" class="h-full w-full md:w-20rem fadein animation-duration-2000" />
          <PrimeInputText
            id="note"
            v-model="note"
            :disabled="loadingArticle"
            class="w-full" />
          <label for="note">Note</label>
        </PrimeFloatLabel>
        <div class="w-full h-full mb-5">
          <MdEditor
            v-model="content"
            language="en-US"
            preview-theme='github'
            :preview="false"
            :disabled="loadingArticle"
            :theme="themeStore.theme"
            :toolbars-exclude="isNewArticle ? ['github'] : ['github', 'save']"
            class="w-full h-full"
            :on-save="saveDraft"
            no-upload-img
          />
          <PrimeTag v-for="error in vuelidate.content.$errors" :key="error.$uid" severity="danger">
            {{ error.$message }}
          </PrimeTag>
        </div>
        <div class="mb-5">
          <PrimeButton
            severity="primary"
            :disabled="vuelidate.$error || loadingArticle || loadingCategories"
            label="Submit"
            :icon="PrimeIcons.SAVE"
            class="md:hidden w-full"
            @click="submit"
          />
        </div>
      </div>
    </template>
    <template #footer>
      <WikiFooter />
    </template>
  </BaseLayout>
  <PrimeToast />
</template>

<style scoped>
.container {
  height: calc(100vh - 3rem);
}

</style>