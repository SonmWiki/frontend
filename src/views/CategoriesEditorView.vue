<script setup lang="ts">

import { computed, type Ref, ref, watch } from "vue"
import type { TreeNode } from "primevue/treenode"
import { wikiApi } from "@/service/WikiApiService"
import { MapperService } from "@/service/MapperService"
import BaseLayout from "@/layouts/BaseLayout.vue"
import WikiHeader from "@/components/navigation/WikiHeader.vue"
import WikiFooter from "@/components/navigation/WikiFooter.vue"
import type { TreeExpandedKeys } from "primevue/tree"
import { PrimeIcons } from "primevue/api"
import { AppConstants } from "@/constants/AppConstants"
import { maxLength, required, sameAs } from "@vuelidate/validators"
import { useVuelidate } from "@vuelidate/core"
import { useToast } from "primevue/usetoast"

const categoriesTree: Ref<TreeNode[]> = ref([])
const categories = computed(() => {
  let stack: TreeNode[] = []
  const flattenedTree: TreeNode[] = []
  categoriesTree.value
  stack.push(...categoriesTree.value)

  while (stack.length !== 0) {
    const node = stack.pop()
    flattenedTree.push(node)
    if (node.children) {
      node.children.forEach(x => stack.push(x))
    }
  }
  return flattenedTree.sort()
})
const loading = ref(false)
const expandedKeys: Ref<TreeExpandedKeys> = ref({})

const selectedParentNode: Ref<TreeNode | undefined> = ref()
const selectedNode: Ref<TreeNode | undefined> = ref()

const createDialogVisible = ref(false)
const createDialogCategoryName = ref("")

const editDialogVisible = ref(false)
const editDialogCategoryName = ref("")

const deleteDialogVisible = ref(false)


const toast = useToast()

const rules = {
  createDialogCategoryName: { required, maxLength: maxLength(128) },
  editDialogCategoryName: { required, maxLength: maxLength(128) }
}

const vuelidate = useVuelidate(rules, {
  createDialogCategoryName: createDialogCategoryName,
  editDialogCategoryName: editDialogCategoryName
})

const loadCategoriesTree = async () => {
  try {
    loading.value = true
    let data = (await wikiApi.api.getCategoriesTree()).data.data
    categoriesTree.value = data.map(MapperService.mapGetCategoriesTreeResponseElementToTreeNode)
    loading.value = false
  } catch (error) {
    console.error(error)
    toast.add({ severity: "error", summary: "There was an error loading categories" })
  }
}
const expandNode = (node: TreeNode) => {
  if (node.children && node.children.length) {
    expandedKeys.value[node.key] = true

    node.children.forEach(x => expandNode(x))
  }
}

const expandAll = () => {
  for (let node of categoriesTree.value) {
    expandNode(node)
  }

  expandedKeys.value = { ...expandedKeys.value }
}

const openCreate = (parentNode: TreeNode | undefined = undefined) => {
  selectedParentNode.value = parentNode
  createDialogVisible.value = true
}

const openEdit = (node: TreeNode, parentNode: TreeNode | undefined) => {
  selectedNode.value = node
  editDialogCategoryName.value = node.label
  selectedParentNode.value = parentNode
  editDialogVisible.value = true
}

const openDelete = (node: TreeNode) => {
  selectedNode.value = node
  deleteDialogVisible.value = true
}

const onCreateConfirm = async () => {
  try {
    loading.value = true
    await wikiApi.api.createCategory({ name: createDialogCategoryName.value, parentId: selectedParentNode.value?.key })
    await loadCategoriesTree()
    createDialogVisible.value = false
  } catch (error) {
    if (error.isAxiosError) {
      if (error.response?.data?.detail != undefined) {
        toast.add({
          severity: "error",
          summary: "There was an error creating a category",
          detail: error.response.data.detail
        })
      }
    }
    console.log(error)
    loading.value = false
  }
}

const onEditConfirm = async () => {
  try {
    loading.value = true
    await wikiApi.api.updateCategory(selectedNode.value?.key, {
      name: editDialogCategoryName.value,
      parentId: selectedParentNode.value?.key
    })
    await loadCategoriesTree()
    editDialogVisible.value = false
  } catch (error) {
    if (error.isAxiosError) {
      if (error.response?.data?.detail != undefined) {
        toast.add({
          severity: "error",
          summary: "There was an error editing a category",
          detail: error.response.data.detail
        })
      }
    }
    console.log(error)
    loading.value = false
  }
}

const onDeleteConfirm = async () => {
  try {
    loading.value = true
    await wikiApi.api.deleteCategory(selectedNode.value?.key)
    await loadCategoriesTree()
    deleteDialogVisible.value = false
  } catch (error) {
    if (error.isAxiosError) {
      if (error.response?.data?.detail != undefined) {
        toast.add({
          severity: "error",
          summary: "There was an error deleting a category",
          detail: error.response.data.detail
        })
      }
    }
    console.log(error)
    loading.value = false
  }
}

watch(createDialogCategoryName, () => {
  vuelidate.value.createDialogCategoryName.$touch()
})

loadCategoriesTree().then(() => expandAll())
</script>

