const state = {
  error: false,
  errorMessage: "",
  searchDrawer: true,
  externalResources: [
    {
      icon: "fas fa-database",
      text: "GeoCASe",
      url: "http://geocase.eu"
    },
    {
      icon: "fab fa-github",
      text: "ABCD-EFG standard GitHub",
      url: "https://github.com/tdwg/efg"
    },
    {
      icon: "far fa-hand-paper",
      text: "ABCD-EFG standard",
      url: "https://www.tdwg.org/community/esp/efg/"
    },
    {
      icon: "fas fa-pager",
      text: "BioCASe portal",
      url: "https://www.biocase.org/"
    },
    {
      icon: "fas fa-leaf",
      text: "GBIF portal",
      url: "https://www.gbif.org/"
    }
  ]
};

const actions = {
  updateErrorState({ commit }, bool) {
    commit("SET_ERROR_STATE", bool);
  },

  updateErrorMessage({ commit }, message) {
    commit("SET_ERROR_MESSAGE", message);
  },

  updateSearchDrawerState({ commit, state }, bool) {
    if (state.searchDrawer !== bool) commit("UPDATE_SEARCH_DRAWER_STATE", bool);
  }
};

const mutations = {
  SET_ERROR_STATE(state, bool) {
    state.error = bool;
  },

  SET_ERROR_MESSAGE(state, message) {
    state.errorMessage = message;
  },

  UPDATE_SEARCH_DRAWER_STATE(state, bool) {
    console.log("updating");
    state.searchDrawer = bool;
  }
};

const getters = {};

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
};
