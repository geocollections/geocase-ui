import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

const state = {
  error: false,
  errorMessage: "",
  info: false,
  infoMessage: "",
  searchDrawer: false,
  language: "en",
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
