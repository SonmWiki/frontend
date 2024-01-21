import Keycloak from "keycloak-js";
import type {App} from "vue";

const initOptions = {
    url: "http://localhost:8085",
    realm: "testing-realm",
    clientId: "wiki-test-frontend",
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


