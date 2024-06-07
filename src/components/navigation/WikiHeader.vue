<script setup lang="ts">
import { onBeforeMount, type Ref, ref } from "vue"
import useAuthStore from "@/stores/AuthStore"
import { UserRole } from "@/types/UserRole"
import { wikiApi } from "@/service/WikiApiService"
import ArticleSearchDialog from "@/components/article/ArticleSearchList.vue"
import ThemeSwitch from "@/components/ThemeSwitch.vue"
import WikiHeaderUserMenu from "@/components/navigation/WikiHeaderUserMenu.vue"
import useSidebarStore from "@/stores/SidebarStore"
import router from "@/router"

const props = defineProps({
  hasSidebarSwitch: Boolean
})

const authStore = useAuthStore()
const sidebarStore = useSidebarStore()
const appName = import.meta.env.VITE_APP_NAME ? import.meta.env.VITE_APP_NAME : "Wiki"
const appLogo = import.meta.env.VITE_APP_LOGO ? import.meta.env.VITE_APP_LOGO : "https://scmc.dev/img/catfish.png"

const searchTerm = ref("")
const articleSearchVisible = ref(false)
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
            class="p-overlay-badge flex align-items-center justify-content-center w-2rem"
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
        <PrimeButton
          severity="secondary"
          aria-haspopup="true"
          aria-controls="overlay_menu"
          icon="pi pi-search"
          class="m-1 md:hidden"
          text
          @click="articleSearchVisible = true"
        />
        <PrimeIconField class="m-1 md:block hidden" icon-position="left">
          <PrimeInputIcon class="pi pi-search" />
          <PrimeInputText
            v-model="searchTerm"
            class="w-10rem"
            placeholder="Search"
            @input="articleSearchVisible = true"
          />
        </PrimeIconField>
        <ThemeSwitch />
        <WikiHeaderUserMenu />
      </template>
    </PrimeToolbar>
    <PrimeDialog
      v-model:visible="articleSearchVisible"
      modal
      maximizable
      header="Search"
      class="w-full md:w-30rem"
      :breakpoints="{ '1199px': '75vw', '575px': '95vw' }"
    >
      <ArticleSearchDialog
        v-model:search-term="searchTerm"
        @search="articleSearchVisible = true"
        @article-select="value => { router.push({name:'articles', params: {articleId: value}}); articleSearchVisible = false }"
      />
    </PrimeDialog>
  </div>
</template>

<style scoped>

img {
  object-fit: contain;
}
</style>
