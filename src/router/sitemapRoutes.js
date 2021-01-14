module.exports = [
  {
    path: "*",
    redirect: "/"
  },
  {
    path: "/",
    name: "FrontPage",
    component: () => import("@/views/FrontPage"),
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
    component: () => import("@/views/Search"),
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
    component: () => import("@/views/DetailView"),
    meta: {
      sitemap: {
        ignoreRoute: true
      }
    }
  },
  {
    path: "/partners_and_providers",
    name: "Partners and providers",
    component: () => import("@/views/PartnersAndProviders"),
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
    component: () => import("@/views/About"),
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
    component: () => import("@/views/Access"),
    meta: {
      sitemap: {
        priority: 0.5,
        changefreq: "monthly"
      }
    }
  }
];
