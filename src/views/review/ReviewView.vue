<script setup lang="ts">

import { type Ref, ref } from "vue"
import ArticleDiff from "@/components/article/ArticleDiff.vue"
import ArticleContent from "@/components/article/ArticleContent.vue"
import PendingReviewsList from "@/components/review/PendingReviewsList.vue"
import SendReviewModal from "@/components/review/SendReviewModal.vue"
import WikiHeader from "@/components/navigation/WikiHeader.vue"
import SidebarLayout from "@/layouts/SidebarLayout.vue"
import WikiFooter from "@/components/navigation/WikiFooter.vue"
import router from "@/router"
import { isNullOrWhitespace } from "@/utils/stringUtils"

enum PreviewMode {
  PREVIEW = "preview",
  DIFF = "diff"
}

interface PreviewOption {
  label: String,
  mode: PreviewMode
}

const props = defineProps<{
  revisionId?: string
}>()

const pendingReviewsList = ref<InstanceType<typeof PendingReviewsList> | null>(null)

const previewOptions: Array<PreviewOption> = [
  { label: "Normal view", mode: PreviewMode.PREVIEW },
  { label: "Diff view", mode: PreviewMode.DIFF }
]
const selectedPreviewOption: Ref<PreviewOption> = ref(previewOptions[0])
const dialogVisible = ref(false)
const onRevisionSelected = (value: any) => {
  router.replace({ name: "review", params: { revisionId: value } })
}
const onReviewSent = () => {
  router.replace( { name: "review" })
}

</script>

<template>
  <SidebarLayout>
    <template #header>
      <WikiHeader :has-sidebar-switch="true" />
    </template>
    <template #sidebar>
      <h2 class="m-0">Pending revisions</h2>
      <PrimeDivider class="mb-5" />
      <PendingReviewsList ref="pendingReviewsList" :selected-revision="revisionId" @select="onRevisionSelected" />
    </template>
    <template #default>
      <h2 class="m-0">Revision review</h2>
      <PrimeDivider class="mb-5" />
      <div class="flex-container w-full">
        <div v-if="revisionId" class="container flex flex-column justify-content-center">
          <div class="flex justify-content-between mb-3">
            <PrimeSelectButton
              v-model="selectedPreviewOption"
              :options="previewOptions"
              option-label="label"
            />
            <PrimeButton label="Leave Review" @click="dialogVisible = true"></PrimeButton>
          </div>
          <div v-if="!isNullOrWhitespace(revisionId)" class="w-full">
            <ArticleDiff v-if="selectedPreviewOption.mode === PreviewMode.DIFF" :new-revision-id="revisionId" />
            <ArticleContent
              v-else
              :revision-id="revisionId"
              hide-catalog
              hide-edit
              hide-history
            />
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <WikiFooter/>
    </template>
  </SidebarLayout>
  <SendReviewModal v-model:dialog-visible="dialogVisible" :revision-id="revisionId" @review-sent="onReviewSent" />
</template>

<style scoped>
</style>