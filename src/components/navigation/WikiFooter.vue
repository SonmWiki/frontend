<script setup lang="ts">

const appFullName = import.meta.env.VITE_APP_FULL_NAME ? import.meta.env.VITE_APP_FULL_NAME : "SCMC.dev"

</script>

<template>
  <div class="flex flex-column align-items-center">
    ©{{ (new Date()).getFullYear() }} {{ appFullName }}
  </div>
</template>

<style scoped>

</style>
