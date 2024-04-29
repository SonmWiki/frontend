<script setup lang="ts">
import useThemeStore from "@/stores/ThemeStore"

const themeStore = useThemeStore()
</script>

<template>
  <Button
    severity="secondary"
    aria-haspopup="true"
    aria-controls="overlay_menu"
    text
    :icon="themeStore.theme == 'light' ? 'pi pi-sun text-xl' : ' pi pi-moon'"
    class="flex align-items-center justify-content-center"
    @click="themeStore.switchTheme()"
  />
</template>

<style scoped>

</style>