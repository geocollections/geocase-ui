import SearchService from "../../../middleware/SearchService";

const actions = {
  updateDetailSearch({ commit }, detailSearch) {
    commit("UPDATE_DETAIL_SEARCH", detailSearch);
  },

  updateFastSearch({ commit }, fastSearch) {
    commit("UPDATE_FAST_SEARCH", fastSearch);
  },

  updateSearchParameters({ commit }, searchParams) {
    commit("UPDATE_SEARCH_PARAMETERS", searchParams);
  },

  async updateSearch({ dispatch, commit, state }, payload) {
    try {
      let response;

      if (payload.type === "detail") {
        response = await SearchService.getDetailSearch(payload.params);
      } else if (payload.type === "fast") {
        response = await SearchService.getFastSearch(payload.params);
      } else {
        response = await SearchService.updateSearchQuery(payload.params);
      }
      if (response) commit("UPDATE_RESPONSE", response.response);
    } catch (err) {
      commit(
        "UPDATE_ERROR_MESSAGE",
        `<b>Status:</b> ${err.request.status}<br /><b>Status text:</b> ${err.request.statusText}`
      );
      if (!state.snackbar) dispatch("updateSnackbar", true);
    }
  },

  updateSnackbar({ commit }, snackbarState) {
    commit("UPDATE_SNACKBAR", snackbarState);
  }
};

export default actions;
