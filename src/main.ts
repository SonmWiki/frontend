/* eslint-disable vue/multi-word-component-names */
import "./assets/main.css"
import "primeflex/primeflex.css"
import "primeicons/primeicons.css"

import { createApp } from "vue"
import App from "./App.vue"
import PrimeVue from "primevue/config"
import Button from "primevue/button"
import Card from "primevue/card"
import Checkbox from "primevue/checkbox"
import ConfirmationService from "primevue/confirmationservice"
import ContextMenu from "primevue/contextmenu"
import Dialog from "primevue/dialog"
import DialogService from "primevue/dialogservice"
import Image from "primevue/image"
import InputGroup from "primevue/inputgroup"
import InputGroupAddon from "primevue/inputgroupaddon"
import InputText from "primevue/inputtext"
import Password from "primevue/password"
import SelectButton from "primevue/selectbutton"
import ScrollPanel from "primevue/scrollpanel"
import ScrollTop from "primevue/scrolltop"
import Skeleton from "primevue/skeleton"
import StyleClass from "primevue/styleclass"
import Toast from "primevue/toast"
import ToastService from "primevue/toastservice"
import Tooltip from "primevue/tooltip"
import Tree from "primevue/tree"
import Avatar from "primevue/avatar"
import ConfirmDialog from "primevue/confirmdialog"
import Drawer from "primevue/drawer"
import ToggleButton from "primevue/togglebutton"
import MultiSelect from "primevue/multiselect"
import AutoComplete from "primevue/autocomplete"
import Menu from "primevue/menu"
import Splitter from "primevue/splitter"
import SplitterPanel from "primevue/splitterpanel"
import { CodeDiff } from "v-code-diff"
import Textarea from "primevue/textarea"
import Select from "primevue/Select"
import Fieldset from "primevue/fieldset"
import { createPinia } from "pinia"
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"
import DataTable from "primevue/datatable"
import Column from "primevue/column"
import IconField from "primevue/iconfield"
import InputIcon from "primevue/inputicon"
import useThemeStore from "@/stores/ThemeStore"
import Listbox from "primevue/listbox"
import FloatLabel from "primevue/floatlabel"
import Paginator from "primevue/paginator"
import ButtonGroup from "primevue/buttongroup"
import Tag from "primevue/tag"
import keycloakPlugin from "@/plugins/keycloakPlugin"
import router from "@/router"
import Badge from "primevue/badge"
import BadgeDirective from "primevue/badgedirective"
import Menubar from "primevue/menubar"
import Toolbar from "primevue/toolbar"
import ToggleSwitch from "primevue/toggleswitch"
import Divider from "primevue/divider"
import Aura from "@primevue/themes/aura"
import Popover from "primevue/popover"

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

const app = createApp(App)

app.use(pinia)
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.app-dark'
    }
  },
  ripple: false,
})
app.use(ConfirmationService)
app.use(ToastService)
app.use(DialogService)
app.use(keycloakPlugin, {
  keycloakInitOptions: {
    onLoad: "check-sso",
    checkLoginIframe: false,
    silentCheckSsoRedirectUri: location.origin + "/silent-check-sso.html"
  }
})
app.use(router)

app.directive("tooltip", Tooltip)
app.directive("styleclass", StyleClass)
app.directive("badge", BadgeDirective)

app.component("PrimeAvatar", Avatar)
app.component("PrimeButton", Button)
app.component("PrimeCard", Card)
app.component("PrimeCheckbox", Checkbox)
app.component("PrimeContextMenu", ContextMenu)
app.component("PrimeDialog", Dialog)
app.component("PrimeImage", Image)
app.component("PrimeInputGroup", InputGroup)
app.component("PrimeInputGroupAddon", InputGroupAddon)
app.component("PrimeInputText", InputText)
app.component("PrimePassword", Password)
app.component("PrimeSelectButton", SelectButton)
app.component("PrimeScrollPanel", ScrollPanel)
app.component("PrimeScrollTop", ScrollTop)
app.component("PrimeSkeleton", Skeleton)
app.component("PrimeToast", Toast)
app.component("PrimeTree", Tree)
app.component("PrimePopover", Popover)
app.component("PrimeConfirmDialog", ConfirmDialog)
app.component("PrimeDrawer", Drawer)
app.component("PrimeToggleButton", ToggleButton)
app.component("PrimeMultiSelect", MultiSelect)
app.component("PrimeAutoComplete", AutoComplete)
app.component("PrimeMenu", Menu)
app.component("PrimeSplitter", Splitter)
app.component("PrimeSplitterPanel", SplitterPanel)
app.component("CodeDiff", CodeDiff)
app.component("PrimeTextarea", Textarea)
app.component("PrimeSelect", Select)
app.component("PrimeFieldset", Fieldset)
app.component("PrimeDataTable", DataTable)
app.component("PrimeColumn", Column)
app.component("PrimeIconField", IconField)
app.component("PrimeInputIcon", InputIcon)
app.component("PrimeListbox", Listbox)
app.component("PrimeFloatLabel", FloatLabel)
app.component("PrimePaginator", Paginator)
app.component("PrimeButtonGroup", ButtonGroup)
app.component("PrimeTag", Tag)
app.component("PrimeBadge", Badge)
app.component("PrimeMenubar", Menubar)
app.component("PrimeToolbar", Toolbar)
app.component("PrimeToggleSwitch", ToggleSwitch)
app.component("PrimeDivider", Divider)

useThemeStore().applyTheme()

app.mount("#app")