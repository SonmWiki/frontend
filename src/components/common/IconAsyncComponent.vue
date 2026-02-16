<template>
  <IconAsyncComponent />
</template>

<script lang="ts" setup>
import { type Component, defineAsyncComponent } from "vue"
import * as solid from "@heroicons/vue/24/solid"
import * as outline from "@heroicons/vue/24/outline"

export type HeroIconName = keyof typeof solid | keyof typeof outline

interface Props {
  name: HeroIconName
  type?: "solid" | "outline"
}

const props = withDefaults(defineProps<Props>(), {
  name: "ExclamationCircleIcon",
  type: "solid",
})

const IconAsyncComponent = defineAsyncComponent({
  loader: async () => {
    if (props.type === "outline") {
      return import("@heroicons/vue/24/outline").then(
        (module) => module[props.name as HeroIconName],
      ) as Promise<Component>
    } else {
      return import("@heroicons/vue/24/solid").then(
        (module) => module[props.name as HeroIconName],
      ) as Promise<Component>
    }
  },
})
</script>
