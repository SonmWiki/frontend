<script setup lang="ts">
import { type Ref, ref, watch } from "vue"
import { MdCatalog, MdPreview } from "md-editor-v3"
import "md-editor-v3/lib/style.css"
import { useToast } from "primevue/usetoast"
import { wikiApi } from "@/service/WikiApiService"
import type { GetArticleResponse, GetRevisionHistoryResponseElement } from "@/api"
import useThemeStore from "@/stores/ThemeStore"
import { PrimeIcons } from "primevue/api"
import router from "@/router"
import useAuthStore from "@/stores/AuthStore"
import { UserRole } from "@/types/UserRole"
import RevisionHistoryList from "@/components/article/RevisionHistoryList.vue"
import moment from "moment/moment"
import { AppConstants } from "@/constants/AppConstants"

const props = defineProps<{
  articleId?: string
  revisionId?: string
  hideCatalog?: boolean
  hideTitle?: boolean
  hideEdit?: boolean
  hideHistory?: boolean
}>()

const toast = useToast()
const themeStore = useThemeStore()
const authStore = useAuthStore()

const popup = ref()
const articleData: Ref<GetArticleResponse | undefined> = ref()
const loading = ref(true)
const error = ref()

const deleteDialogVisible = ref(false)


const id = "preview-only"
const scrollElement = document.documentElement

const loadArticle = async () => {
  articleData.value = undefined
  loading.value = true

  try {
    error.value = undefined
    if (!props.revisionId) {
      if (props.articleId == undefined) return
      articleData.value = (await wikiApi.api.getArticle(props.articleId)).data
    } else
      articleData.value = (await wikiApi.api.getArticleByRevision(props.revisionId)).data
  } catch (err) {
    console.log(err)
    error.value = err
  }
  loading.value = false
}
const togglePopup = (event: any) => {
  popup.value.toggle(event)
}

const copyLink = () => {
  toast.add({ severity: "info", summary: "Link Copied!", life: 3000 })
  navigator.clipboard.writeText(window.location.toString())
  togglePopup(this)
}

const editArticle = () => {
  router.push({ name: "articleEditor", params: { articleId: props.articleId } })
}

const redirectArticle = () => {
  router.push({ name: "redirectArticle", params: { articleId: props.articleId } })
}

const onDeleteConfirm = async () => {
  if (!articleData.value?.id) return
  try {
    loading.value = true
    await wikiApi.api.deleteArticle(articleData.value?.id)
    deleteDialogVisible.value = false
    await router.replace({ name: "home" })
  } catch (error: any) {
    if (error.isAxiosError) {
      if (error.response?.data?.detail != undefined) {
        toast.add({
          severity: "error",
          summary: "There was an error deleting an article",
          detail: error.response.data.detail
        })
      }
    }
    console.log(error)
    loading.value = false
  }
}

const onRevisionSelected = (revision: GetRevisionHistoryResponseElement | undefined) => {
  if (revision?.id != articleData.value?.revisionId || (props.revisionId && revision?.id != props.revisionId)) {
    router.replace({ name: "articles", params: { articleId: articleData.value?.id, revisionId: revision?.id } })
  }
}

const onCategoryClicked = async (categoryId: string) => {
  await router.push({ name: "categories", params: { id: categoryId } })
}

watch(
  () => props.articleId,
  () => {
    loadArticle()
  }
)

watch(
  () => props.revisionId,
  () => {
    loadArticle()
  }
)

loadArticle()
</script>

