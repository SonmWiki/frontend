<script setup lang="ts">
import { onBeforeMount, type Ref, ref } from "vue"
import { wikiApi } from "@/service/WikiApiService"
import { MapperService } from "@/components/navigation/sidebar/MapperService"
import WikiSidebarTree from "@/components/navigation/sidebar/WikiSidebarTree.vue"
import type { WikiSidebarTreeNode, } from "@/components/navigation/sidebar/WikiSidebarTreeNode"

const navigation = ref(new Array<WikiSidebarTreeNode>())
const categories = ref(new Array<WikiSidebarTreeNode>())
const selectedSidebarOption: Ref<boolean> = ref(false)

const loadNavigation = async () => {
  try {
    let nav = (await wikiApi.api.getNavigationsTree()).data.data
    navigation.value = nav.map(MapperService.mapGetNavigationsTreeResponseElementToTreeNode)
  } catch (error) {
    console.log(error)
  }
}

const loadCategories = async () => {
  try {
    let cat = (await wikiApi.api.getCategoriesTree()).data.data
    categories.value = cat.map(MapperService.mapGetCategoriesTreeResponseElementToTreeNode)
  } catch (error) {
    console.error(error)
  }
}

onBeforeMount(async () => {
  await Promise.all([loadNavigation(), loadCategories()])
})
</script>

<template>
  <label class="inline-flex cursor-pointer bg-gray-900 p-2 rounded">
    <span
      class="select-none text-sm font-medium text-heading"
      :class="!selectedSidebarOption ? 'text-gray-50' : 'text-gray-400'"
      >Navigation</span
    >
    <input
      v-model="selectedSidebarOption"
      class="sr-only peer"
      type="checkbox"
      value=""
    />
    <div
      class="relative ml-2 mr-2 w-9 h-5 bg-gray-700 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-buffer after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand"
    />
    <span
      class="select-none text-sm font-medium text-heading"
      :class="selectedSidebarOption ? 'text-gray-50' : 'text-gray-400'"
      >Category</span
    >
  </label>

  <div v-show="selectedSidebarOption === false">
    <WikiSidebarTree v-model="navigation" />
  </div>
  <div v-show="selectedSidebarOption === true">
    <WikiSidebarTree v-show="selectedSidebarOption === true" v-model="categories" />
  </div>
</template>

<style scoped></style>
