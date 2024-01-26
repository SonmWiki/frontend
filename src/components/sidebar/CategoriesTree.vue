<script setup lang="ts">

import {inject, ref} from "vue";
import type {Api} from "@/api";
import {type TreeNode} from "primevue/treenode";
import {useRouter} from "vue-router";

const nodes = ref([]);
const api = inject("api") as Api<any>
const router = useRouter()

const loading = ref(true);
const requestTree = async () => {
  loading.value = true
  let tree = (await api.api.getCategoriesTree()).data.data

  if (tree == undefined) return

  nodes.value = JSON.parse(JSON.stringify(tree), function (k, v) {
    if (k === "id")
      this.key = v;
    else if (k === "name")
      this.label = v;
    else
      return v;
  });
  loading.value = false
}

requestTree()
</script>

<template>
  <Tree
      :value="nodes"
      class="$style.p-treenode w-full p-2"
      style="background: transparent; border: 0; font-size: 0.9em; font-weight: 400"
      selectionMode="single"
      @nodeSelect="(node: TreeNode) => {router.push(`/categories/${node.key}`)}"
      :pt="{
            toggler: {
              style: 'margin: 0'
            },
            content: {
              style: 'padding: 0;'
            }
          }"
  >
    <template #default="slotProps">
      <div class="flex align-items-center" :class="{'gap-2': slotProps.node.icon}">
        <span>{{ slotProps.node.icon }}</span>
        <span>{{ slotProps.node.label }}</span>
      </div>
    </template>
    <template #header="slotProps">
      <div class="flex align-items-center font-bold uppercase" :class="{'gap-2': slotProps.node.icon}">
        <span>{{ slotProps.node.icon }}</span>
        <span>{{ slotProps.node.label }}</span>
      </div>
    </template>
  </Tree>
</template>

<style scoped>


</style>