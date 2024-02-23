<script setup lang="ts">
import {ref, watch} from "vue";
import {useRoute} from "vue-router";
import SidebarComponent from "@/components/sidebar/SidebarComponent.vue";
import SearchComponent from '@/components/navigation/SearchComponent.vue'
import UserMenuComponent from "@/components/navigation/UserMenuComponent.vue";
import DarkModeSwitch from "@/components/navigation/DarkModeSwitch.vue";

const route = useRoute()
const sidebarVisible = ref(false)
const appName = import.meta.env.VITE_APP_NAME ? import.meta.env.VITE_APP_NAME : "Wiki"

watch(
    () => route.params,
    () => {sidebarVisible.value = false},
);
</script>

<template>
  <header class="flex flex-row border-bottom-1 p-2 md:p-4 surface-border align-items-center justify-content-center w-full">
    <div class="flex flex-row gap-4 align-items-center justify-content-between w-full" style="max-width: 1900px">
      <div class="logo flex flex-row align-items-center">
        <Button text icon="pi pi-bars" @click="sidebarVisible = true" class="flex md:hidden align-items-center justify-content-center" />
        <RouterLink to='/' class="no-underline text-color flex flex-row justify-content-center align-items-center">
          <img class="p-overlay-badge flex align-items-center justify-content-center" src="https://scmc.dev/img/catfish.png" width=48 alt="logo" />
          <b class="2">{{ appName }}</b>
        </RouterLink>
      </div>
      <div class="flex flex-row gap-1 align-items-center">
        <SearchComponent />
        <DarkModeSwitch />
        <UserMenuComponent />
      </div>
    </div>
  </header>
  <Sidebar v-model:visible="sidebarVisible">
    <SidebarComponent />
  </Sidebar>
</template>

<style scoped>
header {
  height: 80px;
  background: var(--surface-ground);
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  z-index: 10;
}

img {
  object-fit: contain;
}
</style>
