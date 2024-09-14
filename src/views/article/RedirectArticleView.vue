<script setup lang="ts">
import BaseLayout from "@/layouts/BaseLayout.vue"
import WikiHeader from "@/components/navigation/WikiHeader.vue"
import WikiFooter from "@/components/navigation/WikiFooter.vue"
import { type Ref, ref, watch } from "vue"
import ArticleSearchDialog from "@/components/article/ArticleSearchList.vue"
import { PrimeIcons } from "@primevue/core/api"
import { required } from "@vuelidate/validators"
import { useVuelidate } from "@vuelidate/core"
import { wikiApi } from "@/service/WikiApiService"
import { useToast } from "primevue/usetoast"
import router from "@/router"

const props = defineProps<{
  articleId: string
}>()

const toast = useToast()

const redirectFromId = ref<string>(props.articleId)
const redirectToId = ref<string | undefined>()
const searchTerm: Ref<string> = ref("")
const articleSearchVisible = ref(false)

const rules = {
  redirectFromId: { required },
  redirectToId: { required }
}
const vuelidate = useVuelidate(rules, { redirectFromId: redirectFromId, redirectToId: redirectToId })

const setRedirect = async () => {
  try {
    if (!redirectToId.value) return

    const result = (await wikiApi.api.setArticleRedirect(props.articleId, { redirectArticleId: redirectToId.value })).data
    await router.push({ name: "articles", params: { articleId: result.id } })
  } catch (error: any) {
    if (error.isAxiosError) {
      if (error.response?.data?.detail != undefined) {
        toast.add({ severity: "error", summary: "Couldn't set redirect", detail: error.response.data.detail })
      }
    }
    console.log(error)
  }
}

watch(redirectToId, () => {
  vuelidate.value.$touch()
})
</script>

<template>
  <BaseLayout>
    <template #header>
      <WikiHeader />
    </template>
    <template #default>
      <div class="container flex flex-column w-full">
        <h1 class="m-0">Set article redirect</h1>
        <PrimeDivider class="mb-5" />
        <div class="flex flex-column w-full h-full">
          <div class="flex flex-row flex-wrap gap-2 justify-content-center w-full mb-5">
            <div class="w-full md:w-14rem">
              <PrimeFloatLabel>
                <PrimeInputText
                  id="redirectFrom"
                  v-model="redirectFromId"
                  disabled
                  class="w-full"
                  :value="articleId"
                />
                <label for="redirectFrom">Redirect from Id</label>
              </PrimeFloatLabel>
              <PrimeTag v-for="error in vuelidate.redirectFromId.$errors" :key="error.$uid" severity="danger">
                {{ error.$message }}
              </PrimeTag>
            </div>
              <i :class="PrimeIcons.FAST_FORWARD" class="m-2"></i>
            <div class="w-full md:w-14rem">
              <PrimeFloatLabel>
                <PrimeInputText
                  id="redirectTo"
                  v-model="redirectToId"
                  class="w-full"
                  @focus="articleSearchVisible = true"
                />
                <label for="redirectTo">Redirect to Id</label>
              </PrimeFloatLabel>
              <PrimeTag v-for="error in vuelidate.redirectToId.$errors" :key="error.$uid" severity="danger">
                {{ error.$message }}
              </PrimeTag>
            </div>
          </div>
          <PrimeButton
            label="Set redirect"
            :disabled="vuelidate.$error"
            @click="setRedirect"
          />
        </div>
      </div>
    </template>
    <template #footer>
      <WikiFooter />
    </template>
  </BaseLayout>
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
      @article-select="value => { articleSearchVisible = false; redirectToId = value }"
    />
  </PrimeDialog>
  <PrimeToast />
</template>

<style scoped>
.container {
  height: calc(100vh - 3rem);
}
</style>