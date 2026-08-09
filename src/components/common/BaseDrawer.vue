<script setup>
import { onMounted, onUnmounted, watch } from "vue"
import IconAsyncComponent from "@/components/common/IconAsyncComponent.vue"

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  position: {
    type: String,
    default: "left",
  },
  drawerClass: {
    type: String,
    default: "",
  },
})

const emit = defineEmits(["update:modelValue"])

const close = () => {
  emit("update:modelValue", false)
}

watch(
  () => props.modelValue,
  (isOpen) => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = isOpen ? "hidden" : ""
    }
  },
)

const handleKeyDown = (e) => {
  if (e.key === "Escape" && props.modelValue) {
    close()
  }
}

onMounted(() => window.addEventListener("keydown", handleKeyDown))
onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown)
  document.body.style.overflow = ""
})
</script>

<template>
  <Teleport to="body">
    <div :class="['drawer-root', drawerClass]">
      <Transition name="drawer-fade">
        <div
          v-if="modelValue"
          class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          @click="close"
        />
      </Transition>

      <Transition :name="position === 'right' ? 'slide-right' : 'slide-left'">
        <div
          v-if="modelValue"
          :class="[
            'fixed top-0 bottom-0 z-50 w-80 max-w-[calc(100vw-2rem)] bg-white p-2 shadow-xl flex flex-col dark:bg-gray-900',
            position === 'right' ? 'right-0' : 'left-0',
          ]"
        >
          <div class="flex justify-between items-center mb-4">
            <slot name="header" />
            <button class="hover:text-gray-600 transition-colors ml-auto" aria-label="Close" @click="close">
              <IconAsyncComponent name="XMarkIcon" class="size-6 cursor-pointer" />
            </button>
          </div>

          <div class="flex-1 overflow-y-auto">
            <slot />
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<style scoped>
.drawer-fade-enter-active,
.drawer-fade-leave-active {
  transition: opacity 0.25s ease;
}
.drawer-fade-enter-from,
.drawer-fade-leave-to {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-100%);
}

.slide-right-enter-from,
.slide-right-leave-to {
  transform: translateX(100%);
}
</style>
