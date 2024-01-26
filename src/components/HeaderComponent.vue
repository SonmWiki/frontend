<script setup lang="ts">
import {inject, ref, watch} from "vue";
import {useRoute} from "vue-router";
import Keycloak from "keycloak-js";
import type {Api} from "@/api";
import SidebarComponent from "@/components/sidebar/SidebarComponent.vue";

const route = useRoute()
const sidebarVisible = ref(false)
const keycloak = inject("keycloak") as Keycloak
const api = inject("api") as Api<any>

watch(
    () => route.params.id,
    () => {sidebarVisible.value = false},
);

const sus = async () => {
  try {
    await api.api.createArticle({}).then((res) => {console.log(res)})
  } catch (err: any) {
    console.log(err.message)
  }
}
</script>

<template>
  <header class="flex flex-row border-bottom-1 surface-border p-4 align-items-center justify-content-between">
    <div class="logo flex flex-row gap-2 align-items-center">
      <Button text icon="pi pi-bars" @click="sidebarVisible = true" class="small-screen-only flex align-items-center justify-content-center" />
      <RouterLink to='/' class="no-underline text-color flex flex-row justify-content-center align-items-center">
        <img class="p-overlay-badge flex align-items-center justify-content-center" src="https://scmc.dev/img/catfish.png" width=48 />
        <b class="2">Wiki</b>
      </RouterLink>
      <RouterLink to='/editor' class="link-primary">WIP</RouterLink>
    </div>
    <div class="flex flex-row gap-2 align-items-center">
      <span class="link-primary" @click="console.log(keycloak.token)">token</span>
      <span class="link-primary" @click="keycloak.login()">in</span>
      <span class="link-primary" @click="keycloak.logout()">out</span>
      <span class="link-primary" @click="sus()">api</span>
    </div>
  </header>
  <Sidebar v-model:visible="sidebarVisible">
    <SidebarComponent />
  </Sidebar>
</template>

<style scoped>
header {
  height: 80px;
  background: var(--surface-ground);
  position: sticky;
  position: -webkit-sticky;
  top: 0;
  z-index: 10;
}

img {
  object-fit: contain;
}

.small-screen-only {
  display: none;
  visibility: hidden;
}

@media only screen and (max-width: 700px) {
  .small-screen-only {
    display: block;
    visibility: visible;
  }
}
</style>
