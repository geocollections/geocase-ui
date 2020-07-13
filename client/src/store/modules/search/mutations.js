import { cloneDeep } from "lodash";

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
    let clonedSearchFields = cloneDeep(state.searchFields);
    let currentItemIndex = -1;

    let currentItem = clonedSearchFields.find((item, index) => {
      if (item.field === payload.field) {
        currentItemIndex = index;
        return true;
      } else return false;
    });

    if (currentItemIndex !== -1 && currentItem) {
      clonedSearchFields[currentItemIndex] = {
        ...currentItem,
        ...payload
      };
    }

    state.searchFields = clonedSearchFields;
  },

  RESET_SEARCH_FIELDS(state) {
    state.searchFields.forEach(item => {
      if (item.field === "fastsearch") item.lookUpType = "";
      else item.lookUpType = "contains";
      item.value = null;
    });
  }
};

export default mutations;
