<script setup lang="ts">
</script>

<template>
  <header class="logo flex flex-row gap-2 border-bottom-1 surface-border p-2 align-items-center">
    <img class="p-overlay-badge flex align-items-center justify-content-center" src="https://scmc.dev/img/catfish.png" width=48 />
    <b class="2">Wiki</b>
    <RouterLink to='/' class="link-primary">Home</RouterLink>
    <RouterLink to='/register' class="link-primary">Register</RouterLink>
    <RouterLink to='/login' class="link-primary">Login</RouterLink>
    <RouterLink to='/categories' class="link-primary">Categories</RouterLink>
  </header>
</template>

<style scoped>
header {
  height: 80px;
  background: var(--bluegray-900);
  position: sticky;
  position: -webkit-sticky;
  top: 0;
}

img {
  object-fit: contain;
}
</style>
