import actions from "./actions";
import mutations from "./mutations";
import getters from "./getters";

const state = {
  map: null,
  isLoading: false,
  mapResults: [],
  mapResultsCount: 0,
};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
