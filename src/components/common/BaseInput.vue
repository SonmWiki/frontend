<script lang="ts" setup>
import IconAsyncComponent, { type HeroIconName } from "./IconAsyncComponent.vue"

interface Props {
  modelValue?: string | number
  type?: string
  placeholder?: string
  disabled?: boolean
  iconName?: HeroIconName
  iconType?: "solid" | "outline"
}

withDefaults(defineProps<Props>(), {
  modelValue: "",
  type: "text",
  placeholder: "",
  disabled: false,
  iconName: undefined,
  iconType: "solid",
})

const emit = defineEmits<{
  "update:modelValue": [value: string]
  input: [event: Event]
  focus: [event: FocusEvent]
}>()

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit("update:modelValue", target.value)
  emit("input", event)
}
</script>

<template>
  <div class="relative">
    <input
      :value="modelValue"
      :type="type"
      :placeholder="placeholder"
      :disabled="disabled"
      class="peer py-2.5 pe-0 w-full bg-transparent border-t-transparent border-b-2 border-x-transparent border-b-line-2 disabled:opacity-50"
      :class="[iconName ? 'ps-8' : 'ps-0']"
      @input="onInput"
      @focus="$emit('focus', $event)"
    />
    <div
      v-if="iconName"
      class="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-1 peer-disabled:opacity-50 peer-disabled:pointer-events-none"
    >
      <IconAsyncComponent :name="iconName" :type="iconType" class="size-6" />
    </div>
  </div>
</template>
