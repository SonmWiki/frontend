<script setup lang="ts">
import { watch, onUnmounted } from "vue"
import IconAsyncComponent from "@/components/common/IconAsyncComponent.vue"

interface Props {
  title?: string
  modelValue: boolean
  showClose?: boolean
  closeOnOverlay?: boolean
  dialogClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: undefined,
  dialogClass: "w-[95vw] md:w-[75vw] lg:w-[48rem]",
  showClose: true,
  closeOnOverlay: true,
})

const slots = defineSlots<{
  header?: (props: { title?: string }) => any
  default?: (props: {}) => any
  footer?: (props: { confirm: () => void; cancel: () => void }) => any
}>()

const emit = defineEmits<{
  (e: "update:modelValue", val: boolean): void
  (e: "close"): void
  (e: "confirm"): void
}>()

const closeModal = () => {
  emit("update:modelValue", false)
  emit("close")
}

const confirm = () => {
  emit("confirm")
}

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape" && props.modelValue) {
    closeModal()
  }
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      window.addEventListener("keydown", handleKeydown)
    } else {
      window.removeEventListener("keydown", handleKeydown)
    }
  },
)

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeydown)
})
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition ease-out duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition ease-in duration-200"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        role="dialog"
        aria-modal="true"
        @click.self="closeOnOverlay && closeModal()"
      >
        <!-- Modal Container -->
        <div
          :class="[
            'bg-gray-900 rounded shadow-2xl overflow-hidden flex flex-col max-h-[90vh]',
            dialogClass,
          ]"
        >
          <!-- HEADER SLOT -->
          <div
            v-if="slots.header"
            class="flex items-center justify-between px-6 py-4 border-b border-gray-100"
          >
            <slot name="header" :title="title">
              <h3 class="text-lg font-semibold">{{ title }}</h3>
            </slot>

            <button
              v-if="showClose"
              class="hover:text-gray-600 transition-colors"
              aria-label="Close"
              @click="closeModal"
            >
              <IconAsyncComponent name="XMarkIcon" class="size-6 cursor-pointer" />
            </button>
          </div>

          <!-- CONTENT SLOT -->
          <div class="px-6 py-4 overflow-y-auto flex-1">
            <slot>
              <p class="text-gray-600">Default dialog content...</p>
            </slot>
          </div>

          <!-- FOOTER SLOT -->
          <div
            v-if="slots.footer"
            class="px-6 py-4 border-t border-gray-100 flex justify-end gap-3"
          >
            <slot name="footer" :cancel="closeModal" :confirm="confirm">
              <button
                class="mr-2 p-2 rounded-md border-2 w-25 border-gray-700 active:scale-95 hover:bg-gray-700 hover:cursor-pointer"
                @click="closeModal"
              >
                Cancel
              </button>
              <button
                class="mr-2 p-2 rounded-md border-2 w-25 border-blue-300 active:scale-95 hover:bg-gray-700 hover:cursor-pointer"
                @click="confirm"
              >
                Confirm
              </button>
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
