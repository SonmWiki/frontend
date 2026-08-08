<script setup lang="ts">
import { computed } from "vue"
import type { WikiSidebarTreeNode } from "@/components/navigation/sidebar/WikiSidebarTreeNode"

interface WikiSidebarTreeNodeWithDepth extends WikiSidebarTreeNode {
  depth: number
}

const props = defineProps<{
  nodes: WikiSidebarTreeNode[] | undefined
  ariaLabel?: string
}>()

const expandedKeys = defineModel<Record<string | number, boolean>>("expandedKeys", {
  default: () => ({}),
})

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

  processNodes(props.nodes, 0)
  return result
})
</script>

<template>
  <div
    class="w-full pt-2 bg-transparent font-normal text-sm space-y-1"
    role="tree"
    :aria-label="ariaLabel || 'Tree navigation'"
  >
    <div
      v-for="node in flattenedNodes"
      :key="node.key ?? node.label"
    class="flex items-center"
    :style="{ paddingLeft: `calc(var(--spacing) * ${node.depth} * 2)` }"
    >
    <button
      v-if="node.key != null && node.children?.length"
      :aria-expanded="!!expandedKeys[node.key]"
      :aria-controls="`tree-node-${node.key}-children`"
      class="p-1 shrink-0 cursor-s-resize rounded hover:bg-gray-700 focus:bg-gray-300 transition-transform"
      :class="expandedKeys[node.key] ? 'cursor-n-resize rotate-90' : ''"
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

    <div v-else class="w-6 shrink-0"></div>

    <div class="flex-1 min-w-0">
      <slot :node="node" :toggle="() => toggleExpansion(node.key)"></slot>
    </div>
  </div>

  <div v-if="!nodes || nodes.length === 0" class="text-gray-400 py-4 text-center">
    <slot name="empty">No items available</slot>
  </div>
  </div>
</template>