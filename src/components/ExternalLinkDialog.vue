<script setup lang="ts">
// TODO: Перекидывать сюда ссылку и оброблять её тута
</script>

<template>
  <ConfirmDialog>
    <template #container="{ message, acceptCallback, rejectCallback }">
        <div class="flex flex-column p-4">
          <div class="flex flex-column align-items-center w-full gap-3 border-bottom-1 surface-border">
            <i class="pi pi-exclamation-circle text-4xl text-primary-500"></i>
            <div class="flex flex-column gap-2 justify-content-center align-items-center mb-4">
              <div class="text-2xl">External Link</div>
              <div>By continuing, new tab will be opened</div>
              <div class="link-primary hover:no-underline cursor-auto">{{ message.message }}</div>
            </div>
          </div>
          <div class="flex align-items-center gap-2 mt-4 justify-content-center ">
            <Button label="Continue" @click="acceptCallback"></Button>
            <Button label="Cancel" outlined @click="rejectCallback"></Button>
          </div>
        </div>
    </template>
  </ConfirmDialog>
</template>

<style scoped>

</style>