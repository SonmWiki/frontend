<script setup lang="ts">
import { onBeforeMount, type Ref, ref } from "vue"
import { wikiApi } from "@/service/WikiApiService"
import { MapperService } from "@/service/MapperService"
import type { TreeNode } from "primevue/treenode"
import SidebarTree from "@/components/navigation/WikiSidebarTree.vue"
import useSidebarStore from "@/stores/SidebarStore"

enum SidebarMode {
  NAVIGATION = "navigation",
  CATEGORIES = "categories"
}

interface SidebarOption {
  label: String,
  mode: SidebarMode
}

const navigation = ref(new Array<TreeNode>())
const categories = ref(new Array<TreeNode>())
const sidebarOptions: Array<SidebarOption> = [
  { label: "Navigation", mode: SidebarMode.NAVIGATION },
  { label: "Categories", mode: SidebarMode.CATEGORIES }
]
const selectedSidebarOption: Ref<SidebarOption> = ref(sidebarOptions[0])

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
  <PrimeSelectButton
    v-model="selectedSidebarOption"
    class="w-full flex flex-wrap justify-content-center align-items-center"
    :allow-empty="false"
    :options="sidebarOptions"
    option-label="label"
  />
  <SidebarTree v-if="selectedSidebarOption.mode == SidebarMode.NAVIGATION" v-model="navigation" />
  <SidebarTree v-else v-model="categories" />
</template>

<style scoped>

</style>