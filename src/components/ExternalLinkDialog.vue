<script setup lang="ts">

</script>

<template>
  <ConfirmDialog>
    <template #container="{ message, acceptCallback, rejectCallback }">
      <div class="flex flex-column align-items-center p-5 surface-overlay border-round">
        <div class="border-circle bg-primary inline-flex justify-content-center align-items-center h-3rem w-3rem -mt-6">
          <i class='pi pi-exclamation-triangle text-2xl'></i>
        </div>
        <span class="font-bold text-2xl block mb-2 mt-4">{{ message.header }}</span>
        <p class="mb-0 link-primary hover:no-underline cursor-auto">{{ message.message }}</p>
        <div class="flex align-items-center gap-2 mt-4">
          <Button label="Continue" @click="acceptCallback"></Button>
          <Button label="Cancel" outlined @click="rejectCallback"></Button>
        </div>
      </div>
    </template>
  </ConfirmDialog>
</template>

<style scoped>

</style>