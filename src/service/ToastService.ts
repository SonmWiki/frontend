import { useToastStore } from "@/stores/ToastStore"
import type { ToastOptions } from "@/types/Toast"


function getStore() {
  return useToastStore()
}

export const toast = {
  show: (options: ToastOptions) => getStore().push(options),
  success: (message: string, opts?: Omit<ToastOptions, "message" | "variant">) =>
    getStore().push({ ...opts, message, variant: "success" }),
  error: (message: string, opts?: Omit<ToastOptions, "message" | "variant">) =>
    getStore().push({ ...opts, message, variant: "error" }),
  warning: (message: string, opts?: Omit<ToastOptions, "message" | "variant">) =>
    getStore().push({ ...opts, message, variant: "warning" }),
  info: (message: string, opts?: Omit<ToastOptions, "message" | "variant">) =>
    getStore().push({ ...opts, message, variant: "info" }),
  dismiss: (id: string) => getStore().dismiss(id),
  clear: () => getStore().dismissAll(),
}
