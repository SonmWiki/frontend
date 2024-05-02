<script setup lang="ts">
import { type Ref, ref } from "vue"
import router from "@/router"
import { UserRole } from "@/types/UserRole"
import useAuthStore from "@/stores/AuthStore"
import { keycloakService } from "@/service/KeycloakService"
import type { MenuItem } from "primevue/menuitem"
import type Menu from "primevue/menu"

const authStore = useAuthStore()
const menu = ref<Menu>()
const items: Ref<MenuItem[]> = ref([
  {
    label: `${authStore.isAuthenticated ? "Hello, " + authStore.username : "Not Logged In"}`,
    items: [
      {
        label: "Articles List",
        icon: "pi pi-table",
        command: () => {
          router.push({ name: "articlesTable" })
        }
      },
      {
        label: "Login",
        icon: "pi pi-sign-in",
        visible: !authStore.isAuthenticated,
        command: () => {
          keycloakService.login()
        }
      },
      {
        label: "Create",
        icon: "pi pi-pencil",
        visible: authStore.hasRole(UserRole.USER),
        command: () => {
          router.push({ name: "create" })
        }
      },
      {
        label: "Review",
        icon: "pi pi-eye",
        visible: authStore.hasRole(UserRole.EDITOR),
        command: () => {
          router.push({ name: "review" })
        }
      },
      {
        label: "Edit Navigations",
        icon: "pi pi-list",
        visible: authStore.hasRole(UserRole.EDITOR),
        command: () => {
          router.push({ name: "navigationsEditor" })
        }
      },
      {
        label: "Logout",
        icon: "pi pi-sign-out",
        visible: authStore.isAuthenticated,
        command: () => {
          keycloakService.logout()
        }
      }
    ]
  }
])

const onToggleClicked = (event: Event) => {
  menu?.value?.toggle(event)
}
</script>

<template>
  <Button
    aria-haspopup="true"
    aria-controls="overlay_menu"
    text
    icon="pi pi-user"
    class="flex align-items-center justify-content-center"
    @click="onToggleClicked"
  />
  <Menu
    id="overlay_menu"
    ref="menu"
    :model="items"
    :popup="true"
  />
</template>

<style scoped>

</style>