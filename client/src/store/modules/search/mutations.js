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
    let currentItemIndex = -1;
    let currentItem = state.searchFields.find((item, index) => {
      if (item.field === payload.field) {
        currentItemIndex = index;
        return true;
      } else return false;
    });
    if (currentItemIndex !== -1 && currentItem) {
      state.searchFields[currentItemIndex] = {
        ...currentItem,
        ...payload
      };
    }
  }
};

export default mutations;
