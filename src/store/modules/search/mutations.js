const mutations = {
  UPDATE_RESPONSE_RESULTS(state, payload) {
    state.responseResults = payload;
  },

  UPDATE_RESPONSE_RESULTS_COUNT(state, payload) {
    state.responseResultsCount = payload;
  },

  UPDATE_PAGE(state, payload) {
    state.page = payload;
  },

  UPDATE_PAGINATE_BY(state, payload) {
    state.paginateBy = payload;
  },

  UPDATE_SORT_BY(state, payload) {
    state.sortBy = payload;
  },

  UPDATE_SORT_DESC(state, payload) {
    state.sortDesc = payload;
  },

  UPDATE_SEARCH_FIELD(state, payload) {
    if ("value" in payload) state.search[payload.id].value = payload.value;
    if ("lookUpType" in payload)
      state.search[payload.id].lookUpType = payload.lookUpType;
    if ("showCheckboxes" in payload)
      state.search[payload.id].showCheckboxes = payload.showCheckboxes;
    if ("showMore" in payload)
      state.search[payload.id].showMore = payload.showMore;
  },

  UPDATE_SEARCH_PARAM(state, payload) {
    let field = payload.field;
    if (field === "page" || field === "paginateBy") {
      if (payload.value) {
        let parsedInt = parseInt(payload.value);
        if (parsedInt && !isNaN(parsedInt) && state[field] !== parsedInt)
          state[field] = parsedInt;
      } else state[field] = field === "page" ? 1 : 50;
    } else if (field === "sortBy" || field === "sortDesc") {
      if (payload.value && payload.value.trim().length > 0) {
        let value = payload.value.split(",");
        if (field === "sortDesc") value = value.map(item => item === "true");
        if (JSON.stringify(state[field]) !== JSON.stringify(value))
          state[field] = value;
      } else state[field] = [];
    }
  },

  UPDATE_FACETS(state, payload) {
    if (payload) {
      Object.entries(payload).forEach(item => {
        let key = item[0];
        state[key] = item[1].filter(val => typeof val === "string");
        state[`${key}_count`] = item[1].filter(val => typeof val !== "string");
      });
    }
  },

  RESET_SEARCH(state) {
    state.searchIds.forEach(item => {
      if (state.search[item].lookUpType !== "")
        state.search[item].lookUpType = "contains";
      if (state.search[item].value !== null) state.search[item].value = null;
    });
  },

  SET_ALL_FIELD_NAMES(state, payload) {
    state.allFieldNames = payload.fields;
  },

  SET_LOADING(state, loadingState) {
    state.isLoading = loadingState;
  }
};

export default mutations;
