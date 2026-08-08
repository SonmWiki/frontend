<script setup lang="ts">
import { computed } from "vue"
import BaseDialog from "./BaseDialog.vue"
import BracketButton from "@/components/common/BracketButton.vue"
import IconAsyncComponent from "@/components/common/IconAsyncComponent.vue"

const url = defineModel<string>({ default: "" })
const isOpen = computed(() => !!url.value)

const handleConfirm = () => {
  if (url.value) {
    window.open(url.value, "_blank")
  }
  closeDialog()
}

const closeDialog = () => {
  url.value = ""
}
</script>

<template>
  <BaseDialog
    :model-value="isOpen"
    title="Переход по внешней ссылке"
    @update:model-value="(val) => !val && closeDialog()"
    @confirm="handleConfirm"
    @close="closeDialog"
  >
    <template #header> </template>
    <div class="space-y-3">
      <p>Вы собираетесь перейти по адресу:</p>

      <div
        class="p-3 bg-gray-950 rounded border border-gray-800 break-all text-xs font-mono text-gray-400"
      >
        {{ url }}
      </div>
    </div>

    <template #footer>
      <BracketButton class="w-30 bg-blue-950" color="blue-400" @click="closeDialog"> Остаться </BracketButton>
      <BracketButton class="mr-2 w-30 bg-amber-950/60" color="amber-400" @click="handleConfirm">
        <IconAsyncComponent class="size-5 mr-1" type="outline" name="ExclamationTriangleIcon" />
        Продолжить
      </BracketButton>
    </template>
  </BaseDialog>
</template>
