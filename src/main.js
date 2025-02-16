import { createApp } from "vue";
import "@/style.css";
import App from "@/App.vue";
import router from "@/router";
import SwalPlugin from "@/plugins/swal";

createApp(App).use(router).use(SwalPlugin).mount("#app");
