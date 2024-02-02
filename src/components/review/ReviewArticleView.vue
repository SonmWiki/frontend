<script setup lang="ts">

import {ref} from "vue";
import ArticleDiffComponent from "@/components/ArticleDiffComponent.vue";
import ArticleViewComponent from "@/components/ArticleViewComponent.vue";
import PendingReviewsComponent from "@/components/review/PendingReviewsComponent.vue";

const checked = ref(false)

const revisionId = ref("")
const articleId = ref("")
</script>

<template>
  <Splitter style="height: calc(100vh - 80px); background: transparent; border: 0; max-width: 1900px">
    <SplitterPanel class="flex align-items-center justify-content-center overflow-y-scroll" :size="25" :minSize="15">
      <PendingReviewsComponent v-model:revisionId="revisionId" v-model:articleId="articleId" />
    </SplitterPanel>
    <SplitterPanel class="flex justify-content-center p-3 h-full overflow-y-auto" :size="75" :minSize="50">
      <div class="h-full w-full">
        <div class="flex ">
          <ToggleButton v-model="checked" onLabel="Diff View" offLabel="Normal View" :pt="{box: {style: 'background: none !important; border: 0;'}}" />
        </div>
        <div class="w-full flex flex-row">
            <ArticleDiffComponent v-if="checked" v-bind:newRevision="revisionId" v-bind:newArticle="articleId" />
            <ArticleViewComponent v-else v-bind:revision="revisionId" v-bind:article="articleId" :hide-catalog="true" />
        </div>
      </div>
    </SplitterPanel>
  </Splitter>


</template>

<style scoped>

</style>