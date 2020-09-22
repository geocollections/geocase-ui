import Vue from "vue";
import Vuex from "vuex";
import search from "./modules/search";
import detail from "./modules/detail";
import settings from "./modules/settings";
import frontpage from "./modules/frontpage";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    search,
    detail,
    settings,
    frontpage
  },
  strict: process.env.NODE_ENV !== "production"
});
