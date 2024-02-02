<script setup lang="ts">
import {inject, ref} from "vue";
import router from "@/router";
import {authService} from "@/services/AuthService";

const menu = ref();
//
// watch(
//     () => !!localStorage.getItem("token"),
//     () => {
//       console.log(!!localStorage.getItem("token"))
//       getCurrentInstance().proxy?.$forceUpdate()
//     }
// )

const items = ref([
  {
    label: "Options",
    items: [
      {
        label: "Login",
        icon: 'pi pi-sign-in',
        command: () => {
          authService.login()
        }
      },
      {
        label: "Logout",
        icon: 'pi pi-sign-out',
        command: () => {
          authService.logout()
        }
      },
      {
        label: "Create",
        icon: 'pi pi-pencil',
        command: () => {
          router.push({name: 'create'})
        }
      },
      {
        label: "Review",
        icon: 'pi pi-eye',
        command: () => {
          router.push({name: 'review'})
        }
      },
      {
        label: 'Console Auth Info',
        icon: 'pi pi-key',
        command: () => {
          console.log("KC: " + authService.getAccessToken())
          console.log("auth: " + authService)
        }
      }
    ],
  }
]);

const setItems = () => {
}

const toggle = (event) => {
  menu.value.toggle(event);
}

setItems()
</script>

<template>
  <Button
      aria-haspopup="true"
      aria-controls="overlay_menu"
      text
      outlined
      icon="pi pi-user"
      @click="toggle"
      class="flex align-items-center justify-content-center"
  />
  <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
</template>

<style scoped>

</style>