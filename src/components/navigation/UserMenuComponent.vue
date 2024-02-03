<script setup lang="ts">
import {ref} from "vue";
import router from "@/router";
import {authService} from '@/main'

const menu = ref();

const items = ref([
  {
    label: `${authService.isLoggedIn() ? 'Logged In as ' + authService.getUsername() : 'Not Logged In'}`,
    items: [
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
      },
      !authService.isLoggedIn() ?
          {
            label: "Login",
            icon: 'pi pi-sign-in',
            command: () => {
              authService.login()
            }
          } :
          {
            label: "Logout",
            icon: 'pi pi-sign-out',
            command: () => {
              authService.logout()
            }
          },
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
  <Menu ref="menu" id="overlay_menu" :model="items" :popup="true"/>
</template>

<style scoped>

</style>