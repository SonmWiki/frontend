<script setup lang="ts">
import {provide} from "vue";
import {Api} from "@/api";
import HeaderComponent from "@/components/HeaderComponent.vue";
import FooterComponent from "@/components/FooterComponent.vue";

const api = new Api();
api.baseUrl = 'http://localhost:5216'

provide("api", api)
</script>

<template>
  <div class="h-full flex flex-column justify-content-between">
    <HeaderComponent />
    <RouterView />
    <FooterComponent />
  </div>
</template>

<style scoped>
</style>
