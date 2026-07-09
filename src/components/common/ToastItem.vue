<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from "vue"
import type { Toast } from "@/types/Toast"
import { useToastStore } from "@/stores/ToastStore"
import IconAsyncComponent, { type HeroIconName } from "@/components/common/IconAsyncComponent.vue"

const props = defineProps<{ toast: Toast }>()

const store = useToastStore()
const progressWidth = ref(100)
const isPaused = ref(false)
const remainingMs = ref(props.toast.duration)
const animating = ref(false)

let timer: ReturnType<typeof setTimeout> | null = null
let startTime = 0

const ICONS: Record<string, HeroIconName> = {
  success: "CheckCircleIcon",
  error: "XCircleIcon",
  warning: "ExclamationTriangleIcon",
  info: "InformationCircleIcon",
}

const ROOT_VARIANTS: Record<string, string> = {
  success: "bg-emerald-950/60 backdrop-blur-xs text-emerald-50",
  error: "bg-red-950/60 backdrop-blur-xs text-red-50",
  warning: "bg-amber-950/60 backdrop-blur-xs text-amber-50",
  info: "bg-blue-950/60 backdrop-blur-xs text-blue-50",
}

const ICON_VARIANTS: Record<string, string> = {
  success: "text-emerald-400",
  error: "text-red-400",
  warning: "text-amber-400",
  info: "text-blue-400",
}

const BRACKET_COLORS: Record<string, string> = {
  success: "var(--color-emerald-400)",
  error: "var(--color-red-400)",
  warning: "var(--color-amber-400)",
  info: "var(--color-blue-400)",
}

const resolvedIcon = computed<HeroIconName>(() => props.toast.icon ?? ICONS[props.toast.variant])

const rootClass = computed(() => [
  "relative flex items-start gap-3 w-full max-w-sm",
  "rounded-md border-2 border-transparent px-4 py-3 shadow-lg overflow-hidden",
  "pointer-events-auto",
  ROOT_VARIANTS[props.toast.variant],
])

const iconWrapClass = computed(() => ["shrink-0", ICON_VARIANTS[props.toast.variant]])

const bracketStyle = computed(() => {
  const currentProgress = props.toast.showProgress ? progressWidth.value / 100 : 1
  const shouldAnimate = props.toast.showProgress && animating.value && !isPaused.value

  return {
    "--color": BRACKET_COLORS[props.toast.variant] || "var(--color-gray-500)",
    "--progress": currentProgress,
    "--bg-transition": shouldAnimate ? `background-size ${remainingMs.value}ms linear` : "none",
  }
})

function startTimer() {
  if (!props.toast.duration || props.toast.duration <= 0) return
  startTime = Date.now()

  if (props.toast.showProgress) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        animating.value = true
        progressWidth.value = 0
      })
    })
  }

  timer = setTimeout(dismiss, remainingMs.value)
}

function pauseTimer() {
  if (!props.toast.pauseOnHover || !timer) return
  clearTimeout(timer)
  timer = null

  const elapsed = Date.now() - startTime
  remainingMs.value = Math.max(0, remainingMs.value - elapsed)

  if (props.toast.showProgress) {
    progressWidth.value = (remainingMs.value / props.toast.duration) * 100
  }

  animating.value = false
  isPaused.value = true
}

function resumeTimer() {
  if (!isPaused.value) return
  isPaused.value = false
  startTime = Date.now()
  timer = setTimeout(dismiss, remainingMs.value)

  if (props.toast.showProgress) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        animating.value = true
        progressWidth.value = 0
      })
    })
  }
}

function dismiss() {
  store.dismiss(props.toast.id)
}

function handleAction() {
  props.toast.action?.onClick()
  dismiss()
}

onMounted(startTimer)
onUnmounted(() => {
  if (timer) clearTimeout(timer)
})
</script>

<template>
  <div
    :class="['bracket-block', rootClass]"
    :style="bracketStyle"
    role="alert"
    aria-live="assertive"
    @mouseenter="pauseTimer"
    @mouseleave="resumeTimer"
  >
    <span :class="iconWrapClass">
      <IconAsyncComponent :name="resolvedIcon" class="w-5 h-5" />
    </span>

    <div class="flex-1 min-w-0">
      <p v-if="toast.title" class="text-sm font-semibold mb-1">
        {{ toast.title }}
      </p>
      <p class="text-sm leading-snug">{{ toast.message }}</p>
      <button
        v-if="toast.action"
        class="mt-1.5 text-sm font-medium underline underline-offset-2 hover:opacity-75 transition-opacity hover:cursor-pointer"
        @click="handleAction"
      >
        {{ toast.action.label }}
      </button>
    </div>

    <button
      class="shrink-0 p-0.5 rounded-sm opacity-60 hover:opacity-100 transition-opacity hover:cursor-pointer"
      aria-label="Dismiss"
      @click="dismiss"
    >
      <IconAsyncComponent name="XMarkIcon" class="w-4 h-4" />
    </button>
  </div>
</template>

<style scoped>
.bracket-block {
  transition: background 0.3s;
}

.bracket-block::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 2px;
  pointer-events: none;

  background-image:
    radial-gradient(ellipse at top left, var(--color) 0%, transparent 70%),
    radial-gradient(ellipse at bottom right, var(--color) 0%, transparent 70%);

  background-size:
    calc(50% * var(--progress, 1)) calc(70% * var(--progress, 1)),
    calc(50% * var(--progress, 1)) calc(70% * var(--progress, 1)),
    calc(100% * var(--progress, 1)) calc(100% * var(--progress, 1));

  background-position:
    top left,
    bottom right,
    center;

  background-repeat: no-repeat;

  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: exclude;
  -webkit-mask-composite: destination-out;

  transition: var(--bg-transition);
}
</style>
