<script setup lang="ts">
import HeaderComponent from "@/components/navigation/HeaderComponent.vue"
</script>

<template>
  <div class="h-full">
    <HeaderComponent />
    <div class="flex flex-column justify-content-between">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
</style>
