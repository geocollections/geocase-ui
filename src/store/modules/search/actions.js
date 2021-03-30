import SearchService from "@/middleware/SearchService";

const actions = {
  updatePage({ commit }, page) {
    commit("UPDATE_PAGE", page);
  },

  updatePaginateBy({ dispatch, commit, state }, paginateBy) {
    if (state.page !== 1) dispatch("updatePage", 1);
    commit("UPDATE_PAGINATE_BY", paginateBy);
  },

  updateSortBy({ commit }, sortBy) {
    commit("UPDATE_SORT_BY", sortBy);
  },

  updateSortDesc({ commit }, sortDesc) {
    commit("UPDATE_SORT_DESC", sortDesc);
  },

  updateSearchField({ dispatch, commit, state }, payload) {
    console.log(payload)
    if (payload.id) {
      // #112 resetting page number after facet (search field) change
      // if ("value" in payload && state.page !== 1) dispatch("updatePage", 1);
      commit("UPDATE_SEARCH_FIELD", payload);
    }
  },

  updateSearchParam({ commit }, payload) {
    if (payload.field === "paginate_by") payload.field = "paginateBy";
    if (payload.field === "sort_by") payload.field = "sortBy";
    if (payload.field === "sort_desc") payload.field = "sortDesc";
    commit("UPDATE_SEARCH_PARAM", payload);
  },

  resetSearch({ commit }) {
    commit("RESET_SEARCH");
  },

  async search({ dispatch, commit, rootState, state }) {
    commit("SET_LOADING", true);

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
        `<b>Failed to fetch search results!</b><br /><b>Name:</b> ${err.name}<br /><b>Message:</b> ${err.message}`,
        { root: true }
      );
      if (!rootState.settings.error)
        dispatch("settings/updateErrorState", true, { root: true });
    }

    commit("SET_LOADING", false);
  },

  async getAllFieldNames({ dispatch, commit, rootState }) {
    try {
      let response = await SearchService.getAllFieldNames();

      if (response) {
        let fields = response.split(",");
        commit("SET_ALL_FIELD_NAMES", { fields: fields });
        commit("SET_ALL_TABLE_HEADERS", { fields: fields });
      }
    } catch (err) {
      dispatch(
        "settings/updateErrorMessage",
        `<b>Failed to fetch field names!</b><br /<b>Name:</b> ${err.name}<br /><b>Message:</b> ${err.message}`,
        { root: true }
      );
      if (!rootState.settings.error)
        dispatch("settings/updateErrorState", true, { root: true });
    }
  },

  updateTableHeaders({ commit }, payload) {
    commit("UPDATE_TABLE_HEADERS", payload);
  },

  updateTableHeaderFixedState({ commit }, payload) {
    commit("UPDATE_TABLE_HEADER_FIXED_STATE", payload);
  }
};

export default actions;
