import { defineStore } from "pinia"
import { ref } from "vue"
import type { Toast, ToastOptions } from "@/types/Toast"
import { nanoid } from "nanoid"

const DEFAULTS = {
  variant: "info",
  position: "top-right",
  duration: 4000,
  showProgress: true,
  pauseOnHover: true,
} as const

export const useToastStore = defineStore("toast", () => {
  const toasts = ref<Toast[]>([])

  function push(options: ToastOptions): string {
    const id = nanoid(8)
    toasts.value.push({
      ...DEFAULTS,
      ...options,
      id,
      createdAt: Date.now(),
    } as Toast)
    return id
  }

  function dismiss(id: string) {
    const idx = toasts.value.findIndex((t) => t.id === id)
    if (idx !== -1) {
      toasts.value[idx].onDismiss?.()
      toasts.value.splice(idx, 1)
    }
  }

  function dismissAll() {
    toasts.value.forEach((t) => t.onDismiss?.())
    toasts.value = []
  }

  return { toasts, push, dismiss, dismissAll }
})
