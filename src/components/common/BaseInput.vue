<template>
  <div class="relative w-full">
    <input
      v-model="model"
      v-bind="$attrs"
      :type="type"
      :placeholder="placeholder"
      :class="[
        'peer py-2.5 w-full bg-transparent border-t-transparent border-x-transparent border-b-2 disabled:opacity-50 focus:outline-none transition-colors',
        hasError ? 'border-b-red-500' : 'border-b-line-2',
        iconName ? 'ps-8' : 'ps-0',
        inputClass,
      ]"
      @focus="emit('focus', $event)"
      @blur="emit('blur', $event)"
    />

    <div
      v-if="iconName"
      class="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-1 peer-disabled:opacity-50 peer-disabled:pointer-events-none"
    >
      <IconAsyncComponent :name="iconName" :type="iconType" class="size-6" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import IconAsyncComponent, { type HeroIconName } from "./IconAsyncComponent.vue"

defineOptions({
  inheritAttrs: false,
})

interface Props {
  type?: string
  placeholder?: string
  iconName?: HeroIconName
  iconType?: "solid" | "outline"
  inputClass?: string
  hasError?: boolean // <-- Добавили пропс ошибки
}

withDefaults(defineProps<Props>(), {
  type: "text",
  placeholder: "",
  iconType: "solid",
  inputClass: "",
  hasError: false,
})

const emit = defineEmits<{
  (e: "focus", event: FocusEvent): void
  (e: "blur", event: FocusEvent): void
}>()

const model = defineModel<string>({ default: "" })
</script>
