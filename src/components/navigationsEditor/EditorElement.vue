<script setup lang="ts">
import { isNullOrWhitespace } from '@/utils/stringUtils'

const props =  defineProps<{
  icon: string | null
  name: string
}>()

const emit = defineEmits<{
  iconChanged: [icon: string | null]
  nameChanged: [name: string]
  changeUriClicked: []
  removeClicked: []
}>()

const onIconChanged = (event: Event) => emit('iconChanged', event.target.value)
const onNameChanged = (event: Event) => emit('nameChanged', event.target.value)
const onChangeUriClicked = () => emit('changeUriClicked')
const onRemoveClicked = () => emit('removeClicked')

</script>

<template>
  <InputGroup class="p-inputgroup h-2rem">
    <InputGroupAddon class="handle cursor-move">
      <i class="pi pi-arrows-alt"></i>
    </InputGroupAddon>
    <InputText
      v-tooltip="'Icon'"
      :value="icon"
      class="w-3rem flex-none"
      maxlength="128"
      @change="onIconChanged($event)"
    />
    <InputText
      v-tooltip="'Name'"
      :value="name"
      maxlength="128"
      :invalid="isNullOrWhitespace(name)"
      @change="onNameChanged($event)"
    />
    <Button
      v-tooltip="'Edit Uri'"
      class="border-200"
      icon="pi pi-link"
      severity="secondary"
      aria-label="Edit Uri"
      outlined
      @click="onChangeUriClicked"
    />
    <Button
      v-tooltip="'Remove'"
      class="border-200"
      icon="pi pi-trash"
      severity="secondary"
      aria-label="Remove"
      outlined
      @click="onRemoveClicked"
    />
  </InputGroup>
</template>

<style scoped>

</style>