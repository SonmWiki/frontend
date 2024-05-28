<script setup lang="ts">
import useThemeStore from "@/stores/ThemeStore"

const themeStore = useThemeStore()
</script>

<template>
  <PrimeButton
    severity="secondary"
    aria-haspopup="true"
    aria-controls="overlay_menu"
    class="m-1"
    text
    :icon="themeStore.theme == 'light' ? 'pi pi-sun text-xl' : ' pi pi-moon'"
    @click="themeStore.switchTheme()"
  />
</template>

<style scoped>

</style>