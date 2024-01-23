<script setup lang="ts">
import NavigationComponent from "@/components/NavigationComponent.vue";
import {ref} from "vue";

const sidebarVisible = ref(false)
</script>

<template>
  <header class="logo flex flex-row gap-2 border-bottom-1 surface-border p-2 align-items-center">
    <Button text icon="pi pi-bars" @click="sidebarVisible = true" class="small-screen-only" />
    <img class="p-overlay-badge flex align-items-center justify-content-center" src="https://scmc.dev/img/catfish.png" width=48 />
    <b class="2">Wiki</b>
    <RouterLink to='/' class="link-primary">Home</RouterLink>
    <RouterLink to='/categories' class="link-primary">Categories</RouterLink>
  </header>
  <Sidebar v-model:visible="sidebarVisible" header="Sidebar">
    <NavigationComponent></NavigationComponent>
  </Sidebar>
</template>

<style scoped>
header {
  height: 80px;
  background: var(--bluegray-900);
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  z-index: 10;
}

img {
  object-fit: contain;
}

.small-screen-only {
  display: none;
  visibility: hidden;
}

@media only screen and (max-width: 700px) {
  .small-screen-only {
    display: block;
    visibility: visible;
  }
}
</style>
