import { createApp } from "vue";
import "@/style.css";
import App from "@/App.vue";
import router from "@/router";
import SwalPlugin from "@/plugins/swal";
import { createPinia } from "pinia";

const pinia = createPinia(); // create an instance for Pinia

createApp(App).use(router).use(SwalPlugin).use(pinia).mount("#app");
