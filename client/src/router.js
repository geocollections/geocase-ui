import Vue from "vue";
import Router from "vue-router";
import Dashboard from "@/views/Dashboard";

Vue.use(Router);

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "*",
      redirect: "/"
    },
    {
      path: "/",
      name: "Dashboard",
      component: Dashboard
    },
    {
      // path: "/detail/:id(\\d+)",
      path: "/detail/:id",
      name: "Detail",
      component: () => import("@/views/DetailView")
    }
  ]
});

export default router;