<template>
  <BaseLayout>
    <template #header>
      <WikiHeader />
    </template>
    <template #default>
      <div class="container flex flex-column w-full">
        <PrimeTree
          v-model:expandedKeys="expandedKeys"
          :value="categoriesTree"
        >
          <template #default="slotProps">
            <div class="flex align-items-center" :class="{'gap-2': slotProps.node.icon }">
              <span>{{ slotProps.node.icon }}</span>
              <span>{{ slotProps.node.label }}</span>
              <PrimeButton
                severity="secondary"
                rounded
                class="h-2rem w-2rem ml-1"
                text
                :icon="PrimeIcons.PLUS"
                @click="openCreate(slotProps.node)"
              />
              <PrimeButton
                severity="secondary"
                rounded
                class="h-2rem w-2rem ml-1"
                text
                :icon="PrimeIcons.PENCIL"
                @click="openEdit(slotProps.node, categoriesTree.find(x=>x.children?.includes(slotProps.node)))"
              />
              <PrimeButton
                severity="secondary"
                rounded
                class="h-2rem w-2rem"
                text
                :icon="PrimeIcons.TRASH"
                @click="openDelete(slotProps.node)"
              />
            </div>
          </template>
        </PrimeTree>
        <PrimeButton
          severity="secondary"
          class="w-full"
          type="button"
          label="Add category"
          icon="pi pi-plus"
          :disabled="loading"
          @click="openCreate()"
        />
      </div>
    </template>
    <template #footer>
      <WikiFooter />
    </template>
  </BaseLayout>

  <PrimeDialog
    v-model:visible="createDialogVisible"
    modal
    header="Create category"
    :position="'top'"
    class="w-full md:w-30rem"
    :breakpoints="AppConstants.dialogBreakpoints"
    :closable="!loading"
  >
    <div v-if="selectedParentNode">
      Parent category: <b> {{ selectedParentNode.label }} </b>
    </div>
    <PrimeFloatLabel class="mt-5">
      <PrimeInputText
        id="createDialogCategoryName"
        v-model="createDialogCategoryName"
        class="w-full"
        :invalid="vuelidate.createDialogCategoryName.$error"
        :disabled="loading"
      />
      <label for="createDialogCategoryName">Name</label>
    </PrimeFloatLabel>
    <PrimeTag v-for="error in vuelidate.createDialogCategoryName.$errors" :key="error.$uid" severity="danger">
      {{ error.$message }}
    </PrimeTag>
    <div class="flex justify-content-end gap-2 w-full mt-2">
      <PrimeButton
        type="button"
        label="Cancel"
        severity="secondary"
        :disabled="loading"
      />
      <PrimeButton
        type="button"
        label="Confirm"
        :disabled="vuelidate.createDialogCategoryName.$error || loading"
        @click="onCreateConfirm"
      />
    </div>
  </PrimeDialog>

  <PrimeDialog
    v-model:visible="editDialogVisible"
    modal
    header="Edit category"
    :position="'top'"
    class="w-full md:w-30rem"
    :breakpoints="AppConstants.dialogBreakpoints"
    :closable="!loading"
  >
    <PrimeFloatLabel class="mt-5">
      <PrimeDropdown
        id="editCategoryDropdown"
        v-model="selectedParentNode"
        option-label="label"
        :options="categories"
        class="w-full"
        :disabled="loading"
      />
      <label for="editCategoryDropdown">Parent category</label>
    </PrimeFloatLabel>
    <PrimeFloatLabel class="mt-5">
      <PrimeInputText
        id="editDialogCategoryName"
        v-model="editDialogCategoryName"
        class="w-full"
        :invalid="vuelidate.editDialogCategoryName.$error"
        :disabled="loading"
      />
      <label for="editDialogCategoryName">Name</label>
    </PrimeFloatLabel>
    <PrimeTag v-for="error in vuelidate.editDialogCategoryName.$errors" :key="error.$uid" severity="danger">
      {{ error.$message }}
    </PrimeTag>
    <div class="flex justify-content-end gap-2 w-full mt-2">
      <PrimeButton
        type="button"
        label="Cancel"
        severity="secondary"
        :disabled="loading"
      />
      <PrimeButton
        type="button"
        label="Confirm"
        :disabled="vuelidate.editDialogCategoryName.$error || loading"
        @click="onEditConfirm"
      />
    </div>
  </PrimeDialog>

  <PrimeDialog
    v-model:visible="deleteDialogVisible"
    modal
    header="Delete category"
    :position="'top'"
    class="w-full md:w-30rem"
    :breakpoints="AppConstants.dialogBreakpoints"
    :closable="!loading"
  >
    Are you sure that you want to delete category: <b> {{ selectedNode?.label }} </b>?
    This action cannot be undone!
    <div class="flex justify-content-end gap-2 w-full mt-2">
      <PrimeButton
        type="button"
        label="Cancel"
        severity="secondary"
        :disabled="loading"
      />
      <PrimeButton
        type="button"
        severity="danger"
        label="Confirm"
        @click="onDeleteConfirm"
      />
    </div>
  </PrimeDialog>
  <PrimeToast />
</template>

<style scoped>
.container {
  height: calc(100vh - 3rem);
}
</style>