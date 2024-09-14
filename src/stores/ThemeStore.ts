import { defineStore } from "pinia"
import { ref } from "vue"

const dark = "dark"
const light = "light"

const useThemeStore = defineStore("themeStore", () => {
    function preferredTheme(): typeof dark | typeof light {
      return (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) ? dark : light
    }

    const theme = ref<typeof dark | typeof light>(preferredTheme())

    function switchTheme() {
      theme.value = theme.value == dark ? light : dark
      localStorage.setItem("theme", theme.value)
      applyTheme()
    }

    function applyTheme() {
      document.querySelector("html")?.classList.toggle("app-dark")
    }

    return { theme, switchTheme, applyTheme }
  },
  {
    persist: true,
  },
)

export default useThemeStore