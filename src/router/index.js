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
      component: FrontPage
    },
    {
      path: `/:locale${LANGUAGE_REGEX}?/search`,
      name: "Search",
      component: Search
    },
    {
      // path: "/specimen/:id(\\d+)",
      path: "/:locale(en|ee|de)?/specimen/:id",
      name: "Detail",
      component: DetailView
    },
    {
      path: `/:locale${LANGUAGE_REGEX}?/`,
      name: "Static",
      component: StaticPage,
      children: [
        {
          path: `partners_and_providers`,
          name: "Partners and providers",
          component: PartnersAndProviders
        },
        {
          path: `about`,
          name: "About",
          component: About
        },
        {
          path: `access`,
          name: "Access",
          component: Access
        },
        {
          path: `tutorial`,
          name: "Tutorial",
          component: Tutorial
        },
        {
          path: `links`,
          name: "Links",
          component: Links
        },
        {
          path: `efg`,
          name: "Efg",
          component: Efg
        }
      ]
    }
  ]
});

import store from "@/store/index";
import Tutorial from "@/views/Tutorial";
import Links from "@/views/Links";
import Efg from "@/views/Efg";
import StaticPage from "@/views/StaticPage";

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
