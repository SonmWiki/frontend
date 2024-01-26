import Keycloak from "keycloak-js";
import type {App} from "vue";

const env = () => import.meta.env

const initOptions = {
    url: env().VITE_KEYCLOAK_URL,
    realm: env().VITE_KEYCLOAK_REALM,
    clientId: env().VITE_KEYCLOAK_CLIENT_ID,
};

const keycloak = new Keycloak(initOptions);

keycloak
    .init({
        onLoad: 'check-sso',
        checkLoginIframe: false
    })
    .then((auth) => {
        if (!auth) {
            console.log("Unauthenticated");
        } else {
            console.log("Authenticated");
            console.log(keycloak.token)
        }
    })
    .catch((error) => {
        console.log(error);
        console.error("Authenticated Failed");
    });

keycloak.onTokenExpired = () => {
    console.log("Token expired");

    keycloak
        .updateToken(30 * 60)
        .then(() => {
            console.log("Token renewed");
        })
        .catch(() => {
            keycloak.login()
        })
}

export default {
    install(app: App) {
        app.provide("keycloak", keycloak)
    }
}


