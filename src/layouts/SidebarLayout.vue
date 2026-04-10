<script setup lang="ts">
import useSidebarStore from "@/stores/SidebarStore"
import BaseLayout from "@/layouts/BaseLayout.vue"

const sidebarStore = useSidebarStore()
</script>

<template>
  <BaseLayout>
    <template #header>
      <slot name="header" />
    </template>
    <template #default>
      <aside
        class="sticky hidden md:pr-2 overflow-y-auto"
        :class="{ 'md:block': sidebarStore.sidebarVisible }"
        style="top: 5rem; height: calc(100vh - 7rem); min-width: fit-content"
      >
        <slot name="sidebar" />
      </aside>
      <main class="w-full md:pl-2">
        <slot />
      </main>
    </template>
    <template #footer>
      <slot name="footer" />
    </template>
  </BaseLayout>
  <PrimeDrawer v-model:visible="sidebarStore.mdSidebarVisible">
    <slot name="sidebar" />
  </PrimeDrawer>
</template>

<style scoped>
</style>