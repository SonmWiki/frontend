<script setup lang="ts">
import type { TreeNode } from "primevue/treenode"
import router from "@/router"
import { type ModelRef, ref, type Ref } from "vue"
import type { TreeExpandedKeys } from "primevue/tree"
import ExternalLinkDialog from "@/components/ExternalLinkDialog.vue"

const nodes: ModelRef<TreeNode[] | undefined> = defineModel()
const expandedKeys: Ref<TreeExpandedKeys> = ref({})
const url = ref("")

const onNodeSelect = (node: TreeNode) => {
  const key = node.key

  if (node.type == "ext") url.value = node.uri
  else if (node.type == "int") router.push(node.uri)

  if (key != undefined && node.children && node.children.length) {
    const expandedKey: boolean = expandedKeys.value[key]
    expandedKeys.value[key] = !expandedKey
  }
}
</script>

<template>
  <Tree
    v-model:expandedKeys="expandedKeys"
    :value="nodes"
    class="w-full p-2 bg-transparent border-0 font-normal"
    style="font-size: 0.9em;"
    selection-mode="single"
    :pt="{
            toggler: {
              style: 'margin: 0'
            },
            content: {
              style: 'padding: 0;'
            }
          }"
    @node-select="onNodeSelect"
  >
    <template #default="slotProps">
      <div class="flex" :class="{'gap-2': slotProps.node.icon}">
        <span>{{ slotProps.node.icon }}</span>
        <span>{{ slotProps.node.label }}</span>
      </div>
    </template>
    <template #ext="slotProps">
      <a
        onclick="return false"
        :href="slotProps.node.uri"
        class="flex text-color no-underline"
        :class="{'gap-2': slotProps.node.icon}"
      >
        <span>{{ slotProps.node.icon }}</span>
        <span>{{ slotProps.node.label }}</span>
      </a>
    </template>
    <template #int="slotProps">
      <RouterLink :to="slotProps.node.uri" class="flex text-color no-underline" :class="{'gap-2': slotProps.node.icon}">
        <span>{{ slotProps.node.icon }}</span>
        <span>{{ slotProps.node.label }}</span>
      </RouterLink>
    </template>
    <template #header="slotProps">
      <div class="flex font-bold uppercase" :class="{'gap-2': slotProps.node.icon}">
        <span>{{ slotProps.node.icon }}</span>
        <span>{{ slotProps.node.label }}</span>
      </div>
    </template>
  </Tree>
  <ExternalLinkDialog v-model:url="url" />
</template>

<style scoped>


</style>