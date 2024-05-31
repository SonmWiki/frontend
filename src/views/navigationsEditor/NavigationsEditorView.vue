<script setup lang="ts">
import {
  computed,
  onBeforeMount,
  onMounted,
  ref
} from "vue"
import { wikiApi } from "@/service/WikiApiService"
import type { GetNavigationsTreeResponseElement } from "@/api"
import { MapperService } from "@/service/MapperService"
import WikiSidebarTree from "@/components/navigation/WikiSidebarTree.vue"
import { PrimeIcons } from "primevue/api"
import NavigationsEditorNestedDraggable from "@/components/navigationsEditor/NavigationsEditorNestedDraggable.vue"
import NavigationsEditorUriEditor from "@/components/navigationsEditor/NavigationsEditorUriEditor.vue"
import { useToast } from "primevue/usetoast"
import { NavigationEditorService } from "@/service/NavigationEditorService"
import { InsertNavigationCommand } from "@/commands/navigationsEditor/InsertNavigationCommand"
import { EditIconCommand } from "@/commands/navigationsEditor/EditIconCommand"
import { EditNameCommand } from "@/commands/navigationsEditor/EditNameCommand"
import { MoveNavigationCommand } from "@/commands/navigationsEditor/MoveNavigationCommand"
import { DeleteNavigationCommand } from "@/commands/navigationsEditor/DeleteNavigationCommand"
import { EditUriCommand } from "@/commands/navigationsEditor/EditUriCommand"
import { useVuelidate } from "@vuelidate/core"
import WikiHeader from "@/components/navigation/WikiHeader.vue"
import SidebarLayout from "@/layouts/SidebarLayout.vue"

const navigationsEditorService = new NavigationEditorService()
const navigations = navigationsEditorService.navigations
const loadingNavigations = ref(true)
const undoStack = navigationsEditorService.undoStack
const redoStack = navigationsEditorService.redoStack
const previewNavigation = computed(() => navigations.map(MapperService.mapGetNavigationsTreeResponseElementToTreeNode))
const previewDialogVisible = ref(false)
const uriEditorVisible = ref(false)
const uriEditorUri = ref()
const selectedId = ref(0)
const toast = useToast()
const vuelidate = useVuelidate()

const onIconChanged = (id: number, icon: string | null) => {
  if (icon?.length === 0) icon = null
  navigationsEditorService.performCommand(new EditIconCommand(navigationsEditorService, id, icon))
}

const onNameChanged = (id: number, name: string) => {
  navigationsEditorService.performCommand(new EditNameCommand(navigationsEditorService, id, name))
}

const onChangeUriClicked = (id: number, uri: string | null) => {
  uriEditorUri.value = uri
  selectedId.value = id
  uriEditorVisible.value = true
}

const onUriChanged = (value: string | null) => {
  if (value?.length === 0) value = null
  navigationsEditorService.performCommand(new EditUriCommand(navigationsEditorService, selectedId.value, value))
}

const onElementMoved = (id: number, oldIndex: number, newIndex: number, oldParent: number | null, newParent: number | null) => {
  navigationsEditorService.performCommand(new MoveNavigationCommand(navigationsEditorService, id, oldParent, newParent, oldIndex, newIndex))
}

const onAddNavigationClicked = () => {
  const newNavigation: GetNavigationsTreeResponseElement = {
    id: navigationsEditorService.lastId + 1,
    icon: null,
    uri: null,
    name: "",
    weight: 0,
    children: new Array<GetNavigationsTreeResponseElement>()
  }
  navigationsEditorService.performCommand(new InsertNavigationCommand(navigationsEditorService, newNavigation, null, navigationsEditorService.navigations.length))
}

const onRemoveClicked = (id: number) => {
  navigationsEditorService.performCommand(new DeleteNavigationCommand(navigationsEditorService, id))
}

const onSaveClicked = async () => {
  try {
    await wikiApi.api.updateNavigationsTree({
      data: navigations.map(MapperService.mapGetNavigationsTreeResponseElementToUpdateNavigationsTreeCommandElement)
    })
    toast.add({ severity: "success", summary: "Success", detail: "Navagation tree was saved successfully" })
  } catch (err: any) {
    toast.add({ severity: "error", summary: "An error occured", detail: "Couldn't save the data" })
  }
}

onBeforeMount(async () => {
  const loaded = await navigationsEditorService.setup()
  if (loaded) {
    loadingNavigations.value = false
  } else {
    toast.add({ severity: "error", summary: "An error occured", detail: "Couldn't load navigation" })
  }
})

onMounted(() => {
  document.addEventListener("keydown", (event: KeyboardEvent) => {
    if (event.ctrlKey && event.code === "KeyZ") {
      event.preventDefault()
      navigationsEditorService.undo()
    } else if (event.ctrlKey && event.code === "KeyY") {
      event.preventDefault()
      navigationsEditorService.redo()
    }
  })
})
</script>

<template>
  <SidebarLayout>
    <template #header>
      <WikiHeader :has-sidebar-switch="true" />
    </template>
    <template #sidebar>
      <div class="h-full">
        <b>Preview</b>
        <WikiSidebarTree v-model="previewNavigation" />
      </div>
    </template>
    <template #default>
      <div class="flex w-full justify-content-center">
        <div class="flex flex-column align-items-center w-full">
          <div class="flex justify-content-between w-full">
            <PrimeButtonGroup>
              <PrimeButton
                v-tooltip="'Undo'"
                severity="secondary"
                :icon="PrimeIcons.REPLAY"
                :disabled="loadingNavigations || undoStack.length == 0"
                @click="navigationsEditorService.undo()"
              />
              <PrimeButton
                v-tooltip="'Redo'"
                severity="secondary"
                :icon="PrimeIcons.REFRESH"
                :disabled="loadingNavigations || redoStack.length == 0"
                @click="navigationsEditorService.redo()"
              />
            </PrimeButtonGroup>
            <PrimeButton
              severity="primary"
              label="Save"
              :disabled="loadingNavigations || vuelidate.$errors.length != 0 || undoStack.length == 0"
              :icon="PrimeIcons.SAVE"
              @click="onSaveClicked"
            />
          </div>
          <div class="flex justify-content-between flex-row w-full">
            <div class="flex flex-column flex-1">
              <div v-if="loadingNavigations">
                <PrimeSkeleton
                  v-for="i in 7"
                  :key="i"
                  width="full"
                  height="2rem"
                  class="mt-2"
                />
              </div>
              <NavigationsEditorNestedDraggable
                :model-value="navigations"
                class="flex-1 pt-2"
                @icon-changed="onIconChanged"
                @name-changed="onNameChanged"
                @change-uri-clicked="onChangeUriClicked"
                @element-moved="onElementMoved"
                @remove-clicked="onRemoveClicked"
              />
              <PrimeButton
                severity="secondary"
                class="w-full"
                type="button"
                label="Add navigation"
                icon="pi pi-plus"
                :disabled="loadingNavigations"
                @click="onAddNavigationClicked"
              />
            </div>
          </div>
          <PrimeDialog
            v-model:visible="previewDialogVisible"
            modal
            maximizable
            header="Preview Navigations"
            :position="'top'"
            class="w-full md:w-30rem"
          >
            <WikiSidebarTree v-model="previewNavigation" />
          </PrimeDialog>
          <NavigationsEditorUriEditor
            v-model:uri="uriEditorUri"
            v-model:visible="uriEditorVisible"
            @update:uri="onUriChanged"
          />
        </div>
      </div>
    </template>
  </SidebarLayout>
  <PrimeToast />
</template>

<style scoped>

</style>