<script setup lang="ts">
import {inject} from "vue";
import type Keycloak from "keycloak-js";

const aboba = async () => {}

const keycloak = inject("keycloak") as Keycloak

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
</script>


<template>
  <div class="flex-container">
    <div class="menu left-menu border-right-1 surface-border">item 1</div>
    <div class="container">
      <div class="content bg-gray-900">
        item 2
        <Button @click="console.log(keycloak.token)">Get token</Button>
        <Button @click="keycloak.login()">log in</Button>
        <Button @click="keycloak.logout()">loh out</Button>
      </div>

    </div>
    <div class="menu right-menu">item 1</div>
  </div>

</template>

<style scoped>
.flex-container {
  display: flex;
  flex-direction: row;
  width: 100%;
  max-width: 1900px;
  height: 100%;
  margin: 0 auto;
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

.right-menu {
  width: max(220px, -1160px + 100vw + min(-300px, 485px - 50vw));
  flex-shrink: 0;
  max-width: 300px;
}

.left-menu {
  width: 300px;
}

.menu {
  position: sticky;
  position: -webkit-sticky;
  top: 80px;
  height: calc(-80px + 100vh);
}

.container {
  flex-grow: 1;
  flex-basis: 0%;
  width: 100%;
}

.content {
  height: 100%;
  max-width: 750px;
  margin-left: auto;
  margin-right: auto;
}
</style>
