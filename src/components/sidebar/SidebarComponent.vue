<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import {useRoute} from "vue-router";
import PendingReviewsList from "@/components/review/PendingReviewsList.vue";
import { api } from '@/api/api'
import { MapperService } from '@/service/MapperService'
import type { TreeNode } from 'primevue/treenode'
import SidebarTree from '@/components/sidebar/SidebarTree.vue'

const navigation = ref(new Array<TreeNode>())
const categories = ref(new Array<TreeNode>());
const isNavigations = ref(true)
const route = useRoute()

const loadNavigation = async () => {
  try {
    let nav = (await api().api.getNavigationsTree()).data.data
    navigation.value = nav.map(MapperService.mapGetNavigationsTreeResponseElementToTreeNode)
  } catch (error) {
    console.log(error)
  }
}

const loadCategories = async () => {
  try {
    let cat = (await api().api.getCategoriesTree()).data.data
    categories.value = cat.map(MapperService.mapGetCategoriesTreeResponseElementToTreeNode)
  }
  catch (error) {
    console.error(error)
  }
}

onBeforeMount(async () => {
  await Promise.all([loadNavigation(), loadCategories()])
})
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
        <ToggleButton v-model="isNavigations" onLabel="Navigation" offLabel="Categories" :pt="{box: {style: 'background: none !important; border: 0;'}}" />
        <SidebarTree v-model="navigation" v-if="isNavigations" />
        <SidebarTree v-model="categories" v-else />
      </div>
    </ScrollPanel>
  </div>
</template>

<style scoped>

</style>