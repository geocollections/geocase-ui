import Vue from "vue";
import Router from "vue-router";
import Dashboard from "./components/Dashboard";

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
      name: "GeoCASe-prototype",
      component: Dashboard
    },
    {
      path: "/detail/:id(\\d+)",
      name: "Detail",
      component: () => import("./components/DetailView")
    }
  ]
});

export default router;
