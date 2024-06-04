<script setup lang="ts">
const footer = import.meta.env.VITE_FOOTER_CONTENT ? import.meta.env.VITE_FOOTER_CONTENT : ""
</script>

<template>
  <div class="flex flex-column align-items-center">
    {{ footer }}
  </div>
</template>

<style scoped>

</style>