<template>
  <PrimeToast />
  <div class="flex">
    <div class="w-full">
      <div v-if="articleData && articleData.content != null" class="content pt-4">
        <div class="title flex align-items-center justify-content-between ml-4 mr-4">
          <div>
            <h1 class="font-bold mb-0 mt-0">{{ articleData.title }}</h1>
            <div v-if="revisionId" class="text-sm text-color-secondary">
              rev: {{ revisionId }}
            </div>
            <div class="text-sm text-color-secondary">
              {{ moment(articleData.submittedTimestamp, moment.ISO_8601).format("DD.MM.YYYY HH:mm") }}
            </div>
            <PrimeTag
              v-for="category in articleData.categories"
              :key="category.id"
              class="m-1 cursor-pointer"
              @click="onCategoryClicked(category.id)"
            >
              {{ category.name }}
            </PrimeTag>
          </div>
          <div class="flex align-items-center justify-content-between">
            <PrimeButton
              v-if="!hideEdit && (authStore.hasRole(UserRole.USER) || authStore.hasRole(UserRole.EDITOR) || authStore.hasRole(UserRole.ADMIN))"
              severity="secondary"
              style="max-height: 32px; max-width: 32px; font-size: 1em; padding: 0; z-index: 1"
              rounded
              text
              size="small"
              :icon="PrimeIcons.PENCIL"
              @click="editArticle"
            />
            <PrimeButton
              v-if="!hideEdit && (authStore.hasRole(UserRole.EDITOR) || authStore.hasRole(UserRole.ADMIN))"
              severity="secondary"
              style="max-height: 32px; max-width: 32px; font-size: 1em; padding: 0; z-index: 1"
              rounded
              text
              size="small"
              :icon="PrimeIcons.FAST_FORWARD"
              @click="redirectArticle"
            />
            <PrimeButton
              v-if="!hideEdit && (authStore.hasRole(UserRole.EDITOR) || authStore.hasRole(UserRole.ADMIN))"
              :icon="PrimeIcons.TRASH"
              style="max-height: 32px; max-width: 32px; font-size: 1em; padding: 0; z-index: 1"
              severity="danger"
              rounded
              text
              size="small"
              @click="deleteDialogVisible=true"
            />
            <PrimeButton
              severity="secondary"
              style="max-height: 32px; max-width: 32px; font-size: 1em; padding: 0; z-index: 1"
              size="small"
              icon="pi pi-ellipsis-v"
              text
              rounded
              @click="togglePopup"
            />
            <PrimeOverlayPanel ref="popup" :pt="{content: {style: 'padding: 0.5rem'}}">
              <div class="flex flex-column">
                <PrimeButton
                  class="text-left"
                  icon="pi pi-share-alt"
                  label="Copy link"
                  size="small"
                  text
                  @click="copyLink"
                />
              </div>
              <div v-if="!hideHistory" class="flex flex-column">
                <PrimeFloatLabel class="mt-5">
                  <RevisionHistoryList
                    id="revisionList"
                    :article="articleData"
                    :disabled="loading || !articleData"
                    @update:selected-revision="onRevisionSelected"
                  />
                  <label for="revisionList">Revision</label>
                </PrimeFloatLabel>
              </div>
            </PrimeOverlayPanel>
          </div>
        </div>
        <div>
          <MdPreview
            language="en-US"
            preview-theme='github'
            :theme="themeStore.theme"
            :editor-id="id"
            :model-value="articleData.content"
          />
        </div>
      </div>
      <div v-if="error && !articleData" class="content pt-4">
        <div class="title flex align-items-center justify-content-between ml-4 mr-4">
          <h1 class="font-bold mb-0 mt-0">{{ error.response.status }} {{ error.response.statusText }}</h1>
        </div>
      </div>
      <div v-if="!error && !articleData && loading" class="content pt-4">
        <div class="flex flex-column gap-2 ml-4 mr-4">
          <PrimeSkeleton width="45%" height="2rem" class="fadein animation-duration-2000"></PrimeSkeleton>
          <PrimeSkeleton width="100%" height="8rem" class="fadein animation-duration-2000"></PrimeSkeleton>
          <PrimeSkeleton width="100%" height="8rem" class="fadein animation-duration-2000"></PrimeSkeleton>
        </div>
      </div>
    </div>
    <div v-if="!hideCatalog" class="menu catalog">
      <div v-if="articleData" class="pt-4 sticky" style="top: 2rem;">
        <MdCatalog
          language="en-US"
          preview-theme='github'
          :theme="themeStore.theme"
          :editor-id="id"
          :scroll-element="scrollElement"
          :scroll-element-offset-top="48"
        />
      </div>
    </div>
  </div>
  <PrimeDialog
    v-model:visible="deleteDialogVisible"
    modal
    header="Delete article"
    :position="'top'"
    class="w-full md:w-30rem"
    :breakpoints="AppConstants.dialogBreakpoints"
    :closable="!loading"
  >
    Are you sure that you want to delete article: <b> {{ articleData?.title }} </b>?
    This action cannot be undone!
    <div class="flex justify-content-end gap-2 w-full mt-2">
      <PrimeButton
        type="button"
        label="Cancel"
        severity="secondary"
      />
      <PrimeButton
        type="button"
        severity="danger"
        label="Confirm"
        @click="onDeleteConfirm"
      />
    </div>
  </PrimeDialog>
</template>

<style scoped>

@media only screen and (max-width: 1280px) {
  .catalog {
    display: none;
  }
}

.catalog {
  width: max(220px, -1160px + 100vw + min(-300px, 485px - 50vw));
  flex-shrink: 0;
  max-width: 300px;
}

.content {
  height: 100%;
  max-width: 750px;
  margin-left: auto;
  margin-right: auto;
}
</style>