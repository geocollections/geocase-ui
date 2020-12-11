import Vue from "vue";
import Router from "vue-router";
import Search from "@/views/Search";
import FrontPage from "@/views/FrontPage";
import DetailView from "@/views/DetailView";
import PartnersAndProviders from "@/views/PartnersAndProviders";
import About from "@/views/About";
import Access from "@/views/Access";

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
      component: FrontPage,
      meta: {
        sitemap: {
          priority: 1.0,
          changefreq: "daily"
        }
      }
    },
    {
      path: "/search",
      name: "Search",
      component: Search,
      meta: {
        sitemap: {
          priority: 1.0,
          changefreq: "daily"
        }
      }
    },
    {
      // path: "/specimen/:id(\\d+)",
      path: "/specimen/:id",
      name: "Detail",
      component: DetailView,
      meta: {
        sitemap: {
          ignoreRoute: true
        }
      }
    },
    {
      path: "/partners_and_providers",
      name: "Partners and providers",
      component: PartnersAndProviders,
      meta: {
        sitemap: {
          priority: 0.7,
          changefreq: "monthly"
        }
      }
    },
    {
      path: "/about",
      name: "About",
      component: About,
      meta: {
        sitemap: {
          priority: 0.6,
          changefreq: "monthly"
        }
      }
    },
    {
      path: "/access",
      name: "Access",
      component: Access,
      meta: {
        sitemap: {
          priority: 0.5,
          changefreq: "monthly"
        }
      }
    }
  ]
});

export default router;
