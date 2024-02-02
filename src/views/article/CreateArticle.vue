<script setup lang="ts">
import {type Ref, ref} from 'vue';
import {MdEditor} from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import {type CreateArticleRequest, type GetCategoriesResponseElement} from "@/api";
import {useVuelidate} from "@vuelidate/core";
import {api} from "@/api/api";
import {useToast} from "primevue/usetoast";
import {maxLength, minLength, required} from "@vuelidate/validators";

const text: Ref<string> = ref('Hello Editor! 👋');
const dialogVisible = ref(false)
const localArticleDraft: Ref<string>  = ref("")
const title = ref('')
const categories: Ref<GetCategoriesResponseElement[]> = ref([])
const selectedCategories: Ref<GetCategoriesResponseElement[]> = ref([]);
const loadingCategories = ref(false)
const error = ref()
const toast = useToast()

localArticleDraft.value = localStorage.getItem("article_draft") as string

if (localArticleDraft.value != "") text.value = localArticleDraft.value

const rules = {
  title: {required, minLength: minLength(4), maxLength: maxLength(256)},
}

const v$ = useVuelidate(
    rules, {title: title}, {$lazy: true}
)

const saveDraft = (v: string) => {
  if (localArticleDraft.value == text.value) return
  localArticleDraft.value = v
  localStorage.setItem("article_draft", v)
  console.log("Saved in local storage!")
};

const createArticle = async () => {
  const isFormCorrect = await v$.value.$validate()
  if (!isFormCorrect) return

  const data: CreateArticleRequest = {
    title: title.value,
    content: text.value,
    categoryIds: selectedCategories.value ? selectedCategories.value.map((category) => category.id) : []
  }

  console.log(data)

   try {
     const result = (await api().api.createArticle(data)).data
     dialogVisible.value = false

     toast.add({ severity: 'success', summary: 'Article Created!', detail: `id: ${result.id}`, life: 3000 });

   } catch (e) {
    error.value = e
    console.log(e)
   }
}

const onCategoriesClick = async () => {
  if (loadingCategories.value || categories.value.length != 0) return

  loadingCategories.value = true

  try {
    categories.value = (await api().api.getCategories()).data.data
    loadingCategories.value = false
  } catch (error) {
    console.log(error)
  }
}

setInterval (()=> {
  saveDraft(text.value)
}, 30*1000);
</script>

<template>
  <Toast />

  <div class="flex flex-column gap-2">
    <div class="w-full flex flex-column align-items-center">
      <h1>Create Article</h1>
      <div class="flex flex-column align-items-center w-30rem">

      </div>
    </div>
    <MdEditor @onSave="saveDraft" v-model="text" language="en-US" previewTheme='github' theme="dark" />
    <div class="flex justify-content-center">
      <Button label="Create" @click="dialogVisible = true"></Button>
    </div>
  </div>

  <Dialog v-model:visible="dialogVisible" modal header="Create Article" class="w-30rem">
    <div class="flex flex-column gap-4">
      <div class="flex flex-column gap-2">
        <label for="title">Title</label>
        <InputText
            id="title"
            v-model="title"
            aria-describedby="title-help"
            :class="{ 'p-invalid': v$.title.$errors[0] }"
            v-tooltip.right="v$.title.$errors[0]?.$message || ''"
        />
        <small id="title-help">⚠️ You'll need to create a new article to rename it</small>
      </div>
      <div class="flex flex-column gap-2">
        <label for="username">Categories</label>
        <MultiSelect
            @click="onCategoriesClick"
            :loading="loadingCategories"
            v-model="selectedCategories"
            :options="categories"
            filter
            optionLabel="name"
            placeholder="Select Categories"
            :maxSelectedLabels="3"
            class="w-full"
        />
      </div>
      <span v-if="error" class="text-red-400">
        ❗ Failed to create: {{ error.request.statusText }}
      </span>
      <div class="flex justify-content-end gap-2">
        <Button outlined type="button" label="Cancel" severity="secondary" @click="dialogVisible = false"></Button>
        <Button outlined type="button" label="Create" @click="createArticle"></Button>
      </div>
    </div>
  </Dialog>
</template>

<style scoped>

</style>