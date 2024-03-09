<script setup lang="ts">
import { computed, ref } from 'vue';
import { PrimeIcons } from 'primevue/api';
import { AppConstants } from '@/constants/AppConstants';

const visible = defineModel<boolean>('visible')
const selectedIcon = defineModel<string | undefined>('selectedIcon')
const icons = ref(Object.values(PrimeIcons) as Array<string>)
const filter = ref()

const emit = defineEmits<{
  iconSelected: [icon: string | undefined]
}>()

const filteredIcons = computed(() => {
  if (filter.value) return icons.value.filter((icon) => icon.indexOf(filter.value.toLowerCase()) > -1)
  else return icons.value
})
</script>

<template>
  <Dialog @update:hide="selectedIcon = undefined" v-model:visible="visible" modal maximizable header="Select an icon" class="w-full md:w-30rem" :breakpoints="AppConstants.dialogBreakpoints">
    <template #header>
      <div class="inline-flex align-items-center justify-content-center gap-2">
        <span class="font-bold white-space-nowrap">Select an icon</span>
        <i :class="selectedIcon"></i>
      </div>
    </template>
    <div class="card">
      <InputText v-model="filter" class="w-full sticky top-0 z-1 p-3 mb-4" placeholder="Search an icon" />
      <div class="grid justify-content-center text-center">
        <Button outlined plain text @click="selectedIcon = undefined; emit('iconSelected', selectedIcon)" class="col-2 m-2 w-3rem h-3rem border-5 md:col-2"/>
        <Button text plain @click="selectedIcon = icon; emit('iconSelected', selectedIcon)" :icon="icon" v-for="icon of filteredIcons" :key="icon" class="col-2 m-2 w-3rem h-3rem md:col-2"/>
      </div>
    </div>
  </Dialog>
</template>

<style scoped>

</style>