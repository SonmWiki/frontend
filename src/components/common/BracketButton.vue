<script setup lang="ts">
import { computed } from "vue"

type ButtonSize = "sm" | "md" | "lg"

interface Props {
  /**
   * Tailwind color token  →  'rose-500', 'emerald-400', 'sky-300' …
   * Falls back to any valid CSS color  →  '#c0003b', 'oklch(60% 0.2 30)'
   *
   * Tailwind v4 exposes every palette color as --color-<name>,
   * e.g. 'rose-500' becomes var(--color-rose-500).
   */
  color?: string
  size?: ButtonSize
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  color: "gray-400",
  size: "md",
  disabled: false,
})

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const resolvedColor = computed<string>(() =>
  /^[a-z]+-\d+$/.test(props.color) ? `var(--color-${props.color})` : props.color,
)

const sizeClasses = computed<string>(() => {
  const map: Record<ButtonSize, string> = {
    sm: "px-1.5 py-1.5 text-xs",
    md: "px-2 py-2 text-sm",
    lg: "px-3 py-3 text-base",
  }
  return map[props.size]
})

const btnClasses = [
  "bracket-btn",
  "relative backdrop-blur-xs border-2 rounded-md border-transparent text-white",
  "active:translate-y-px transition-transform duration-75",
  "hover:cursor-pointer select-none",
  "disabled:opacity-40 disabled:cursor-not-allowed disabled:active:translate-y-0",
]

function handleClick(event: MouseEvent) {
  if (!props.disabled) emit("click", event)
}
</script>

<template>
  <button
    :disabled="disabled"
    :class="[btnClasses, sizeClasses]"
    :style="{ '--color': resolvedColor }"
    @click="handleClick"
  >
    <slot />
  </button>
</template>

<style scoped>
.bracket-btn {
  transition: background 0.3s;
}

.bracket-btn::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 2px;

  background-image:
    radial-gradient(ellipse at top left, var(--color) 0%, transparent 70%),
    radial-gradient(ellipse at bottom right, var(--color) 0%, transparent 70%);

  background-size:
    50% 70%,
    50% 70%,
    100% 100%;

  background-position:
    top left,
    bottom right,
    center;

  background-repeat: no-repeat;

  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: exclude;

  transition: background-size 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.bracket-btn:hover::before {
  background-size:
    75% 90%,
    75% 90%,
    90% 90%;
}
</style>
