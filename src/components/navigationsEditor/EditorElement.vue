<script setup lang="ts">
import { maxLength, required } from "@vuelidate/validators"
import { useVuelidate } from "@vuelidate/core"
import { onMounted, watch } from "vue"

const props = defineProps<{
  icon: string | null
  name: string
  uri: string | null
}>()

const rules = {
  icon: { maxLength: maxLength(128) },
  name: { required, maxLength: maxLength(128) },
  uri: { maxLength: maxLength(2048) }
}

const vuelidate = useVuelidate(rules, props)

const emit = defineEmits<{
  iconChanged: [icon: string | null]
  nameChanged: [name: string]
  changeUriClicked: []
  removeClicked: []
}>()

const onIconChanged = (event: Event) => emit("iconChanged", (<HTMLInputElement>event.target).value)
const onNameChanged = (event: Event) => emit("nameChanged", (<HTMLInputElement>event.target).value)
const onChangeUriClicked = () => emit("changeUriClicked")
const onRemoveClicked = () => emit("removeClicked")

watch(props, () => {
  vuelidate.value.$touch()
})

onMounted(() => {
  vuelidate.value.$touch()
})

</script>

<template>
  <PrimeInputGroup class="p-inputgroup h-2rem">
    <PrimeInputGroupAddon class="handle cursor-move">
      <i class="pi pi-arrows-alt"></i>
    </PrimeInputGroupAddon>
    <PrimeInputText
      v-tooltip="'Icon'"
      :value="icon"
      :invalid="vuelidate.icon.$error"
      class="w-3rem flex-none"
      maxlength="128"
      @change="onIconChanged($event)"
    />
    <PrimeInputText
      v-tooltip="'Name'"
      :value="name"
      maxlength="128"
      :invalid="vuelidate.name.$error"
      @change="onNameChanged($event)"
    />
    <PrimeButton
      v-tooltip.left="'Edit URI'"
      class="border-200"
      icon="pi pi-link"
      :severity="vuelidate.uri.$error ? 'danger' : 'secondary'"
      aria-label="Edit Uri"
      outlined
      @click="onChangeUriClicked"
    />
    <PrimeButton
      v-tooltip="'Remove'"
      class="border-200"
      icon="pi pi-trash"
      severity="secondary"
      aria-label="Remove"
      outlined
      @click="onRemoveClicked"
    />
  </PrimeInputGroup>
  <PrimeTag v-for="error in vuelidate.$errors" :key="error.$uid" severity="danger">
    {{ error.$property }} : {{ error.$message }}
  </PrimeTag>
</template>

<style scoped>

</style>