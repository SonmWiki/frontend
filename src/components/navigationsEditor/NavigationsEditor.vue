<script setup lang="ts">
import { computed, onBeforeMount, onMounted, ref } from 'vue'
import { api } from '@/api/api'
import type { GetNavigationsTreeResponseElement, UpdateNavigationsTreeCommandElement } from '@/api'
import { MapperService } from '@/service/MapperService'
import SidebarTree from '@/components/sidebar/SidebarTree.vue'
import useTreeEditorStore from '@/stores/NavigationsEditorStore'
import { storeToRefs } from 'pinia'
import { PrimeIcons } from 'primevue/api'
import NestedComponent from '@/components/navigationsEditor/NavigationsEditorElement.vue'
import LinkEditorComponent from '@/components/navigationsEditor/NavigationLinkEditor.vue'
import { useToast } from 'primevue/usetoast'

const store = useTreeEditorStore()
const { navigations, lastId } = storeToRefs(store)
const previewNavigation = computed(() => {
  return navigations.value.map(MapperService.mapGetNavigationsTreeResponseElementToTreeNode)
})
const linkEditorVisible = ref(false)
const selectedId = ref(0)
const link = ref()
const toast = useToast()

async function loadNavigations() {
  try {
    return (await api().api.getNavigationsTree()).data.data
  } catch (error) {
    console.log(error)
    return new Array<GetNavigationsTreeResponseElement>()
  }
}

const addNavigation = () => {
  let newNavigation: GetNavigationsTreeResponseElement = {
    id: ++lastId.value,
    icon: null,
    uri: null,
    name: '',
    weight: 0,
    children: new Array<GetNavigationsTreeResponseElement>()
  }
  store.addElement(null, navigations.value.length, newNavigation)
}

const onIconChanged = (id: number, icon: string | null) => {
  if (icon?.length === 0) icon = null
  store.editIcon(id, icon)
}

const onNameChanged = (id: number, newName: string) => {
  store.editName(id, newName)
}

const onChangeLinkClicked = (id: number, selectedLink: string | null) => {
  link.value = selectedLink
  selectedId.value = id
  linkEditorVisible.value = true
}

const onLinkChanged = (value: string | null) => {
  if (value?.length === 0) value = null
  store.editLink(selectedId.value, value)
}

const onElementMoved = (id: number, oldIndex: number, newIndex: number, oldParent: number | null, newParent: number | null) => {
  store.moveElement(id, oldIndex, newIndex, oldParent, newParent)
}

const onRemoveClicked = (id: number) => {
  store.removeElement(id)
}

const onSaveClicked = async () => {
  try {
    await api().api.updateNavigationsTree({
      data: store.navigations
        .map(MapperService.mapGetNavigationsTreeResponseElementToUpdateNavigationsTreeCommandElement)
    })
    toast.add({ severity: 'success', summary: 'Success', detail: 'Navagation tree was saved successfully' })
  } catch (err: any) {
    toast.add({ severity: 'error', summary: 'An error occured', detail: 'Couldn\'t save the data' })
  }
}

onBeforeMount(async () => {
  navigations.value = await loadNavigations()
  store.clearHistory()
  const findLastId = (arr: Array<GetNavigationsTreeResponseElement>) => {
    arr.forEach(element => {
      lastId.value = Math.max(element.id, lastId.value)
      findLastId(element.children)
    })
  }
  findLastId(navigations.value)
})

onMounted(() => {
  document.addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.ctrlKey && event.code === 'KeyZ') {
      event.preventDefault()
      store.undo()
    } else if (event.ctrlKey && event.code === 'KeyY') {
      event.preventDefault()
      store.redo()
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
              :disabled="store.undoStack.length == 0"
              @click="store.undo()"
            />
            <Button
              v-tooltip="'Redo'"
              severity="secondary"
              :icon="PrimeIcons.REFRESH"
              :disabled="store.redoStack.length == 0"
              @click="store.redo()"
            />
          </ButtonGroup>
        </div>
        <div>
          <Button
            severity="primary"
            label="Save"
            :icon="PrimeIcons.SAVE"
            @click="onSaveClicked"
          />
        </div>
      </div>
      <div class="flex justify-content-between flex-wrap w-full">
        <div class="flex-1">
          <NestedComponent
            v-model="navigations"
            class="flex-1"
            @icon-changed="onIconChanged"
            @name-changed="onNameChanged"
            @change-link-clicked="onChangeLinkClicked"
            @element-moved="onElementMoved"
            @remove-clicked="onRemoveClicked"
          />
          <Button
            severity="secondary"
            class="w-full"
            type="button"
            label="Add navigation"
            icon="pi pi-plus"
            @click="addNavigation"
          />
        </div>
        <div class="flex-1">
          <SidebarTree v-model="previewNavigation" />
        </div>
      </div>
      <LinkEditorComponent
        v-model:link="link"
        v-model:visible="linkEditorVisible"
        @update:link="onLinkChanged"
      />
    </div>
  </div>
  <Toast />
</template>

<style scoped>

</style>