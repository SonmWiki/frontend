<script setup lang="ts">
import { type Ref, ref } from "vue"
import { wikiApi } from "@/service/WikiApiService"
import { MapperService } from "@/components/navigation/sidebar/MapperService"
import WikiHeader from "@/components/navigation/WikiHeader.vue"
import WikiFooter from "@/components/navigation/WikiFooter.vue"
import { maxLength, required } from "@vuelidate/validators"
import { useVuelidate } from "@vuelidate/core"
import { useToast } from "@/composables/useToast"
import type { WikiSidebarTreeNode } from "@/components/navigation/sidebar/WikiSidebarTreeNode"
import { AxiosError } from "axios"
import IconAsyncComponent from "@/components/common/IconAsyncComponent.vue"
import WikiTree from "@/components/navigation/WikiTree.vue"
import SidebarLayout from "@/layouts/SidebarLayout.vue"
import BracketButton from "@/components/common/BracketButton.vue"
import BaseInput from "@/components/common/BaseInput.vue"
import BaseDialog from "@/components/common/BaseDialog.vue"

const nodes: Ref<WikiSidebarTreeNode[]> = ref([])
const expandedKeys = ref<Record<string | number, boolean>>({})
const loading = ref(false)

const selectedNode: Ref<WikiSidebarTreeNode | undefined> = ref()

const createDialogCategoryName = ref("")
const isSelectingParent = ref(false)
const deleteDialogVisible = ref(false)

const toast = useToast()

const rules = {
  createDialogCategoryName: { required, maxLength: maxLength(128) },
}

const vuelidate = useVuelidate(rules, {
  createDialogCategoryName: createDialogCategoryName,
})

const loadCategoriesTree = async () => {
  try {
    loading.value = true
    let data = (await wikiApi.api.getCategoriesTree()).data.data
    nodes.value = data.map(MapperService.mapGetCategoriesTreeResponseElementToTreeNode)
    loading.value = false
  } catch (error) {
    console.error(error)
    toast.error("There was an error loading categories")
  }
}

const expandNode = (node: WikiSidebarTreeNode) => {
  if (node.children && node.children.length) {
    expandedKeys.value[node.key] = true
    node.children.forEach((x) => expandNode(x))
  }
}

const expandAll = () => {
  for (let node of nodes.value) {
    expandNode(node)
  }
  expandedKeys.value = { ...expandedKeys.value }
}

const startParentSelection = () => {
  vuelidate.value.createDialogCategoryName.$touch()
  if (vuelidate.value.createDialogCategoryName.$invalid) return
  isSelectingParent.value = true
}

const cancelCreation = () => {
  isSelectingParent.value = false
  createDialogCategoryName.value = ""
  vuelidate.value.createDialogCategoryName.$reset() // Теперь отработает корректно
}

const onNodeClick = (node: WikiSidebarTreeNode) => {
  if (isSelectingParent.value) {
    onCreateConfirm(node)
  }
}

const openDelete = (node: WikiSidebarTreeNode) => {
  selectedNode.value = node
  deleteDialogVisible.value = true
}

const onCreateConfirm = async (parentNode: WikiSidebarTreeNode | undefined = undefined) => {
  try {
    loading.value = true
    await wikiApi.api.createCategory({
      name: createDialogCategoryName.value,
      parentId: parentNode?.key ?? null,
    })
    await loadCategoriesTree()
    cancelCreation()
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.detail != undefined) {
      toast.error(error.response.data.detail, {
        title: "There was an error creating a category",
      })
    }
    console.log(error)
    loading.value = false
  }
}

const onDeleteConfirm = async () => {
  const key = selectedNode.value?.key
  if (!key) return

  try {
    loading.value = true
    await wikiApi.api.deleteCategory(key)
    await loadCategoriesTree()
    deleteDialogVisible.value = false
  } catch (error: unknown) {
    if (error instanceof AxiosError && error.response?.data?.detail != undefined) {
      toast.error(error.response.data.detail, { title: "There was an error deleting a category" })
    }
    console.log(error)
    loading.value = false
  }
}

