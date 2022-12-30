import { createRouter, createWebHistory } from "vue-router";
import useUserStore from "@/stores/user";
import type { RouteLocationNormalized, NavigationGuardNext } from "vue-router";
import Home from "@/views/Home.vue";
import Track from "@/views/Track.vue";

const routes = [
  {
    name: "home",
    path: "/",
    component: Home,
  },
  {
    name: "manage",
    path: "/manage-music",
    meta: { needsAuth: true },
    component: () => import("@/views/Manage.vue"),
    beforeEnter: (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized,
      next: NavigationGuardNext
    ): void => {
      const userStore = useUserStore();
      if (userStore.userLoggedIn) {
        next();
        return;
      }
      next({ name: "home" });
    },
  },
  {
    path: "/manage",
    redirect: { name: "manage" },
  },
  {
    name: "track",
    path: "/track/:id",
    component: Track,
  },
  {
    path: "/:catchAll(.*)*",
    redirect: { name: "home" },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  linkActiveClass: "text-yellow-500",
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      };
    }
  },
});

export default router;
