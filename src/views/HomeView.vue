<script setup lang="ts">
import {ref} from "vue";
import SidebarContainer from "@/components/sidebar/SidebarComponent.vue";

const checked = ref(false);
</script>

<template>
  <div class="flex-container">
    <div class="menu left-menu border-right-1 surface-border">
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

@media only screen and (max-width: 700px) {
  .left-menu {
    display: none;
  }
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