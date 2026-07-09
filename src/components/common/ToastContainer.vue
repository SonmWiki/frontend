<script lang="ts" setup>
import { useToastStore } from "@/stores/ToastStore"
import ToastItem from "./ToastItem.vue"
import type { ToastPosition } from "@/types/Toast"

const store = useToastStore()

const POSITIONS: ToastPosition[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
]

const POSITION_CLASSES: Record<ToastPosition, string> = {
  "top-left": "fixed top-4 left-4 flex flex-col items-start",
  "top-center": "fixed top-4 left-1/2 -translate-x-1/2 flex flex-col items-center",
  "top-right": "fixed top-4 right-4 flex flex-col items-end",
  "bottom-left": "fixed bottom-4 left-4 flex flex-col-reverse items-start",
  "bottom-center": "fixed bottom-4 left-1/2 -translate-x-1/2 flex flex-col-reverse items-center",
  "bottom-right": "fixed bottom-4 right-4 flex flex-col-reverse items-end",
}

const toastsAt = (pos: ToastPosition) => store.toasts.filter((t) => t.position === pos)

const positionClass = (pos: ToastPosition) => `pointer-events-none ${POSITION_CLASSES[pos]}`
</script>

<template>
  <Teleport to="body">
    <div
      class="pointer-events-none fixed inset-0 z-[9999] flex flex-col"
      aria-label="Notifications"
    >
      <TransitionGroup
        v-for="position in POSITIONS"
        :key="position"
        tag="div"
        :class="positionClass(position)"
        name="toast"
      >
        <ToastItem
          v-for="toast in toastsAt(position)"
          :key="toast.id"
          :toast="toast"
          class="mb-2"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.toast-enter-active {
  transition: all 300ms cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-leave-active {
  transition: all 250ms ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateY(-12px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(32px);
}
.toast-move {
  transition: transform 300ms ease;
}
</style>
