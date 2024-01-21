<script setup lang="ts">
import {provide} from "vue";
import {Api} from "@/api";
import HeaderComponent from "@/components/HeaderComponent.vue";

const api = new Api();
api.baseUrl = 'http://localhost:5216'

provide("api", api)
</script>

<template>
  <div class="h-full">
    <HeaderComponent />
    <div class="flex flex-column justify-content-between ">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
</style>
