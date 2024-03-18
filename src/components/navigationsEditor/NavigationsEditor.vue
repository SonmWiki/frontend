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
const undoStack = navigationsEditorService.undoStack
const redoStack = navigationsEditorService.redoStack
const previewNavigation = computed(() => navigations.map(MapperService.mapGetNavigationsTreeResponseElementToTreeNode))
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
  await navigationsEditorService.setup()
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
    <div class="flex flex-column align-items-center p-2 md:p-4 w-full"
         style="max-width: 1900px; min-height: calc(100vh - 80px)">
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
              :disabled="undoStack.length == 0"
              @click="navigationsEditorService.undo()"
            />
            <Button
              v-tooltip="'Redo'"
              severity="secondary"
              :icon="PrimeIcons.REFRESH"
              :disabled="redoStack.length == 0"
              @click="navigationsEditorService.redo()"
            />
          </ButtonGroup>
        </div>
        <div>
          <Button
            severity="primary"
            label="Save"
            :disabled="vuelidate.$error || undoStack.length == 0"
            :icon="PrimeIcons.SAVE"
            @click="onSaveClicked"
          />
        </div>
      </div>
      <div class="flex justify-content-between flex-wrap w-full">
        <div class="flex-1">
          <NestedDraggable
            :model-value="navigations"
            class="flex-1"
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
            @click="onAddNavigationClicked"
          />
        </div>
        <div class="flex-1">
          <SidebarTree v-model="previewNavigation" />
        </div>
      </div>
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