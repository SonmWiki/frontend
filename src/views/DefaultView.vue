<script setup lang="ts">
import SidebarLayout from "@/layouts/SidebarLayout.vue"
import WikiHeader from "@/components/navigation/WikiHeader.vue"
import WikiSidebar from "@/components/navigation/WikiSidebar.vue"
import WikiFooter from "@/components/navigation/WikiFooter.vue"
import router from "@/router"
import HomeView from "@/views/HomeView.vue"
import { computed } from "vue"

const showHomePage = computed(() => router.currentRoute.value.name == "home")
</script>

<template>
  <SidebarLayout>
    <template #header>
      <WikiHeader :has-sidebar-switch="true" />
    </template>
    <template #sidebar>
      <WikiSidebar />
    </template>
    <template #default>
      <HomeView v-if="showHomePage"/>
      <router-view v-else />
    </template>
    <template #footer>
      <WikiFooter />
    </template>
  </SidebarLayout>
</template>

<style scoped>
</style>