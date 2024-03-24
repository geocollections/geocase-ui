import Vue from "vue";
import Vuex from "vuex";
import VuexPersistence from "vuex-persist";
import search from "./modules/search";
import detail from "./modules/detail";
import settings from "./modules/settings";
import frontpage from "./modules/frontpage";
import cookie from "./modules/cookie";
// import searchMap from "./modules/searchMap";

Vue.use(Vuex);

const vuexLocal = new VuexPersistence({
  key: "GeoCASE_v1.1.1",
  storage: window.localStorage,
  reducer: (state) => ({
    cookie: state.cookie,
    frontpage: { showAlert: state.frontpage.showAlert },
    settings: { language: state.settings.language },
  }),
});

export default new Vuex.Store({
  modules: {
    search,
    detail,
    settings,
    frontpage,
    cookie,
    // searchMap
  },
  plugins: [vuexLocal.plugin],
  strict: process.env.NODE_ENV !== "production",
});
