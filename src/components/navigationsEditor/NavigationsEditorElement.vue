<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import type { GetNavigationsTreeResponseElement } from '@/api'
import debounce from 'lodash.debounce'
import { isNullOrWhitespace } from '@/utils/stringUtils'

const model = defineModel<Array<GetNavigationsTreeResponseElement>>()
const emit = defineEmits<{
  elementMoved: [id: number, oldIndex: number, newIndex: number, oldParentId: number | null, newParentId: number | null]
  iconChanged: [id: number, newIcon: string | null, oldIcon: string | null]
  nameChanged: [id: number, newName: string, oldName: string]
  changeLinkClicked: [id: number, link: string | null]
  removeClicked: [id: number]
}>()

const onElementMoved = (event: SortableEvent) => {
  emit('elementMoved', event.item.__vnode.key, event.oldIndex, event.newIndex, event.from.parentNode.__vnode.key, event.to.parentNode.__vnode.key)
}

const onIconInput = debounce(function(event, el) {
    emit('iconChanged', el.id, event.target.value, el.icon)
  }, 500
)

const onNameInput = debounce(function(event, el) {
    emit('nameChanged', el.id, event.target.value, el.name)
  }, 500
)

const onChangeLinkClicked = (id: number) => {
  emit('removeClicked', id)
}

const onRemoveClicked = (id: number) => {
  emit('removeClicked', id)
}

</script>

<template>
  <VueDraggable
    v-model="model"
    class="drag-area list-none p-0"
    tag="ul"
    group="g1"
    :animation="150"
    handle=".handle"
    @end='onElementMoved'
  >
    <li v-for="el in modelValue" :key="el.id">
      <InputGroup class="p-inputgroup h-2rem">
        <InputGroupAddon class="handle cursor-move">
          <i class="pi pi-arrows-alt"></i>
        </InputGroupAddon>
        <InputText
          v-tooltip="'Icon'"
          :value="el.icon"
          class="w-3rem flex-none"
          maxlength="128"
          @input="onIconInput($event, el)"
        />
        <InputText
          v-tooltip="'Name'"
          :value="el.name"
          maxlength="128"
          :invalid="isNullOrWhitespace(el.name)"
          @input="onNameInput($event, el)"
        />
        <Button
          v-tooltip="'Edit link'"
          class="border-200"
          icon="pi pi-link"
          severity="secondary"
          aria-label="Edit link"
          outlined
          @click="onChangeLinkClicked(el.id)"
        />
        <Button
          v-tooltip="'Remove'"
          class="border-200"
          icon="pi pi-trash"
          severity="secondary"
          aria-label="Remove"
          outlined
          @click="onRemoveClicked(el.id)"
        />
      </InputGroup>
      <NavigationsEditorElement
        v-model="el.children"
        class="pt-2 ml-4"
        @element-moved="(...params) => emit('elementMoved', ...params)"
        @icon-changed="(...params) => emit('iconChanged', ...params)"
        @name-changed="(...params) => emit('nameChanged', ...params)"
        @change-link-clicked="(...params) => emit('changeLinkClicked', ...params)"
        @remove-clicked="(...params) => emit('removeClicked', ...params)"
      />
    </li>
  </VueDraggable>
</template>

<style scoped>

</style>