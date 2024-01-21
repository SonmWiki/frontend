<script setup lang="ts">
import {inject} from "vue";
import type Keycloak from "keycloak-js";

const aboba = async () => {}

const keycloak = inject("keycloak") as Keycloak

function delay(ms: number) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}
</script>


<template>
  <div class="flex-container">
    <div class="menu left-menu border-right-1 surface-border">item 1</div>
    <div class="content">
      item 2
      <Button @click="console.log(keycloak.token)">Get token</Button>
      <Button @click="keycloak.login()">log in</Button>
      <Button @click="keycloak.logout()">loh out</Button>

    </div>
    <div class="menu right-menu">item 1</div>
  </div>

</template>

<style scoped>
.flex-container {
  display: flex;
  height: 100%;
}

@media only screen and (max-width: 1280px) {
  .right-menu {
    display: none;
  }
}

@media only screen and (max-width: 700px) {
  .left-menu {
    display: none;
  }
}

.menu {
  flex-grow: 1;
  flex-basis: 100px;
  position: sticky;
  position: -webkit-sticky;
  top: 80px;
  height: calc(-80px + 100vh);
}

.content {
  flex-grow: 2;
  flex-basis: 250px;
}
</style>
