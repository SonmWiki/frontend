<script setup lang="ts">

import { type Ref, ref, watch } from "vue"
import ArticleDiffComponent from "@/components/article/ArticleDiffComponent.vue"
import ArticleViewComponent from "@/components/article/ArticleViewComponent.vue"
import PendingReviewsList from "@/components/review/PendingReviewsList.vue"
import { useRoute } from "vue-router"
import SendReviewModal from "@/components/review/SendReviewModal.vue"

const diffView = ref(false)
const dialogVisible = ref(false)
const route = useRoute()

const revisionId: Ref<string | undefined> = ref(route.params.revision as string)
const articleId: Ref<string | undefined> = ref(route.params.article as string)

watch(
  () => route.params.revision,
  () => {
    revisionId.value = route.params.revision as string
    articleId.value = route.params.article as string
  }
)
</script>

<template>
  <div class="flex justify-content-center w-full">
    <PrimeSplitter
      style="height: calc(100vh - 80px); background: transparent; border: 0; max-width: 1900px"
      class="w-full"
      :pt="{
          gutter: 'hidden md:block'
        }"
    >
      <PrimeSplitterPanel class="hidden md:flex flex-column align-items-start overflow-y-scroll" :size="20" :min-size="15">
        <PendingReviewsList class="" />
      </PrimeSplitterPanel>
      <PrimeSplitterPanel class="flex justify-content-center p-3 h-full overflow-y-auto" :size="80" :min-size="50">
        <div class="h-full w-full flex flex-column gap-2">
          <div class="flex justify-content-between">
            <PrimeToggleButton
              v-model="diffView"
              on-label="Diff View"
              off-label="Normal View"
              :pt="{box: {style: 'background: none !important; border: 0;'}}"
            />
            <PrimeButton label="Leave Review" @click="dialogVisible = true"></PrimeButton>
          </div>
          <div class="w-full flex flex-row">
            <ArticleDiffComponent v-if="diffView" :new-revision="revisionId" :article="articleId" />
            <ArticleViewComponent
              v-else
              :revision="revisionId"
              :article="articleId"
              :hide-catalog="true"
            />
          </div>
        </div>
      </PrimeSplitterPanel>
    </PrimeSplitter>
  </div>

  <SendReviewModal v-model:dialog-visible="dialogVisible" v-model:revision-id="revisionId" />
</template>

<style scoped>

</style>