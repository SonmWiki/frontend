<script setup lang="ts">
import { type Ref, ref } from "vue"
import { MdEditor, MdPreview } from "md-editor-v3"
import "md-editor-v3/lib/style.css"
import { type CreateArticleRequest, type GetCategoriesResponseElement } from "@/api"
import { useVuelidate } from "@vuelidate/core"
import { wikiApi } from "@/service/WikiApiService"
import { useToast } from "primevue/usetoast"
import { maxLength, minLength, required } from "@vuelidate/validators"

const text: Ref<string> = ref("Hello Editor! 👋")
const dialogVisible = ref(false)
const localArticleDraft: Ref<string | null> = ref(null)
const title = ref("")
const categories: Ref<GetCategoriesResponseElement[]> = ref([])
const selectedCategories: Ref<GetCategoriesResponseElement[]> = ref([])
const loadingCategories = ref(false)
const error = ref()
const toast = useToast()
const preview = ref(false)

localArticleDraft.value = localStorage.getItem("article_draft")

if (localArticleDraft.value != null) text.value = localArticleDraft.value

const rules = {
  title: { required, minLength: minLength(4), maxLength: maxLength(256) }
}

const v$ = useVuelidate(
  rules, { title: title }, { $lazy: true }
)

const saveDraft = (v: string) => {
  if (localArticleDraft.value == text.value) return
  localArticleDraft.value = v
  localStorage.setItem("article_draft", v)
  console.log("Saved in local storage!")
}

const createArticle = async () => {
  const isFormCorrect = await v$.value.$validate()
  if (!isFormCorrect) return

  const data: CreateArticleRequest = {
    title: title.value,
    content: text.value,
    categoryIds: selectedCategories.value ? selectedCategories.value.map((category) => category.id) : []
  }

  console.log(data)

  try {
    const result = (await wikiApi.api.createArticle(data)).data
    dialogVisible.value = false

    toast.add({ severity: "success", summary: "Article Created!", detail: `id: ${result.id}`, life: 3000 })

  } catch (e) {
    error.value = e
    console.log(e)
  }
}

const onCategoriesClick = async () => {
  if (loadingCategories.value || categories.value.length != 0) return

  loadingCategories.value = true

  try {
    categories.value = (await wikiApi.api.getCategories()).data.data
    loadingCategories.value = false
  } catch (error) {
    console.log(error)
  }
}

setInterval(() => {
  saveDraft(text.value)
}, 30 * 1000)
</script>

<template>
  <PrimeToast />

  <div class="flex w-full justify-content-center">
    <div class="flex flex-column gap-2 p-2 w-full h-full" style="max-width: 1900px; min-height: calc(100vh - 80px)">
      <div class="w-full flex flex-column align-items-center">
        <h1>Create Article</h1>
      </div>
      <div class="flex justify-content-between">
        <PrimeToggleButton
          v-model="preview"
          on-label="Preview Mode"
          off-label="Editor Mode"
          :pt="{box: {style: 'background: none !important; border: 0;'}}"
        />
        <PrimeButton label="Create" @click="dialogVisible = true" />
      </div>
      <div class="h-full flex justify-content-center">
        <MdPreview
          v-if="preview"
          v-model="text"
          style="max-width: 750px;"
          language="en-US"
          preview-theme='github'
          theme="dark"
        />
        <MdEditor
          v-else
          v-model="text"
          :preview='false'
          language="en-US"
          preview-theme='github'
          theme="dark"
          @on-save="saveDraft"
        />
      </div>
    </div>
  </div>

  <PrimeDialog
    v-model:visible="dialogVisible"
    modal
    header="Create Article"
    class="w-30rem">
    <div class="flex flex-column gap-4">
      <div class="flex flex-column gap-2">
        <label for="title">Title</label>
        <PrimeInputText
          id="title"
          v-model="title"
          v-tooltip.right="v$.title.$errors[0]?.$message || ''"
          aria-describedby="title-help"
          :class="{ 'p-invalid': v$.title.$errors[0] }"
        />
        <small id="title-help">⚠️ You'll need to create a new article to rename it</small>
      </div>
      <div class="flex flex-column gap-2">
        <label for="username">Categories</label>
        <PrimeMultiSelect
          v-model="selectedCategories"
          :loading="loadingCategories"
          :options="categories"
          filter
          option-label="name"
          placeholder="Select Categories"
          :max-selected-labels="3"
          class="w-full"
          @click="onCategoriesClick"
        />
      </div>
      <span v-if="error" class="text-red-400">
        ❗ Failed to create: {{ error.request.statusText }}
      </span>
      <div class="flex justify-content-end gap-2">
        <PrimeButton
          outlined
          type="button"
          label="Cancel"
          severity="secondary"
          @click="dialogVisible = false"
        />
        <PrimeButton
          outlined
          type="button"
          label="Create"
          @click="createArticle"
        />
      </div>
    </div>
  </PrimeDialog>
</template>

<style scoped>

</style>