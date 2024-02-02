<script setup lang="ts">
import { inject, ref, watch } from 'vue'
import {useRoute} from "vue-router";
import SidebarComponent from "@/components/sidebar/SidebarComponent.vue";
import SearchComponent from '@/components/navigation/SearchComponent.vue'
import { type AuthService, authServiceKey } from '@/services/AuthService'

const route = useRoute()
const sidebarVisible = ref(false)
const authService = inject(authServiceKey) as AuthService

watch(
    () => route.params.id,
    () => {sidebarVisible.value = false},
);

</script>

<template>
  <header class="flex flex-row border-bottom-1 surface-border p-4 align-items-center justify-content-between">
    <div class="logo flex flex-row gap-2 align-items-center">
      <Button text icon="pi pi-bars" @click="sidebarVisible = true" class="flex align-items-center justify-content-center small-screen-only" />
      <RouterLink to='/' class="no-underline text-color flex flex-row justify-content-center align-items-center">
        <img class="p-overlay-badge flex align-items-center justify-content-center" src="https://scmc.dev/img/catfish.png" width=48 alt="logo" />
        <b class="2">Wiki</b>
      </RouterLink>
      <RouterLink to='/create' class="link-primary">add</RouterLink>
      <RouterLink to='/review' class="link-primary">rev</RouterLink>
    </div>
    <div class="flex flex-row gap-2 align-items-center">
      <SearchComponent/>
      <span class="link-primary" @click="console.log(authService.getAccessToken())">token</span>
      <span class="link-primary" @click="authService.login()">in</span>
      <span class="link-primary" @click="authService.logout()">out</span>
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

.small-screen-only {
  display: none !important;
  visibility: hidden !important;
}

@media only screen and (max-width: 700px) {
  .small-screen-only {
    display: block;
    visibility: visible;
  }
}
</style>
