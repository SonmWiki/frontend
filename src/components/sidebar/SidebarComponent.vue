<script setup lang="ts">
import NavigationComponent from "@/components/sidebar/NavigationTree.vue";
import CategoriesComponent from "@/components/sidebar/CategoriesTree.vue";
import {ref} from "vue";

const checked = ref(false)
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
      <ToggleButton v-model="checked" onLabel="Categories" offLabel="Navigation" :pt="{box: {style: 'background: none !important; border: 0;'}}" />
      <CategoriesComponent v-if="checked" />
      <NavigationComponent v-else />
    </ScrollPanel>
  </div>
</template>

<style scoped>

</style>