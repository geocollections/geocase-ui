import Vue from "vue";
import Router from "vue-router";
import Search from "@/views/Search";
import FrontPage from "@/views/FrontPage";
import DetailView from "@/views/DetailView";
import PartnersAndProviders from "@/views/PartnersAndProviders";
import About from "@/views/About";
import Access from "@/views/Access";
import i18n from "@/i18n";

Vue.use(Router);

const LANGUAGE_REGEX = "(en|ee|de)";

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "*",
      redirect: "/"
    },
    {
      path: `/:locale${LANGUAGE_REGEX}?`,
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
      path: `/:locale${LANGUAGE_REGEX}?/search`,
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
      path: "/:locale(en|ee|de)?/specimen/:id",
      name: "Detail",
      component: DetailView,
      meta: {
        sitemap: {
          ignoreRoute: true
        }
      }
    },
    {
      path: `/:locale${LANGUAGE_REGEX}?/partners_and_providers`,
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
      path: `/:locale${LANGUAGE_REGEX}?/about`,
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
      path: `/:locale${LANGUAGE_REGEX}?/access`,
      name: "Access",
      component: Access,
      meta: {
        sitemap: {
          priority: 0.5,
          changefreq: "monthly"
        }
      }
    },
    {
      path: `/:locale${LANGUAGE_REGEX}?/join`,
      name: "Join",
      component: Join,
      meta: {
        sitemap: {
          priority: 0.5,
          changefreq: "monthly"
        }
      }
    },
    {
      path: `/:locale${LANGUAGE_REGEX}?/tutorial`,
      name: "Tutorial",
      component: Tutorial,
      meta: {
        sitemap: {
          priority: 0.5,
          changefreq: "monthly"
        }
      }
    },
    {
      path: `/:locale${LANGUAGE_REGEX}?/project`,
      name: "Project",
      component: Project,
      meta: {
        sitemap: {
          priority: 0.5,
          changefreq: "monthly"
        }
      }
    },
    {
      path: `/:locale${LANGUAGE_REGEX}?/links`,
      name: "Links",
      component: Links,
      meta: {
        sitemap: {
          priority: 0.5,
          changefreq: "monthly"
        }
      }
    },
    {
      path: `/:locale${LANGUAGE_REGEX}?/imprint`,
      name: "Imprint",
      component: Imprint,
      meta: {
        sitemap: {
          priority: 0.5,
          changefreq: "monthly"
        }
      }
    },
    {
      path: `/:locale${LANGUAGE_REGEX}?/efg`,
      name: "Efg",
      component: Efg,
      meta: {
        sitemap: {
          priority: 0.5,
          changefreq: "monthly"
        }
      }
    },
    {
      path: `/:locale${LANGUAGE_REGEX}?/howto`,
      name: "HowTo",
      component: HowTo,
      meta: {
        sitemap: {
          priority: 0.5,
          changefreq: "monthly"
        }
      }
    }
  ]
});

import store from "@/store/index";
import Join from "@/views/Join";
import Tutorial from "@/views/Tutorial";
import Project from "@/views/Project";
import Links from "@/views/Links";
import Imprint from "@/views/Imprint";
import Efg from "@/views/Efg";
import HowTo from "@/views/HowTo";

router.beforeEach((to, from, next) => {
  const hasLang = to.params?.locale;
  const hadLang = from.params?.locale;

  // If the language hasn't changed since last then route we're done
  if (
    hasLang &&
    hadLang &&
    to.params.locale.toLowerCase() === from.params.locale.toLowerCase()
  )
    next();

  // Getting the current language
  let lang = i18n.locale;

  // Overwriting
  if (hasLang) lang = to.params.locale.toLowerCase();

  // Is language valid
  if (!lang.match(LANGUAGE_REGEX)) lang = "en";

  // Setting language based on the URL
  i18n.locale = lang;
  if (store.state.settings.language !== lang)
    store.dispatch("settings/updateLanguage", lang);

  if (!hasLang && lang !== "en") return next(`/${lang}${to.fullPath}`);
  else return next();
});

export default router;
