import Vue from "vue";
import Vuex from "vuex";
import search from "./modules/search";
import detail from "./modules/detail";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    search,
    detail
  },
  strict: process.env.NODE_ENV !== "production"
});
