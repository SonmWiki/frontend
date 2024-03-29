<script setup lang="ts">
import {
  computed,
  onBeforeMount,
  onMounted,
  ref
} from 'vue'
import { api } from '@/api/api'
import type { GetNavigationsTreeResponseElement } from '@/api'
import { MapperService } from '@/service/MapperService'
import SidebarTree from '@/components/sidebar/SidebarTree.vue'
import { PrimeIcons } from 'primevue/api'
import NestedDraggable from '@/components/navigationsEditor/NestedDraggable.vue'
import UriEditor from '@/components/navigationsEditor/UriEditor.vue'
import { useToast } from 'primevue/usetoast'
import { NavigationEditorService } from '@/service/NavigationEditorService'
import { InsertNavigationCommand } from '@/commands/navigationsEditor/InsertNavigationCommand'
import { EditIconCommand } from '@/commands/navigationsEditor/EditIconCommand'
import { EditNameCommand } from '@/commands/navigationsEditor/EditNameCommand'
import { MoveNavigationCommand } from '@/commands/navigationsEditor/MoveNavigationCommand'
import { DeleteNavigationCommand } from '@/commands/navigationsEditor/DeleteNavigationCommand'
import { EditUriCommand } from '@/commands/navigationsEditor/EditUriCommand'
import { useVuelidate } from '@vuelidate/core'

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
    name: '',
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
    await api().api.updateNavigationsTree({
      data: navigations.map(MapperService.mapGetNavigationsTreeResponseElementToUpdateNavigationsTreeCommandElement)
    })
    toast.add({ severity: 'success', summary: 'Success', detail: 'Navagation tree was saved successfully' })
  } catch (err: any) {
    toast.add({ severity: 'error', summary: 'An error occured', detail: 'Couldn\'t save the data' })
  }
}

onBeforeMount(async () => {
  const loaded = await navigationsEditorService.setup()
  if(loaded){
    loadingNavigations.value = false
  }else {
    toast.add({ severity: 'error', summary: 'An error occured', detail: 'Couldn\'t load navigation' })
  }
})

onMounted(() => {
  document.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.ctrlKey && event.code === 'KeyZ') {
      event.preventDefault()
      navigationsEditorService.undo()
    } else if (event.ctrlKey && event.code === 'KeyY') {
      event.preventDefault()
      navigationsEditorService.redo()
    }
  })
})
</script>

<template>
  <div class="flex w-full justify-content-center">
    <div
      class="flex flex-column align-items-center p-2 md:p-4 w-full"
      style="max-width: 1900px; min-height: calc(100vh - 80px)"
    >
      <div class="w-full flex flex-column align-items-center">
        <h1>Navigation editor</h1>
      </div>
      <div class="flex justify-content-between w-full">
        <div>
          <ButtonGroup>
            <Button
              v-tooltip="'Undo'"
              severity="secondary"
              :icon="PrimeIcons.REPLAY"
              :disabled="loadingNavigations || undoStack.length == 0"
              @click="navigationsEditorService.undo()"
            />
            <Button
              v-tooltip="'Redo'"
              severity="secondary"
              :icon="PrimeIcons.REFRESH"
              :disabled="loadingNavigations || redoStack.length == 0"
              @click="navigationsEditorService.redo()"
            />
          </ButtonGroup>
        </div>
        <div>
          <Button
            label="Preview"
            severity="secondary"
            class="md:hidden"
            :icon="PrimeIcons.LIST"
            @click="previewDialogVisible = true"
          />
        </div>
        <div>
          <Button
            severity="primary"
            label="Save"
            :disabled="loadingNavigations || vuelidate.$errors.length != 0 || undoStack.length == 0"
            :icon="PrimeIcons.SAVE"
            @click="onSaveClicked"
          />
        </div>
      </div>
      <div class="flex justify-content-between flex-row w-full">
        <div class="flex flex-column flex-1">
          <div v-if="loadingNavigations">
            <Skeleton
              v-for="i in 7"
              :key="i"
              width="full"
              height="2rem"
              class="mt-2"
            />
          </div>
          <NestedDraggable
            :model-value="navigations"
            class="flex-1 pt-2"
            @icon-changed="onIconChanged"
            @name-changed="onNameChanged"
            @change-uri-clicked="onChangeUriClicked"
            @element-moved="onElementMoved"
            @remove-clicked="onRemoveClicked"
          />
          <Button
            severity="secondary"
            class="w-full"
            type="button"
            label="Add navigation"
            icon="pi pi-plus"
            :disabled="loadingNavigations"
            @click="onAddNavigationClicked"
          />
        </div>
        <div class="flex-1 hidden md:flex">
          <SidebarTree v-model="previewNavigation" />
        </div>
      </div>
      <Dialog
        v-model:visible="previewDialogVisible"
        modal
        maximizable
        header="Preview Navigations"
        :position="'top'"
        class="w-full md:w-30rem"
      >
        <SidebarTree v-model="previewNavigation" />
      </Dialog>
      <UriEditor
        v-model:uri="uriEditorUri"
        v-model:visible="uriEditorVisible"
        @update:uri="onUriChanged"
      />
    </div>
  </div>
  <Toast />
</template>

<style scoped>

</style>