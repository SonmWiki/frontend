<script setup lang="ts">
import { onBeforeMount, type Ref, ref } from "vue"
import useAuthStore from "@/stores/AuthStore"
import { UserRole } from "@/types/UserRole"
import { wikiApi } from "@/service/WikiApiService"
import WikiHeaderSearch from "@/components/navigation/WikiHeaderSearch.vue"
import ThemeSwitch from "@/components/ThemeSwitch.vue"
import WikiHeaderUserMenu from "@/components/navigation/WikiHeaderUserMenu.vue"
import useSidebarStore from "@/stores/SidebarStore"

const props = defineProps({
  hasSidebarSwitch: Boolean
})

const authStore = useAuthStore()
const sidebarStore = useSidebarStore()
const appName = import.meta.env.VITE_APP_NAME ? import.meta.env.VITE_APP_NAME : "Wiki"
const appLogo = import.meta.env.VITE_APP_LOGO ? import.meta.env.VITE_APP_LOGO : "https://scmc.dev/img/catfish.png"

const pendingRevisionCount: Ref<number> = ref(0)


onBeforeMount(async () => {
    if (authStore.hasRole(UserRole.EDITOR) || authStore.hasRole(UserRole.ADMIN))
      pendingRevisionCount.value = (await wikiApi.api.getPendingRevisionsCount()).data.count
    else
      pendingRevisionCount.value = 0
  }
)
</script>

<template>
  <div class="w-full" style="background: var(--surface-section);">
    <PrimeToolbar class="h-full p-0 border-none m-auto" style="max-width: 1728px;">
      <template #start>
        <PrimeButton
          v-if="hasSidebarSwitch"
          class="m-1 hidden md:inline-flex"
          icon="pi pi-bars"
          aria-label="Filter"
          severity="secondary"
          text
          @click="sidebarStore.toggleSidebar()"
        />
        <PrimeButton
          v-if="hasSidebarSwitch"
          class="m-1 md:hidden"
          icon="pi pi-bars"
          severity="secondary"
          text
          @click="sidebarStore.toggleMdSidebar()"
        />
        <RouterLink to='/' class="no-underline m-1 text-color flex flex-row justify-content-center align-items-center">
          <img
            class="p-overlay-badge flex align-items-center justify-content-center w-1rem"
            :src='appLogo'
            alt="logo"
          />
          <b class="2">{{ appName }}</b>
        </RouterLink>
      </template>
      <template #end>
        <RouterLink v-if="pendingRevisionCount != 0" to="/review">
          <PrimeButton
            class="m-1 p-button-icon-only overflow-visible"
            severity="secondary"
            text
          >
            <i v-badge.warning="pendingRevisionCount" class="pi pi-eye line-height-2 z-3" />
          </PrimeButton>
        </RouterLink>
        <WikiHeaderSearch />
        <ThemeSwitch />
        <WikiHeaderUserMenu />
      </template>
    </PrimeToolbar>
  </div>
</template>

<style scoped>

img {
  object-fit: contain;
}
</style>
