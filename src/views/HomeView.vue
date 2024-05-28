<script setup lang="ts">
import SidebarLayout from "@/layouts/SidebarLayout.vue"
import WikiHeader from "@/components/navigation/WikiHeader.vue"
import WikiSidebar from "@/components/navigation/WikiSidebar.vue"
import WikiFooter from "@/components/navigation/WikiFooter.vue"
</script>

<template>
  <SidebarLayout>
    <template #header>
      <WikiHeader />
    </template>
    <template #sidebar>
      <WikiSidebar />
    </template>
    <template #default>
      <router-view />
    </template>
    <template #footer>
      <WikiFooter />
    </template>
  </SidebarLayout>
</template>

<style scoped>
</style>