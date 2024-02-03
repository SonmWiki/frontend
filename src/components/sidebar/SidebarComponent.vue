<script setup lang="ts">
import NavigationComponent from "@/components/sidebar/NavigationTree.vue";
import CategoriesComponent from "@/components/sidebar/CategoriesTree.vue";
import {ref} from "vue";
import {useRoute} from "vue-router";
import PendingReviewsList from "@/components/review/PendingReviewsList.vue";

const checked = ref(false)

const route = useRoute()
</script>

<template>
  <div class="w-full h-full">
    <ScrollPanel
        class="w-full h-full"
        :pt="{
        wrapper: {
            style: 'border-right: 10px solid var(--surface-50);'
        },
        bary: 'surface-300 opacity-100 border-round',
    }"
    >
      <div v-if="route.name == 'reviewView'">
        <PendingReviewsList />
      </div>
      <div v-else>
        <ToggleButton v-model="checked" onLabel="Categories" offLabel="Navigation" :pt="{box: {style: 'background: none !important; border: 0;'}}" />
        <CategoriesComponent v-if="checked" />
        <NavigationComponent v-else />
      </div>
    </ScrollPanel>
  </div>
</template>

<style scoped>

</style>