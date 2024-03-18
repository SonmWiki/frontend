<script setup lang="ts">
import { VueDraggable } from 'vue-draggable-plus'
import type { GetNavigationsTreeResponseElement } from '@/api'
import EditorElement from '@/components/navigationsEditor/EditorElement.vue'
import type { SortableEvent } from 'sortablejs'

const model = defineModel<Array<GetNavigationsTreeResponseElement>>()
const emit = defineEmits<{
  elementMoved: [id: number, oldIndex: number, newIndex: number, oldParentId: number | null, newParentId: number | null]
  iconChanged: [id: number, icon: string | null]
  nameChanged: [id: number, name: string]
  changeUriClicked: [id: number, uri: string | null]
  removeClicked: [id: number]
}>()

const onElementMoved = (event: SortableEvent) => {
  emit('elementMoved', event.item.__vnode.key, event.oldIndex, event.newIndex, event.from.parentNode.__vnode.key, event.to.parentNode.__vnode.key)
}

const onIconChanged = (id: number, icon: string | null) => {
  emit('iconChanged', id, icon)
}

const onNameChanged = (id: number, name: string) => {
  emit('nameChanged', id, name)
}

const onChangeUriClicked = (id: number, uri: string | null) => {
  emit('changeUriClicked', id, uri)
}

const onRemoveClicked = (id: number) => {
  emit('removeClicked', id)
}

</script>

<template>
  <VueDraggable
    :model-value="[...model]"
    class="drag-area list-none p-0"
    tag="ul"
    group="g1"
    :animation="150"
    handle=".handle"
    @end="onElementMoved"
  >
    <li v-for="el in modelValue" :key="el.id">
      <EditorElement
        :icon="el.icon"
        :name="el.name"
        @icon-changed="(icon) => onIconChanged(el.id, icon)"
        @name-changed="(name) => onNameChanged(el.id, name)"
        @change-uri-clicked="onChangeUriClicked(el.id, el.uri)"
        @remove-clicked="onRemoveClicked(el.id)"
      />
      <NestedDraggable
        :model-value="el.children"
        class="pt-2 ml-4"
        @element-moved="(...params) => emit('elementMoved', ...params)"
        @icon-changed="(...params) => emit('iconChanged', ...params)"
        @name-changed="(...params) => emit('nameChanged', ...params)"
        @change-uri-clicked="(...params) => emit('changeUriClicked', ...params)"
        @remove-clicked="(...params) => emit('removeClicked', ...params)"
      />
    </li>
  </VueDraggable>
</template>

<style scoped>

</style>