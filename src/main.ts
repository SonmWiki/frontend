import './assets/main.css'
import "primeflex/primeflex.css";
import "primevue/resources/themes/soho-dark/theme.css";
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
import Keycloak from "@/keycloak";


const app = createApp(App);

app.use(PrimeVue, { ripple: true  });
app.use(ConfirmationService);
app.use(ToastService);
app.use(DialogService);
app.use(router);
app.use(Keycloak)

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

app.mount("#app");
