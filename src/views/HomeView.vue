<script setup lang="ts">
import SidebarContainer from "@/components/sidebar/SidebarComponent.vue"
</script>

<template>
  <div class="flex-container">
    <div class="menu left-menu md:block hidden border-right-1 surface-border">
      <SidebarContainer></SidebarContainer>
    </div>
    <div class="container flex flex-row justify-content-center">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
.flex-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 1900px;
  height: 100%;
  margin: 0 auto;
}

.left-menu {
  width: 300px;
}

.menu {
  position: sticky;
  position: -webkit-sticky;
  top: 80px;
  height: calc(-80px + 100vh);
}

.container {
  flex-grow: 1;
  flex-basis: 0%;
  width: 100%;
}

</style>