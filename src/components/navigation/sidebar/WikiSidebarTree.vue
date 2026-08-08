<script setup lang="ts">
import router from "@/router"
import { ref } from "vue"
import {
  type WikiSidebarTreeNode,
  WikiSidebarTreeNodeType,
} from "@/components/navigation/sidebar/WikiSidebarTreeNode"
import ExternalLinkDialog from "@/components/common/ExternalLinkDialog.vue"
import WikiTree from "@/components/navigation/WikiTree.vue" // Импортируем общий компонент

const nodes = defineModel<WikiSidebarTreeNode[] | undefined>()
const expandedKeys = ref<Record<string | number, boolean>>({})
const url = ref("")

const handleNodeClick = (node: WikiSidebarTreeNode) => {
  if (node.type === WikiSidebarTreeNodeType.EXTERNAL_URL && node.uri) {
    url.value = node.uri
    return
  }

  if (node.type === WikiSidebarTreeNodeType.INTERNAL_URL && node.uri) {
    router.push(node.uri)
    return
  }

  if (node.key != null && node.children?.length) {
    expandedKeys.value[node.key] = !expandedKeys.value[node.key]
  }
}
</script>

<template>
  <WikiTree :nodes="nodes" v-model:expandedKeys="expandedKeys" aria-label="Navigation tree">
    <template #default="{ node }">
      <div
        class="flex-1 py-1 px-1.5 rounded transition-colors min-w-0 overflow-hidden"
        :class="{
          'cursor-pointer hover:bg-gray-700/50':
            node.type === WikiSidebarTreeNodeType.EXTERNAL_URL ||
            node.type === WikiSidebarTreeNodeType.INTERNAL_URL ||
            (node.key != null && node.children?.length),

          'font-semibold ':
            node.type === WikiSidebarTreeNodeType.HEADER ||
            node.type === WikiSidebarTreeNodeType.TEXT,

          'cursor-default opacity-70':
            node.type === WikiSidebarTreeNodeType.EXTERNAL_URL && !node.children?.length,
        }"
        @click="handleNodeClick(node)"
      >
        <div class="flex items-start min-w-0 w-full" :class="{ 'gap-2': node.icon }">
          <span v-if="node.icon" class="shrink-0 pt-0.5">{{ node.icon }}</span>

          <span class="wrap-break-word flex-1 min-w-0">{{ node.label }}</span>
        </div>
      </div>
    </template>

    <template #empty> No navigation items available </template>
  </WikiTree>

  <ExternalLinkDialog v-model="url" />
</template>

<style scoped></style>
