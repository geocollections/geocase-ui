import SearchService from "@/middleware/SearchService";

const actions = {
  updatePage({ commit }, page) {
    commit("UPDATE_PAGE", page);
  },

  updatePaginateBy({ commit }, paginateBy) {
    commit("UPDATE_PAGINATE_BY", paginateBy);
  },

  updateSortBy({ commit }, sortBy) {
    commit("UPDATE_SORT_BY", sortBy);
  },

  updateSortDesc({ commit }, sortDesc) {
    commit("UPDATE_SORT_DESC", sortDesc);
  },

  updateSearchField({ commit, state }, payload) {
    commit("UPDATE_SEARCH_FIELD", payload);
    if (
      payload.id &&
      "value" in payload &&
      state.search?.[payload.id]?.type === "checkbox"
    )
      commit("UPDATE_LAST_UPDATED_CHECKBOX", payload.id);
  },

  updateSearchParam({ commit }, payload) {
    commit("UPDATE_SEARCH_PARAM", payload);
  },

  resetSearch({ commit }) {
    commit("RESET_SEARCH");
  },

  async getFacets({ dispatch, commit, rootState }) {
    try {
      let response = await SearchService.getFacets();

      if (response)
        commit("UPDATE_FACETS", response?.facet_counts?.facet_fields);
    } catch (err) {
      dispatch(
        "settings/updateErrorMessage",
        `<b>Name:</b> ${err.name}<br /><b>Message:</b> ${err.message}`,
        { root: true }
      );
      if (!rootState.settings.error)
        dispatch("settings/updateErrorState", true, { root: true });
    }
  },

  async search({ dispatch, commit, rootState, state }) {
    try {
      let params = {
        page: state.page,
        paginateBy: state.paginateBy,
        sortBy: state.sortBy,
        sortDesc: state.sortDesc,
        searchIds: state.searchIds,
        search: state.search
      };
      let response = await SearchService.search(params);

      if (response) {
        commit("UPDATE_FACETS", response?.facet_counts?.facet_fields);
        commit("UPDATE_RESPONSE_RESULTS", response?.response?.docs || []);
        commit(
          "UPDATE_RESPONSE_RESULTS_COUNT",
          response?.response?.numFound || 0
        );
      }
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
