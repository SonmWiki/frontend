<script setup lang="ts">
import useSidebarStore from "@/stores/SidebarStore"
import BaseLayout from "@/layouts/BaseLayout.vue"
import BaseDrawer from "@/components/common/BaseDrawer.vue"

const sidebarStore = useSidebarStore()
</script>

<template>
  <BaseLayout>
    <template #header>
      <slot name="header" />
    </template>
    <template #default>
      <aside
        class="sticky hidden md:pr-2 overflow-y-auto overflow-x-hidden w-full min-w-70 max-w-70"
        :class="{ 'md:block': sidebarStore.sidebarVisible }"
        style="top: 5rem; height: calc(100vh - 7rem)"
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
  <BaseDrawer v-model="sidebarStore.mdSidebarVisible" drawer-class="md:hidden">
    <slot name="sidebar" />
  </BaseDrawer>
</template>

<style scoped></style>