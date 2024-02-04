import './assets/main.css'
import "primeflex/primeflex.css";
import "primevue/resources/themes/aura-dark-amber/theme.css";
import "primeicons/primeicons.css";

import {createApp} from "vue";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import Button from 'primevue/button';
import Card from 'primevue/card';
import Checkbox from 'primevue/checkbox';
import ConfirmationService from 'primevue/confirmationservice';
import ContextMenu from 'primevue/contextmenu';
import Dialog from 'primevue/dialog';
import DialogService from 'primevue/dialogservice'
import Image from 'primevue/image';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import SelectButton from 'primevue/selectbutton';
import ScrollPanel from 'primevue/scrollpanel';
import ScrollTop from 'primevue/scrolltop';
import Skeleton from 'primevue/skeleton';
import StyleClass from 'primevue/styleclass';
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';
import Tree from 'primevue/tree';
import router from "@/router";
import Avatar from "primevue/avatar";
import OverlayPanel from 'primevue/overlaypanel';
import ConfirmDialog from 'primevue/confirmdialog';
import Sidebar from "primevue/sidebar";
import ToggleButton from "primevue/togglebutton";
import MultiSelect from "primevue/multiselect";
import AutoComplete from 'primevue/autocomplete'
import Menu from "primevue/menu";
import Splitter from 'primevue/splitter';
import SplitterPanel from 'primevue/splitterpanel';
import {CodeDiff} from "v-code-diff";
import type { AuthService } from '@/services/AuthService'
import { KeycloakService } from '@/services/AuthService'
import Textarea from "primevue/textarea";
import Dropdown from "primevue/dropdown";
import Fieldset from "primevue/fieldset";

const app = createApp(App);

app.use(PrimeVue, { ripple: false  });
app.use(ConfirmationService);
app.use(ToastService);
app.use(DialogService);
app.use(router);

app.directive('tooltip', Tooltip);
app.directive('styleclass', StyleClass);

app.component('Avatar', Avatar)
app.component('Button', Button);
app.component('Card', Card);
app.component('Checkbox', Checkbox);
app.component('ContextMenu', ContextMenu);
app.component('Dialog', Dialog);
app.component('Image', Image);
app.component('InputGroup', InputGroup);
app.component('InputGroupAddon', InputGroupAddon);
app.component('InputText', InputText);
app.component('Password', Password);
app.component('SelectButton', SelectButton);
app.component('ScrollPanel', ScrollPanel);
app.component('ScrollTop', ScrollTop);
app.component('Skeleton', Skeleton);
app.component('Toast', Toast);
app.component('Tree', Tree);
app.component('OverlayPanel', OverlayPanel);
app.component('ConfirmDialog', ConfirmDialog)
app.component('Sidebar', Sidebar)
app.component('ToggleButton', ToggleButton)
app.component('MultiSelect', MultiSelect)
app.component('AutoComplete', AutoComplete)
app.component('Menu', Menu)
app.component('Splitter', Splitter)
app.component('SplitterPanel', SplitterPanel)
app.component('CodeDiff', CodeDiff)
app.component('Textarea', Textarea)
app.component('Dropdown', Dropdown)
app.component('Fieldset', Fieldset)

export const authService = new KeycloakService(() => app.mount("#app")) as AuthService
