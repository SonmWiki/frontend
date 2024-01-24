<script setup lang="ts">

import {inject, ref} from "vue";
import {Api} from "@/api";
import router from "@/router";
import {useConfirm} from "primevue/useconfirm";
import ExternalLinkDialog from "@/components/ExternalLinkDialog.vue";

const expandedKeys = ref({})
const navigation = ref()

const api = inject("api") as Api<any>
const confirm = useConfirm();

const loadNavigation = async () => {
  let nav = (await api.api.getNavigationsTree()).data.data
  console.log(nav)

  navigation.value = JSON.parse(JSON.stringify(nav), function (k, v) {
    if (k == "uri") {
      if (v == null) {
        if (this.children.length > 0) this.type = "text"

        else {
          this.selectable = false;
          this.type = "header"
        }
      }
      else if (v.match(`^https?://`)) this.type = "ext"
      else this.type = "int"
    }

    if (k === "name")
      this.label = v;
    else if (k === "id")
      this.key = v;
    else
      return v;
  });

  console.log(navigation.value)
}

const onNodeSelect = (node: any) => {
  const v = node.uri
  const key: string = node.key
  const expandedKey: boolean = (expandedKeys as any).value[key]

  if (node.type == "ext") showDialog(v)

  else if (node.type == "int") router.push(v)

  if (node.children && node.children.length) {
    (expandedKeys as any).value[key]  = !expandedKey
  }
};

const showDialog = (v: string) => {
  let shownLink = v.substring(0, 36)
  if (v.length > 36) shownLink += ".."

  confirm.require({
    message: `${shownLink}`,
    header: 'External link will be opened',
    accept: () => {
      window.open(v, '_blank')
      confirm.close()
    },
    reject: () => {
      confirm.close()
    }
  });
}

loadNavigation()
</script>

<template>
  <div class="w-full h-full">
    <ScrollPanel
        style="width: 100%; height: 100%"
        :pt="{
        wrapper: {
            style: 'border-right: 10px solid var(--surface-50);'
        },
        bary: 'surface-300 opacity-100 border-round'
    }"
    >
      <Tree
          :value="navigation"
          class="$style.p-treenode w-full p-0"
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
    </ScrollPanel>
  </div>
  <ExternalLinkDialog />
</template>

<style scoped>


</style>