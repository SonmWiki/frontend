<script setup lang="ts">
import {ref} from "vue";
import router from "@/router";
import { UserRole } from '@/types/UserRole'
import useAuthStore from '@/stores/AuthStore'

const menu = ref();

const menuModel = ref([{}]);
const authStore = useAuthStore()

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

  if (!authStore.isAuthenticated)
    items.push(
        {
          label: "Login",
          icon: 'pi pi-sign-in',
          command: () => {
            authStore.login()
          }
        }
    )

  if (authStore.hasRole(UserRole.USER))
    items.push(
        {
          label: "Create",
          icon: 'pi pi-pencil',
          command: () => {
            router.push({name: 'create'})
          }
        }
    )

  if (authStore.hasRole(UserRole.EDITOR))
    items.push(
        {
          label: "Review",
          icon: 'pi pi-eye',
          command: () => {
            router.push({name: 'review'})
          }
        }
    )

  if (authStore.hasRole(UserRole.ADMIN))
    items.push(
        {
          label: 'Console Auth Info',
          icon: 'pi pi-key',
          command: () => {
            console.log("KC: " + authStore.token)
            console.log("auth: " + authStore)
          }
        },
    )

  if (authStore.isAuthenticated)
    items.push(
        {
          label: "Logout",
          icon: 'pi pi-sign-out',
          command: () => {
            authStore.logout()
          }
        }
    )

  menuModel.value = [
    {
      label: `${authStore.isAuthenticated ? 'Logged In as ' + authStore.userName : 'Not Logged In'}`,
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