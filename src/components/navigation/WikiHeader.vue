<script setup lang="ts">
import { onBeforeMount, ref } from "vue"
import useAuthStore from "@/stores/AuthStore"
import { UserRole } from "@/types/UserRole"
import { wikiApi } from "@/service/WikiApiService"
import ArticleSearchDialog from "@/components/article/ArticleSearchList.vue"
import WikiHeaderUserMenu from "@/components/navigation/WikiHeaderUserMenu.vue"
import useSidebarStore from "@/stores/SidebarStore"
import router from "@/router"
import logo from "../../assets/logo.svg"
import { Bars3Icon, MagnifyingGlassIcon } from "@heroicons/vue/24/solid"
import { EyeIcon } from "@heroicons/vue/24/outline"
import BaseDialog from "@/components/common/BaseDialog.vue"
import IconAsyncComponent from "@/components/common/IconAsyncComponent.vue"
import BracketButton from "@/components/common/BracketButton.vue"

const props = defineProps({
  hasSidebarSwitch: Boolean,
})

const authStore = useAuthStore()
const sidebarStore = useSidebarStore()
const appName = import.meta.env.VITE_APP_NAME || "Wiki"

const searchTerm = ref("")
const articleSearchVisible = ref(false)
const pendingRevisionCount = ref(0)

onBeforeMount(async () => {
  if (authStore.hasRole(UserRole.EDITOR) || authStore.hasRole(UserRole.ADMIN)) {
    pendingRevisionCount.value = (await wikiApi.api.getPendingRevisionsCount()).data.count
  }
})
</script>

<template>
  <header class="w-full bg-gray-900">
    <div class="max-w-432 mx-auto h-16 flex items-center justify-between px-3 md:px-4">
      <div class="flex items-center">
        <BracketButton
          v-if="hasSidebarSwitch"
          class="mr-2 bg-transparent md:hidden"
          color="gray-400"
          @click="sidebarStore.toggleMdSidebar()"
        >
          <Bars3Icon class="size-6"></Bars3Icon>
        </BracketButton>
        <BracketButton
          v-if="hasSidebarSwitch"
          class="mr-2 bg-transparent hidden md:inline-flex"
          color="gray-400"
          @click="sidebarStore.toggleSidebar()"
        >
          <Bars3Icon class="size-6"></Bars3Icon>
        </BracketButton>

        <RouterLink
          to="/"
          class="flex items-center no-underline text-primary font-bold text-xl hover:opacity-90 transition-opacity"
        >
          <img :src="logo" :alt="`${appName} logo`" class="w-8 h-8 mr-2 object-contain" />
          <span>{{ appName }}</span>
        </RouterLink>
      </div>

      <div class="flex items-center gap-1">
        <RouterLink
          v-if="pendingRevisionCount > 0"
          to="/review"
          class="relative mr-2 p-2 rounded-md border-2 border-transparent active:scale-95 hover:border-blue-300 hover:bg-gray-700 hover:cursor-pointer"
          aria-label="Review pending revisions"
        >
          <EyeIcon class="size-6"></EyeIcon>
          <span
            class="absolute -top-1 -right-1 flex items-center justify-center h-4 w-4 text-[0.65rem] font-bold text-white bg-red-500 rounded-full border-2 border-surface-50 dark:border-surface-800"
          >
            {{ pendingRevisionCount }}
          </span>
        </RouterLink>

        <BracketButton
          v-if="hasSidebarSwitch"
          class="mr-2 bg-transparent md:hidden"
          color="gray-400"
          @click="articleSearchVisible = true"
        >
          <MagnifyingGlassIcon class="size-6"></MagnifyingGlassIcon>
        </BracketButton>
        <div class="relative hidden md:inline">
          <input
            v-model="searchTerm"
            type="text"
            class="peer py-2.5 pe-0 ps-8 w-full bg-transparent border-t-transparent border-b-2 border-x-transparent border-b-line-2 disabled:opacity-50"
            placeholder="Search articles"
            @input="articleSearchVisible = true"
            @focus="articleSearchVisible = true"
          />
          <div
            class="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-1 peer-disabled:opacity-50 peer-disabled:pointer-events-none"
          >
            <IconAsyncComponent name="MagnifyingGlassIcon" class="size-6"></IconAsyncComponent>
          </div>
        </div>
        <WikiHeaderUserMenu />
      </div>
    </div>

    <BaseDialog v-model="articleSearchVisible" title="Search articles">
      <template #header />
      <ArticleSearchDialog
        v-model:search-term="searchTerm"
        @search="articleSearchVisible = true"
        @article-select="
          (value) => {
            router.push({ name: 'articles', params: { articleId: value } })
            articleSearchVisible = false
          }
        "
      />
    </BaseDialog>
  </header>
</template>

<style scoped>
</style>