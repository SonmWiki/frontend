<script setup lang="ts">
import {ref} from "vue";
import router from "@/router";
import {authService} from '@/main'
import {UserRole} from "@/services/AuthService";

const menu = ref();

const menuModel = ref([{}]);

const setItems = () => {
  const items = []

  items.push(
      {
        label: "Articles List",
        icon: 'pi pi-table',
        command: () => {
          router.push({name: 'articlesTable'})
        }
      }
  )

  if (!authService.isLoggedIn())
    items.push(
        {
          label: "Login",
          icon: 'pi pi-sign-in',
          command: () => {
            authService.login()
          }
        }
    )

  if (authService.hasRole(UserRole.USER))
    items.push(
        {
          label: "Create",
          icon: 'pi pi-pencil',
          command: () => {
            router.push({name: 'create'})
          }
        }
    )

  if (authService.hasRole(UserRole.EDITOR))
    items.push(
        {
          label: "Review",
          icon: 'pi pi-eye',
          command: () => {
            router.push({name: 'review'})
          }
        }
    )

  if (authService.hasRole(UserRole.ADMIN))
    items.push(
        {
          label: 'Console Auth Info',
          icon: 'pi pi-key',
          command: () => {
            console.log("KC: " + authService.getAccessToken())
            console.log("auth: " + authService)
          }
        },
    )

  if (authService.isLoggedIn())
    items.push(
        {
          label: "Logout",
          icon: 'pi pi-sign-out',
          command: () => {
            authService.logout()
          }
        }
    )

  menuModel.value = [
    {
      label: `${authService.isLoggedIn() ? 'Logged In as ' + authService.getUsername() : 'Not Logged In'}`,
      items: items,
    }
  ]
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
      icon="pi pi-user"
      @click="toggle"
      class="flex align-items-center justify-content-center"
  />
  <Menu ref="menu" id="overlay_menu" :model="menuModel" :popup="true"/>
</template>

<style scoped>

</style>