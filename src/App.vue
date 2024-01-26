<script setup lang="ts">
import {inject, provide} from "vue";
import {Api} from "@/api";
import HeaderComponent from "@/components/HeaderComponent.vue";
import type Keycloak from "keycloak-js";

const keycloak = inject('keycloak') as Keycloak

const api = new Api()
api.instance.defaults.baseURL = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL : `http://${window.location.hostname}:5216`

if (keycloak.token !== undefined)
  api.instance.defaults.headers.common = {
    'Authorization': `Bearer ${keycloak.token}`
  };

provide("api", api)
</script>

<template>
  <div class="h-full">
    <HeaderComponent />
    <div class="flex flex-column justify-content-between">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
</style>
