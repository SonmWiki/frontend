<script setup lang="ts">
import {ref, inject} from "vue";
import type {Api} from "@/api";

const nodes = ref(null);
const selectedKey = ref()
const api = inject("api") as Api<any>

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
  <div class="w-full flex justify-content-center flex-column align-items-center text-center">
    <h1>Select category</h1>
    <div class="md:w-30rem md:h-30rem">
      <Tree
          v-model:selectionKeys="selectedKey"
          @nodeSelect="(node) => {$router.push(`/categories/${node.key}`)}"
          :value="nodes"
          :filter="true"
          selectionMode="single"
          filterMode="lenient"
          class="w-full h-full lg:overflow-y-auto max-w-screen"
          :loading="loading"
      >
      </Tree>
    </div>
  </div>
  <Toast/>
</template>

<style scoped>

</style>
