import { createRouter, createWebHistory } from "vue-router";
import MainPage from "@/pages/main-page.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "main-page",
      component: MainPage,
    },
  ],
});

export default router;
