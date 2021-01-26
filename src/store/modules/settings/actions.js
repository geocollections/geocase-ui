const actions = {
  updateErrorState({ commit }, bool) {
    commit("SET_ERROR_STATE", bool);
  },

  updateErrorMessage({ commit }, message) {
    commit("SET_ERROR_MESSAGE", message);
  },

  updateInfoState({ commit }, bool) {
    commit("SET_INFO_STATE", bool);
  },

  updateInfoMessage({ commit }, message) {
    commit("SET_INFO_MESSAGE", message);
  },

  updateSearchDrawerState({ commit, state }, bool) {
    if (state.searchDrawer !== bool) commit("UPDATE_SEARCH_DRAWER_STATE", bool);
  },

  updateLanguage({ commit }, language) {
    commit("UPDATE_LANGUAGE", language);
  }
};

export default actions;
