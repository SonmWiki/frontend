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
            localStorage.removeItem("token")
        } else {
            console.log("Authenticated");
            localStorage.setItem("token", keycloak.token as string)
        }
    })
    .catch((error) => {
        console.log(error);
        console.error("Authenticated Failed");
        localStorage.removeItem("token")
    });

keycloak.onTokenExpired = () => {
    console.log("Token expired");
    localStorage.removeItem("token")

    keycloak
        .updateToken(30 * 60)
        .then(() => {
            console.log("Token renewed");
            localStorage.setItem("token", keycloak.token as string)
        })
        .catch(() => {
            keycloak.login()
        })
}

keycloak.onAuthLogout = () => {
    localStorage.removeItem("token")
}

export default {
    install(app: App) {
        app.provide("keycloak", keycloak)
    }
}


