const mutations = {
  SET_ERROR_STATE(state, bool) {
    state.error = bool;
  },

  SET_ERROR_MESSAGE(state, message) {
    state.errorMessage = message;
  },

  SET_INFO_STATE(state, bool) {
    state.info = bool;
  },

  SET_INFO_MESSAGE(state, message) {
    state.infoMessage = message;
  },

  UPDATE_SEARCH_DRAWER_STATE(state, bool) {
    // console.log("updating");
    state.searchDrawer = bool;
  },

  UPDATE_LANGUAGE(state, language) {
    state.language = language;
  }
};

export default mutations;
