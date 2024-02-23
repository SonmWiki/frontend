<script setup lang="ts">
import {themeService} from "@/main";
</script>

<template>
  <Button
      severity="secondary"
      aria-haspopup="true"
      aria-controls="overlay_menu"
      text
      :icon="themeService.theme.value == 'light' ? 'pi pi-sun text-xl' : ' pi pi-moon'"
      class="flex align-items-center justify-content-center"
      @click="themeService.switchTheme()"
  />
</template>

<style scoped>

</style>