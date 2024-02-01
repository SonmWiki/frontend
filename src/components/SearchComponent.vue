<script setup lang="ts">
import { api } from '@/api/api'
import { ref } from 'vue'
import router from '@/router'
import type { AutoCompleteCompleteEvent, AutoCompleteItemSelectEvent } from 'primevue/autocomplete'
import type { SearchArticlesResponseElement } from '@/api'

const value = ref("")
const foundArticles = ref(new Array<SearchArticlesResponseElement>)

async function search(event: AutoCompleteCompleteEvent){
  try {
    api().api.searchArticles({searchTerm: event.query}).then((res) => {
      foundArticles.value = res.data.data
    })
  } catch (err: any) {
    console.log(err.message)
  }
}
async function select(event: AutoCompleteItemSelectEvent){
  await router.push({name: 'articles', params: {id: event.value.id}})
}
</script>

<template>
  <AutoComplete placeholder="Search" v-model="value" optionLabel="articleTitle" :suggestions="foundArticles" @complete="search" @item-select="select" />
</template>

<style scoped>

</style>