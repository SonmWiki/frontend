<script setup lang="ts">

import {type Ref, ref, watch} from "vue";
import ArticleDiffComponent from "@/components/ArticleDiffComponent.vue";
import ArticleViewComponent from "@/components/ArticleViewComponent.vue";
import PendingReviewsList from "@/components/review/PendingReviewsList.vue";
import {useRoute} from "vue-router";
import SendReviewModal from "@/components/review/SendReviewModal.vue";

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
    <Splitter
        style="height: calc(100vh - 80px); background: transparent; border: 0; max-width: 1900px" class="w-full"
        :pt="{
          gutter: 'hidden md:block'
        }"
    >
      <SplitterPanel class="hidden md:flex flex-column align-items-start overflow-y-scroll" :size="20" :minSize="15">
          <PendingReviewsList class="" />
      </SplitterPanel>
      <SplitterPanel class="flex justify-content-center p-3 h-full overflow-y-auto" :size="80" :minSize="50">
        <div class="h-full w-full flex flex-column gap-2">
          <div class="flex justify-content-between">
            <ToggleButton v-model="diffView" onLabel="Diff View" offLabel="Normal View" :pt="{box: {style: 'background: none !important; border: 0;'}}" />
            <Button @click="dialogVisible = true" label="Leave Review"></Button>
          </div>
          <div class="w-full flex flex-row">
            <ArticleDiffComponent v-if="diffView" v-bind:newRevision="revisionId" v-bind:article="articleId" />
            <ArticleViewComponent v-else v-bind:revision="revisionId" v-bind:article="articleId" :hide-catalog="true" />
          </div>
        </div>
      </SplitterPanel>
    </Splitter>
  </div>

  <SendReviewModal v-model:dialog-visible="dialogVisible" v-model:revision-id="revisionId" />
</template>

<style scoped>

</style>