loadCategoriesTree().then(() => expandAll())
</script>

<template>
  <SidebarLayout>
    <template #header>
      <WikiHeader />
    </template>

    <template #sidebar>
      <WikiTree v-model:expanded-keys="expandedKeys" :nodes="nodes" aria-label="Categories tree">
        <template #default="{ node }">
          <div
            class="flex align-items-center justify-content-between gap-2 py-1 px-1.5 rounded transition-colors w-full min-w-0"
            :class="{
              'hover:bg-layout-sidebar-hover': !isSelectingParent,
              'cursor-pointer bg-blue-900 bg-opacity-20 animate-pulse': isSelectingParent,
            }"
            @click="onNodeClick(node)"
          >
            <div class="flex align-items-center flex-1 min-w-0" :class="{ 'gap-2': node.icon }">
              <span v-if="node.icon" class="shrink-0">{{ node.icon }}</span>

              <span
                class="wrap-break-word flex-1 min-w-0"
                :class="{ 'text-primary': isSelectingParent }"
              >
                {{ node.label }}
              </span>
            </div>

            <div class="flex align-items-center gap-1 shrink-0">
              <button
                type="button"
                class="p-1 rounded hover:bg-gray-700 focus:bg-gray-300 cursor-pointer border-none bg-transparent text-white flex items-center justify-center"
                @click.stop="openDelete(node)"
              >
                <IconAsyncComponent type="outline" name="TrashIcon" class="size-3" />
              </button>
            </div>
          </div>
        </template>

        <template #empty> No categories available </template>
      </WikiTree>
    </template>

    <template #default>
      <div class="p-4 m-4 w-full flex-col gap-1.5">
        <h3 class="m-0 text-xl font-medium text-white">Добавить категорию:</h3>

        <div v-if="!isSelectingParent" style="display: flex; flex-direction: column; gap: 1rem">
          <div style="display: flex; flex-direction: column; gap: 0.5rem">
            <BaseInput
              id="nativeCategoryName"
              v-model="createDialogCategoryName"
              placeholder="Input name..."
              :disabled="loading"
              :has-error="vuelidate.createDialogCategoryName.$error"
              @blur="vuelidate.createDialogCategoryName.$touch()"
            />
          </div>

          <div
            v-if="vuelidate.createDialogCategoryName.$error"
            style="display: flex; flex-direction: column; gap: 0.5rem"
          >
            <span
              v-for="error in vuelidate.createDialogCategoryName.$errors"
              :key="error.$uid"
              class="text-xs bg-red-900 text-red-100 px-2 py-1 rounded w-max"
            >
              {{ error.$message }}
            </span>
          </div>

          <BracketButton
            color="emerald-400"
            class="bg-emerald-950/60"
            :disabled="
              vuelidate.createDialogCategoryName.$invalid ||
              loading ||
              !createDialogCategoryName.trim()
            "
            @click="startParentSelection"
          >
            Добавить
          </BracketButton>
        </div>

        <div v-else style="display: flex; flex-direction: column; gap: 1rem">
          <p class="m-0 text-sm line-height-3 text-gray-300">
            Кликните по нужной категории в дереве слева, чтобы сделать её родительской для
            <span class="text-white font-semibold">"{{ createDialogCategoryName }}"</span>.
          </p>

          <div style="display: flex; flex-direction: column; gap: 0.5rem" class="mt-2">
            <BracketButton
              color="blue-400"
              class="bg-blue-950/60"
              :disabled="loading"
              @click="onCreateConfirm(undefined)"
            >
              Без родителя
            </BracketButton>
            <BracketButton
              color="red-400"
              class="bg-red-950/60"
              :disabled="loading"
              @click="cancelCreation"
            >
              Отменить
            </BracketButton>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <WikiFooter />
    </template>
  </SidebarLayout>

  <BaseDialog v-model="deleteDialogVisible" title="Delete category" @confirm="onDeleteConfirm">
    <template #header />
    <span>Are you sure you want to delete <span class="font-bold">{{ selectedNode?.key }}</span> category?</span>
    <template #footer />
  </BaseDialog>
</template>

<style scoped></style>
