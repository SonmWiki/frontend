import { defineStore } from "pinia"

export type SidebarStoreReturnType = ReturnType<typeof useSidebarStore>

export type SidebarStore = {
  sidebarVisible: boolean,
  mdSidebarVisible: boolean,
}

const useSidebarStore = defineStore({
  id: "sidebarStore",
  state: (): SidebarStore => {
    return {
      sidebarVisible: true,
      mdSidebarVisible: false,
    }
  },
  getters: {
  },
  actions: {
    toggleSidebar(){
      this.sidebarVisible = !this.sidebarVisible
    },
    toggleMdSidebar(){
      this.mdSidebarVisible = !this.mdSidebarVisible
    }
  }
})

export default useSidebarStore