<script setup lang="ts">
import {type Ref, ref, watch} from "vue";
import {useRoute} from "vue-router";
import {MdCatalog, MdPreview} from "md-editor-v3";
import 'md-editor-v3/lib/style.css';
import {useToast} from "primevue/usetoast";
import {api} from "@/api/api";
import type {GetArticleResponse} from "@/api";
import useThemeStore from '@/stores/ThemeStore'

const props = defineProps<{
  article?: string
  revision?: string
  hideCatalog?: boolean
}>()

const route = useRoute()
const toast = useToast()
const themeStore = useThemeStore()

const popup = ref()
const articleData: Ref<GetArticleResponse | undefined> = ref()
const articleId = ref("")
const revisionId: Ref<string | undefined> = ref()
const loading = ref(true)
const error = ref()

const id = 'preview-only';
const scrollElement = document.documentElement;

const loadArticle = async () => {
  articleData.value = undefined
  loading.value = true

  if (props.revision)
    revisionId.value = props.revision
  else revisionId.value = revisionId.value ? (revisionId.value as string) : undefined

  if (props.article)
    articleId.value = props.article

  if (articleId.value == undefined) return

  try {
    error.value = undefined
    articleData.value = (await api().api.getArticle(articleId.value, {revisionId: revisionId.value})).data
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
  articleId.value = route.params.id as string;
  revisionId.value = route.query.revision as string;
  await loadArticle();
}

watch(
    () => route.params.id,
    () => {load()},
);

watch(
    () => props.revision,
    () => {load()},
);

load()
</script>

<template>
  <Toast position="top-center"></Toast>

  <div class="w-full">
    <div class="content pt-4" v-if="articleData && articleData.content != null">
      <div class="title flex align-items-center justify-content-between ml-4 mr-4">
        <div>
          <h1 class="font-bold mb-0 mt-0">{{ articleData.title }}</h1>
        </div>
        <div class="flex align-items-center justify-content-between">
          <Button severity="secondary" style="max-height: 32px; max-width: 32px; font-size: 1em; padding: 0; z-index: 1" size="small" icon="pi pi-ellipsis-v" @click="togglePopup" text rounded></Button>
          <OverlayPanel ref="popup" :pt="{content: {style: 'padding: 0.5rem'}}">
            <div class="flex flex-column">
              <Button class="text-left" icon="pi pi-share-alt" label="Copy Link" @click="copyLink" size="small" text />
            </div>
          </OverlayPanel>
        </div>
      </div>
      <div>
        <MdPreview language="en-US" previewTheme='github' :theme="themeStore.theme" :editorId="id" :modelValue="articleData.content"></MdPreview>
      </div>
    </div>
    <div class="content pt-4" v-if="error && !articleData">
      <div class="title flex align-items-center justify-content-between ml-4 mr-4">
        <h1 class="font-bold mb-0 mt-0">{{ error.response.status }} {{ error.response.statusText }}</h1>
      </div>
    </div>
    <div class="content pt-4" v-if="!error && !articleData && loading">
      <div class="flex flex-column gap-2 ml-4 mr-4">
        <Skeleton width="45%" height="2rem"></Skeleton>
        <Skeleton width="100%" height="8rem"></Skeleton>
        <Skeleton width="100%" height="8rem"></Skeleton>
      </div>
    </div>
  </div>
  <div class="menu catalog" v-if="!hideCatalog">
    <div v-if="articleData" class="pt-4 sticky" style="top: 80px;">
      <MdCatalog language="en-US" previewTheme='github' :theme="themeStore.theme" :editorId="id" :scrollElement="scrollElement" />
    </div>
  </div>
</template>

<style scoped>

@media only screen and (max-width: 1280px) {
  .catalog {
    display: none;
  }
}

.catalog {
  width: max(220px, -1160px + 100vw + min(-300px, 485px - 50vw));
  flex-shrink: 0;
  max-width: 300px;
}

.content {
  height: 100%;
  max-width: 750px;
  margin-left: auto;
  margin-right: auto;
}
</style>