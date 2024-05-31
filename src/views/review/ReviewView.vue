<script setup lang="ts">

import { type Ref, ref, watch } from "vue"
import ArticleDiffComponent from "@/components/article/ArticleDiffComponent.vue"
import ArticleViewComponent from "@/components/article/ArticleViewComponent.vue"
import PendingReviewsList from "@/components/review/PendingReviewsList.vue"
import { useRoute } from "vue-router"
import SendReviewModal from "@/components/review/SendReviewModal.vue"
import WikiHeader from "@/components/navigation/WikiHeader.vue"
import SidebarLayout from "@/layouts/SidebarLayout.vue"
import WikiFooter from "@/components/navigation/WikiFooter.vue"

enum PreviewMode {
  PREVIEW = "preview",
  DIFF = "diff"
}

interface PreviewOption {
  label: String,
  mode: PreviewMode
}

const previewOptions: Array<PreviewOption> = [
  { label: "Normal view", mode: PreviewMode.PREVIEW },
  { label: "Diff view", mode: PreviewMode.DIFF }
]
const selectedPreviewOption: Ref<PreviewOption> = ref(previewOptions[0])
const dialogVisible = ref(false)
const route = useRoute()

const articleId: Ref<string> = ref(route.params.article as string)
const revisionId: Ref<string> = ref(route.params.revision as string)

watch(
  () => route.params.revision,
  () => {
    articleId.value = route.params.article as string
    revisionId.value = route.params.revision as string
  }
)
</script>

<template>
  <SidebarLayout>
    <template #header>
      <WikiHeader :has-sidebar-switch="true" />
    </template>
    <template #sidebar>
      <PendingReviewsList />
    </template>
    <template #default>
      <div class="flex-container w-full">
        <div class="container flex flex-column justify-content-center">
          <div class="flex justify-content-between">
            <PrimeSelectButton
              v-model="selectedPreviewOption"
              :options="previewOptions"
              option-label="label"
            />
            <PrimeButton label="Leave Review" @click="dialogVisible = true"></PrimeButton>
          </div>
          <div class="w-full flex flex-row">
            <ArticleDiffComponent v-if="selectedPreviewOption.mode === PreviewMode.DIFF" :new-revision="revisionId" :article="articleId" />
            <ArticleViewComponent
              v-else
              :revision="revisionId"
              :article="articleId"
              :hide-catalog="true"
            />
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <WikiFooter/>
    </template>
  </SidebarLayout>
  <SendReviewModal v-model:dialog-visible="dialogVisible" v-model:revision-id="revisionId" />
</template>

<style scoped>
</style>