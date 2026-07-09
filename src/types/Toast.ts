import type { HeroIconName } from "@/components/common/IconAsyncComponent.vue"

export type ToastVariant = "success" | "error" | "warning" | "info"

export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"

export interface ToastAction {
  label: string
  onClick: () => void
}

export interface ToastOptions {
  /** Display message */
  message: string
  /** Visual style — defaults to 'info' */
  variant?: ToastVariant
  /** Screen position — defaults to 'top-right' */
  position?: ToastPosition
  /** Auto-dismiss delay in ms. Set to 0 to keep indefinitely */
  duration?: number
  /** Optional title above the message */
  title?: string
  /** Override the default icon for this variant */
  icon?: HeroIconName
  /** Show a countdown progress bar */
  showProgress?: boolean
  /** Pause the timer while the user hovers */
  pauseOnHover?: boolean
  /** Single inline action button */
  action?: ToastAction
  /** Called when the toast is dismissed (any reason) */
  onDismiss?: () => void
}

export interface Toast extends Required<
  Omit<ToastOptions, "title" | "icon" | "action" | "onDismiss">
> {
  id: string
  title?: string
  icon?: HeroIconName
  action?: ToastAction
  onDismiss?: () => void
  createdAt: number
}
