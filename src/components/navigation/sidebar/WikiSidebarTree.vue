<script setup lang="ts">
import router from "@/router"
import { computed, ref } from "vue"
import ExternalLinkDialog from "@/components/ExternalLinkDialog.vue"
import {
  type WikiSidebarTreeNode,
  WikiSidebarTreeNodeType,
} from "@/components/navigation/sidebar/WikiSidebarTreeNode"

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

const toggleExpansion = (key: string | number) => {
  if (key != null) {
    expandedKeys.value[key] = !expandedKeys.value[key]
  }
}

const flattenedNodes = computed<WikiSidebarTreeNodeWithDepth[]>(() => {
  const result: WikiSidebarTreeNodeWithDepth[] = []

  const processNodes = (nodesList: WikiSidebarTreeNode[] | undefined, depth: number) => {
    nodesList?.forEach((node) => {
      result.push({ ...node, depth })

      if (node.key != null && node.children?.length && expandedKeys.value[node.key] === true) {
        processNodes(node.children, depth + 1)
      }
    })
  }

  processNodes(nodes.value, 0)
  return result
})

interface WikiSidebarTreeNodeWithDepth extends WikiSidebarTreeNode {
  depth: number
}
</script>

<template>
  <div
    class="w-full pt-2 bg-transparent font-normal text-sm space-y-1"
    role="tree"
    aria-label="Navigation tree"
  >
    <div
      v-for="node in flattenedNodes"
      :key="node.key ?? node.label"
      class="flex items-center"
      :style="{ paddingLeft: `calc(var(--spacing) * ${node.depth}*6)` }"
    >
      <button
        v-if="node.key != null && node.children?.length"
        :aria-expanded="!!expandedKeys[node.key]"
        :aria-controls="`tree-node-${node.key}-children`"
        class="p-1 rounded hover:bg-gray-700 focus:bg-gray-300 transition-transform"
        :class="expandedKeys[node.key] ? 'rotate-90' : ''"
        type="button"
        @click.stop="toggleExpansion(node.key)"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-4 h-4 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <div v-else class="w-6"></div>

      <div
        class="flex-1 py-1 px-1.5 rounded transition-colors"
        :class="{
          'cursor-pointer hover:bg-gray-700/50':
            node.type === WikiSidebarTreeNodeType.EXTERNAL_URL ||
            node.type === WikiSidebarTreeNodeType.INTERNAL_URL ||
            (node.key != null && node.children?.length),

          'font-semibold ': node.type === WikiSidebarTreeNodeType.HEADER || node.type === WikiSidebarTreeNodeType.TEXT,

          'cursor-default opacity-70': node.type === WikiSidebarTreeNodeType.EXTERNAL_URL && !node.children?.length,
        }"
        @click="handleNodeClick(node)"
      >
        <div class="flex items-center" :class="{ 'gap-2': node.icon }">
          <span v-if="node.icon" class="flex-shrink-0">{{node.icon}}</span>
          <span class="break-words">{{ node.label }}</span>
        </div>
      </div>
    </div>

    <div
      v-if="!nodes || nodes.length === 0"
      class="text-gray-400 py-4 text-center"
    >
      No navigation items available
    </div>
  </div>

  <ExternalLinkDialog v-model="url" />
</template>

<style scoped></style>
