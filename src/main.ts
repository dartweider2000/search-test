import { createApp } from "vue";
import App from "@/App.vue";
import store from "@/stores/main";
import "@/assets/scss/styles.scss";

const app = createApp(App);
app.use(store);

app.mount("#app");
