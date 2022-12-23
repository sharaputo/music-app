import { createApp } from "vue";
import { createPinia } from "pinia";
// import router from "@/router";

import "@/assets/main.css";

import App from "@/App.vue";
import VeeValidatePlugin from "@/includes/validation";
import { auth } from "@/includes/firebase";

let app: any;

auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App);

    app.use(createPinia());
    // app.use(router);
    app.use(VeeValidatePlugin);

    app.mount("#app");
  }
});
