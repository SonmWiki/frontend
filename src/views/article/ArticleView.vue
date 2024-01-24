<script setup lang="ts">
import {inject, ref, watch} from "vue";
import {Api} from "@/api";
import {useRoute} from "vue-router";
import {MdCatalog, MdPreview} from "md-editor-v3";
import 'md-editor-v3/lib/style.css';
import {useToast} from "primevue/usetoast";
import NavigationComponent from "@/components/NavigationComponent.vue";

const api = inject("api") as Api<any>
const route = useRoute()
const toast = useToast()

const popup = ref()
const article = ref()
const articleId = ref()
const loading = ref(true)
const error = ref()

const id = 'preview-only';
const scrollElement = document.documentElement;

articleId.value = route.params.id

const loadArticle = async () => {
  article.value = undefined
  loading.value = true
  try {
    article.value = (await api.api.getArticle(articleId.value)).data
  } catch (err) {
    console.log(err)
    error.value = err
  }
  loading.value = false
}
const togglePopup = (event: any) => {
  popup.value.toggle(event);
}

const copyLink = () => {
  toast.add({severity: 'info', summary: 'Link Copied!', life: 3000});
  navigator.clipboard.writeText(window.location.origin + route.path)
  togglePopup(this)
}

const load = async () => {
  articleId.value = route.params.id;
  await loadArticle();
}

watch(
    () => route.params.id,
    () => {load()},
);

load()
</script>

<template>
  <div class="flex-container">
    <div class="menu left-menu border-right-1 surface-border">
      <NavigationComponent/>
    </div>
    <Toast position="top-center"></Toast>
    <div class="container">
      <div class="content pt-4" v-if="article">
        <div class="title flex align-items-center justify-content-between ml-4 mr-4">
          <div>
            <h1 class="font-bold mb-0 mt-0">{{ article.title }}</h1>
          </div>
          <div class="flex align-items-center justify-content-between">
            <Button severity="secondary" style="max-height: 32px; max-width: 32px; font-size: 1em; padding: 0; z-index: 1" size="small" icon="pi pi-ellipsis-v" @click="togglePopup" text rounded></Button>
            <OverlayPanel ref="popup">
              <Button icon="pi pi-share-alt" label="Copy Link" @click="copyLink" size="small" text />
            </OverlayPanel>
          </div>
        </div>
        <div>
          <MdPreview language="en-US" previewTheme='github' theme="dark" :editorId="id" :modelValue="article.content" class="editor"></MdPreview>
        </div>
      </div>
      <div class="content pt-4" v-if="error && !article">
        <div class="title flex align-items-center justify-content-between ml-4 mr-4">
          <h1 class="font-bold mb-0 mt-0">{{ error.status }} {{ error.statusText }}</h1>
        </div>
      </div>
      <div class="content pt-4" v-if="!error && !article && loading">
        <div class="flex flex-column gap-2 ml-4 mr-4">
          <Skeleton width="45%" height="2rem"></Skeleton>
          <Skeleton width="100%" height="8rem"></Skeleton>
          <Skeleton width="100%" height="8rem"></Skeleton>
        </div>
      </div>
    </div>
    <div class="menu right-menu pt-4">
      <div v-if="article">
        <MdCatalog language="en-US" previewTheme='github' theme="dark" :editorId="id" :scrollElement="scrollElement" />
      </div>
    </div>
  </div>
  <div>
  </div>
  <Toast></Toast>
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