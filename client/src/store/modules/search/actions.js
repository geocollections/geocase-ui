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

  async updateSearch({ commit }, payload) {
    try {
      let response;

      // eslint-disable-next-line no-console
      console.log(payload.params);
      // eslint-disable-next-line no-console
      console.log(payload.type);

      if (payload.type === "detail") {
        response = await SearchService.getDetailSearch(payload.params);
      } else if (payload.type === "fast") {
        response = await SearchService.getFastSearch(payload.params);
      } else {
        response = await SearchService.updateSearchQuery(payload.params);
      }
      if (response) commit("UPDATE_RESPONSE", response.response);

      commit("UPDATE_SNACKBAR", false);
    } catch (err) {
      commit(
        "UPDATE_ERROR_MESSAGE",
        `<b>Status:</b> ${err.request.status}<br /><b>Status text:</b> ${err.request.statusText}`
      );
      commit("UPDATE_SNACKBAR", true);
    }
  }
};

export default actions;
