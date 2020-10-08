const state = {
  error: false,
  errorMessage: "",
  searchDrawer: true,
  externalResources: [
    {
      icon: "fas fa-sitemap",
      text: "CETAF",
      url: "http://cetaf.org"
    },
    {
      icon: "fas fa-microscope",
      text: "DiSSCo",
      url: "http://www.dissco.eu"
    },
    {
      icon: "fas fa-network-wired",
      text: "BioCASe portal",
      url: "https://www.biocase.org/"
    },
    {
      icon: "fas fa-leaf",
      text: "GBIF portal",
      url: "https://www.gbif.org/"
    },
    {
      icon: "far fa-hand-paper",
      text: "ABCD-EFG standard",
      url: "https://www.tdwg.org/community/esp/efg/"
    },
    {
      icon: "fab fa-github",
      text: "GeoCASe 2.0 on GitHub",
      url: "https://github.com/geocollections/geocase-ui"
    },
    {
      icon: "fas fa-database",
      text: "GeoCASe 1.0 portal",
      url: "http://geocase.eu"
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
    // console.log("updating");
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
