import SearchService from "../../../middleware/SearchService";

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

  updateSearchField({ commit }, payload) {
    commit("UPDATE_SEARCH_FIELD", payload);
  },

  updateSearchParam({ commit }, payload) {
    commit("UPDATE_SEARCH_PARAM", payload);
  },

  updateSearchFieldCheckboxState({ commit }, payload) {
    commit("UPDATE_SEARCH_FIELD_CHECKBOX_STATE", payload);
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
        searchFields: state.searchFields
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
