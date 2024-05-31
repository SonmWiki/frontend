import { defineStore } from "pinia"

export type ArticleEditorStoreReturnType = ReturnType<typeof useArticleEditorStore>

export type ArticleEditorStore = {
  title: string,
  content: string,
  categories: string[]
}

const useArticleEditorStore = defineStore({
  id: "articleEditorStore",
  state: (): ArticleEditorStore => {
    return {
      title: "",
      content: "",
      categories: []
    }
  },
  persist: true
})

export default useArticleEditorStore