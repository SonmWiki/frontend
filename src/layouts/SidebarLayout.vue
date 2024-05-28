<script setup lang="ts">

import useSidebarStore from "@/stores/SidebarStore"

const sidebarStore = useSidebarStore()
</script>

<template>
  <header class="h-3rem top-0 sticky z-5">
    <slot name="header" />
  </header>
  <div class="flex m-auto container">
    <aside class="sticky hidden overflow-y-auto p-2" :class="{'md:block': sidebarStore.sidebarVisible}">
      <slot name="sidebar" />
    </aside>
    <main class="w-full p-2">
      <slot />
    </main>
  </div>
  <footer class="h-2rem">
    <slot name="footer" />
  </footer>
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

main{
  min-height: calc(100vh - 2rem);
}

.container {
  max-width: 1400px;
}
</style>