import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "@/router";

import "@/assets/main.css";
import "nprogress/nprogress.css";

import App from "@/App.vue";
import VeeValidatePlugin from "@/includes/validation";
import { auth } from "@/includes/firebase";
import Icon from "@/directives/icon";
import i18n from "@/includes/i18n";
import { registerSW } from "virtual:pwa-register";
import progressBar from "@/includes/progress-bar";

registerSW({ immediate: true });
progressBar(router);

let app: any;

auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App);

    app.use(createPinia());
    app.use(router);
    app.use(VeeValidatePlugin);
    app.use(i18n);
    app.directive("icon", Icon);

    app.mount("#app");
  }
});
