<script setup lang="ts">
const aboba = async () => {}

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

</script>


<template>
  <div class="align-items-center">
    <h1>hello</h1>

    <Button @click="aboba">aaboa</Button>
  </div>

</template>

<style scoped>

</style>
