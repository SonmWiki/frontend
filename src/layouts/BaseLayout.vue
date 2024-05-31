<script setup lang="ts">

</script>

<template>
  <header class="h-3rem top-0 sticky z-5">
    <slot name="header" />
  </header>
  <div class="flex m-auto container p-2">
    <slot />
  </div>
  <footer class="h-2rem">
    <slot name="footer" />
  </footer>
</template>

<style scoped>
.container {
  max-width: 1728px;
}
</style>