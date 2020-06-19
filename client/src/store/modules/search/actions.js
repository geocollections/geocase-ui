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

  async updateSearch({ dispatch, commit, rootState }, payload) {
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
      dispatch(
        "settings/updateErrorMessage",
        `<b>Name:</b> ${err.name}<br /><b>Message:</b> ${err.message}`,
        { root: true }
      );
      if (!rootState.settings.error)
        dispatch("settings/updateErrorState", true, { root: true });
    }
  }
};

export default actions;
