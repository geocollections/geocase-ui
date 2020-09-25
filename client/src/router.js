import Vue from "vue";
import Router from "vue-router";
import Search from "@/views/Search";
import FrontPage from "@/views/FrontPage";

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
      name: "FrontPage",
      component: FrontPage
    },
    {
      path: "/search",
      name: "Search",
      component: Search
    },
    {
      // path: "/specimen/:id(\\d+)",
      path: "/specimen/:id",
      name: "Detail",
      component: () => import("@/views/DetailView")
    },
    {
      path: "/partners_and_providers",
      name: "Partners and providers",
      component: () => import("@/views/PartnersAndProviders")
    }
  ]
});

export default router;
