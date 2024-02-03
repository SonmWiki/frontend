<script setup lang="ts">

import {type Ref, ref} from "vue";
import router from "@/router";
import ExternalLinkDialog from "@/components/ExternalLinkDialog.vue";
import {api} from "@/api/api";
import type {TreeExpandedKeys} from "primevue/tree";
import type {TreeNode} from "primevue/treenode";

const expandedKeys: Ref<TreeExpandedKeys> = ref({})
const navigation = ref()
const url = ref("")

const loadNavigation = async () => {
  try {
    let nav = (await api().api.getNavigationsTree()).data.data

    navigation.value = JSON.parse(JSON.stringify(nav), function (k, v) {
      if (k == "uri") {
        if (v == null) {
          if (this.children.length > 0) this.type = "text"

          else {
            this.selectable = false;
            this.type = "header"
          }
        } else if (v.match(`^https?://`)) this.type = "ext"
        else this.type = "int"
      }

      if (k === "name")
        this.label = v;
      else if (k === "id")
        this.key = v;
      else
        return v;
    });
  } catch (error) {
    console.log(error)
  }
}

const onNodeSelect = (node: TreeNode) => {
  const v = node.uri
  const key = node.key

  if (node.type == "ext") url.value = v
  else if (node.type == "int") router.push(v)

  if (key != undefined && node.children && node.children.length) {
      const expandedKey: boolean = expandedKeys.value[key]
      expandedKeys.value[key] = !expandedKey
  }
};

loadNavigation()
</script>

<template>
  <Tree
      :value="navigation"
      class="w-full p-2"
      style="background: transparent; border: 0; font-size: 0.9em; font-weight: 400"
      v-model:expandedKeys="expandedKeys"
      selectionMode="single"
      @nodeSelect="onNodeSelect"
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
  <ExternalLinkDialog v-model:url="url" />
</template>

<style scoped>


</style>