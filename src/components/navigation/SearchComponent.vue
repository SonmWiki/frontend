<script setup lang="ts">
import { api } from '@/api/api'
import {ref, watch} from 'vue'
import type { SearchArticlesResponseElement } from '@/api'
import { AppConstants } from '@/constants/AppConstants'

const active = ref(false)
const value = ref("")
const foundArticles = ref(new Array<SearchArticlesResponseElement>)

async function search(query: string){
  try {
    api().api.searchArticles({searchTerm: query}).then((res) => {
      foundArticles.value = res.data.data
    })
  } catch (err: any) {
    console.log(err.message)
  }
}

watch(
    () => value.value,
    async () => {
      const curVal = value.value
      await (new Promise(r => setTimeout(r, 1000)))
      if (curVal == value.value) await search(value.value)
    }
)
</script>

<template>
  <Button
      severity="secondary"
      aria-haspopup="true"
      aria-controls="overlay_menu"
      text
      icon="pi pi-search"
      class="flex align-items-center justify-content-center"
      @click="active = true"
  />

  <Dialog v-model:visible="active" modal maximizable header="Search" class="w-full md:w-30rem" :breakpoints="AppConstants.dialogBreakpoints">

    <IconField iconPosition="left">
      <InputIcon>
        <i class="pi pi-search" />
      </InputIcon>
      <InputText placeholder="Search" v-model="value" class="w-full" />
    </IconField>

    <div v-if="foundArticles.length > 0" class="flex gap-2 flex-column">
      <div class="text-primary font-bold pt-3">
        Results
      </div>
      <RouterLink
          v-for="article in foundArticles"
          :key="article.id"
          :to="{name: 'articles', params: {id: article.id}}"
          class="w-full border-bottom-1 surface-border p-3 border-round no-underline text-color hover:surface-hover"
          @click="active = false"
      >
        {{ article.articleTitle }}
      </RouterLink>
    </div>
  </Dialog>
</template>

<style scoped>

</style>