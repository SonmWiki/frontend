<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, type Ref } from "vue"
import router from "@/router"
import { UserRole } from "@/types/UserRole"
import useAuthStore from "@/stores/AuthStore"
import { keycloakService } from "@/service/KeycloakService"
import IconAsyncComponent, { type HeroIconName } from "@/components/common/IconAsyncComponent.vue"

interface MenuItem {
  label: string
  icon?: HeroIconName
  command?: () => void
  visible?: () => boolean
}

const authStore = useAuthStore()
const dropdownContainer = ref<HTMLElement | null>(null)
const isMenuOpen = ref(false)

const menuItems: Ref<MenuItem[]> = ref([
  {
    label: "Articles List",
    icon: "TableCellsIcon",
    command: () => router.push({ name: "articlesTable" }),
  },
  {
    label: "Login",
    icon: "ArrowLeftOnRectangleIcon",
    visible: () => !authStore.isAuthenticated,
    command: () => keycloakService.login(),
  },
  {
    label: "Create",
    icon: "PencilIcon",
    visible: () => authStore.hasRole(UserRole.USER),
    command: () => router.push({ name: "articleEditor" }),
  },
  {
    label: "Review",
    icon: "EyeIcon",
    visible: () => authStore.hasRole(UserRole.EDITOR),
    command: () => router.push({ name: "review" }),
  },
  {
    label: "Edit Navigations",
    icon: "Bars3Icon",
    visible: () => authStore.hasRole(UserRole.EDITOR),
    command: () => router.push({ name: "navigationsEditor" }),
  },
  {
    label: "Edit Categories",
    icon: "Bars3Icon",
    visible: () => authStore.hasRole(UserRole.EDITOR),
    command: () => router.push({ name: "categoriesEditor" }),
  },
  {
    label: "Logout",
    icon: "ArrowRightStartOnRectangleIcon",
    visible: () => authStore.isAuthenticated,
    command: () => keycloakService.logout(),
  },
])

const headerText = computed(() =>
  authStore.isAuthenticated ? `Hello, ${authStore.username}` : "Not Logged In",
)

const visibleItems = computed(() =>
  menuItems.value.filter((item) => !item.visible || item.visible()),
)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const handleMenuItemClick = (item: MenuItem) => {
  if (item.command) item.command()
  isMenuOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  if (dropdownContainer.value && !dropdownContainer.value.contains(event.target as Node)) {
    isMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside)
})
</script>

<template>
  <div class="relative" ref="dropdownContainer">
    <button
      id="user-menu-button"
      @click="toggleMenu"
      class="relative p-2 rounded-md border-2 border-blue-300 active:scale-95 hover:bg-gray-700 hover:cursor-pointer hidden md:inline-flex"
    >
      <IconAsyncComponent type="outline" name="UserIcon" class="size-6" />
    </button>

    <div
      v-show="isMenuOpen"
      id="user-menu-dropdown"
      class="absolute right-0 mt-2.5 w-60 origin-top-right bg-gray-900 rounded shadow-lg ring-2 ring-blue-300 focus:outline-none z-50 py-1"
      role="menu"
      aria-orientation="vertical"
      aria-labelledby="user-menu-button"
    >
      <div class="px-4 py-3.5 text-sm font-medium border-b border-blue-300">
        {{ headerText }}
      </div>

      <div v-for="(item, index) in visibleItems" :key="index" role="none">
        <button
          @click="handleMenuItemClick(item)"
          class="w-full flex items-center px-4 py-2.5 text-sm hover:bg-gray-700 cursor-pointer"
          role="menuitem"
          :class="{ ' font-medium': item.label === 'Articles List' }"
        >
          <IconAsyncComponent
            v-if="item.icon"
            type="outline"
            :name="item.icon"
            class="size-4 mr-2"
          ></IconAsyncComponent>
          {{ item.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>