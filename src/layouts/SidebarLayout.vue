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
      <aside class="sticky hidden md:pr-2 overflow-y-auto" :class="{'md:block': sidebarStore.sidebarVisible}">
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
  <PrimeSidebar v-model:visible="sidebarStore.mdSidebarVisible">
    <slot name="sidebar" />
  </PrimeSidebar>
</template>

<style scoped>
aside {
  top: 3rem;
  height: calc(100vh - 5rem);
  width: 400px;
}

main {
  min-height: calc(100vh - 3rem)
}
</style>