<script setup lang="ts">
import { useConfirm } from "primevue/useconfirm"
import { type ModelRef, ref, watch } from "vue"

const url: ModelRef<undefined | string> = defineModel("url")
const shownUrl = ref("")

const confirm = useConfirm()

const showDialog = () => {
  if (url.value == undefined) return

  shownUrl.value = url.value.substring(0, 36)
  if (url.value.length > 36) shownUrl.value += ".."

  confirm.require({
    accept: () => {
      window.open(url.value, "_blank")
      reset()
    },
    reject: () => {
      reset()
    }
  })
}

const reset = () => {
  confirm.close()
  url.value = undefined
}

watch(
  () => url.value,
  () => {
    if (url.value != undefined) showDialog()
  }
)
</script>

<template>
  <PrimeConfirmDialog>
    <template #container="{ acceptCallback, rejectCallback }">
      <div class="flex flex-column p-4">
        <div class="flex flex-column align-items-center w-full gap-3 border-bottom-1 surface-border">
          <i class="pi pi-exclamation-circle text-4xl text-primary-500"></i>
          <div class="flex flex-column gap-2 justify-content-center align-items-center mb-4">
            <div class="text-2xl">External Link</div>
            <div>By continuing, new tab will be opened</div>
            <div class="link-primary hover:no-underline cursor-auto">{{ shownUrl }}</div>
          </div>
        </div>
        <div class="flex align-items-center gap-2 mt-4 justify-content-center ">
          <PrimeButton label="Continue" @click="acceptCallback"></PrimeButton>
          <PrimeButton label="Cancel" outlined @click="rejectCallback"></PrimeButton>
        </div>
      </div>
    </template>
  </PrimeConfirmDialog>
</template>

<style scoped>

</style>